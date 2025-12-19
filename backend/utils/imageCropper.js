const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Crop image to specific ratio (450x350) from original image
 * @param {string} inputPath - Path to the original image
 * @param {string} outputPath - Path to save the cropped image
 * @returns {Promise<string>} - Path to the cropped image
 */
async function cropImage(inputPath, outputPath) {
  try {
    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;
    
    // Target ratio: 450x350 = 9:7 ratio
    const targetRatio = 450 / 350; // 1.2857
    
    let cropWidth, cropHeight, left, top;
    
    // Calculate crop dimensions to maintain 450x350 ratio
    if (width / height > targetRatio) {
      // Image is wider than target ratio
      cropHeight = height;
      cropWidth = Math.round(height * targetRatio);
      left = Math.round((width - cropWidth) / 2);
      top = 0;
    } else {
      // Image is taller than target ratio
      cropWidth = width;
      cropHeight = Math.round(width / targetRatio);
      left = 0;
      top = Math.round((height - cropHeight) / 2);
    }
    
    // Crop and resize to 450x350
    await sharp(inputPath)
      .extract({ 
        left: Math.max(0, left), 
        top: Math.max(0, top), 
        width: Math.min(cropWidth, width), 
        height: Math.min(cropHeight, height) 
      })
      .resize(450, 350, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    console.error('Error cropping image:', error);
    throw error;
  }
}

module.exports = { cropImage };
