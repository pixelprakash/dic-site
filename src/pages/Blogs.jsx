import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogsData';
import '../styles/Blogs.css';

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
