import { useState } from 'react'
import { projectsAPI } from '../../services/api'
import ImageUploadWithCrop from '../ImageUploadWithCrop'
import './Management.css'

function ProjectManagement({ projects, onProjectCreated, onProjectDeleted }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
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
      submitData.append('description', formData.description)
      submitData.append('image', formData.image)

      await projectsAPI.create(submitData)
      setFormData({ name: '', description: '', image: null })
      setShowForm(false)
      onProjectCreated()
      alert('Project added successfully!')
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error creating project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      await onProjectDeleted(id)
      alert('Project deleted successfully!')
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting project. Please try again.')
    }
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Project Management</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Project'}
        </button>
      </div>

      {showForm && (
        <form className="management-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter project name"
            />
          </div>

          <div className="form-group">
            <label>Project Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Enter project description"
            />
          </div>

          <div className="form-group">
            <label>Project Image *</label>
            <ImageUploadWithCrop onImageChange={handleImageChange} />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Project'}
          </button>
        </form>
      )}

      <div className="items-list">
        {projects.length === 0 ? (
          <p className="empty-message">No projects yet. Add your first project!</p>
        ) : (
          <div className="items-grid">
            {projects.map((project) => (
              <div key={project._id} className="item-card">
                <div className="item-image">
                  <img
                    src={project.image || 'https://via.placeholder.com/450x350?text=No+Image'}
                    alt={project.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/450x350?text=No+Image'
                    }}
                  />
                </div>
                <div className="item-details">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(project._id)}
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

export default ProjectManagement
