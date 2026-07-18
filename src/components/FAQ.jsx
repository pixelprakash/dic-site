import { useState } from 'react';
import { FAQS } from '../data/siteData';
import { useReveal } from '../hooks/useReveal';
import '../styles/FAQ.css';

export default function FAQ() {
  const [ref, visible] = useReveal();
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="faq" id="faq" aria-label="Frequently asked questions">
      <div className={`faq__inner reveal ${visible ? 'visible' : ''}`} ref={ref}>
        <h2 className="section-title faq__title">FAQ</h2>

        <div className="faq__list">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div className="faq__item" key={item.q}>
                <h3>
                  <button
                    type="button"
                    className="faq__question"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  >
                    <span className="faq__index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="faq__question-text">{item.q}</span>
                    <svg
                      className={`faq__chevron ${isOpen ? 'open' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </h3>
                <div
                  className={`faq__answer ${isOpen ? 'open' : ''}`}
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
