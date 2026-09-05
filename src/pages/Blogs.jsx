import { Link } from 'react-router-dom';
import '../styles/Blogs.css';

const BLOG_POSTS = [
  {
    id: 'reimagining-formative-assessment-art-education',
    title: 'Reimagining Formative Assessment in Government School Art Education: A Mobile Application Approach',
    excerpt: 'A DIC PhD scholar on presenting his research at the 6th Mobile Studies Congress — and why equitable, mobile-first assessment matters for art classrooms in Telangana.',
    author: 'Ganesh Kumar Malthurkar',
    date: 'August 21, 2026',
    path: '/blogs/reimagining-formative-assessment-art-education',
  },
  {
    id: 'wiki-thesis-research-assessment-ai',
    title: "Time for the 'Wiki-Thesis': Rethinking Research Assessment in the Age of AI Writing",
    excerpt: 'Salil S and Prof. Deepak John Mathew, writing in Careers360, on why AI writing tools call for new thesis formats — and three alternatives worth considering.',
    author: 'Salil S & Deepak John Mathew',
    date: 'October 30, 2024',
    path: '/blogs/wiki-thesis-research-assessment-ai',
  },
];

export default function Blogs() {
  return (
    <>
      <div className="page-header">
        <div className="page-header__accent" />
        <h1>Blogs &amp; Articles</h1>
        <p>Insights, research notes, and stories from the DIC community.</p>
      </div>

      <section className="blogs-list">
        {BLOG_POSTS.map((post) => (
          <Link className="blog-card" to={post.path} key={post.id}>
            <div className="blog-card__meta">
              <span>{post.author}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{post.date}</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <span className="blog-card__cta">
              Read post
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
