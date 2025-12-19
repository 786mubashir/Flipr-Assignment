const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const upload = require('../middleware/upload');
const { cropImageToBuffer } = require('../utils/imageCropper');
const { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } = require('../utils/cloudinary');

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create client
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Crop image to 450x350 buffer
    const croppedBuffer = await cropImageToBuffer(req.file.path);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(croppedBuffer, 'portfolio/clients');

    // Delete temporary file
    const fs = require('fs');
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const client = new Client({
      name: req.body.name,
      designation: req.body.designation,
      description: req.body.description,
      image: uploadResult.secure_url
    });

    await client.save();
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
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

// Update client
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '..', client.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // Crop new image
      const originalPath = req.file.path;
      const croppedFilename = 'cropped-' + req.file.filename;
      const croppedPath = path.join(path.dirname(originalPath), croppedFilename);
      await cropImage(originalPath, croppedPath);
      fs.unlinkSync(originalPath);
      client.image = `/uploads/${croppedFilename}`;
    }

    if (req.body.name) client.name = req.body.name;
    if (req.body.designation) client.designation = req.body.designation;
    if (req.body.description) client.description = req.body.description;

    await client.save();
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Delete image from Cloudinary if it exists
    if (client.image && client.image.includes('cloudinary.com')) {
      try {
        const publicId = extractPublicIdFromUrl(client.image);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (deleteError) {
        console.error('Error deleting image from Cloudinary:', deleteError);
        // Continue even if deletion fails
      }
    }

    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
