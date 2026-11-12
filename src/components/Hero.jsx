import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ onOpenResume }) {
  const canvasRef = useRef(null);
  const wordmarkRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const wordmark = wordmarkRef.current;
    const targetBrand = document.getElementById('nav-brand-target');
    const targetSlot = document.getElementById('nav-brand-slot');
    const titleContainer = wordmark?.parentElement;

    if (!wordmark || !targetSlot || !titleContainer) return;

    wordmark.style.willChange = 'transform, opacity';
    wordmark.style.transformOrigin = '0 50%';

    let measurements = null;

    const updateMeasurements = () => {
      const scroll = window.scrollY || window.pageYOffset || 0;
      const cRect = titleContainer.getBoundingClientRect();
      const sRect = targetSlot.getBoundingClientRect();

      const docTop = cRect.top + scroll;
      const docLeft = cRect.left + (window.scrollX || 0);
      const targetTop = sRect.top;
      const targetLeft = sRect.left;
      const isMobile = window.innerWidth < 768;
      const scaleRatio = isMobile
        ? Math.min(0.65, Math.max(0.25, (sRect.height || 22) / (cRect.height || 50)))
        : Math.min(0.55, Math.max(0.18, (sRect.height || 24) / (cRect.height || 65)));

      measurements = {
        docTop,
        docLeft,
        targetTop,
        targetLeft,
        deltaX: targetLeft - docLeft,
        deltaY: targetTop - docTop,
        scaleRatio,
        S: Math.min(320, Math.max(180, docTop - targetTop))
      };
    };

    const applyMorph = (currentScroll) => {
      if (!measurements) updateMeasurements();
      const { deltaX, deltaY, scaleRatio, S } = measurements;
      const scroll = typeof currentScroll === 'number' ? currentScroll : (window.scrollY || window.pageYOffset || 0);

      const p = Math.min(1, Math.max(0, scroll / S));
      const ease = p * (2 - p);

      const tx = deltaX * ease;
      const ty = scroll + deltaY * ease;
      const scale = 1 + (scaleRatio - 1) * ease;

      wordmark.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;

      if (p >= 0.8) {
        const fadeP = (p - 0.8) / 0.2;
        wordmark.style.opacity = Math.max(0, 1 - fadeP).toFixed(3);
        if (targetBrand) {
          targetBrand.style.opacity = Math.min(1, fadeP).toFixed(3);
          targetBrand.style.visibility = 'visible';
          targetBrand.classList.add('docked');
        }
      } else {
        wordmark.style.opacity = '1';
        if (targetBrand) {
          targetBrand.style.opacity = '0';
          targetBrand.style.visibility = 'hidden';
          targetBrand.classList.remove('docked');
        }
      }
    };

    const handleScroll = (e) => {
      const s = typeof e?.scroll === 'number' ? e.scroll : (window.scrollY || window.pageYOffset || 0);
      applyMorph(s);
    };

    const handleResize = () => {
      updateMeasurements();
      applyMorph();
    };

    updateMeasurements();
    applyMorph();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    const checkLenisTimer = setTimeout(() => {
      if (window.lenis) {
        window.lenis.on('scroll', handleScroll);
      }
    }, 100);

    return () => {
      clearTimeout(checkLenisTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (window.lenis) {
        window.lenis.off('scroll', handleScroll);
      }
    };
  }, []);

  // --- ANIMATION 2: FRAGMENTED 3D MOSAIC ASSEMBLY ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'low-power'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Dynamic procedural mossy botanical landscape texture
    const texCanvas = document.createElement('canvas');
    texCanvas.width = isMobile ? 512 : 1024;
    texCanvas.height = isMobile ? 384 : 768;
    const ctx = texCanvas.getContext('2d');

    // Deep architectural obsidian base
    ctx.fillStyle = '#080A07';
    ctx.fillRect(0, 0, texCanvas.width, texCanvas.height);

    // Rich botanical moss gradients
    const grad1 = ctx.createRadialGradient(
      texCanvas.width * 0.25, texCanvas.height * 0.6, 15,
      texCanvas.width * 0.25, texCanvas.height * 0.6, texCanvas.width * 0.4
    );
    grad1.addColorStop(0, '#3B5824');
    grad1.addColorStop(0.5, '#1B2E10');
    grad1.addColorStop(1, 'transparent');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, texCanvas.width, texCanvas.height);

    const grad2 = ctx.createRadialGradient(
      texCanvas.width * 0.8, texCanvas.height * 0.35, 20,
      texCanvas.width * 0.8, texCanvas.height * 0.35, texCanvas.width * 0.45
    );
    grad2.addColorStop(0, '#4A5D23');
    grad2.addColorStop(0.6, '#15240D');
    grad2.addColorStop(1, 'transparent');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, texCanvas.width, texCanvas.height);

    // Architectural topographic elevation contours
    ctx.strokeStyle = '#273C1A';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < (isMobile ? 5 : 9); i++) {
      ctx.beginPath();
      ctx.ellipse(
        texCanvas.width * 0.5,
        texCanvas.height * 0.5,
        (texCanvas.width * 0.15) + i * (isMobile ? 30 : 55),
        (texCanvas.height * 0.15) + i * (isMobile ? 22 : 40),
        0.22, 0, Math.PI * 2
      );
      ctx.stroke();
    }

    // Precision coordinate grid
    ctx.strokeStyle = 'rgba(206, 241, 82, 0.07)';
    ctx.lineWidth = 1;
    const step = isMobile ? 64 : 48;
    for (let x = 0; x < texCanvas.width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, texCanvas.height); ctx.stroke();
    }
    for (let y = 0; y < texCanvas.height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(texCanvas.width, y); ctx.stroke();
    }

    const mosaicTexture = new THREE.CanvasTexture(texCanvas);

    const cols = 8;
    const rows = 5;
    const tiles = [];
    const tileWidth = 14 / cols;
    const tileHeight = 8.5 / rows;

    const group = new THREE.Group();
    scene.add(group);

    const maxDist = Math.hypot(cols / 2, rows / 2);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const geom = new THREE.PlaneGeometry(tileWidth * 0.94, tileHeight * 0.94);
        const uvs = geom.attributes.uv;
        for (let i = 0; i < uvs.count; i++) {
          const u = (c + uvs.getX(i)) / cols;
          const v = (r + uvs.getY(i)) / rows;
          uvs.setXY(i, u, v);
        }

        const mat = new THREE.MeshBasicMaterial({
          map: mosaicTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.25
        });

        const mesh = new THREE.Mesh(geom, mat);
        const targetX = (c - cols / 2 + 0.5) * tileWidth;
        const targetY = (r - rows / 2 + 0.5) * tileHeight;
        const targetZ = 0;

        const distFromCenter = Math.hypot(c - (cols - 1) / 2, r - (rows - 1) / 2);
        const cornerFactor = 1.0 - (distFromCenter / maxDist);

        const randAngle = Math.random() * Math.PI * 2;
        const scatterDist = 3.0 + Math.random() * 3.5;
        const initX = targetX + Math.cos(randAngle) * scatterDist;
        const initY = targetY + Math.sin(randAngle) * scatterDist;
        const initZ = -8.0 - Math.random() * 8.0;

        const initRotX = (Math.random() - 0.5) * 1.2;
        const initRotY = (Math.random() - 0.5) * 1.2;
        const initRotZ = (Math.random() - 0.5) * 0.6;

        mesh.position.set(initX, initY, initZ);
        mesh.rotation.set(initRotX, initRotY, initRotZ);
        mesh.scale.set(0.25, 0.25, 0.25);

        group.add(mesh);
        tiles.push({ mesh, mat, targetX, targetY, targetZ, initX, initY, initZ, initRotX, initRotY, initRotZ, cornerFactor });
      }
    }

    let mosaicProgress = 0;
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: '+=1200',
      scrub: 1.2,
      onUpdate: (self) => { mosaicProgress = self.progress; }
    });

    let animId = null;
    function animateMosaic() {
      animId = requestAnimationFrame(animateMosaic);
      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];
        const start = (1.0 - t.cornerFactor) * 0.45;
        const end = start + 0.55;
        const localP = THREE.MathUtils.clamp((mosaicProgress - start) / (end - start), 0, 1);
        const eased = localP * localP * (3.0 - 2.0 * localP);

        t.mesh.position.x = THREE.MathUtils.lerp(t.initX, t.targetX, eased);
        t.mesh.position.y = THREE.MathUtils.lerp(t.initY, t.targetY, eased);
        t.mesh.position.z = THREE.MathUtils.lerp(t.initZ, t.targetZ, eased);

        t.mesh.rotation.x = THREE.MathUtils.lerp(t.initRotX, 0, eased);
        t.mesh.rotation.y = THREE.MathUtils.lerp(t.initRotY, 0, eased);
        t.mesh.rotation.z = THREE.MathUtils.lerp(t.initRotZ, 0, eased);

        const curScale = THREE.MathUtils.lerp(0.25, 1.0, eased);
        t.mesh.scale.set(curScale, curScale, curScale);
        t.mat.opacity = THREE.MathUtils.lerp(0.2, 0.85, eased);
      }
      renderer.render(scene, camera);
    }
    animateMosaic();

    const handleResize = () => {
      if (!canvas) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      scrollTriggerInstance.kill();
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      mosaicTexture.dispose();
    };
  }, []);

  return (
    <section className="hero-section" id="hero">
      <div className="hero-mosaic-wrap">
        <canvas ref={canvasRef} id="hero-mosaic-canvas"></canvas>
      </div>

      <div className="container hero-content">
        <div className="hero-meta-bar">
          <div className="hero-status-pill">SUJIT VAKKALANKA // FULL-STACK &amp; SYSTEMS</div>
          <div className="hero-role-title">SOFTWARE ENGINEERING STUDENT // CLASS OF 2029</div>
        </div>

        <div className="hero-title-container">
          <h1 className="hero-wordmark" ref={wordmarkRef} id="hero-wordmark">
            SUJIT VAKKALANKA
          </h1>
        </div>

        <div className="hero-bottom-grid">
          <div>
            <div className="hero-tagline">
              Code across the stack.<br />
              <span>Systems that actually run.</span>
            </div>
            <div className="hero-cta-group">
              <a href="#projects" className="btn-action btn-primary">See What I've Built ↗</a>
              <a href="https://github.com/SujitVakkalanka1" target="_blank" rel="noopener noreferrer" className="btn-action btn-secondary">GitHub ↗</a>
              <a href="https://www.linkedin.com/in/sujit-vakkalanka-862878383/" target="_blank" rel="noopener noreferrer" className="btn-action btn-secondary">LinkedIn ↗</a>
              <button type="button" className="btn-action btn-secondary" onClick={onOpenResume}>Resume ↗</button>
            </div>
          </div>

          <div>
            <p className="hero-bio-summary">
              B.Tech CSIT student (Class of 2029) working across Python, full-stack development, databases, and machine learning — not as separate boxes to check, but as one connected skill set I'm applying to real builds, from web apps to data-driven tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

