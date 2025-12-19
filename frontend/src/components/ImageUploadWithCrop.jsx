import { useState, useRef } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import './ImageUploadWithCrop.css'

function ImageUploadWithCrop({ onImageChange }) {
  const [src, setSrc] = useState(null)
  const [crop, setCrop] = useState({
    unit: '%',
    width: 90,
    aspect: 450 / 350, // Target ratio 450:350
  })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const imgRef = useRef(null)
  const fileInputRef = useRef(null)

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setSrc(reader.result))
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = 450
    canvas.height = 350
    const ctx = canvas.getContext('2d')

    // Convert percentage to pixels if needed
    const cropX = crop.unit === '%' ? (crop.x / 100) * image.width : crop.x
    const cropY = crop.unit === '%' ? (crop.y / 100) * image.height : crop.y
    const cropWidth = crop.unit === '%' ? (crop.width / 100) * image.width : crop.width
    const cropHeight = crop.unit === '%' ? (crop.height / 100) * image.height : crop.height

    ctx.drawImage(
      image,
      cropX * scaleX,
      cropY * scaleY,
      cropWidth * scaleX,
      cropHeight * scaleY,
      0,
      0,
      450,
      350
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty')
          return
        }
        resolve(blob)
      }, 'image/jpeg', 0.95)
    })
  }

  const makeClientCrop = async (cropValue) => {
    if (imgRef.current && cropValue && cropValue.width && cropValue.height) {
      try {
        const croppedImageBlob = await getCroppedImg(imgRef.current, cropValue)
        const file = new File([croppedImageBlob], 'cropped-image.jpg', {
          type: 'image/jpeg',
        })
        setCroppedImage(URL.createObjectURL(croppedImageBlob))
        onImageChange(file)
      } catch (error) {
        console.error('Error cropping image:', error)
      }
    }
  }

  const onImageLoaded = (image) => {
    imgRef.current = image
  }


  const handleRemove = () => {
    setSrc(null)
    setCroppedImage(null)
    setCompletedCrop(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onImageChange(null)
  }

  return (
    <div className="image-upload-crop">
      <div className="upload-section">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="file-input"
        />
        {!src && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="select-image-btn"
          >
            Select Image
          </button>
        )}
      </div>

      {src && (
        <div className="crop-section">
          <div className="crop-container">
            <ReactCrop
              src={src}
              crop={crop}
              onChange={(c) => {
                setCrop(c)
              }}
              onComplete={(c) => {
                setCompletedCrop(c)
                if (imgRef.current && c && c.width && c.height) {
                  makeClientCrop(c)
                }
              }}
              onImageLoaded={onImageLoaded}
              aspect={450 / 350}
            />
          </div>
          <div className="preview-section">
            {croppedImage ? (
              <>
                <p>✅ Cropped Preview (450x350):</p>
                <img src={croppedImage} alt="Cropped preview" className="preview-image" />
                <button type="button" onClick={handleRemove} className="remove-btn">
                  Remove & Select Different Image
                </button>
              </>
            ) : (
              <p className="crop-instruction">Adjust the crop area above. The image will be automatically cropped.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploadWithCrop
