import { useState } from 'react'
import './NewsletterSection.css'

function NewsletterSection({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    try {
      const success = await onSubmit(email.trim())
      if (success) {
        setEmail('')
      }
    } catch (error) {
      console.error('Error subscribing:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="newsletter-container">
      <h2 className="newsletter-title">Subscribe to Our Newsletter</h2>
      <p className="newsletter-description">
        Stay updated with our latest projects and news
      </p>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="newsletter-input"
        />
        <button 
          type="submit" 
          className="newsletter-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  )
}

export default NewsletterSection
