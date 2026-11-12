import React, { useEffect } from 'react';

export default function ProjectModal({ isOpen, mode, itemId, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const projectData = {
    clauseguard: {
      title: 'ClauseGuard AI',
      badge: 'FULL-STACK AI & WEB3',
      role: 'Full-Stack & Web3/AI Developer (Hackathon build)',
      liveDemo: 'https://clause-guard-ai-plum.vercel.app/',
      overview: 'An enterprise-grade contract intelligence platform combining a Python/FastAPI backend, React/Tailwind dark-mode dashboard UI, Google Gemini API for legal clause risk analysis (High/Med/Low scoring & automated redlines), and the Algorand SDK for milestone-based smart contract settlement tracking with live Tx ID verification.',
      challenge: {
        problem: 'Legal teams and enterprise buyers require instant clause risk detection and automated redlines, paired with verifiable, on-chain milestone settlement tracking without compromising UX or data privacy.',
        audience: 'Legal tech firms, enterprise procurement teams, and decentralized Web3 applications.'
      },
      pipeline: 'React Client UI ➔ FastAPI Routing ➔ Gemini AI Risk Engine ➔ Algorand Smart Contract Settlement (Tx ID) ➔ Audit Response',
      features: [
        'Contract Ingestion & Section Parsing: Automated PDF/DOCX chunking into semantic legal clauses.',
        'FastAPI High-Concurrency Backend: Async routing, zero-retention privacy middleware, and PII redaction.',
        'Gemini AI Risk Engine: High/Med/Low severity scoring, automated clause redlines, and mitigation rationale.',
        'Algorand On-Chain Settlement: Milestone tracking, cryptographic Tx ID verification, and escrow release via Algorand SDK.'
      ],
      impact: [
        { val: '100%', label: 'Verified On-Chain Settlement' },
        { val: 'Gemini API', label: 'Risk Engine Core' },
        { val: 'Algorand SDK', label: 'Milestone Escrow' }
      ],
      demoCode: `# FastAPI + Gemini LLM Risk Engine + Algorand x402 Protocol Endpoint
from fastapi import FastAPI, HTTPException, Header
import algosdk
import google.generativeai as gemini

app = FastAPI(title='ClauseGuard AI Engine')

@app.post('/api/v1/analyze-clause')
async def analyze_clause_endpoint(
    request: ClauseAnalysisRequest,
    x_algorand_tx_id: str = Header(..., alias='X-Algorand-Tx-ID')
):
    # 1. Verify Algorand x402 On-Chain Micro-Payment Settlement
    tx_verified = verify_algorand_settlement(x_algorand_tx_id, min_microalgos=1000)
    if not tx_verified:
        raise HTTPException(status_code=402, detail='Payment Required: Invalid Algorand Tx ID')

    # 2. Delegate Legal Text to Gemini API for Clause Risk Analysis
    prompt = f"Analyze legal clause: '{request.clause_text}' - Assign Risk Score (HIGH/MEDIUM/LOW), provide suggested redline, and detail mitigation rationale."
    gemini_response = await gemini.generate_content_async(prompt)
    
    return {
        'clause_id': request.clause_id,
        'payment_status': 'SETTLED_ON_CHAIN',
        'algorand_tx_id': x_algorand_tx_id,
        'risk_analysis': gemini_response.structured_json
    }`
    },
    xai: {
      title: 'X-AI Financial Reasoning Engine',
      badge: 'EXPLAINABLE AI SYSTEM',
      role: 'Machine Learning & Python Engineer',
      liveDemo: null,
      overview: "A financial reasoning tool built around explainability: it takes in numerical financial data and doesn't just output a prediction, it shows the reasoning behind it. The goal was to make the 'why' behind a financial output as visible as the output itself, not a black box.",
      challenge: {
        problem: 'Traditional financial ML models operate as black boxes, making predictions without giving financial analysts or users insight into why a decision was reached.',
        audience: 'Financial analysts, fintech developers, and ML researchers.'
      },
      pipeline: 'Financial Data Input → Python ML Engine → Feature Attribution → Rationale Generation → UI View',
      features: [
        'Numerical financial data parser and feature normalization pipeline.',
        'Explainable AI decision tree rendering feature weight contributions.',
        'Interactive UI visualizing prediction confidence and step-by-step logic.'
      ],
      impact: [
        { val: '100%', label: 'Explainable Outputs' },
        { val: '0', label: 'Black Box Logic' },
        { val: 'Python', label: 'Core Engine' }
      ],
      demoCode: `# Explainable Financial Rationale Extractor
def generate_reasoning(features, weights):
    top_contributors = sorted(zip(features, weights), key=lambda x: abs(x[1]), reverse=True)
    return [{'feature': f, 'impact': w} for f, w in top_contributors]`
    }
  };

  const trackData = {
    fullstack: {
      id: 'fullstack',
      tag: 'WEB DEVELOPMENT TRACK',
      title: 'Full-Stack Development',
      description: 'Building complete web applications — frontend interactivity, backend logic, and the data layer that ties them together.',
      curriculum: [
        'DOM manipulation and event-driven interfaces',
        'Asynchronous JavaScript and API-driven data flow',
        'Backend routing and middleware with Express.js',
        'Connecting applications to real databases, not static data'
      ]
    },
    python: {
      id: 'python',
      tag: 'LANGUAGE TRACK',
      title: 'Python',
      description: 'Using Python as the language for automation, scripting, and the early groundwork for machine learning.',
      curriculum: [
        'Core syntax, data structures, and control flow',
        'Functions, OOP, and error handling that holds up in real scripts',
        'File I/O and task automation',
        'Working with APIs and structured data (JSON)'
      ]
    },
    ml: {
      id: 'ml',
      tag: 'EARLY STAGE',
      title: 'Machine Learning',
      description: 'Starting from the fundamentals — the math and logic behind the models, before reaching for shortcuts.',
      curriculum: [
        'Core ML concepts and how models actually learn',
        'Working with real datasets, not pre-cleaned demos',
        'Building toward applying Python and data structures knowledge to real ML problems'
      ]
    }
  };

  const currentProject = projectData[itemId] || projectData.clauseguard;
  const currentTrack = trackData[itemId] || trackData.fullstack;

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">✕</button>

        {mode === 'resume' && (
          <div>
            <span className="spotlight-badge" style={{ color: 'var(--accent-lime)' }}>ACADEMIC CREDENTIALS</span>
            <h3 className="modal-title" id="modal-title">Official Resume // Sujit Vakkalanka</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
              B.Tech CSIT (2nd Year) • Class of 2029 (Hyderabad)
            </p>
            <div className="modal-section-block">
              <h4 className="modal-sec-title">// STATUS SPECIFICATION</h4>
              <p className="modal-text">
                Formal resume document is being synchronized with recent hackathon builds and Cisco credentials.
              </p>
              <div style={{ background: 'rgba(206, 241, 82, 0.08)', border: '1px dashed var(--accent-lime)', borderRadius: '8px', padding: '1.25rem', marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-lime)' }}>
                [TODO: Upload official resume PDF to assets/resume.pdf and bind download pipeline]
              </div>
            </div>
            <div className="modal-section-block">
              <h4 className="modal-sec-title">// DIRECT INQUIRIES</h4>
              <p className="modal-text">
                For academic transcripts or formal verification, dispatch an inquiry below or email vsbsujit883@gmail.com.
              </p>
            </div>
          </div>
        )}

        {mode === 'track' && (
          <div>
            <span className="spotlight-badge" style={{ color: 'var(--accent-lime)' }}>{currentTrack.tag}</span>
            <h3 className="modal-title">{currentTrack.title}</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
              03 // ACTIVE CURRICULUM & ENGINEERING ROADMAP
            </p>

            <div className="modal-section-block">
              <h4 className="modal-sec-title">01 // TRACK PHILOSOPHY</h4>
              <p className="modal-text">{currentTrack.description}</p>
            </div>

            <div className="modal-section-block">
              <h4 className="modal-sec-title">02 // CURRICULUM TOPICS & IMPLEMENTATIONS</h4>
              <ul style={{ paddingLeft: '1.25rem', color: '#BBB', fontSize: '0.9375rem', lineHeight: '1.8' }}>
                {currentTrack.curriculum.map((topic, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-lime)', fontFamily: 'var(--font-mono)', marginRight: '0.5rem' }}>[✓]</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal-section-block">
              <h4 className="modal-sec-title">03 // ROADMAP STATUS</h4>
              <p className="modal-text">
                Applied directly in production builds including ClauseGuard AI and the X-AI Financial Reasoning Engine.
              </p>
            </div>
          </div>
        )}

        {mode === 'project' && (
          <div>
            <span className="spotlight-badge" style={{ color: 'var(--accent-lime)' }}>{currentProject.badge}</span>
            <h3 className="modal-title">{currentProject.title}</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>{currentProject.role}</p>

            <div className="modal-section-block">
              <h4 className="modal-sec-title">01 // ARCHITECTURAL OVERVIEW</h4>
              <p className="modal-text">{currentProject.overview}</p>
            </div>

            <div className="modal-section-block">
              <h4 className="modal-sec-title">02 // CHALLENGE & PROBLEM STATEMENT</h4>
              <p className="modal-text"><strong>Problem:</strong> {currentProject.challenge.problem}</p>
              <p className="modal-text" style={{ marginTop: '0.5rem' }}><strong>Target Audience:</strong> {currentProject.challenge.audience}</p>
            </div>

            <div className="modal-section-block">
              <h4 className="modal-sec-title">03 // PIPELINE & DECISION LAYERS</h4>
              <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-dark)', padding: '0.75rem 1rem', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-lime)', marginBottom: '1rem' }}>
                {currentProject.pipeline}
              </div>
              <ul style={{ paddingLeft: '1.25rem', color: '#BBB', fontSize: '0.875rem', lineHeight: '1.6' }}>
                {currentProject.features.map((f, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{f}</li>)}
              </ul>
            </div>

            <div className="modal-section-block">
              <h4 className="modal-sec-title">04 // KEY IMPACT & METRICS</h4>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {currentProject.impact.map((m, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-mid)', padding: '0.85rem 1.25rem', borderRadius: '8px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-lime)' }}>{m.val}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-section-block">
              <h4 className="modal-sec-title">05 // PRODUCTION CODE DEMO</h4>
              <div className="modal-code-box">
                <pre><code>{currentProject.demoCode}</code></pre>
              </div>
            </div>

            {currentProject.liveDemo && (
              <div style={{ marginTop: '2rem' }}>
                <a href={currentProject.liveDemo} target="_blank" rel="noopener noreferrer" className="btn-action btn-primary">
                  Launch Live Application ↗
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
