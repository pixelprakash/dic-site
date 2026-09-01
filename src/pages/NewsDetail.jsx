import { Link, useParams } from 'react-router-dom';
import { getNewsById } from '../data/siteData';
import '../styles/ProjectDetail.css';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export default function NewsDetail() {
  const { id } = useParams();
  const item = getNewsById(id);

  if (!item) {
    return (
      <div className="page-header" style={{ textAlign: 'center' }}>
        <div className="page-header__accent" />
        <ol className="project-detail__breadcrumb" style={{ justifyContent: 'center' }}>
          <li><Link to="/">Home</Link></li>
          <li aria-current="page">Not found</li>
        </ol>
        <h1>Update not found</h1>
        <p style={{ margin: '0 auto' }}>This update doesn&rsquo;t have a page yet, or the link is out of date.</p>
      </div>
    );
  }

  const { title, excerpt, date, image, tag } = item;

  return (
    <div className="project-detail">
      <div className={`page-header project-detail__header ${image ? 'project-detail__header--media' : ''}`}>
        <div className="page-header__accent" />
        <div className="project-detail__header-content">
          <ol className="project-detail__breadcrumb">
            <li><Link to="/">Home</Link></li>
            <li aria-current="page">{title}</li>
          </ol>
          {tag && (
            <div className="project-detail__meta-row">
              <span className="project-detail__status">{tag}</span>
            </div>
          )}
          <h1>{title}</h1>
          <p className="project-detail__subtitle">{formatDate(date)}</p>
        </div>

        {image && (
          <div className="project-detail__header-media">
            <img src={image} alt="" loading="lazy" />
          </div>
        )}
      </div>

      <section className="project-detail__section">
        <p className="project-detail__body">{excerpt}</p>
      </section>

      <section className="project-detail__cta">
        <h2>Interested in DIC&rsquo;s work?</h2>
        <Link className="pill-cta" to="/contact">
          Get in touch
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
