import { useState, useEffect } from 'react'
import { projectsAPI, clientsAPI, contactsAPI, newslettersAPI } from '../services/api'
import ProjectManagement from '../components/admin/ProjectManagement'
import ClientManagement from '../components/admin/ClientManagement'
import ContactManagement from '../components/admin/ContactManagement'
import NewsletterManagement from '../components/admin/NewsletterManagement'
import './AdminPanel.css'

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [contacts, setContacts] = useState([])
  const [newsletters, setNewsletters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [projectsRes, clientsRes, contactsRes, newslettersRes] = await Promise.all([
        projectsAPI.getAll(),
        clientsAPI.getAll(),
        contactsAPI.getAll(),
        newslettersAPI.getAll(),
      ])
      setProjects(projectsRes.data)
      setClients(clientsRes.data)
      setContacts(contactsRes.data)
      setNewsletters(newslettersRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectCreated = async () => {
    const res = await projectsAPI.getAll()
    setProjects(res.data)
  }

  const handleProjectDeleted = async (id) => {
    await projectsAPI.delete(id)
    setProjects(projects.filter(p => p._id !== id))
  }

  const handleClientCreated = async () => {
    const res = await clientsAPI.getAll()
    setClients(res.data)
  }

  const handleClientDeleted = async (id) => {
    await clientsAPI.delete(id)
    setClients(clients.filter(c => c._id !== id))
  }

  const handleContactDeleted = async (id) => {
    await contactsAPI.delete(id)
    setContacts(contacts.filter(c => c._id !== id))
  }

  const handleNewsletterDeleted = async (id) => {
    await newslettersAPI.unsubscribe(id)
    setNewsletters(newsletters.filter(n => n._id !== id))
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="container">
          <h1>Admin Panel</h1>
          <a href="/" className="back-link">← Back to Home</a>
        </div>
      </header>

      <div className="admin-container">
        <div className="admin-tabs">
          <button
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            className={activeTab === 'clients' ? 'active' : ''}
            onClick={() => setActiveTab('clients')}
          >
            Clients
          </button>
          <button
            className={activeTab === 'contacts' ? 'active' : ''}
            onClick={() => setActiveTab('contacts')}
          >
            Contact Forms
          </button>
          <button
            className={activeTab === 'newsletters' ? 'active' : ''}
            onClick={() => setActiveTab('newsletters')}
          >
            Newsletter Subscriptions
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'projects' && (
            <ProjectManagement
              projects={projects}
              onProjectCreated={handleProjectCreated}
              onProjectDeleted={handleProjectDeleted}
            />
          )}
          {activeTab === 'clients' && (
            <ClientManagement
              clients={clients}
              onClientCreated={handleClientCreated}
              onClientDeleted={handleClientDeleted}
            />
          )}
          {activeTab === 'contacts' && (
            <ContactManagement
              contacts={contacts}
              onContactDeleted={handleContactDeleted}
            />
          )}
          {activeTab === 'newsletters' && (
            <NewsletterManagement
              newsletters={newsletters}
              onNewsletterDeleted={handleNewsletterDeleted}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
