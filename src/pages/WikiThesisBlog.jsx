import { Link } from 'react-router-dom';
import '../styles/BlogDetail.css';

// This post is co-authored journalism published by a third-party outlet
// (Careers360), not the authors' own writing shared directly with DIC —
// unlike the Ganesh Kumar Malthurkar post, reproducing its text at length
// isn't appropriate here. This is written as an original, much shorter
// summary of the argument, with a link out to read the full piece.
export default function WikiThesisBlog() {
  return (
    <div className="blog-detail">
      <div className="page-header">
        <div className="page-header__accent" />
        <ol className="blog-detail__breadcrumb">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/blogs">Blogs &amp; Articles</Link></li>
          <li aria-current="page">Time for the 'Wiki-Thesis'</li>
        </ol>
        <h1 className="blog-detail__title">Time for the &lsquo;Wiki-Thesis&rsquo;: Rethinking Research Assessment in the Age of AI Writing</h1>
        <p className="blog-detail__byline">
          By Salil S, PhD Scholar, and Prof. Deepak John Mathew, IIT Hyderabad — originally
          published in <em>Careers360</em>, October 30, 2024
        </p>
      </div>

      <section className="blog-detail__section">
        <p className="blog-detail__body">
          Generative AI can now help a student at almost every stage of writing a thesis —
          from generating ideas and structuring an argument to synthesising literature,
          managing data, editing prose, and even flagging ethical concerns. In a piece for{' '}
          <em>Careers360</em>, DIC PhD scholar Salil S and Prof. Deepak John Mathew argue that
          this changes what a thesis can reasonably be expected to prove, and that research
          assessment needs to catch up rather than pretend the tools don't exist.
        </p>

        <h2 className="section-title">Three Alternatives to the Traditional Thesis</h2>
        <p className="blog-detail__body">
          Rather than trying to police AI use out of a single written document, the authors
          propose evaluating research differently:
        </p>
        <ul className="blog-detail__list">
          <li><strong>Multimodal thesis</strong> — findings presented through video, visualisation, simulation, and audio alongside text, so evaluators can assess engagement with the material more directly than prose alone allows.</li>
          <li><strong>Longitudinal thesis</strong> — a process-oriented format that tracks a student's intellectual development across semesters through iterative feedback, documenting the research journey rather than judging only the final output.</li>
          <li><strong>Wiki-thesis</strong> — a collaborative project built on a public platform, where individual contribution, peer engagement, and iterative revision are all visible — closer to how research actually happens outside academia.</li>
        </ul>

        <h2 className="section-title">Rebellious Research, Honestly Assessed</h2>
        <p className="blog-detail__body">
          The authors also call for what they term &ldquo;rebellious research&rdquo;: scholarship that
          critically examines its own use of AI tools rather than treating them as invisible
          infrastructure. They acknowledge the obvious worry — that any transition risks
          inconsistent evaluation — but argue that &ldquo;clear rubrics, increased data points for
          evaluation&rdquo; can keep assessment fair without pretending AI writing tools aren't
          already part of how research gets done.
        </p>

        <a
          className="blog-detail__external-link"
          href="https://news.careers360.com/ai-writing-tools-research-thesis-rethinking-assessments-iit-hyderabad-ugc-artificial-intelligence-opinion"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read the full piece on Careers360
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>

        <div className="blog-detail__author-card">
          <span className="blog-detail__author-name">Salil S</span>
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
