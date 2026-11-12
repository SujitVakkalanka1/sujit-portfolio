import React from 'react';

export default function JournalAccordion({ onOpenProject }) {
  const panels = [
    {
      projectId: 'clauseguard',
      tag: 'CLAUSEGUARD AI // 01',
      title: 'Contract Ingestion & Privacy',
      desc: 'Automated PDF/DOCX chunking into normalized clauses with section numbers. Async route execution with zero-retention headers and memory sanitization.',
      bgClass: 'accordion-bg-1'
    },
    {
      projectId: 'clauseguard',
      tag: 'CLAUSEGUARD AI // 02',
      title: 'Gemini AI Risk Engine',
      desc: 'High, Medium, and Low risk severity scoring, automated clause redlines, and contextual mitigation rationale delivered via Google Gemini API.',
      bgClass: 'accordion-bg-2'
    },
    {
      projectId: 'clauseguard',
      tag: 'CLAUSEGUARD AI // 03',
      title: 'Algorand x402 Settlement',
      desc: 'Milestone state machine with on-chain cryptographic Tx ID verification and micro-payment escrow release via the Algorand SDK.',
      bgClass: 'accordion-bg-3'
    },
    {
      projectId: 'xai',
      tag: 'X-AI REASONING // 04',
      title: 'Explainable Attribution',
      desc: 'Numerical financial data parser, feature normalization, and attribution tree rendering feature weight contributions instead of black boxes.',
      bgClass: 'accordion-bg-4'
    },
    {
      projectId: 'xai',
      tag: 'X-AI REASONING // 05',
      title: 'Rationale Generation',
      desc: 'Step-by-step logic and prediction confidence visualizations built with structured Python modules for instant risk recalculation.',
      bgClass: 'accordion-bg-5'
    }
  ];

  return (
    <section className="journal-section" id="journal">
      <div className="container">
        <h2 className="journal-thesis">
          "Architecture is not an afterthought — deep dives into legal AI risk classification, blockchain settlements, and explainable feature trees."
        </h2>

        <div className="accordion-container">
          {panels.map((p, idx) => (
            <div
              key={idx}
              className={`accordion-panel ${p.bgClass}`}
              role="button"
              tabIndex={0}
              onClick={() => onOpenProject(p.projectId)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenProject(p.projectId); } }}
            >
              <div className="accordion-overlay">
                <div className="accordion-header-block">
                  <span className="accordion-tag">{p.tag}</span>
                  <h3 className="accordion-title">{p.title}</h3>
                </div>
                <div className="accordion-hidden-content">
                  <p className="accordion-body-copy">{p.desc}</p>
                  <span className="accordion-read-more">READ MORE ↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

