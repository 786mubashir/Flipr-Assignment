import './Management.css'

function ContactManagement({ contacts, onContactDeleted }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return
    }

    try {
      await onContactDeleted(id)
      alert('Contact deleted successfully!')
    } catch (error) {
      console.error('Error deleting contact:', error)
      alert('Error deleting contact. Please try again.')
    }
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Contact Form Submissions</h2>
        <span className="count-badge">{contacts.length} submissions</span>
      </div>

      <div className="contacts-table-container">
        {contacts.length === 0 ? (
          <p className="empty-message">No contact submissions yet.</p>
        ) : (
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Mobile Number</th>
                <th>City</th>
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id}>
                  <td>{contact.fullName}</td>
                  <td>{contact.email}</td>
                  <td>{contact.mobile}</td>
                  <td>{contact.city}</td>
                  <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(contact._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ContactManagement
