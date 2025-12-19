import { useState, useEffect } from 'react'
import { projectsAPI, clientsAPI, contactsAPI, newslettersAPI } from '../services/api'
import ProjectsSection from '../components/ProjectsSection'
import ClientsSection from '../components/ClientsSection'
import ContactForm from '../components/ContactForm'
import NewsletterSection from '../components/NewsletterSection'
import './LandingPage.css'

function LandingPage() {
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [projectsRes, clientsRes] = await Promise.all([
        projectsAPI.getAll(),
        clientsAPI.getAll(),
      ])
      setProjects(projectsRes.data)
      setClients(clientsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContactSubmit = async (formData) => {
    try {
      await contactsAPI.create(formData)
      alert('Thank you for contacting us! We will get back to you soon.')
      return true
    } catch (error) {
      console.error('Error submitting contact form:', error)
      alert('Error submitting form. Please try again.')
      return false
    }
  }

  const handleNewsletterSubmit = async (email) => {
    try {
      await newslettersAPI.subscribe(email)
      alert('Thank you for subscribing to our newsletter!')
      return true
    } catch (error) {
      console.error('Error subscribing to newsletter:', error)
      if (error.response?.status === 400) {
        alert('This email is already subscribed.')
      } else {
        alert('Error subscribing. Please try again.')
      }
      return false
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>Welcome to Our Portfolio</h1>
          <nav>
            <a href="#projects">Projects</a>
            <a href="#clients">Clients</a>
            <a href="#contact">Contact</a>
            <a href="/admin" className="admin-link">Admin</a>
          </nav>
        </div>
      </header>

      {/* Our Projects Section */}
      <section id="projects" className="projects-section">
        <div className="container">
          <h2 className="section-title">Our Projects</h2>
          <ProjectsSection projects={projects} />
        </div>
      </section>

      {/* Happy Clients Section */}
      <section id="clients" className="clients-section">
        <div className="container">
          <h2 className="section-title">Happy Clients</h2>
          <ClientsSection clients={clients} />
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <ContactForm onSubmit={handleContactSubmit} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="newsletter-section">
        <div className="container">
          <NewsletterSection onSubmit={handleNewsletterSubmit} />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Portfolio Application. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
