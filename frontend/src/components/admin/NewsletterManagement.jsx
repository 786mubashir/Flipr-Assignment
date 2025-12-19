import './Management.css'

function NewsletterManagement({ newsletters, onNewsletterDeleted }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this subscription?')) {
      return
    }

    try {
      await onNewsletterDeleted(id)
      alert('Subscription removed successfully!')
    } catch (error) {
      console.error('Error removing subscription:', error)
      alert('Error removing subscription. Please try again.')
    }
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Newsletter Subscriptions</h2>
        <span className="count-badge">{newsletters.length} subscribers</span>
      </div>

      <div className="newsletters-list">
        {newsletters.length === 0 ? (
          <p className="empty-message">No newsletter subscriptions yet.</p>
        ) : (
          <div className="newsletters-table-container">
            <table className="newsletters-table">
              <thead>
                <tr>
                  <th>Email Address</th>
                  <th>Subscribed At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsletters.map((newsletter) => (
                  <tr key={newsletter._id}>
                    <td>{newsletter.email}</td>
                    <td>{new Date(newsletter.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(newsletter._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsletterManagement
