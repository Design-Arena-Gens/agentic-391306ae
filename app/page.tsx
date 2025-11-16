'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './page.module.css'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface CustomerData {
  name: string
  email: string
  interests: string[]
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    interests: []
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (customerData.name && customerData.email) {
      setShowForm(false)
      const greeting: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Hi ${customerData.name}! 👋 I'm your personal AI sales assistant. I'm here to help you discover products and courses that perfectly match your needs. What brings you here today?`,
        timestamp: new Date()
      }
      setMessages([greeting])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          customerData
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an issue. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  if (showForm) {
    return (
      <div className={styles.container}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Welcome to AI Sales Assistant</h1>
          <p className={styles.subtitle}>Let's personalize your experience</p>
          <form onSubmit={handleStartChat} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={customerData.name}
                onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={customerData.email}
                onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="interests">Interests (optional)</label>
              <input
                id="interests"
                type="text"
                placeholder="e.g., programming, design, marketing"
                onChange={(e) => setCustomerData({
                  ...customerData,
                  interests: e.target.value.split(',').map(i => i.trim())
                })}
              />
            </div>
            <button type="submit" className={styles.startButton}>
              Start Chat
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        <div className={styles.header}>
          <h2>AI Sales Assistant</h2>
          <p>Chatting with {customerData.name}</p>
        </div>

        <div className={styles.messages}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.role === 'user' ? styles.userMessage : styles.assistantMessage
              }`}
            >
              <div className={styles.messageContent}>
                {message.content}
              </div>
              <div className={styles.timestamp}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          {loading && (
            <div className={`${styles.message} ${styles.assistantMessage}`}>
              <div className={styles.messageContent}>
                <div className={styles.typing}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className={styles.input}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={styles.sendButton}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
