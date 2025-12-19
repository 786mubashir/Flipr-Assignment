import './ProjectsSection.css'

function ProjectsSection({ projects }) {
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <p>No projects available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <div key={project._id} className="project-card">
          <div className="project-image">
            <img 
              src={project.image.startsWith('http') ? project.image : `http://localhost:5000${project.image}`} 
              alt={project.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/450x350?text=No+Image'
              }}
            />
          </div>
          <div className="project-content">
            <h3 className="project-name">{project.name}</h3>
            <p className="project-description">{project.description}</p>
            <button className="read-more-btn">Read More</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProjectsSection
