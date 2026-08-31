import { useState } from 'react';
import '../styles/ViewOnMap.css';

/* A compact "View on map" pill that expands in place into an embedded
   Google Map — collapsed by default so it costs nothing until someone
   actually wants directions, unlike a permanently-embedded iframe. */

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

export default function ViewOnMap({
  locationName = 'Design Innovation Centre',
  address = 'IIT Hyderabad, Kandi, Sangareddy, Telangana 502284',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const toggle = () => {
    setIsOpen((v) => !v);
    if (isOpen) setMapLoaded(false);
  };

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`view-on-map ${isOpen ? 'is-open' : ''} ${className}`}>
      {!isOpen ? (
        <button type="button" className="view-on-map__pill" onClick={toggle}>
          <MapPinIcon />
          <span>View on map</span>
        </button>
      ) : (
        <div className="view-on-map__card">
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
          <button type="button" className="view-on-map__close" onClick={toggle} aria-label="Close map">
            <CloseIcon />
          </button>
          <div className="view-on-map__label">
            <MapPinIcon />
            <span>{locationName}</span>
          </div>
        </div>
      )}
    </div>
  );
}
