import { Link } from 'react-router-dom';
import '../styles/BlogDetail.css';

// Published journalism behind The Hindu's paywall — only the opening two
// paragraphs are readable without a subscription. Per the authors' own
// guidance, this stays a short original summary of the piece's premise
// (not a reproduction of its text) with a link to read the rest at the
// source, rather than reconstructing paywalled content from a screenshot.
export default function NaturalIntelligenceBlog() {
  return (
    <div className="blog-detail">
      <div className="page-header">
        <div className="page-header__accent" />
        <ol className="blog-detail__breadcrumb">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/blogs">Blogs &amp; Articles</Link></li>
          <li aria-current="page">How Intelligent Are We About Our Natural Intelligence?</li>
        </ol>
        <h1 className="blog-detail__title">How Intelligent Are We About Our Natural Intelligence?</h1>
        <p className="blog-detail__byline">
          By Salil Sahadevan, PhD Scholar, and Prof. Deepak John Mathew, IIT Hyderabad —
          originally published in <em>The Hindu</em>, October 14, 2025
        </p>
      </div>

      <section className="blog-detail__section">
        <p className="blog-detail__body">
          Can a plant remember? Can a forest converse? In a piece for <em>The Hindu</em>, DIC
          PhD scholar Salil Sahadevan and Prof. Deepak John Mathew open with pea plants that
          learn to associate a fan's breeze with light and adjust their growth accordingly,
          slime moulds that solve mazes with no neurons at all, and trees that exchange signals
          through fungal networks — evidence, they argue, that &ldquo;intelligence is not
          confined to the brain, or to humans.&rdquo;
        </p>
        <p className="blog-detail__body">
          The piece asks a question worth sitting with as AI dominates the conversation around
          intelligence: how do we recognise and promote the many modes of intelligence already
          at play in the natural world, rather than treating co-intelligence with AI as the only
          frontier worth discussing?
        </p>

        <a
          className="blog-detail__external-link"
          href="https://www.thehindu.com/education/how-intelligent-are-we-about-our-natural-intelligence/article70138564.ece"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read the full piece on The Hindu (subscription required)
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>

        <div className="blog-detail__author-card">
          <span className="blog-detail__author-name">Salil Sahadevan</span>
          <span className="blog-detail__author-role">PhD Scholar, IIT Hyderabad</span>
          <Link to="/people/salil-s">View DIC profile</Link>
        </div>
        <div className="blog-detail__author-card">
          <span className="blog-detail__author-name">Prof. Deepak John Mathew</span>
          <span className="blog-detail__author-role">Principal Investigator, DIC, IIT Hyderabad</span>
          <Link to="/people/deepak-john-mathew">View DIC profile</Link>
        </div>
      </section>
    </div>
  );
}
