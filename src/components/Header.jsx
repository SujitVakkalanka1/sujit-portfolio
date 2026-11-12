import React, { useState, useEffect } from 'react';

export default function Header({ theme = 'dark', onToggleTheme }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeString, setTimeString] = useState('00:00:00 IST');
  const [activeSection, setActiveSection] = useState('');

  const navItems = [
    { id: 'spotlight', label: '[ ABOUT ]', mobileLabel: 'ABOUT' },
    { id: 'projects', label: '[ PROJECTS ]', mobileLabel: 'PROJECTS' },
    { id: 'learning', label: '[ LEARNING ]', mobileLabel: 'TRACKS' },
    { id: 'toolbelt', label: '[ TOOLBELT ]', mobileLabel: 'SKILLS' },
    { id: 'contact', label: '[ CONTACT ]', mobileLabel: 'CONTACT' }
  ];

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (!el) return;
    if (window.lenis) {
      window.lenis.scrollTo(el, { offset: -70 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(targetId);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Active ScrollSpy highlighting
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 70) {
        setActiveSection('contact');
      } else if (window.scrollY < 220) {
        setActiveSection('');
      } else {
        const viewThreshold = window.innerHeight * 0.45;
        let current = '';

        const sectionMap = [
          { elId: 'contact', navId: 'contact' },
          { elId: 'journal', navId: 'toolbelt' },
          { elId: 'toolbelt', navId: 'toolbelt' },
          { elId: 'learning', navId: 'learning' },
          { elId: 'manifesto', navId: 'projects' },
          { elId: 'projects', navId: 'projects' },
          { elId: 'spotlight', navId: 'spotlight' },
        ];

        for (const item of sectionMap) {
          const el = document.getElementById(item.elId);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= viewThreshold) {
              current = item.navId;
              break;
            }
          }
        }
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (window.lenis) {
      window.lenis.on('scroll', handleScroll);
    }

    const updateClock = () => {
      const now = new Date();
      const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
      setTimeString(now.toLocaleTimeString('en-GB', options) + ' IST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (window.lenis) {
        window.lenis.off('scroll', handleScroll);
      }
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <header className="site-header" role="banner">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
        <div className="container header-inner">
          <div className="nav-brand-slot" id="nav-brand-slot">
            <a
              href="#hero"
              className="nav-brand-target"
              id="nav-brand-target"
              onClick={(e) => handleNavClick(e, 'hero')}
            >
              SUJIT VAKKALANKA
            </a>
          </div>

          <div className="header-status">
            <div className="live-clock-badge" title="Asia/Kolkata (IST)">
              <span className="pulse-dot"></span>
              <span className="clock-time-text">{timeString}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Bottom Navigation Dock with Active Highlighting & Theme Switcher */}
      <nav className="floating-bottom-nav" role="navigation" aria-label="Main Navigation">
        <div className="bottom-nav-dock">
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`dock-link ${activeSection === item.id ? 'active' : ''}`}
              aria-label={item.mobileLabel}
            >
              <span className="char-shift dock-label-full">{item.label}</span>
              <span className="char-shift dock-label-mobile">{item.mobileLabel}</span>
            </a>
          ))}

          <span className="dock-separator" aria-hidden="true"></span>

          <button
            type="button"
            className="dock-theme-toggle"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="theme-toggle-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="dock-theme-text">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
          </button>
        </div>
      </nav>
    </>
  );
}

