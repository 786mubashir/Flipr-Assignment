const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const upload = require('../middleware/upload');
const { cropImageToBuffer } = require('../utils/imageCropper');
const { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } = require('../utils/cloudinary');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Crop image to 450x350 buffer
    const croppedBuffer = await cropImageToBuffer(req.file.path);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(croppedBuffer, 'portfolio/projects');

    // Delete temporary file
    const fs = require('fs');
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      image: uploadResult.secure_url
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    // Clean up uploaded file on error
    const fs = require('fs');
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(400).json({ error: error.message });
  }
});

// Update project
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (project.image && project.image.includes('cloudinary.com')) {
        try {
          const publicId = extractPublicIdFromUrl(project.image);
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        } catch (deleteError) {
          console.error('Error deleting old image from Cloudinary:', deleteError);
          // Continue even if deletion fails
        }
      }

      // Crop new image to 450x350 buffer
      const croppedBuffer = await cropImageToBuffer(req.file.path);

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(croppedBuffer, 'portfolio/projects');

      // Delete temporary file
      const fs = require('fs');
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      project.image = uploadResult.secure_url;
    }

    if (req.body.name) project.name = req.body.name;
    if (req.body.description) project.description = req.body.description;

    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete image from Cloudinary if it exists
    if (project.image && project.image.includes('cloudinary.com')) {
      try {
        const publicId = extractPublicIdFromUrl(project.image);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (deleteError) {
        console.error('Error deleting image from Cloudinary:', deleteError);
        // Continue even if deletion fails
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
