const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const upload = require('../middleware/upload');
const { cropImage } = require('../utils/imageCropper');
const path = require('path');
const fs = require('fs');

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

    const originalPath = req.file.path;
    const croppedFilename = 'cropped-' + req.file.filename;
    const croppedPath = path.join(path.dirname(originalPath), croppedFilename);

    // Crop image to 450x350
    await cropImage(originalPath, croppedPath);

    // Delete original image
    fs.unlinkSync(originalPath);

    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      image: `/uploads/${croppedFilename}`
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    // Clean up uploaded file on error
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
      // Delete old image
      const oldImagePath = path.join(__dirname, '..', project.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // Crop new image
      const originalPath = req.file.path;
      const croppedFilename = 'cropped-' + req.file.filename;
      const croppedPath = path.join(path.dirname(originalPath), croppedFilename);
      await cropImage(originalPath, croppedPath);
      fs.unlinkSync(originalPath);
      project.image = `/uploads/${croppedFilename}`;
    }

    if (req.body.name) project.name = req.body.name;
    if (req.body.description) project.description = req.body.description;

    await project.save();
    res.json(project);
  } catch (error) {
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

    // Delete image file
    const imagePath = path.join(__dirname, '..', project.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
