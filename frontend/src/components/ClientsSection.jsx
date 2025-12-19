import './ClientsSection.css'

function ClientsSection({ clients }) {
  if (clients.length === 0) {
    return (
      <div className="empty-state">
        <p>No clients available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="clients-grid">
      {clients.map((client) => (
        <div key={client._id} className="client-card">
          <div className="client-image">
            <img 
              src={client.image || 'https://via.placeholder.com/450x350?text=No+Image'} 
              alt={client.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/450x350?text=No+Image'
              }}
            />
          </div>
          <div className="client-content">
            <p className="client-description">"{client.description}"</p>
            <div className="client-info">
              <h3 className="client-name">{client.name}</h3>
              <p className="client-designation">{client.designation}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ClientsSection
