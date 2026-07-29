import { useState } from 'react';
import { Link } from 'react-router-dom';
import { REQUEST_TYPES } from '../data/siteData';
// Playful fish-tank footer treatment — parked for now while the site keeps a
// more serious tone. Not deleted: flip this back on by uncommenting the
// import and the <AquariumBand /> usage below.
// import AquariumBand from './AquariumBand';
import '../styles/Footer.css';

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
  { label: 'Twitter / X', href: 'https://twitter.com', icon: 'twitter' },
];

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

const CONTACT_GROUPS = [
  { heading: 'General enquiries', lines: ['+91 40 2301 6000', 'dic@des.iith.ac.in'] },
  { heading: 'Media & press', lines: ['press@dic.iith.ac.in'] },
  { heading: 'Careers & fellowships', lines: ['careers@dic.iith.ac.in'] },
];

const PAGES = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Research', path: '/research' },
  { label: 'Projects', path: '/projects' },
  { label: 'Education', path: '/education' },
  { label: 'Contact', path: '/contact' },
];

const initialForm = { type: '', name: '', email: '', message: '', consent: false };

export default function Footer() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | error | success

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
          <div className="footer__brand">
            <img src="/images/diclogo.webp" alt="DIC — Design Innovation Centre, IIT Hyderabad" className="footer__logo" />
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
          </div>

          <div className="footer__columns">
            <div className="footer__col">
              {CONTACT_GROUPS.map((group) => (
                <div className="footer__contact-group" key={group.heading}>
                  <h4>{group.heading}</h4>
                  {group.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
              ))}
            </div>
            <div className="footer__col">
              <h4>Pages</h4>
              {PAGES.map((p) => (
                <Link key={p.path} to={p.path}>{p.label}</Link>
              ))}
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
