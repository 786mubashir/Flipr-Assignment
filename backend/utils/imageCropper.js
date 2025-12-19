const sharp = require('sharp');

/**
 * Crop image to specific ratio (450x350) and return as buffer
 * @param {string|Buffer} input - Path to the image or image buffer
 * @returns {Promise<Buffer>} - Cropped image as buffer
 */
async function cropImageToBuffer(input) {
  try {
    const image = sharp(input);
    const metadata = await image.metadata();
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
    
    // Crop and resize to 450x350, return as buffer
    const buffer = await image
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
      .jpeg({ quality: 90 })
      .toBuffer();
    
    return buffer;
  } catch (error) {
    console.error('Error cropping image:', error);
    throw error;
  }
}

/**
 * Crop image to specific ratio (450x350) and save to file
 * @param {string} inputPath - Path to the original image
 * @param {string} outputPath - Path to save the cropped image
 * @returns {Promise<string>} - Path to the cropped image
 */
async function cropImage(inputPath, outputPath) {
  try {
    const buffer = await cropImageToBuffer(inputPath);
    const sharpInstance = sharp(buffer);
    await sharpInstance.toFile(outputPath);
    return outputPath;
  } catch (error) {
    console.error('Error cropping image:', error);
    throw error;
  }
}

module.exports = { cropImage, cropImageToBuffer };
