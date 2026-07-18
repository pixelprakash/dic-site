import { DOMAINS } from '../data/siteData';
import '../styles/DomainMarquee.css';

export default function DomainMarquee() {
  const track = [...DOMAINS, ...DOMAINS, ...DOMAINS, ...DOMAINS];

  return (
    <section className="domain-marquee" id="marquee-domains" aria-label="Research domains, scrolling highlight">
      <div className="domain-marquee__track">
        {track.map((d, i) => (
          <a
            href="#research-domains"
            className="domain-marquee__item"
            key={`${d.title}-${i}`}
            tabIndex={i < DOMAINS.length ? 0 : -1}
            aria-hidden={i >= DOMAINS.length ? 'true' : undefined}
          >
            <span>{d.title}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z" />
            </svg>
          </a>
        ))}
      </div>
    </section>
  );
}
