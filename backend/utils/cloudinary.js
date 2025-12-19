const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} imageBuffer - Image buffer data
 * @param {string} folder - Folder name in Cloudinary (e.g., 'projects', 'clients')
 * @param {string} publicId - Public ID for the image (optional, will be auto-generated if not provided)
 * @returns {Promise<Object>} - Cloudinary upload result with secure_url
 */
async function uploadToCloudinary(imageBuffer, folder = 'portfolio', publicId = null) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folder,
      resource_type: 'image',
      format: 'jpg',
      transformation: [
        { width: 450, height: 350, crop: 'fill', quality: 'auto' }
      ]
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to stream
    const bufferStream = new Readable();
    bufferStream.push(imageBuffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Public ID or null
 */
function extractPublicIdFromUrl(url) {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const afterUpload = parts[1];
      // Remove version if present (v1234567890/)
      const withoutVersion = afterUpload.replace(/^v\d+\//, '');
      // Extract public_id (remove folder and extension)
      const publicId = withoutVersion.split('.')[0];
      return publicId;
    }
    return null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
}

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicIdFromUrl
};

