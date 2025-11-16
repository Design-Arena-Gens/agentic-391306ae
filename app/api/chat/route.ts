import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface CustomerData {
  name: string
  email: string
  interests: string[]
}

// Sample products and courses database
const products = [
  {
    id: 1,
    name: "Premium Web Development Course",
    price: 299,
    category: "course",
    tags: ["programming", "web development", "javascript", "react"],
    description: "Master modern web development with React, Next.js, and TypeScript",
    benefits: ["Lifetime access", "Project-based learning", "Certificate of completion"]
  },
  {
    id: 2,
    name: "Digital Marketing Mastery",
    price: 199,
    category: "course",
    tags: ["marketing", "business", "social media", "seo"],
    description: "Learn proven strategies to grow your business online",
    benefits: ["Real-world case studies", "Marketing templates", "Community access"]
  },
  {
    id: 3,
    name: "AI & Machine Learning Bundle",
    price: 399,
    category: "course",
    tags: ["programming", "ai", "machine learning", "python"],
    description: "Become an AI expert with hands-on projects",
    benefits: ["GPU cloud credits", "Live coding sessions", "Career support"]
  },
  {
    id: 4,
    name: "Professional Design Toolkit",
    price: 149,
    category: "product",
    tags: ["design", "graphics", "creative", "templates"],
    description: "1000+ premium design templates and resources",
    benefits: ["Commercial license", "Regular updates", "Priority support"]
  },
  {
    id: 5,
    name: "Business Automation Suite",
    price: 249,
    category: "product",
    tags: ["business", "productivity", "automation", "saas"],
    description: "Automate your workflow and save 10+ hours per week",
    benefits: ["No-code setup", "Unlimited workflows", "Team collaboration"]
  }
]

// Sales psychology techniques implementation
function generatePersonalizedResponse(
  messages: Message[],
  customerData: CustomerData
): string {
  const lastMessage = messages[messages.length - 1].content.toLowerCase()
  const conversationLength = messages.length

  // Identify intent and stage in sales funnel
  const isAsking = lastMessage.includes('?')
  const showsInterest = lastMessage.match(/interest|want|need|looking|help|tell me/)
  const showsHesitation = lastMessage.match(/not sure|maybe|expensive|think about|later/)
  const readyToBuy = lastMessage.match(/buy|purchase|get|how much|price|checkout/)

  // Match products based on interests and conversation
  const relevantProducts = products.filter(p => {
    const allTags = p.tags.join(' ').toLowerCase()
    const interestMatch = customerData.interests.some(interest =>
      allTags.includes(interest.toLowerCase())
    )
    const messageMatch = p.tags.some(tag =>
      lastMessage.includes(tag.toLowerCase())
    )
    return interestMatch || messageMatch
  })

  // Sales Psychology Techniques Applied:

  // 1. RECIPROCITY - Give value first
  if (conversationLength === 2) {
    return `${customerData.name}, I appreciate you taking the time to chat! Let me share something valuable with you right away. Based on your interests, I have some exciting options that could really transform your journey.\n\nBefore we dive in, may I ask - what's your biggest challenge or goal right now? This will help me recommend the perfect solution for you. 🎯`
  }

  // 2. SCARCITY & URGENCY
  if (showsHesitation) {
    const product = relevantProducts[0] || products[0]
    return `I completely understand wanting to take your time, ${customerData.name}. However, I should mention - we have a limited-time offer running this week. Our ${product.name} is available with a special 30% discount, but only ${Math.floor(Math.random() * 15) + 5} spots remain at this price.\n\nMany of our successful students/customers wished they'd started sooner. What specific concerns can I address to help you make the best decision? 🤔`
  }

  // 3. SOCIAL PROOF
  if (isAsking && showsInterest) {
    const product = relevantProducts[0] || products[0]
    return `Great question, ${customerData.name}! I love your curiosity. 🌟\n\nOur ${product.name} has helped over 5,000+ people achieve incredible results. Just last week, Sarah M. shared how she ${product.category === 'course' ? 'landed her dream job' : 'scaled her business to 6 figures'} within 3 months of starting.\n\n${product.description}\n\n✨ What you get:\n${product.benefits.map(b => `• ${b}`).join('\n')}\n\nRegular price: $${product.price} | Your price today: $${Math.floor(product.price * 0.7)}\n\nWhat aspect interests you most? I can dive deeper into specifics! 💪`
  }

  // 4. ANCHORING - Present high value first
  if (readyToBuy) {
    const product = relevantProducts[0] || products[0]
    return `Fantastic decision, ${customerData.name}! I'm excited for your journey ahead! 🎉\n\nHere's what makes this a no-brainer:\n\nMost people spend $${product.price * 3}+ trying to figure this out themselves. Our ${product.name} gives you the exact blueprint for just $${Math.floor(product.price * 0.7)} (70% off today only).\n\n✅ ${product.benefits.join('\n✅ ')}\n\n🎁 BONUS: Order in the next 30 minutes and get our premium bonus package (worth $199) absolutely FREE!\n\nReady to secure your spot? Click here to get started: [Checkout Link]\n\nP.S. - Our 60-day money-back guarantee means zero risk. If you're not thrilled, full refund - no questions asked! 💯`
  }

  // 5. AUTHORITY & EXPERTISE
  if (relevantProducts.length > 0) {
    const product = relevantProducts[0]
    return `${customerData.name}, based on what you've shared, I have the perfect recommendation that aligns with your goals! 🎯\n\n**${product.name}** - This is our bestseller for people exactly like you.\n\n${product.description}\n\nHere's why it's perfect:\n${product.benefits.map((b, i) => `${i + 1}. ${b}`).join('\n')}\n\n💰 Investment: ~~$${product.price}~~ → Only $${Math.floor(product.price * 0.7)} (Limited time)\n\nOver 1,000 five-star reviews! Our customers report an average 10x ROI within 6 months.\n\nWould you like to see some success stories, or shall we get you started right away? 🚀`
  }

  // 6. COMMITMENT & CONSISTENCY
  return `I love your interest, ${customerData.name}! Let me ask you this - imagine it's 6 months from now, and you've achieved your biggest goal. How would that feel? 🌟\n\nI'm asking because I want to make sure we match you with the perfect solution. We have several options:\n\n${products.slice(0, 3).map((p, i) =>
    `${i + 1}. **${p.name}** - ${p.description} (${p.category === 'course' ? 'Course' : 'Product'}) - Special price: $${Math.floor(p.price * 0.7)}`
  ).join('\n\n')}\n\nWhich one resonates most with your goals? I can provide more details on any of these! 💪`
}

export async function POST(request: NextRequest) {
  try {
    const { messages, customerData } = await request.json()

    // Generate personalized response using sales psychology
    const response = generatePersonalizedResponse(messages, customerData)

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
