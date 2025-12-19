const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const upload = require('../middleware/upload');
const { cropImage } = require('../utils/imageCropper');
const path = require('path');
const fs = require('fs');

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

    const originalPath = req.file.path;
    const croppedFilename = 'cropped-' + req.file.filename;
    const croppedPath = path.join(path.dirname(originalPath), croppedFilename);

    // Crop image to 450x350
    await cropImage(originalPath, croppedPath);

    // Delete original image
    fs.unlinkSync(originalPath);

    const client = new Client({
      name: req.body.name,
      designation: req.body.designation,
      description: req.body.description,
      image: `/uploads/${croppedFilename}`
    });

    await client.save();
    res.status(201).json(client);
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

    // Delete image file
    const imagePath = path.join(__dirname, '..', client.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
