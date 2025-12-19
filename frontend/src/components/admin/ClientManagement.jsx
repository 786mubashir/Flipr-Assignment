import { useState } from 'react'
import { clientsAPI } from '../../services/api'
import ImageUploadWithCrop from '../ImageUploadWithCrop'
import './Management.css'

function ClientManagement({ clients, onClientCreated, onClientDeleted }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    description: '',
    image: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (file) => {
    setFormData({
      ...formData,
      image: file,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.image) {
      alert('Please select an image')
      return
    }

    setIsSubmitting(true)
    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('designation', formData.designation)
      submitData.append('description', formData.description)
      submitData.append('image', formData.image)

      await clientsAPI.create(submitData)
      setFormData({ name: '', designation: '', description: '', image: null })
      setShowForm(false)
      onClientCreated()
      alert('Client added successfully!')
    } catch (error) {
      console.error('Error creating client:', error)
      alert('Error creating client. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return
    }

    try {
      await onClientDeleted(id)
      alert('Client deleted successfully!')
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Error deleting client. Please try again.')
    }
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Client Management</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Client'}
        </button>
      </div>

      {showForm && (
        <form className="management-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Client Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter client name"
            />
          </div>

          <div className="form-group">
            <label>Designation *</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              required
              placeholder="e.g., CEO, Web Developer, Designer"
            />
          </div>

          <div className="form-group">
            <label>Client Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Enter client testimonial/description"
            />
          </div>

          <div className="form-group">
            <label>Client Image *</label>
            <ImageUploadWithCrop onImageChange={handleImageChange} />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Client'}
          </button>
        </form>
      )}

      <div className="items-list">
        {clients.length === 0 ? (
          <p className="empty-message">No clients yet. Add your first client!</p>
        ) : (
          <div className="items-grid">
            {clients.map((client) => (
              <div key={client._id} className="item-card">
                <div className="item-image">
                  <img
                    src={client.image || 'https://via.placeholder.com/450x350?text=No+Image'}
                    alt={client.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/450x350?text=No+Image'
                    }}
                  />
                </div>
                <div className="item-details">
                  <h3>{client.name}</h3>
                  <p className="designation">{client.designation}</p>
                  <p>{client.description}</p>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(client._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientManagement
