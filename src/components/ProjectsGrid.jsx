import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

function ProjectShaderCanvas({ imgSrc }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      imgSrc,
      () => renderer.render(scene, camera),
      undefined,
      () => {
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = 600; fallbackCanvas.height = 400;
        const fCtx = fallbackCanvas.getContext('2d');
        fCtx.fillStyle = '#111'; fCtx.fillRect(0, 0, 600, 400);
        fCtx.fillStyle = '#CEF152'; fCtx.font = 'bold 36px monospace';
        fCtx.fillText('PREVIEW RUNTIME', 40, 200);
        texture.image = fallbackCanvas;
        texture.needsUpdate = true;
      }
    );

    const vertShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragShader = `
      uniform sampler2D uTexture;
      uniform float uHover;
      uniform vec2 uMouse;
      uniform vec2 uVelocity;
      uniform float uTime;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv;
        if (uHover > 0.005) {
          float dist = distance(uv, uMouse);
          float influence = smoothstep(0.55, 0.05, dist) * uHover;
          
          float blockSize = mix(70.0, 18.0, influence);
          vec2 blockUv = floor(uv * blockSize) / blockSize;
          
          float rnd = hash(blockUv + floor(uTime * 14.0));
          vec2 velDisp = uVelocity * 0.18 * (rnd - 0.5);
          vec2 jitter = vec2(sin(rnd * 6.28 + uTime * 6.0), cos(rnd * 6.28 + uTime * 6.0)) * 0.05 * influence;
          
          vec2 finalUv = mix(uv, blockUv + velDisp + jitter, influence);
          
          float r = texture2D(uTexture, finalUv + vec2(0.009 * influence, 0.0)).r;
          float g = texture2D(uTexture, finalUv).g;
          float b = texture2D(uTexture, finalUv - vec2(0.009 * influence, 0.0)).b;
          
          vec2 grid = fract(uv * blockSize);
          float gridBorder = step(0.9, grid.x) + step(0.9, grid.y);
          vec3 col = vec3(r, g, b) + vec3(0.81, 0.95, 0.32) * gridBorder * 0.25 * influence;
          
          gl_FragColor = vec4(col, 1.0);
        } else {
          gl_FragColor = texture2D(uTexture, uv);
        }
      }
    `;

    const uniforms = {
      uTexture: { value: texture },
      uHover: { value: 0.0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: new THREE.Vector2(0.0, 0.0) },
      uTime: { value: 0.0 }
    };

    const geom = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({ vertexShader: vertShader, fragmentShader: fragShader, uniforms: uniforms });
    scene.add(new THREE.Mesh(geom, mat));

    let lastX = 0, lastY = 0;
    let isHovered = false;

    // Only hook mouse events on devices with hover/mouse pointer
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    const handleMouseEnter = (e) => {
      isHovered = true;
      lastX = e.clientX;
      lastY = e.clientY;
      gsap.to(uniforms.uHover, { value: 1.0, duration: 0.35, ease: 'power2.out' });
    };

    const handleMouseMove = (e) => {
      if (!isHovered) return;
      const rect = container.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = 1.0 - (e.clientY - rect.top) / rect.height;

      const velX = (e.clientX - lastX) / rect.width;
      const velY = -(e.clientY - lastY) / rect.height;
      lastX = e.clientX;
      lastY = e.clientY;

      uniforms.uMouse.value.set(normX, normY);
      uniforms.uVelocity.value.set(velX * 3.0, velY * 3.0);
    };

    const handleMouseLeave = () => {
      isHovered = false;
      gsap.to(uniforms.uHover, { value: 0.0, duration: 0.45, ease: 'power2.out' });
    };

    if (!isTouchDevice) {
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    let animId = null;
    const renderLoop = (time) => {
      animId = requestAnimationFrame(renderLoop);
      uniforms.uTime.value = time * 0.001;
      uniforms.uVelocity.value.multiplyScalar(0.92);
      renderer.render(scene, camera);
    };
    renderLoop(0);

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (!isTouchDevice) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      texture.dispose();
    };
  }, [imgSrc]);

  return <canvas ref={canvasRef} className="project-webgl-canvas" style={{ touchAction: 'pan-y' }} />;
}

export default function ProjectsGrid({ onOpenProject }) {
  const [searchQuery, setSearchQuery] = useState('');

  const projects = [
    {
      id: 'clauseguard',
      title: 'ClauseGuard AI',
      badge: 'FULL-STACK AI & WEB3',
      role: 'Hackathon build',
      liveDemo: 'https://clause-guard-ai-plum.vercel.app/',
      imgSrc: '/assets/clauseguard.png',
      tags: ['Python', 'FastAPI', 'React', 'Tailwind CSS', 'Algorand SDK', 'Gemini API'],
      searchTerms: 'python fastapi react tailwind algorand gemini web3 ai contract',
      overview: 'An enterprise-grade contract intelligence platform combining a Python/FastAPI backend, React/Tailwind dark-mode dashboard UI, Google Gemini API for legal clause risk analysis (High/Med/Low scoring & automated redlines), and the Algorand SDK for milestone-based smart contract settlement tracking with live Tx ID verification.'
    },
    {
      id: 'xai',
      title: 'X-AI Financial Reasoning Engine',
      badge: 'EXPLAINABLE AI SYSTEM',
      role: 'Machine Learning & Python Engineer',
      liveDemo: null,
      imgSrc: '/assets/xai.png',
      tags: ['Python', 'Machine Learning', 'Explainable AI', 'Feature Attribution'],
      searchTerms: 'python machine-learning explainable-ai fintech data',
      overview: "A financial reasoning tool built around explainability: it takes in numerical financial data and doesn't just output a prediction, it shows the reasoning behind it. The goal was to make the 'why' behind a financial output as visible as the output itself, not a black box."
    }
  ];

  const filteredProjects = projects.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return p.searchTerms.includes(q) || p.title.toLowerCase().includes(q) || p.overview.toLowerCase().includes(q);
  });

  return (
    <section className="projects-section" id="projects">
      <div className="container">
        <div className="section-sticky-header">
          <div className="section-title-wrap">
            <h2>02 // FEATURED PROJECTS</h2>
            <p>HANDS-ON APPLICATIONS & ENGINEERING BUILDS</p>
          </div>
          <div className="project-search-box">
            <input
              type="text"
              id="project-search"
              className="project-search-input"
              placeholder="Search projects or tech tags..."
              maxLength={80}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search Projects"
            />
          </div>
        </div>

        <div className="projects-grid" id="projects-list">
          {filteredProjects.map((p, idx) => (
            <article
              key={p.id}
              className={`project-card ${idx % 2 === 1 ? 'project-col-right' : ''}`}
              data-project-id={p.id}
            >
              <div className="project-media-viewport" data-cursor-view>
                <ProjectShaderCanvas imgSrc={p.imgSrc} />
              </div>
              <div className="project-info-body">
                <div className="project-header-row">
                  <span className="project-badge">{p.badge}</span>
                  <span className="project-card-role">{p.role}</span>
                </div>
                <h3 className="project-card-title">{p.title}</h3>
                <p className="project-overview-text">{p.overview}</p>
                <div className="project-tags-list">
                  {p.tags.map(tag => (
                    <span key={tag} className="tech-tag-pill">{tag}</span>
                  ))}
                </div>
                <div className="project-card-actions">
                  <button type="button" className="btn-view-study" onClick={() => onOpenProject(p.id)}>
                    View Case Study ↗
                  </button>
                  {p.liveDemo ? (
                    <a href={p.liveDemo} target="_blank" rel="noopener noreferrer" className="btn-live-link">
                      Live Demo ↗
                    </a>
                  ) : (
                    <span className="btn-live-link" style={{ color: 'var(--text-dim)', cursor: 'default' }}>
                      Modal Case Study ↗
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

