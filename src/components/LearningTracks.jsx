import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function LearningTracks({ onOpenTrack }) {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouch) return;

    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setSize(320, 220);

    const texLoader = new THREE.TextureLoader();
    const textures = {
      fullstack: texLoader.load('/assets/fullstack.png'),
      python: texLoader.load('/assets/python-algo.png'),
      ml: texLoader.load('/assets/xai.png')
    };

    const vertShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragShader = `
      uniform sampler2D uTexCurrent;
      uniform sampler2D uTexNext;
      uniform float uDissolve;
      uniform float uTime;
      varying vec2 vUv;

      float rand(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 grid = floor(vUv * 36.0) / 36.0;
        float n = rand(grid);

        vec4 colCurr = texture2D(uTexCurrent, vUv);
        vec4 colNext = texture2D(uTexNext, vUv);

        vec3 green = vec3(0.333, 1.0, 0.267);
        float edge = smoothstep(0.0, 0.08, abs(n - uDissolve));

        vec4 finalCol = (n < uDissolve) ? colNext : colCurr;
        if (edge < 0.35 && uDissolve > 0.05 && uDissolve < 0.95) {
          finalCol.rgb = mix(finalCol.rgb, green, (1.0 - edge / 0.35));
        }

        gl_FragColor = finalCol;
      }
    `;

    let currentTrack = 'fullstack';
    const uniforms = {
      uTexCurrent: { value: textures.fullstack },
      uTexNext: { value: textures.fullstack },
      uDissolve: { value: 1.0 },
      uTime: { value: 0 }
    };

    const mat = new THREE.ShaderMaterial({ vertexShader: vertShader, fragmentShader: fragShader, uniforms: uniforms });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX + 180;
      mouseY = e.clientY - 60;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const rows = document.querySelectorAll('.service-row');
    const handleMouseEnter = (e) => {
      const trackId = e.currentTarget.getAttribute('data-track-id');
      if (textures[trackId] && trackId !== currentTrack) {
        uniforms.uTexCurrent.value = textures[currentTrack];
        uniforms.uTexNext.value = textures[trackId];
        uniforms.uDissolve.value = 0.0;
        currentTrack = trackId;
        gsap.to(uniforms.uDissolve, { value: 1.0, duration: 0.45, ease: 'power2.out' });
      }
      card.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      card.style.opacity = '0';
    };

    rows.forEach(row => {
      row.addEventListener('mouseenter', handleMouseEnter);
      row.addEventListener('mouseleave', handleMouseLeave);
    });

    let animId = null;
    const renderLoop = (time) => {
      animId = requestAnimationFrame(renderLoop);
      targetX += (mouseX - targetX) * 0.12;
      targetY += (mouseY - targetY) * 0.12;
      card.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;

      uniforms.uTime.value = time * 0.001;
      renderer.render(scene, camera);
    };
    renderLoop(0);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      rows.forEach(row => {
        row.removeEventListener('mouseenter', handleMouseEnter);
        row.removeEventListener('mouseleave', handleMouseLeave);
      });
      renderer.dispose();
    };
  }, []);

  return (
    <section className="services-section" id="learning">
      <div className="services-follower-card" ref={cardRef} id="services-follower">
        <canvas ref={canvasRef} id="services-follower-canvas"></canvas>
      </div>

      <div className="container">
        <div className="services-split-layout">
          <div className="services-left-col">
            <h2 className="services-title">03 // LEARNING JOURNEY</h2>
            <p className="services-subtext">ACTIVE CURRICULUM & ENGINEERING ROADMAP</p>
          </div>

          <div className="services-rows-container" id="services-rows">
            <div
              className="service-row"
              data-track-id="fullstack"
              role="button"
              tabIndex={0}
              onClick={() => onOpenTrack && onOpenTrack('fullstack')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenTrack && onOpenTrack('fullstack'); } }}
            >
              <span className="service-index">01</span>
              <div className="service-header-wrap">
                <h3 className="service-name">Full-Stack Development</h3>
                <span className="service-mobile-cta">View Curriculum ↗</span>
              </div>
              <p className="service-desc-snippet">Building complete web applications — frontend interactivity, backend logic, and the data layer that ties them together.</p>
              <span className="service-tag">WEB DEV TRACK</span>
            </div>

            <div
              className="service-row"
              data-track-id="python"
              role="button"
              tabIndex={0}
              onClick={() => onOpenTrack && onOpenTrack('python')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenTrack && onOpenTrack('python'); } }}
            >
              <span className="service-index">02</span>
              <div className="service-header-wrap">
                <h3 className="service-name">Python</h3>
                <span className="service-mobile-cta">View Curriculum ↗</span>
              </div>
              <p className="service-desc-snippet">Using Python as the language for automation, scripting, and the early groundwork for machine learning.</p>
              <span className="service-tag">LANGUAGE TRACK</span>
            </div>

            <div
              className="service-row"
              data-track-id="ml"
              role="button"
              tabIndex={0}
              onClick={() => onOpenTrack && onOpenTrack('ml')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenTrack && onOpenTrack('ml'); } }}
            >
              <span className="service-index">03</span>
              <div className="service-header-wrap">
                <h3 className="service-name">Machine Learning</h3>
                <span className="service-mobile-cta">View Curriculum ↗</span>
              </div>
              <p className="service-desc-snippet">Starting from the fundamentals — the math and logic behind the models, before reaching for shortcuts.</p>
              <span className="service-tag">EARLY STAGE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
