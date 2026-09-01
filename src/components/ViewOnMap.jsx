import { useEffect, useState } from 'react';
import '../styles/ViewOnMap.css';

/* Split into a trigger (the pill) and a panel (the expanded card) that
   share state via useViewOnMap, instead of one component that swaps
   itself in place — the trigger needs to sit next to the logo, aligned
   with the "View project" pill on the card above it, while the expanded
   map needs to live in its own dedicated column so growing it never
   overlaps the description/contact text beside it. One component
   couldn't do both at once; two that share state can. */

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function useViewOnMap(address) {
  const [isOpen, setIsOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const toggle = () => {
    setIsOpen((v) => !v);
    if (isOpen) setMapLoaded(false);
  };

  // Escape closes it the same way it would a dialog, even though this
  // expands in place rather than opening as one.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') toggle();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return { isOpen, toggle, mapLoaded, setMapLoaded, mapSrc };
}

export function ViewOnMapTrigger({ isOpen, onClick, className = '' }) {
  return (
    <button type="button" className={`view-on-map__pill ${className}`} onClick={onClick} aria-expanded={isOpen}>
      <MapPinIcon />
      <span>{isOpen ? 'Hide map' : 'View on map'}</span>
    </button>
  );
}

export function ViewOnMapPanel({ isOpen, mapLoaded, setMapLoaded, mapSrc, locationName, onClose, className = '' }) {
  if (!isOpen) return null;

  return (
    <div className={`view-on-map__card ${className}`}>
      {!mapLoaded && (
        <div className="view-on-map__loading">
          <span className="view-on-map__spinner" aria-hidden="true" />
        </div>
      )}
      <iframe
        title={`Map — ${locationName}`}
        src={mapSrc}
        className={`view-on-map__iframe ${mapLoaded ? 'is-loaded' : ''}`}
        loading="lazy"
        onLoad={() => setMapLoaded(true)}
      />
      <button type="button" className="view-on-map__close" onClick={onClose} aria-label="Close map">
        <CloseIcon />
      </button>
      <div className="view-on-map__label">
        <MapPinIcon />
        <span>{locationName}</span>
      </div>
    </div>
  );
}
