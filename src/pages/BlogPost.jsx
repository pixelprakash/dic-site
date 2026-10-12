import { Link, useParams } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { useBlogPosts } from '../lib/cms';
import '../styles/BlogDetail.css';

// Renders an article written in the Studio ("Blog post / article"). The three
// original posts keep their own hand-built pages (BlogDetail, WikiThesisBlog,
// NaturalIntelligenceBlog), which are matched before this route.
const components = {
  block: {
    normal: ({ children }) => <p className="blog-detail__body">{children}</p>,
    h2: ({ children }) => <h2 className="section-title">{children}</h2>,
    blockquote: ({ children }) => <blockquote className="blog-detail__body">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="blog-detail__list">{children}</ul>,
    number: ({ children }) => <ol className="blog-detail__list">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">{children}</a>
    ),
  },
  types: {
    image: ({ value }) => (value?.asset?.url ? <img src={value.asset.url} alt={value.alt || ''} loading="lazy" /> : null),
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const { cmsPosts, loading } = useBlogPosts();
  const post = cmsPosts.find((p) => p.slug === slug);

  if (!post) {
    if (loading) return <div className="blog-detail" aria-busy="true" />;
    return (
      <div className="page-header" style={{ textAlign: 'center' }}>
        <div className="page-header__accent" />
        <h1>Article not found</h1>
        <p style={{ margin: '0 auto' }}>
          This article doesn&rsquo;t exist, or the link is out of date. <Link to="/blogs">See all articles</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="blog-detail">
      <div className="page-header">
        <div className="page-header__accent" />
        <ol className="blog-detail__breadcrumb">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/blogs">Blogs &amp; Articles</Link></li>
          <li aria-current="page">{post.title}</li>
        </ol>
        <h1 className="blog-detail__title">{post.title}</h1>
        <p className="blog-detail__byline">{post.byline || `By ${post.author}`} — {post.date}</p>
      </div>

      <section className="blog-detail__section">
        <PortableText value={post.body} components={components} />
        {post.externalUrl && (
          <a className="blog-detail__external-link" href={post.externalUrl} target="_blank" rel="noopener noreferrer">
            Read the full piece
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        )}
      </section>
    </div>
  );
}
