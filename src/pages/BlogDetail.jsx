import { Link } from 'react-router-dom';
import '../styles/BlogDetail.css';

const PROBLEM_POINTS = [
  'Capture the creative process and growth of learners',
  'Provide real-time feedback when students need it most',
  'Reduce the overwhelming documentation burden on teachers',
  'Reach under-resourced schools with quality assessment tools',
  'Engage students as active participants in tracking their own progress',
];

const SOLUTION_POINTS = [
  'Real-time, meaningful feedback during the creative process — not just after projects are complete',
  'Offline-first functionality that works seamlessly even with inconsistent internet access',
  'Student-centred dashboards that help learners visualise their own growth over time',
  'Data-driven insights that empower teachers to personalise instruction',
  'Culturally responsive assessment rubrics aligned with local art education contexts',
  'Accessibility by design — built for low-end devices and diverse learning needs',
];

export default function BlogDetail() {
  return (
    <div className="blog-detail">
      <div className="page-header">
        <div className="page-header__accent" />
        <ol className="blog-detail__breadcrumb">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/blogs">Blogs &amp; Articles</Link></li>
          <li aria-current="page">Reimagining Formative Assessment</li>
        </ol>
        <h1 className="blog-detail__title">Reimagining Formative Assessment in Government School Art Education: A Mobile Application Approach</h1>
        <p className="blog-detail__byline">
          By Ganesh Kumar Malthurkar, PhD Scholar (Art &amp; Design Education), IIT Hyderabad — August 21, 2026
        </p>
      </div>

      <section className="blog-detail__section">
        <p className="blog-detail__body">
          I'm presenting my research at the 6th Mobile Studies Congress (6MSC), held at IIT
          Hyderabad from 21–23 August 2026 — the first time the International Mobile Studies
          Congress has been hosted in India. Over three days, the congress brings together
          scholars, researchers, educators, and innovators from across the globe for paper
          presentations, research discussions, film screenings, and collaborative dialogue on
          how mobile technology is reshaping media, learning, and everyday life.
        </p>

        <h2 className="section-title">Bridging Assessment and Innovation</h2>
        <p className="blog-detail__body">
          In government schools across Telangana, art classrooms remain largely disconnected
          from modern assessment practices. While technology has transformed many sectors,
          formative assessment in art and design education has lagged behind — relying
          primarily on subjective rubrics and end-of-unit evaluations that often miss the
          nuanced growth happening throughout the learning journey.
        </p>
        <p className="blog-detail__body">
          My paper, <em>&ldquo;Reimagining Formative Assessment in Government School Art
          Education: A Mobile Application Approach for Middle School Learners in
          Telangana,&rdquo;</em> addresses this challenge through a purpose-built mobile
          application.
        </p>

        <h2 className="section-title">The Problem</h2>
        <p className="blog-detail__body">
          Traditional assessment methods in government school art education often fail to:
        </p>
        <ul className="blog-detail__list">
          {PROBLEM_POINTS.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <h2 className="section-title">The Solution</h2>
        <p className="blog-detail__body">
          A mobile-first formative assessment application designed specifically for government
          school contexts — one that accounts for real-world constraints like intermittent
          connectivity, limited device availability, and stretched budgets.
        </p>

        <h2 className="section-title">What It Enables</h2>
        <ul className="blog-detail__list">
          {SOLUTION_POINTS.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <h2 className="section-title">Why This Matters</h2>
        <p className="blog-detail__body">
          This isn't just academic research — it's about equity. Quality assessment tools have
          traditionally been available only to affluent schools with adequate resources. By
          developing solutions that work with real-world constraints rather than against them,
          this research aims to democratise access to formative assessment practices that
          empower both teachers and students.
        </p>
        <p className="blog-detail__body">
          Art education is about cultivating creativity, critical thinking, and self-expression
          — yet assessment methods often stifle these very qualities. Mobile technology, when
          thoughtfully designed, offers a pathway to assessment that honours the artistic
          journey while giving educators actionable insights to support meaningful learning.
        </p>

        <a
          className="blog-detail__external-link"
          href="https://www.6thmobilestudiescongress.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about the 6th Mobile Studies Congress
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>

        <div className="blog-detail__author-card">
          <span className="blog-detail__author-name">Ganesh Kumar Malthurkar</span>
          <span className="blog-detail__author-role">PhD Scholar (Art &amp; Design Education), IIT Hyderabad</span>
          <a href="https://www.linkedin.com/in/ganeshmalthurkar/" target="_blank" rel="noopener noreferrer">
            View LinkedIn profile
          </a>
        </div>
      </section>
    </div>
  );
}
