import { Link } from 'react-router-dom';
import '../styles/PageNext.css';

/* The end of a project or study: back to the full list, and on to the next one,
   so the page isn't a dead end. */
export default function PageNext({ items, slug, basePath, listLabel, nextLabel }) {
  const i = items.findIndex((x) => x.slug === slug);
  const next = i === -1 || items.length < 2 ? null : items[(i + 1) % items.length];
  return (
    <nav className="page-next" aria-label="More work">
      <Link className="page-next__all" to={basePath}>
        <span aria-hidden="true">&larr;</span> {listLabel}
      </Link>
      {next && (
        <Link className="page-next__item" to={`${basePath}/${next.slug}`}>
          <span className="page-next__label">{nextLabel}</span>
          <span className="page-next__title">
            {next.title} <span aria-hidden="true">&rarr;</span>
          </span>
        </Link>
      )}
    </nav>
  );
}
