import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useViewOnMap, ViewOnMapTrigger, ViewOnMapPanel } from './ViewOnMap';
// Animated aquarium/fish band — parked for now. Not deleted: uncomment
// this import and the <AquariumBand /> usage below to bring it back.
// import AquariumBand from './AquariumBand';
import '../styles/Footer.css';

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// A small copy button beside a phone number/email — one click, no need
// to select the text by hand. Falls back silently if the Clipboard API
// isn't available (an insecure context, or a very old browser).
function CopyLine({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard permission denied — nothing more to do without a
      // fallback text-selection flow, so just leave the button as-is.
    }
  };

  return (
    <span className="footer__contact-line">
      <span className="footer__contact-value">{text}</span>
      <button
        type="button"
        className="footer__copy-btn"
        onClick={handleCopy}
        aria-label={copied ? `Copied ${text}` : `Copy ${text}`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </span>
  );
}

// Affiliation lockup shown at the bottom of the brand card — the DIC
// mark itself already appears above (brand-top row + the logo-strip
// wordmark), so this row is just the other four affiliated bodies, all
// on the same plain white chip now for one consistent style.
//
// The "-crop" files are tightly cropped versions of the originals: every
// source PNG had a large transparent margin baked into its own canvas
// (design-dept.png's actual logo, for instance, only filled 28% of its
// square canvas's height), so object-fit: contain was shrinking the
// visible mark down to fit that empty margin too, reading as "the logo
// is tiny with a rim of whitespace" no matter how big the chip itself
// was made.
//
// The "-mono" files go a step further, recoloured to solid black so
// every logo reads the same way on a white chip:
//   - design-dept-mono.png: the source was already white line art on a
//     transparent background, so this just swaps white for black.
//   - dic-nodal-mono.png: the source had its navy background baked in as
//     *opaque* pixels (not transparent), with white icon + wordmark on
//     top of it — recreating a transparent version meant chroma-keying
//     that navy out pixel-by-pixel (by distance from the navy colour)
//     before recolouring what's left to black.
const FOOTER_LOGOS = [
  { key: 'dic-nodal', src: '/images/dic-nodal-mono.webp', alt: 'DIC Nodal' },
  { key: 'ministry-of-education', src: '/images/ministry-of-education-crop.webp', alt: 'Ministry of Education, Government of India', href: 'https://www.education.gov.in' },
  { key: 'design-dept', src: '/images/design-dept-mono.webp', alt: 'Department of Design, IIT Hyderabad', href: 'https://design.iith.ac.in' },
  { key: 'iith', src: '/images/iith-crop.webp', alt: 'Indian Institute of Technology Hyderabad', href: 'https://www.iith.ac.in' },
];

const CONTACT_GROUPS = [
  { heading: 'General enquiries', lines: ['+91 40 2301 6000', 'dic@des.iith.ac.in'] },
];

export default function Footer() {
  const { pathname } = useLocation();
  const map = useViewOnMap('IIT Hyderabad, Kandi, Sangareddy, Telangana 502284');

  const update = (field) => (e) => {
    const value = field === 'consent' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    if (status !== 'idle') setStatus('idle');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!form.name.trim() || !validEmail || !form.consent) {
      setStatus('error');
      return;
    }
    setStatus('success');
    setForm(initialForm);
  };

  return (
    <footer className="footer">
      {/* <AquariumBand /> — parked for now, see import note above */}
      <div className="footer__inner">
      <div className="footer__top">
        <div className="footer__left">
          {/* Bento layout: this card used to stack above the brand card to
              match the full height of the form card on the right. Parked
              for now along with the aquarium band it linked to — not
              deleted: uncomment to bring it back as the first item here. */}
          {/* <Link to="/projects/urban-aquaponics-no-soil-farming" className="footer__project-card">
            <div className="footer__project-body">
              <p className="footer__project-eyebrow">Did you know?</p>
              <p className="footer__project-title">DIC grows food without soil, using fish like these</p>
            </div>
            <span className="footer__project-link">
              View project
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link> */}

          <div className={`footer__brand ${map.isOpen ? 'footer__brand--map-open' : ''}`}>
            {/* Two dedicated columns, not one shared row — the expanded
                map lives entirely in its own column, so growing it can
                never overlap the logo/description/contact text in the
                other column, at any state or width. That column only
                actually takes up space once the map is open — closed, it
                collapses to nothing and the text column gets the full
                width back. */}
            <div className="footer__brand-main">
              {/* Logo + map trigger share a row, mirroring the project
                  card above (label left, CTA right) so the two CTAs line
                  up at the same position — only the trigger lives here;
                  the expanded map itself renders in .footer__brand-map
                  below, its own dedicated space, so it can never grow
                  into this text column. */}
              <div className="footer__brand-top">
                <img src="/images/diclogo.webp" alt="DIC — Design Innovation Centre, IIT Hyderabad" className="footer__logo" />
                <ViewOnMapTrigger isOpen={map.isOpen} onClick={map.toggle} className="footer__map-trigger" />
              </div>
              <p>
                Nodal Centre at IIT Hyderabad. Interdisciplinary design research bridging
                heritage, technology, and social impact.
              </p>
              {CONTACT_GROUPS.map((group) => (
                <div className="footer__contact-group" key={group.heading}>
                  <h2 className="footer__contact-title">{group.heading}</h2>
                  {group.lines.map((line) => (
                    <CopyLine key={line} text={line} />
                  ))}
                </div>
              ))}

              <div className="footer__logos" role="list" aria-label="Affiliated organisations">
                {FOOTER_LOGOS.map((logo) => {
                  const img = (
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="footer__logo-item"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.currentTarget.closest('[role="listitem"]').style.display = 'none'; }}
                    />
                  );
                  return (
                    <div className="footer__logo-item-wrap" role="listitem" key={logo.key}>
                      {logo.href ? (
                        <a
                          className="footer__logo-chip"
                          href={logo.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {img}
                        </a>
                      ) : (
                        <span className="footer__logo-chip">
                          {img}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="footer__brand-map">
              <ViewOnMapPanel
                isOpen={map.isOpen}
                mapLoaded={map.mapLoaded}
                setMapLoaded={map.setMapLoaded}
                mapSrc={map.mapSrc}
                locationName="Design Innovation Centre, IIT Hyderabad"
                onClose={map.toggle}
                className="footer__map"
              />
            </div>
          </div>
        </div>

        {pathname !== '/contact' && (
          <div className="footer__cta">
            <h2 className="footer__cta-title">Get in touch</h2>
            <p>Collaboration, research partnerships, courses or a visit to the lab.</p>
            <Link className="footer__cta-link" to="/contact#enquiry">
              Send an enquiry <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </div>

      <div className="footer__bottom">
        <span>&copy; {new Date().getFullYear()} DIC, IIT Hyderabad — Department of Design</span>
      </div>
      </div>
    </footer>
  );
}
