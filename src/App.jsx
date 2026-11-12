import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from './components/Header.jsx';
import CursorBadge from './components/CursorBadge.jsx';
import Hero from './components/Hero.jsx';
import SpotlightCard from './components/SpotlightCard.jsx';
import ProjectsGrid from './components/ProjectsGrid.jsx';
import Manifesto from './components/Manifesto.jsx';
import Marquee from './components/Marquee.jsx';
import LearningTracks from './components/LearningTracks.jsx';
import Toolbelt from './components/Toolbelt.jsx';
import JournalAccordion from './components/JournalAccordion.jsx';
import ContactFooter from './components/ContactFooter.jsx';
import ProjectModal from './components/ProjectModal.jsx';
import Toast from './components/Toast.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'project', itemId: 'clauseguard' });
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      handleShowToast(`Theme switched to ${next.toUpperCase()}`);
      return next;
    });
  };

  // Lenis Smooth Inertia Scroll synced to GSAP Ticker
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    // On mobile touchscreens, keep touch native and snappy
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    const lenis = new Lenis({
      duration: isTouchDevice ? 0.9 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.0
    });

    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  const handleShowToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleOpenProject = (projectId) => {
    setModalState({ isOpen: true, mode: 'project', itemId: projectId });
  };

  const handleOpenTrack = (trackId) => {
    setModalState({ isOpen: true, mode: 'track', itemId: trackId });
  };

  const handleOpenResume = () => {
    setModalState({ isOpen: true, mode: 'resume', itemId: null });
  };

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <CursorBadge />
      <Header theme={theme} onToggleTheme={handleToggleTheme} />
      
      <main role="main">
        <Hero onOpenResume={handleOpenResume} />
        <SpotlightCard />
        <ProjectsGrid onOpenProject={handleOpenProject} />
        <Manifesto />
        <Marquee />
        <LearningTracks onOpenTrack={handleOpenTrack} />
        <Toolbelt />
        <JournalAccordion onOpenProject={handleOpenProject} />
        <ContactFooter onShowToast={handleShowToast} />
      </main>

      <ProjectModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        itemId={modalState.itemId}
        onClose={handleCloseModal}
      />

      <Toast toasts={toasts} />
    </>
  );
}

