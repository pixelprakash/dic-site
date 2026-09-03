import { useState } from 'react';
import { Link } from 'react-router-dom';
import { REQUEST_TYPES } from '../data/siteData';
import { useViewOnMap, ViewOnMapTrigger, ViewOnMapPanel } from './ViewOnMap';
// Animated aquarium/fish band — parked for now. Not deleted: uncomment
// this import and the <AquariumBand /> usage below to bring it back.
// import AquariumBand from './AquariumBand';
import '../styles/Footer.css';

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
  { label: 'Twitter / X', href: 'https://twitter.com', icon: 'twitter' },
];

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

const ICONS = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 13v4" />
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  ),
  twitter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4l16 16M20 4 4 20M4 4h5l11 16h-5z" />
    </svg>
  ),
};

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
  { key: 'dic-nodal', src: '/images/dic-nodal-mono.png', alt: 'DIC Nodal' },
  { key: 'ministry-of-education', src: '/images/ministry-of-education-crop.png', alt: 'Ministry of Education, Government of India' },
  { key: 'design-dept', src: '/images/design-dept-mono.png', alt: 'Department of Design, IIT Hyderabad' },
  { key: 'iith', src: '/images/iith-crop.png', alt: 'Indian Institute of Technology Hyderabad' },
];

const CONTACT_GROUPS = [
  { heading: 'General enquiries', lines: ['+91 40 2301 6000', 'dic@des.iith.ac.in'] },
];

const initialForm = { type: '', name: '', email: '', message: '', consent: false };

export default function Footer() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | error | success
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
          {/* Bento layout: this card + the brand card below it stack to
              match the full height of the form card on the right — always
              visible now rather than a hover-only overlay on the tank. */}
          <Link to="/projects/urban-aquaponics-no-soil-farming" className="footer__project-card">
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
          </Link>

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
              <div className="footer__socials">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    {ICONS[s.icon]}
                  </a>
                ))}
              </div>

              {CONTACT_GROUPS.map((group) => (
                <div className="footer__contact-group" key={group.heading}>
                  <h4>{group.heading}</h4>
                  {group.lines.map((line) => (
                    <CopyLine key={line} text={line} />
                  ))}
                </div>
              ))}

              <div className="footer__logos" role="list" aria-label="Affiliated organisations">
                {FOOTER_LOGOS.map((logo) => (
                  <span className="footer__logo-chip" role="listitem" key={logo.key}>
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="footer__logo-item"
                      onError={(e) => { e.currentTarget.closest('.footer__logo-chip').style.display = 'none'; }}
                    />
                  </span>
                ))}
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

        <form className="footer__form" onSubmit={onSubmit} noValidate>
          <h4 className="footer__form-title">Get in touch</h4>

          <div className="footer__field">
            <label htmlFor="footer-type">Type of request</label>
            <select
              id="footer-type"
              value={form.type}
              onChange={update('type')}
            >
              <option value="" disabled>Select an option</option>
              {REQUEST_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="footer__field-row">
            <div className="footer__field">
              <label htmlFor="footer-name">Name</label>
              <input id="footer-name" type="text" placeholder="Your name" value={form.name} onChange={update('name')} autoComplete="name" />
            </div>
            <div className="footer__field">
              <label htmlFor="footer-email">Email</label>
              <input id="footer-email" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} autoComplete="email" />
            </div>
          </div>

          <div className="footer__field">
            <label htmlFor="footer-message">
              Message <span className="footer__field-optional">Optional</span>
            </label>
            <textarea
              id="footer-message"
              placeholder="Tell us a little about your enquiry"
              rows={3}
              value={form.message}
              onChange={update('message')}
            />
          </div>

          <label className="footer__consent">
            <input type="checkbox" checked={form.consent} onChange={update('consent')} />
            <span>
              I agree to the collection and use of my personal data as per the{' '}
              <Link to="/contact">Privacy Policy</Link>, including receiving updates on DIC
              research and events.
            </span>
          </label>

          <div className="footer__form-footer">
            <p className="footer__form-message" role="status">
              {status === 'error' && 'Please fill in your name, a valid email, and accept the consent to continue.'}
              {status === 'success' && "Thanks — we'll be in touch shortly."}
            </p>
            <button type="submit" className="footer__submit" disabled={!form.consent}>
              Send Message
            </button>
          </div>
        </form>
      </div>

      <div className="footer__bottom">
        <span>&copy; {new Date().getFullYear()} DIC, IIT Hyderabad — Department of Design</span>
        <div className="footer__legal">
          <Link to="/contact">Privacy Policy</Link>
          <Link to="/contact">Terms &amp; Conditions</Link>
        </div>
      </div>
      </div>
    </footer>
  );
}
