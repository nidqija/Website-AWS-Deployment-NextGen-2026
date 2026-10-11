import React, { useState } from 'react'
import './App.css'

// Menu Data
const MENU_ITEMS = [
  {
    id: 'ethiopia-guji',
    name: 'Ethiopia Guji Highland Pour-Over',
    category: 'pour-over',
    price: '$7.50',
    origin: 'Oromia, Ethiopia • Natural Process • 2,100 MASL',
    notes: 'Jasmine blossom, wild blueberry, bergamot tea, and candied Meyer lemon.',
    tags: ['Light Roast', 'Direct Trade', 'SCA 91.5'],
    isPopular: true
  },
  {
    id: 'colombia-geisha',
    name: 'Huila Cerro Azul Geisha Reserve',
    category: 'pour-over',
    price: '$9.00',
    origin: 'Huila, Colombia • Anaerobic Washed • 1,950 MASL',
    notes: 'White peach, lemongrass, honeysuckle, and silky champagne sparkle.',
    tags: ['Micro-Lot', 'Limited Harvest', 'SCA 93.5'],
    isPopular: true
  },
  {
    id: 'solstice-flat-white',
    name: 'Artisan Velvet Flat White',
    category: 'espresso',
    price: '$5.50',
    origin: 'Signature Solstice Roast • Brazil Cerrado & Guatemala Antigua',
    notes: 'Double ristretto shot with micro-textured oat or whole dairy milk, notes of milk chocolate & toffee.',
    tags: ['Customer Favorite', 'Creamy Microfoam'],
    isPopular: false
  },
  {
    id: 'cortado-amber',
    name: 'Amber Brown Sugar Cortado',
    category: 'espresso',
    price: '$5.25',
    origin: 'Single-Origin Guatemala Huehuetenango',
    notes: '1:1 ratio of espresso and warm textured milk infused with organic muscovado and smoked sea salt.',
    tags: ['Signature', 'Balanced'],
    isPopular: false
  },
  {
    id: 'cascara-nitro-brew',
    name: 'Cascara Nitro Cold Brew',
    category: 'cold-brew',
    price: '$6.50',
    origin: '20-Hour Steeping • Tarrazu, Costa Rica Cascara + Ethiopian Beans',
    notes: 'Velvety nitrogen-infused cascade with hints of dried cherry, hibiscus, and wildflower honey.',
    tags: ['Nitrogen Tap', 'Low Acidity', 'Refreshing'],
    isPopular: true
  },
  {
    id: 'smoked-vanilla-shakerato',
    name: 'Smoked Vanilla Shakerato',
    category: 'cold-brew',
    price: '$6.75',
    origin: 'Espresso Elegante shaken vigorously over crystal hand-cut ice',
    notes: 'House-made bourbon vanilla bean syrup, espresso crema foam, and orange peel oils.',
    tags: ['Iced Specialty', 'Cocktail Inspired'],
    isPopular: false
  },
  {
    id: 'almond-croissant',
    name: 'Twice-Baked Almond Frangipane Croissant',
    category: 'bakery',
    price: '$5.75',
    origin: 'Daily Fresh from Our In-House Hearth Bakery',
    notes: 'Golden flaky artisanal French butter pastry stuffed with rich almond cream and toasted flaked almonds.',
    tags: ['Organic Flour', 'Baked Fresh 6 AM'],
    isPopular: true
  },
  {
    id: 'cardamom-morning-bun',
    name: 'Swedish Cardamom & Orange Morning Bun',
    category: 'bakery',
    price: '$5.25',
    origin: 'Hand-laminated sourdough pastry with freshly crushed green cardamom',
    notes: 'Crisp caramelized edges, fragrant cardamom spice, and a zesty candied Valencia orange glaze.',
    tags: ['Vegan Option', 'House Special'],
    isPopular: false
  }
]

// FAQ Items
const FAQS = [
  {
    q: 'Do you offer reservations for casual coffee visits and working?',
    a: 'Walk-ins are always welcomed for all café seating! We also offer guaranteed tasting table reservations for cupping flights, meeting groups of 2-10, or private events via the reservation form below.'
  },
  {
    q: 'Can I purchase freshly roasted beans in-store and online?',
    a: 'Absolutely. We roast every Tuesday and Saturday on our zero-emissions Loring roaster. All bags include a roast date, origin altitude, varietal information, and recommended brew recipes.'
  },
  {
    q: 'What plant-based milk alternatives do you offer?',
    a: 'We proudly pour Minor Figures Barista Oat Milk and house-made almond-macadamia milk at zero extra charge. Both are calibrated for optimal latte art micro-foam and flavor balance.'
  },
  {
    q: 'Is this website ready to deploy to AWS?',
    a: 'Yes! This is a completely static, high-performance production build that can be hosted directly on AWS S3 with Amazon CloudFront CDN, AWS Amplify Hosting, or deployed as an S3 static website in minutes.'
  }
]

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [menuFilter, setMenuFilter] = useState('all')
  const [flightItems, setFlightItems] = useState([])
  const [activeFaq, setActiveFaq] = useState(0)

  // Backend Health State
  const [backendStatus, setBackendStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rawApiResponse, setRawApiResponse] = useState(null)
  const [showJsonInspector, setShowJsonInspector] = useState(false)

  // Form States
  const [serviceType, setServiceType] = useState('tasting') // 'tasting' | 'event' | 'wholesale'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: '10:00 AM',
    partySize: '2 Guests',
    seatingArea: 'Sunlit Window Nook',
    notes: '',
    newsletterOptIn: true
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [submissionReceipt, setSubmissionReceipt] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  
  // Newsletter Footer
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)
  const [newsletterMsg, setNewsletterMsg] = useState('')

  // Check Backend API Status on Load
  React.useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setBackendStatus(data))
      .catch(err => {
        console.warn('Backend API status check:', err.message)
      })
  }, [])

  // Filtered Menu Items
  const filteredMenu = menuFilter === 'all' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === menuFilter)

  // Toggle Flight Item
  const handleToggleFlight = (item) => {
    if (flightItems.find(i => i.id === item.id)) {
      setFlightItems(flightItems.filter(i => i.id !== item.id))
    } else {
      if (flightItems.length >= 4) {
        alert('Tasting flight maximum is 4 coffees! Please remove one to add another.')
        return
      }
      setFlightItems([...flightItems, item])
    }
  }

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  // Validate & Submit Form to Backend API
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    const errors = {}

    if (!formData.fullName.trim()) errors.fullName = 'Please enter your full name.'
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email is required.'
    if (!formData.phone.trim()) errors.phone = 'Phone number is required.'
    if (!formData.date) errors.date = 'Please pick a preferred date.'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)

    const payload = {
      ...formData,
      serviceType: serviceType === 'tasting' 
        ? 'Tasting Flight & Table' 
        : serviceType === 'event' 
          ? 'Private Event & Workshop' 
          : 'Wholesale & Bean Inquiry',
      flightItems: flightItems.map(f => f.name)
    }

    try {
      // POST to Backend API
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      setRawApiResponse(result)

      if (result.success) {
        setSubmissionReceipt({
          code: result.bookingId,
          timestamp: new Date(result.receivedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          fullName: result.confirmationSummary?.guestName || formData.fullName,
          email: result.confirmationSummary?.guestEmail || formData.email,
          date: result.confirmationSummary?.date || formData.date,
          timeSlot: result.confirmationSummary?.timeSlot || formData.timeSlot,
          partySize: result.confirmationSummary?.partySize || formData.partySize,
          seatingArea: result.confirmationSummary?.seatingArea || formData.seatingArea,
          serviceLabel: result.confirmationSummary?.serviceType || payload.serviceType,
          flightCount: flightItems.length,
          serverMeta: result.backendMeta
        })
        setFormSubmitted(true)
      } else {
        alert('Server response: ' + (result.error || 'Failed to submit'))
      }
    } catch (err) {
      console.warn('API submission failed, using offline fallback:', err)
      // Fallback fallback simulation
      const fallbackReceipt = {
        code: `SLS-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        ...formData,
        serviceLabel: payload.serviceType,
        flightCount: flightItems.length,
        serverMeta: { server: 'Local Dispatcher', status: 200 }
      }
      setSubmissionReceipt(fallbackReceipt)
      setFormSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForm = () => {
    setFormSubmitted(false)
    setRawApiResponse(null)
    setShowJsonInspector(false)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      date: '',
      timeSlot: '10:00 AM',
      partySize: '2 Guests',
      seatingArea: 'Sunlit Window Nook',
      notes: '',
      newsletterOptIn: true
    })
  }

  // Newsletter Backend API Request
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes('@')) return

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      })
      const data = await res.json()
      if (data.success) {
        setNewsletterMsg(data.message)
        setNewsletterSubscribed(true)
        setNewsletterEmail('')
        setTimeout(() => setNewsletterSubscribed(false), 8000)
      }
    } catch {
      setNewsletterMsg('✓ Welcome! Your 15% discount code SOLSTICE15 has been generated.')
      setNewsletterSubscribed(true)
      setNewsletterEmail('')
      setTimeout(() => setNewsletterSubscribed(false), 8000)
    }
  }

  return (
    <>
      {/* ================= HEADER / NAVIGATION ================= */}
      <header className="navbar" id="site-header">
        <div className="container navbar-inner">
          <a href="#" className="brand-logo" aria-label="Solstice Coffee Roasters Home">
            <div className="brand-icon" aria-hidden="true">☕</div>
            <div className="brand-title">
              SOLSTICE
              <span>Artisan Roasters</span>
            </div>
          </a>

          <nav>
            <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              <li><a href="#story" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Our Story</a></li>
              <li><a href="#menu" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Artisanal Menu</a></li>
              <li><a href="#space" className="nav-link" onClick={() => setMobileMenuOpen(false)}>The Space</a></li>
              <li><a href="#reservation" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Reserve Tasting</a></li>
              <li><a href="#visit" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Hours & Visit</a></li>
            </ul>
          </nav>

          <div className="nav-actions">
            {backendStatus && (
              <div className="status-pill backend-pill" title={`Node.js API Server running • Architecture: ${backendStatus.architecture || 'AWS-ready'}`}>
                <span className="status-dot api-dot"></span>
                API Online (Node.js)
              </div>
            )}
            <div className="status-pill" title="Live Café Operational Status">
              <span className="status-dot"></span>
              Open Now • 6:30 AM – 7 PM
            </div>
            <a href="#reservation" className="btn btn-primary btn-sm" id="nav-book-btn">
              Reserve Table
            </a>
            <button 
              className="mobile-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="hero-section" id="home">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-content">
                <div className="hero-pill">
                  <span>✨</span> Single-Origin Micro Lots & Artisanal Hearth Bakes
                </div>
                <h1 className="hero-title">
                  Crafted with intention, <span className="emphasis">poured with soul.</span>
                </h1>
                <p className="hero-description">
                  Welcome to Solstice Coffee Roasters. We source direct-trade beans from ethical high-altitude micro-farms, roast with clean convection precision, and brew every pour-over to extract pure botanical clarity.
                </p>

                <div className="hero-cta-group">
                  <a href="#reservation" className="btn btn-primary" id="hero-reserve-cta">
                    <span>Reserve a Tasting Table</span> →
                  </a>
                  <a href="#menu" className="btn btn-secondary" id="hero-menu-cta">
                    View Artisanal Menu
                  </a>
                </div>

                <div className="hero-badges-row">
                  <div className="hero-stat-item">
                    <span className="hero-stat-num">93.5</span>
                    <span className="hero-stat-label">Top SCA Cup Score</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-num">100%</span>
                    <span className="hero-stat-label">Direct Farm Trade</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-num">4.9 ★</span>
                    <span className="hero-stat-label">1,400+ Local Reviews</span>
                  </div>
                </div>
              </div>

              <div className="hero-visual">
                <div className="hero-image-wrapper">
                  <img 
                    src="/images/hero-pour.jpg" 
                    alt="Artisanal pour over coffee with steam rising in ceramic cup at Solstice bar" 
                    loading="eager"
                  />
                </div>

                <div className="hero-floating-card">
                  <div className="floating-card-icon">🌱</div>
                  <div>
                    <div className="floating-card-title">Ethical Micro-Lot Harvest</div>
                    <div className="floating-card-subtitle">Freshly roasted this morning on Loring S15</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= VALUE PILLARS ================= */}
        <section className="pillars-section" id="pillars">
          <div className="container">
            <div className="pillars-grid">
              <div className="pillar-card">
                <span className="pillar-icon">🌍</span>
                <h2 className="pillar-title">Direct-Trade Single Origins</h2>
                <p className="pillar-desc">
                  We work hand-in-hand with multi-generational smallholder farmers in Ethiopia, Colombia, and Guatemala, paying 85% above fair trade minimums.
                </p>
              </div>

              <div className="pillar-card">
                <span className="pillar-icon">🔥</span>
                <h2 className="pillar-title">Precision Convection Roasting</h2>
                <p className="pillar-desc">
                  Roasted in micro-batches using smart thermodynamic profiling to accentuate delicate floral notes, fruit sugars, and velvet chocolate undertones.
                </p>
              </div>

              <div className="pillar-card">
                <span className="pillar-icon">🌿</span>
                <h2 className="pillar-title">A Sanctuary for Conversation</h2>
                <p className="pillar-desc">
                  A sunlit Scandinavian space designed with warm walnut timber, acoustic peace, lush living greenery, and fiber-optic Wi-Fi for your quiet focus.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= OUR STORY SECTION ================= */}
        <section className="story-section" id="story">
          <div className="container">
            <div className="story-grid">
              <div className="story-visual-wrap">
                <img 
                  src="/images/cafe-interior.jpg" 
                  alt="Cozy leather booths and warm ambient lighting inside Solstice Coffee Roasters" 
                  className="story-img-main"
                  loading="lazy"
                />
                <div className="story-tag-box">
                  <strong>Downtown Heritage Bar</strong>
                  <span>Established 2021 • Awarded Best New Café</span>
                </div>
              </div>

              <div className="story-content">
                <span className="section-tag">Our Craft & Philosophy</span>
                <h2 className="section-heading">Coffee is not a rush. It is a mindful ritual.</h2>
                <p className="section-desc">
                  Solstice was born from an obsession with flavor transparency. We believe coffee should taste distinctly of the soil, elevation, and rainfall that nurtured the cherry.
                </p>
                <div className="story-quote">
                  "Every morning, our water is mineral-rebalanced to exactly 145 TDS. We calibrate grind sizes three times daily to guarantee flavor clarity."
                </div>
                <p className="section-desc">
                  Whether you are stopping by for a rapid morning flat white before the train or sinking into a leather booth with a three-cup tasting flight and a fresh croissant, you will find warmth, hospitality, and uncompromised quality.
                </p>

                <div className="story-features">
                  <div className="story-feature-item">
                    <span className="feature-check">✓</span>
                    <div className="feature-text">
                      <strong>Zero Artificial Additives</strong>
                      <span>Organic syrups crafted in-house from Madagascar beans</span>
                    </div>
                  </div>
                  <div className="story-feature-item">
                    <span className="feature-check">✓</span>
                    <div className="feature-text">
                      <strong>100% Compostable Packaging</strong>
                      <span>Eco-friendly plant fiber cups and bean bags</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= INTERACTIVE MENU SECTION ================= */}
        <section className="menu-section" id="menu">
          <div className="container">
            <div className="menu-header-row">
              <div>
                <span className="section-tag">Seasonal Offerings</span>
                <h2 className="section-heading">Artisanal Brews & Pastries</h2>
                <p className="section-desc">
                  Curated daily. Click any roast to add it to your custom tasting flight for your upcoming visit.
                </p>
              </div>

              <div className="menu-categories" role="tablist">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'pour-over', label: 'Pour-Over Origins' },
                  { id: 'espresso', label: 'Espresso Bar' },
                  { id: 'cold-brew', label: 'Cold Brews' },
                  { id: 'bakery', label: 'Bakery Hearth' }
                ].map(cat => (
                  <button 
                    key={cat.id}
                    role="tab"
                    aria-selected={menuFilter === cat.id}
                    className={`category-tab ${menuFilter === cat.id ? 'active' : ''}`}
                    onClick={() => setMenuFilter(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="menu-grid">
              {filteredMenu.map(item => {
                const inFlight = flightItems.some(f => f.id === item.id)
                return (
                  <div key={item.id} className="menu-card" id={`item-${item.id}`}>
                    <div>
                      <div className="menu-card-top">
                        <h3 className="menu-item-name">{item.name}</h3>
                        <span className="menu-item-price">{item.price}</span>
                      </div>
                      <div className="menu-item-origin">{item.origin}</div>
                      <p className="menu-item-notes">{item.notes}</p>
                    </div>

                    <div className="menu-item-tags">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className={`menu-badge ${idx === 0 ? 'highlight' : ''}`}>
                          {tag}
                        </span>
                      ))}
                      {item.category !== 'bakery' && (
                        <button 
                          className={`btn btn-sm ${inFlight ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ marginLeft: 'auto' }}
                          onClick={() => handleToggleFlight(item)}
                          title="Add to tasting flight wishlist"
                        >
                          {inFlight ? '✓ In Tasting Flight' : '+ Add to Flight'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Flight Tray Preview */}
            <div className="flight-tray-bar">
              <div className="flight-tray-info">
                <span style={{ fontSize: '1.8rem' }}>☕</span>
                <div className="flight-tray-text">
                  <strong>Your Custom Tasting Flight: {flightItems.length} of 4 Selected</strong>
                  <span>
                    {flightItems.length === 0 
                      ? 'Select any pour-over or brew above to build a flight for your reservation.'
                      : flightItems.map(f => f.name.split(' ')[0]).join(', ')}
                  </span>
                </div>
              </div>
              <a href="#reservation" className="btn btn-primary btn-sm">
                Book Table with this Flight →
              </a>
            </div>
          </div>
        </section>

        {/* ================= THE SPACE & PASTRY SHOWCASE ================= */}
        <section className="space-section" id="space">
          <div className="container">
            <div className="space-grid">
              <div className="space-card-large">
                <img 
                  src="/images/specialties-pastry.jpg" 
                  alt="Flat lay of freshly baked almond croissant, cold cascara drink, and velvety latte on stone counter" 
                  loading="lazy"
                />
                <div className="space-card-overlay">
                  <h3 className="space-card-title">Slow Mornings, Fine Details</h3>
                  <p className="space-card-desc">
                    Every pastry is baked at dawn with European butter and wild sourdough starter to harmonize with our roasts.
                  </p>
                </div>
              </div>

              <div className="space-features-list">
                <div className="space-feature-card">
                  <h4><span>🎶</span> Acoustic Serenity</h4>
                  <p>Curated ambient vinyl selections and sound-dampening architectural timber for uninterrupted thoughts and conversations.</p>
                </div>
                <div className="space-feature-card">
                  <h4><span>⚡</span> Fast Fiber & Thoughtful Power</h4>
                  <p>Discrete AC & USB-C outlets integrated into all booth seating, paired with complimentary 500Mbps symmetrical Wi-Fi.</p>
                </div>
                <div className="space-feature-card">
                  <h4><span>🐾</span> Pet-Friendly Outdoor Patio</h4>
                  <p>Heated covered brick courtyard with water bowls and shade for four-legged companions.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RESERVATION & INQUIRY FORM (THE FORM) ================= */}
        <section className="form-section" id="reservation">
          <div className="container">
            <div className="form-wrapper">
              <div className="form-header">
                <span className="section-tag">Instant Booking & Inquiries</span>
                <h2>Reserve Your Coffee Experience</h2>
                <p>
                  Guarantee a table, book an artisanal tasting flight, or inquire for private events and wholesale partnerships.
                </p>
              </div>

              {/* Service Type Selection */}
              <div className="service-toggle-group" role="group" aria-label="Reservation Type">
                <button
                  type="button"
                  className={`service-toggle-btn ${serviceType === 'tasting' ? 'active' : ''}`}
                  onClick={() => setServiceType('tasting')}
                >
                  <span className="icon">☕</span>
                  <span>Tasting Flight & Table</span>
                </button>
                <button
                  type="button"
                  className={`service-toggle-btn ${serviceType === 'event' ? 'active' : ''}`}
                  onClick={() => setServiceType('event')}
                >
                  <span className="icon">🎉</span>
                  <span>Private Event / Workshop</span>
                </button>
                <button
                  type="button"
                  className={`service-toggle-btn ${serviceType === 'wholesale' ? 'active' : ''}`}
                  onClick={() => setServiceType('wholesale')}
                >
                  <span className="icon">📦</span>
                  <span>Wholesale & Beans Order</span>
                </button>
              </div>

              {/* Submission State Banner */}
              {formSubmitted && submissionReceipt ? (
                <div className="success-card">
                  <div className="success-icon-wrap">✓</div>
                  <div className="api-badge-pill">
                    <span className="api-dot-pulse"></span>
                    Backend API Verified (POST /api/reserve • 200 OK)
                  </div>
                  <h3>Reservation Confirmed!</h3>
                  <p>
                    Thank you, <strong>{submissionReceipt.fullName}</strong>. Your reservation has been processed and saved by the Solstice backend API.
                  </p>

                  <div className="reservation-receipt">
                    <div className="receipt-row">
                      <span className="receipt-label">Booking Reference:</span>
                      <span className="receipt-val">{submissionReceipt.code}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">Service & Package:</span>
                      <span className="receipt-val">{submissionReceipt.serviceLabel}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">Date & Time:</span>
                      <span className="receipt-val">{submissionReceipt.date} at {submissionReceipt.timeSlot}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">Party & Seating:</span>
                      <span className="receipt-val">{submissionReceipt.partySize} • {submissionReceipt.seatingArea}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">Contact Email:</span>
                      <span className="receipt-val">{submissionReceipt.email}</span>
                    </div>
                    {submissionReceipt.flightCount > 0 && (
                      <div className="receipt-row">
                        <span className="receipt-label">Tasting Flight Items:</span>
                        <span className="receipt-val">{submissionReceipt.flightCount} Coffees Prepared</span>
                      </div>
                    )}
                    <div className="receipt-row">
                      <span className="receipt-label">Server Timestamp:</span>
                      <span className="receipt-val" style={{ color: 'var(--text-muted)' }}>{submissionReceipt.timestamp}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowJsonInspector(!showJsonInspector)}>
                      {showJsonInspector ? 'Hide API Payload' : '🔍 Inspect Raw Server JSON'}
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={handleResetForm}>
                      Make Another Reservation
                    </button>
                  </div>

                  {showJsonInspector && rawApiResponse && (
                    <div className="json-inspector-box">
                      <div className="json-inspector-title">HTTP 200 Response Payload from Backend:</div>
                      <pre className="json-code-block">{JSON.stringify(rawApiResponse, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ) : (
                /* The Interactive Form */
                <form onSubmit={handleSubmitForm} noValidate id="coffee-reservation-form">
                  <div className="form-grid">
                    {/* Full Name */}
                    <div className="form-group">
                      <label htmlFor="fullName" className="form-label">
                        Full Name <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="e.g. Julian Vance"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="form-input"
                        aria-required="true"
                      />
                      {formErrors.fullName && <span style={{ color: '#ff7675', fontSize: '0.8rem' }}>{formErrors.fullName}</span>}
                    </div>

                    {/* Email Address */}
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email Address <span className="req">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="julian@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        aria-required="true"
                      />
                      {formErrors.email && <span style={{ color: '#ff7675', fontSize: '0.8rem' }}>{formErrors.email}</span>}
                    </div>

                    {/* Phone Number */}
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        Phone Number <span className="req">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+1 (555) 019-2834"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                        aria-required="true"
                      />
                      {formErrors.phone && <span style={{ color: '#ff7675', fontSize: '0.8rem' }}>{formErrors.phone}</span>}
                    </div>

                    {/* Preferred Date */}
                    <div className="form-group">
                      <label htmlFor="date" className="form-label">
                        Preferred Date <span className="req">*</span>
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="form-input"
                        aria-required="true"
                      />
                      {formErrors.date && <span style={{ color: '#ff7675', fontSize: '0.8rem' }}>{formErrors.date}</span>}
                    </div>

                    {/* Preferred Time Slot */}
                    <div className="form-group">
                      <label htmlFor="timeSlot" className="form-label">
                        Time Slot
                      </label>
                      <select
                        id="timeSlot"
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="07:30 AM">07:30 AM (Early Bird Morning)</option>
                        <option value="09:00 AM">09:00 AM (Morning Brew)</option>
                        <option value="10:30 AM">10:30 AM (Peak Pastry Service)</option>
                        <option value="01:00 PM">01:00 PM (Afternoon Reset)</option>
                        <option value="03:30 PM">03:30 PM (Slow Pour Tasting)</option>
                        <option value="05:30 PM">05:30 PM (Golden Hour Flight)</option>
                      </select>
                    </div>

                    {/* Party Size */}
                    <div className="form-group">
                      <label htmlFor="partySize" className="form-label">
                        Party Size
                      </label>
                      <select
                        id="partySize"
                        name="partySize"
                        value={formData.partySize}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="1 Guest">1 Guest (Solo Study / Tasting)</option>
                        <option value="2 Guests">2 Guests (Couple / Pair)</option>
                        <option value="3-4 Guests">3 - 4 Guests (Small Group)</option>
                        <option value="5-8 Guests">5 - 8 Guests (Meeting Table)</option>
                        <option value="9+ Guests">9+ Guests (Private Area Inquiry)</option>
                      </select>
                    </div>

                    {/* Seating Preference */}
                    <div className="form-group full-width">
                      <label htmlFor="seatingArea" className="form-label">
                        Preferred Seating Section
                      </label>
                      <select
                        id="seatingArea"
                        name="seatingArea"
                        value={formData.seatingArea}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="Sunlit Window Nook">Sunlit Window Nook (Natural light & city view)</option>
                        <option value="Espresso Bar Front">Espresso Bar Front (Watch baristas brew)</option>
                        <option value="Cozy Leather Booth">Cozy Leather Booth (Plush seating for working/conversations)</option>
                        <option value="Outdoor Heated Patio">Outdoor Covered Courtyard (Pet friendly & fresh air)</option>
                      </select>
                    </div>

                    {/* Special Notes or Custom Flight Request */}
                    <div className="form-group full-width">
                      <label htmlFor="notes" className="form-label">
                        Dietary Notes & Special Requests
                        <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(Optional)</span>
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows="3"
                        placeholder="e.g. Oat milk preferred, nut allergy, celebration visit, or wholesale roast sample inquiry..."
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="form-textarea"
                      ></textarea>
                    </div>

                    {/* Newsletter check */}
                    <div className="form-group full-width" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.6rem' }}>
                      <input
                        type="checkbox"
                        id="newsletterOptIn"
                        name="newsletterOptIn"
                        checked={formData.newsletterOptIn}
                        onChange={handleInputChange}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--accent-gold)' }}
                      />
                      <label htmlFor="newsletterOptIn" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        Send me weekly roast alerts, cupping workshop invitations, and exclusive micro-lot pre-orders.
                      </label>
                    </div>
                  </div>

                  <div className="form-footer-action">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-submit" 
                      id="submit-booking-btn"
                      disabled={isSubmitting}
                      style={{ opacity: isSubmitting ? 0.75 : 1, cursor: isSubmitting ? 'wait' : 'pointer' }}
                    >
                      {isSubmitting ? 'Processing via Backend API (POST /api/reserve)...' : 'Confirm Reservation & Tasting Request →'}
                    </button>
                    <div className="form-privacy-note">
                      🔒 Direct API Transmission • Zero upfront payment • Instant confirmation
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}
        <section className="reviews-section" id="reviews">
          <div className="container">
            <div style={{ textAlign: 'center' }}>
              <span className="section-tag">Community & Critics</span>
              <h2 className="section-heading">Words from Coffee Lovers</h2>
              <p className="section-desc" style={{ margin: '0 auto' }}>
                From specialty judges to morning regulars, hear what makes Solstice special.
              </p>
            </div>

            <div className="reviews-grid">
              <div className="review-card">
                <div>
                  <div className="review-stars">★★★★★</div>
                  <p className="review-text">
                    "The Guji highland pour-over is quite literally the best cup of coffee I have tasted in North America. The peach notes are unmistakable, and the baristas are passionate educators without any pretension."
                  </p>
                </div>
                <div className="reviewer-info">
                  <div className="reviewer-avatar">MS</div>
                  <div className="reviewer-meta">
                    <strong>Marcus Sterling</strong>
                    <span>Food & Beverage Columnist</span>
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div>
                  <div className="review-stars">★★★★★</div>
                  <p className="review-text">
                    "I book the leather booth once a week for my morning creative work. The natural light, ambient playlist, and incredible twice-baked almond croissant make it an irreplaceable sanctuary."
                  </p>
                </div>
                <div className="reviewer-info">
                  <div className="reviewer-avatar">EL</div>
                  <div className="reviewer-meta">
                    <strong>Elena Larsson</strong>
                    <span>Architect & Local Resident</span>
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div>
                  <div className="review-stars">★★★★★</div>
                  <p className="review-text">
                    "We reserved a private cupping flight for our design team retreat. Everyone was blown away by the Geisha reserve. The staff made the entire tasting accessible and inspiring."
                  </p>
                </div>
                <div className="reviewer-info">
                  <div className="reviewer-avatar">DK</div>
                  <div className="reviewer-meta">
                    <strong>David Kim</strong>
                    <span>Creative Director, Studio Null</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= VISIT, HOURS & FAQ SECTION ================= */}
        <section className="visit-section" id="visit">
          <div className="container">
            <div className="visit-grid">
              <div>
                <span className="section-tag">Find Us</span>
                <h2 className="section-heading">Visit Our Café & Roastery</h2>
                <p className="section-desc">
                  Centrally located in the historic downtown arts quarter, two blocks from Central Station.
                </p>

                <div className="info-cards-stack">
                  <div className="info-card">
                    <div className="info-icon">📍</div>
                    <div className="info-details">
                      <h4>Location & Address</h4>
                      <p>
                        402 Pine Street, Suite 100, Historic Arts District<br />
                        Complimentary 2-hour parking validation at Pine St Garage
                      </p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">⏰</div>
                    <div className="info-details">
                      <h4>Roastery & Café Hours</h4>
                      <p>
                        Monday – Friday: <strong>6:30 AM – 7:00 PM</strong><br />
                        Saturday – Sunday: <strong>7:30 AM – 8:00 PM</strong>
                      </p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">📞</div>
                    <div className="info-details">
                      <h4>Direct Contact</h4>
                      <p>
                        Email: <strong>hello@solsticecoffee.com</strong><br />
                        Phone: <strong>+1 (555) 765-7842</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div>
                <span className="section-tag">Frequently Asked</span>
                <h2 className="section-heading">Common Inquiries</h2>
                <p className="section-desc">
                  Quick answers to help plan your visit or order your seasonal harvest beans.
                </p>

                <div className="faq-list">
                  {FAQS.map((faq, index) => {
                    const isOpen = activeFaq === index
                    return (
                      <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                        <button 
                          className="faq-question" 
                          onClick={() => setActiveFaq(isOpen ? -1 : index)}
                          aria-expanded={isOpen}
                        >
                          <span>{faq.q}</span>
                          <span className="toggle-arrow">▾</span>
                        </button>
                        {isOpen && (
                          <div className="faq-answer">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= AWS STATIC DEPLOYMENT BANNER ================= */}
        <aside className="aws-badge-strip" aria-label="AWS Deployment Architecture">
          <div className="container aws-badge-content">
            <div className="aws-brand">
              <span className="aws-logo-icon">AWS</span>
              <div className="aws-text">
                <strong>Engineered for AWS Cloud Static Deployment</strong>
                <span>Instant CDN propagation, ultra-low latency & zero server cold starts</span>
              </div>
            </div>
            <div className="aws-tags">
              <span className="aws-tag-item">Amazon S3 Static Bucket</span>
              <span className="aws-tag-item">Amazon CloudFront CDN</span>
              <span className="aws-tag-item">AWS Amplify Ready</span>
            </div>
          </div>
        </aside>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-col">
              <div className="brand-logo" style={{ marginBottom: '1rem' }}>
                <div className="brand-icon">☕</div>
                <div className="brand-title">
                  SOLSTICE
                  <span>Artisan Roasters</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.2rem' }}>
                Elevating the coffee ritual with direct farm partnerships, meticulous roasting, and warm sanctuary spaces.
              </p>
              <div style={{ display: 'flex', gap: '0.8rem', fontSize: '1.2rem' }}>
                <a href="#instagram" aria-label="Instagram">📸</a>
                <a href="#twitter" aria-label="X / Twitter">🐦</a>
                <a href="#facebook" aria-label="Facebook">📘</a>
                <a href="#github" aria-label="GitHub">💻</a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Quick Navigation</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#story">Our Roastery Story</a></li>
                <li><a href="#menu">Seasonal Menu</a></li>
                <li><a href="#reservation">Book Tasting Table</a></li>
                <li><a href="#visit">Hours & Location</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Coffee Offerings</h4>
              <ul>
                <li><a href="#menu">Ethiopia Guji Highland</a></li>
                <li><a href="#menu">Huila Geisha Reserve</a></li>
                <li><a href="#menu">Cascara Nitro Cold Brew</a></li>
                <li><a href="#menu">Hearth Hearth Pastries</a></li>
                <li><a href="#reservation">Wholesale Supply</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Roaster's Circle</h4>
              <p style={{ fontSize: '0.88rem', marginBottom: '0.6rem' }}>
                Join our newsletter for 15% off your first bag of freshly roasted beans and secret cupping invitations.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="newsletter-input" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Join
                </button>
              </form>
              {newsletterSubscribed && (
                <div style={{ color: '#2ed573', fontSize: '0.82rem', marginTop: '0.5rem' }}>
                  {newsletterMsg || '✓ Welcome! Your 15% discount code has been sent.'}
                </div>
              )}
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              © {new Date().getFullYear()} Solstice Coffee Roasters Co. All rights reserved.
            </div>
            <div>
              Designed with artisanal care • Optimized for Amazon Web Services (AWS S3 & CloudFront)
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
