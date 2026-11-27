import { useState } from 'react';
import { REQUEST_TYPES } from '../data/siteData';
import '../styles/EnquiryForm.css';

// The site has no mail server behind it, so this form never claims to have
// sent anything. It writes the message into a draft in the visitor's own email
// app, which they send themselves; "Copy message" is there for anyone whose
// browser has no email app set up. Nothing typed here is stored or collected.
export const ENQUIRY_EMAIL = 'dic@des.iith.ac.in';

const initialForm = { type: REQUEST_TYPES[0], name: '', message: '' };

export default function EnquiryForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | missing | drafted | copied | nocopy

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setStatus('idle');
  };

  const subject = `${form.type} — DIC website`;
  const body = `${form.message.trim()}\n\n${form.name.trim()}`;
  const complete = Boolean(form.name.trim() && form.message.trim());

  const onSubmit = (e) => {
    e.preventDefault();
    if (!complete) {
      setStatus('missing');
      return;
    }
    window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('drafted');
  };

  const copy = async () => {
    if (!complete) {
      setStatus('missing');
      return;
    }
    try {
      await navigator.clipboard.writeText(`To: ${ENQUIRY_EMAIL}\nSubject: ${subject}\n\n${body}`);
      setStatus('copied');
    } catch {
      setStatus('nocopy');
    }
  };

  return (
    <form className="enquiry" id="enquiry" onSubmit={onSubmit} noValidate aria-labelledby="enquiry-title">
      <h2 className="enquiry__title" id="enquiry-title">Write to us</h2>
      <p className="enquiry__note">
        This opens a ready-written draft in your email app. Your message reaches us only when
        you press Send there. This website does not store what you type.
      </p>

      <div className="enquiry__field">
        <label htmlFor="enquiry-type">Type of request</label>
        <select id="enquiry-type" value={form.type} onChange={update('type')}>
          {REQUEST_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="enquiry__field">
        <label htmlFor="enquiry-name">Your name</label>
        <input id="enquiry-name" type="text" value={form.name} onChange={update('name')} autoComplete="name" required />
      </div>
      <div className="enquiry__field">
        <label htmlFor="enquiry-message">Message</label>
        <textarea id="enquiry-message" rows={5} value={form.message} onChange={update('message')} required />
      </div>

      <div className="enquiry__actions">
        <button type="submit" className="btn">Open email draft</button>
        <button type="button" className="btn btn--ghost" onClick={copy}>Copy message</button>
      </div>
      <p className={`enquiry__status${status === 'missing' ? ' enquiry__status--error' : ''}`} role="status">
        {status === 'missing' && 'Please add your name and a message first.'}
        {status === 'drafted' && `Not sent yet: press Send in your email app. If no draft opened, use “Copy message” and email it to ${ENQUIRY_EMAIL}.`}
        {status === 'copied' && `Copied. Paste it into an email to ${ENQUIRY_EMAIL} and send.`}
        {status === 'nocopy' && `Copying is blocked in this browser. Please email ${ENQUIRY_EMAIL} directly.`}
      </p>
    </form>
  );
}
