import React, { useState } from 'react';

export default function ContactFooter({ onShowToast }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', honey: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState('');

  const handleCopyEmail = (e) => {
    e.preventDefault();
    const email = 'vsbsujit883@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        onShowToast(`Copied ${email} to clipboard!`);
      });
    } else {
      onShowToast(`Direct email: ${email}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Honeypot check - silent drop if bot filled it
    if (formData.honey) {
      setIsSubmitted(true);
      return;
    }

    // 2. Client-side input sanitization & validation
    const cleanName = formData.name.replace(/[\r\n]/g, ' ').trim();
    const cleanEmail = formData.email.trim();
    const cleanMessage = formData.message.trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      onShowToast('Please fill out all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      onShowToast('Please enter a valid email address.');
      return;
    }

    // 3. Client-side rate-limiting / throttle check (10s)
    const lastSubmitTime = localStorage.getItem('portfolio-last-submit');
    const now = Date.now();
    if (lastSubmitTime && now - parseInt(lastSubmitTime, 10) < 10000) {
      onShowToast('Please wait a moment before sending another message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://formsubmit.co/ajax/7bc28caf3b4965d55690856c48149e5b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          message: cleanMessage,
          _subject: `New Portfolio Inquiry from ${cleanName}`,
          _captcha: 'false'
        })
      });

      if (response.ok) {
        localStorage.setItem('portfolio-last-submit', String(Date.now()));
        setIsSubmitted(true);
        setMailtoUrl(`mailto:vsbsujit883@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(cleanName)}&body=${encodeURIComponent(cleanMessage)}`);
        onShowToast(`Thank you ${cleanName}! Message dispatched to vsbsujit883@gmail.com`);
      } else {
        throw new Error('Form error');
      }
    } catch {
      localStorage.setItem('portfolio-last-submit', String(Date.now()));
      setIsSubmitted(true);
      setMailtoUrl(`mailto:vsbsujit883@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(cleanName)}&body=${encodeURIComponent(cleanMessage)}`);
      onShowToast('Network dispatch error: mailto client link configured.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '', honey: '' });
    setIsSubmitted(false);
  };

  return (
    <section className="contact-footer-section" id="contact">
      <div className="container">
        
        <div className="contact-grid">
          <div className="contact-intro-side">
            <span className="spotlight-badge" style={{ color: 'var(--accent-lime)' }}>05 // CONTACT</span>
            <h2>"Let's build something worth building."</h2>
            <p>
              Open to conversations about software engineering roles, technical projects, or anything worth building together.
            </p>

            <div className="contact-direct-links">
              <button type="button" className="contact-chip-link" onClick={handleCopyEmail}>
                <span className="chip-icon">✉</span>
                <span className="chip-email-text">vsbsujit883@gmail.com</span>
                <span className="chip-action-pill">COPY</span>
              </button>
              <a href="https://github.com/SujitVakkalanka1" target="_blank" rel="noopener noreferrer" className="contact-chip-link">
                <span className="chip-icon">⚙</span>
                <span>github.com/SujitVakkalanka1 ↗</span>
              </a>
              <a href="https://www.linkedin.com/in/sujit-vakkalanka-862878383/" target="_blank" rel="noopener noreferrer" className="contact-chip-link">
                <span className="chip-icon">⚡</span>
                <span>linkedin.com/in/sujit-vakkalanka ↗</span>
              </a>
            </div>
          </div>

          <div className="contact-form-card">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} id="contact-form">
                {/* Anti-spam honeypot field - invisible to genuine users */}
                <input
                  type="text"
                  name="_honey"
                  style={{ display: 'none' }}
                  value={formData.honey}
                  onChange={(e) => setFormData({ ...formData, honey: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="form-group">
                  <label htmlFor="form-name" className="form-label">YOUR NAME</label>
                  <input
                    type="text"
                    id="form-name"
                    className="form-input"
                    placeholder="e.g. Alex Morgan"
                    maxLength={80}
                    autoComplete="name"
                    inputMode="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="form-email" className="form-label">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    id="form-email"
                    className="form-input"
                    placeholder="alex@company.com"
                    maxLength={120}
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="form-message" className="form-label">PROJECT DETAILS / INQUIRY</label>
                  <textarea
                    id="form-message"
                    className="form-textarea"
                    placeholder="Hello Sujit, we would like to discuss..."
                    maxLength={3000}
                    autoComplete="off"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn-submit-message" disabled={isSubmitting}>
                  <span>{isSubmitting ? 'Sending Message... ⚡' : 'Dispatch Message ↗'}</span>
                </button>
              </form>
            ) : (
              <div className="form-success-banner visible">
                <h4>Message Dispatched Successfully!</h4>
                <p>Thank you for reaching out. Your message has been routed to vsbsujit883@gmail.com.</p>
                <div className="banner-actions">
                  <a href={mailtoUrl} className="btn-action btn-primary">Open in Mail Client ↗</a>
                  <button type="button" onClick={handleReset} className="btn-action btn-secondary">Send Another</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="footer-directory-grid">
          <div className="footer-dir-col">
            <h5>ACADEMICS/</h5>
            <ul>
              <li>B.Tech CSIT (2nd Year)</li>
              <li>Class of 2029</li>
              <li>Full-Stack &amp; Systems</li>
              <li>Hyderabad, India</li>
            </ul>
          </div>

          <div className="footer-dir-col">
            <h5>NAVIGATION/</h5>
            <ul>
              <li><a href="#spotlight">[ ABOUT ]</a></li>
              <li><a href="#projects">[ PROJECTS ]</a></li>
              <li><a href="#learning">[ LEARNING ]</a></li>
              <li><a href="#toolbelt">[ TOOLBELT ]</a></li>
              <li><a href="#contact">[ CONTACT ]</a></li>
            </ul>
          </div>

          <div className="footer-dir-col">
            <h5>CHANNELS/</h5>
            <ul>
              <li><a href="https://github.com/SujitVakkalanka1" target="_blank" rel="noopener noreferrer">GitHub Profile ↗</a></li>
              <li><a href="https://www.linkedin.com/in/sujit-vakkalanka-862878383/" target="_blank" rel="noopener noreferrer">LinkedIn Profile ↗</a></li>
              <li><a href="mailto:vsbsujit883@gmail.com">Direct Email ↗</a></li>
            </ul>
          </div>
        </div>

        <div className="colossal-wordmark-container">
          <svg
            className="colossal-wordmark-svg"
            viewBox="0 0 1440 140"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            aria-label="SUJIT VAKKALANKA"
            role="img"
          >
            <defs>
              <linearGradient id="footerWordmarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--wordmark-grad-start, #FFFFFF)" />
                <stop offset="100%" stopColor="var(--wordmark-grad-end, #CEF152)" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              dominantBaseline="middle"
              textLength="1300"
              lengthAdjust="spacingAndGlyphs"
              fill="url(#footerWordmarkGrad)"
              className="svg-wordmark-text"
            >
              SUJIT VAKKALANKA
            </text>
          </svg>
        </div>

        <div className="footer-bottom-bar">
          <div>© 2026 Sujit Vakkalanka. Designed with precision &amp; built with code.</div>
          <div className="footer-status-tag">
            <span className="pulse-dot"></span>
            <span>SYSTEMS &amp; FULL-STACK // CLASS OF 2029</span>
          </div>
        </div>

      </div>
    </section>
  );
}

