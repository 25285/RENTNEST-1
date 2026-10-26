import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Key, Home, X } from 'lucide-react';
import './PropertyLoadingScreen.css';

/**
 * PropertyLoadingScreen
 * 
 * An elegant, emotionally resonant full-page loading overlay displayed
 * when a tenant selects a rental property card. Features modern calligraphy
 * typography, delicate SVG architectural line-drawing, floating warm accents,
 * and real asset preloading before revealing property details.
 *
 * @param {Object} props
 * @param {Object|null} props.property - The property object being prepared (contains id, title, image, etc.)
 * @param {boolean} props.isOpen - Whether the overlay is currently active
 * @param {Function} props.onComplete - Callback fired after loading & exit transition finish
 * @param {number} [props.minDuration=1600] - Minimum visual display time (ms) to allow quote appreciation
 */
const PropertyLoadingScreen = ({
  property,
  isOpen = false,
  onComplete,
  minDuration = 1600
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isAssetReady, setIsAssetReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const timerRef = useRef(null);
  const exitTimerRef = useRef(null);
  const imgRef = useRef(null);

  // Handle entry and real asset preloading
  useEffect(() => {
    if (!isOpen || !property) {
      setIsVisible(false);
      setIsExiting(false);
      setIsAssetReady(false);
      setMinTimeElapsed(false);
      return;
    }

    // Trigger smooth fade-in
    const enterFrame = requestAnimationFrame(() => {
      setIsVisible(true);
      setIsExiting(false);
    });

    setIsAssetReady(false);
    setMinTimeElapsed(false);

    // 1. Enforce minimum pleasant animation duration
    timerRef.current = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minDuration);

    // 2. Real loading state: Preload high-res property hero image into memory
    if (property.image) {
      const img = new Image();
      imgRef.current = img;

      const handleImageDone = () => {
        setIsAssetReady(true);
      };

      img.onload = handleImageDone;
      img.onerror = handleImageDone; // Fallback so UI never hangs if network or image fails
      img.src = property.image;

      // If already cached by browser
      if (img.complete) {
        setIsAssetReady(true);
      }
    } else {
      setIsAssetReady(true);
    }

    return () => {
      cancelAnimationFrame(enterFrame);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (imgRef.current) {
        imgRef.current.onload = null;
        imgRef.current.onerror = null;
      }
    };
  }, [isOpen, property, minDuration]);

  // When both real data/asset is ready AND minimum visual sequence has played, fade out
  useEffect(() => {
    if (isOpen && minTimeElapsed && isAssetReady && !isExiting) {
      setIsExiting(true);

      // Smooth fade-out duration (matches CSS 450ms)
      exitTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
        if (onComplete) {
          onComplete(property);
        }
      }, 450);
    }
  }, [isOpen, minTimeElapsed, isAssetReady, isExiting, property, onComplete]);

  // Allow tenant to dismiss/skip immediately via keyboard Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          setIsExiting(false);
          if (onComplete) onComplete(property);
        }, 150);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, property, onComplete]);

  if (!isOpen && !isVisible) {
    return null;
  }

  return (
    <aside
      className={`property-loading-overlay ${isVisible ? 'is-visible' : ''} ${isExiting ? 'is-exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Preparing property details"
      aria-busy="true"
    >
      {/* Ambient background glows */}
      <div className="loading-ambient-orb orb-emerald" aria-hidden="true" />
      <div className="loading-ambient-orb orb-warm" aria-hidden="true" />
      <div className="loading-ambient-orb orb-center" aria-hidden="true" />

      <div className="loading-content-container">
        {/* Brand Pill */}
        <div className="loading-brand-pill">
          <svg className="loading-brand-logo-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className="loading-brand-text">RentNest Homes</span>
          <Sparkles size={13} color="#D97706" />
        </div>

        {/* Animated House Outline & Floating Key Visual */}
        <div className="loading-illustration-wrap" aria-hidden="true">
          <div className="loading-icon-halo" />
          <div className="loading-halo-ring" />

          {/* Handcrafted SVG Architectural Line-Drawing */}
          <svg
            className="svg-house-canvas"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Chimney */}
            <path
              className="house-stroke"
              d="M72 38V24H64V30"
              style={{ animationDelay: '0.1s' }}
            />

            {/* Roof Peak & Overhangs */}
            <path
              className="house-stroke"
              d="M18 46L50 18L82 46"
              style={{ animationDelay: '0.25s' }}
            />

            {/* Main House Body / Walls & Floor */}
            <path
              className="house-stroke"
              d="M26 44V80C26 82.2 27.8 84 30 84H70C72.2 84 74 82.2 74 80V44"
              style={{ animationDelay: '0.5s' }}
            />

            {/* Arched Doorway */}
            <path
              className="house-stroke"
              d="M42 84V64C42 59.6 45.6 56 50 56C54.4 56 58 59.6 58 64V84"
              style={{ animationDelay: '0.8s' }}
            />

            {/* Attic Window Frame */}
            <rect
              className="house-window"
              x="45"
              y="34"
              width="10"
              height="10"
              rx="2"
            />

            {/* Warm Hearth Heart Inside Doorway */}
            <path
              className="house-heart"
              d="M50 67C48.5 65.5 46 66.2 46 68.2C46 70.4 50 73 50 73C50 73 54 70.4 54 68.2C54 66.2 51.5 65.5 50 67Z"
            />
          </svg>

          {/* Floating Warm Golden Key Badge */}
          <div className="floating-key-badge" title="Unlocking your home">
            <Key size={18} strokeWidth={2.4} />
            <Sparkles size={12} className="key-sparkle" />
          </div>
        </div>

        {/* Central Quote: Modern Calligraphy Typography */}
        <div className="loading-quote-wrapper">
          <blockquote className="loading-main-quote">
            <span className="quote-mark">“</span>
            Searching for more than a space<span className="quote-dash">—</span>
            <span className="quote-highlight">finding your home</span>
            <span className="quote-mark">.”</span>
          </blockquote>
        </div>

        {/* Selected Property Preview context */}
        {property && (
          <div className="loading-property-preview">
            <span className="preview-dot" />
            <span className="preview-title">{property.title}</span>
            <span className="preview-location">• {property.location}</span>
          </div>
        )}

        {/* Subtle Loading Animation Beneath Quote */}
        <div className="loading-progress-cluster">
          <div className="loading-progress-bar-track">
            <div className="loading-progress-bar-fill" />
          </div>

          <div className="loading-dots-row">
            <span className="animated-dot" />
            <span className="animated-dot" />
            <span className="animated-dot" />
          </div>

          <span className="loading-status-hint">Preparing your rental experience…</span>
        </div>

        {/* Keyboard accessibility hint */}
        <div className="loading-escape-hint">
          <span>Press</span>
          <kbd>ESC</kbd>
          <span>to view instantly</span>
        </div>
      </div>
    </aside>
  );
};

export default PropertyLoadingScreen;
