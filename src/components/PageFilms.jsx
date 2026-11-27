import YouTubeEmbed from './YouTubeEmbed';
import { VIDEOS } from '../data/siteData';
import '../styles/PageFilms.css';

// The film(s) belonging to a project, research or event page. Which page a
// film appears on is set by its `page` in data/siteData.js (VIDEOS). Nothing
// loads from the YouTube player until the visitor presses play.
export default function PageFilms({ path, sectionClass = 'project-detail__section', heading, extra = [] }) {
  // `extra`: films a page keeps itself, shown ahead of the shared list.
  const films = [...extra, ...VIDEOS.filter((v) => v.page === path)];
  if (!films.length) return null;
  return (
    <section className={`${sectionClass} page-films`} aria-labelledby="page-films-heading">
      <h2 className="section-title" id="page-films-heading">{heading || (films.length > 1 ? 'Films' : 'Film')}</h2>
      <div className={`page-films__grid${films.length === 1 ? ' page-films__grid--one' : ''}`}>
        {films.map((v) => (
          <YouTubeEmbed key={v.id} videoId={v.id} title={v.title} channel={v.channel} large />
        ))}
      </div>
    </section>
  );
}
