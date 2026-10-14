import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Practices.css';

/* DIC Practices — the five ways the DIC hub works with schools, colleges and
   governments, delivered through The Institute of Human-Centred Design
   (HCD Institute). Content is static for now (not in the CMS). */

const EMAIL = 'dic@hcd.institute';

const PRACTICE_OPTIONS = [
  'Immersion programmes at IIT Hyderabad',
  'Start a DIC in government schools',
  'HCD Lab in schools',
  'Design education centres',
  'Universal design practices',
];

// yes = built for this audience; part = partly / as a sponsor (with a label for screen readers)
const AUDIENCES = ['Private schools', 'Government schools', 'Colleges & universities', 'Government & public bodies'];
const MATRIX = [
  { id: 'immersion', label: 'Immersion programmes at IIT Hyderabad', cells: ['yes', 'yes', 'yes', ['part', 'Through faculty training']] },
  { id: 'gov-schools', label: 'Start a DIC in government schools', cells: [null, 'yes', null, 'yes'] },
  { id: 'hcd-lab', label: 'HCD Lab in schools', cells: ['yes', 'yes', null, null] },
  { id: 'design-centres', label: 'Design education centres', cells: [null, null, 'yes', ['part', 'As sponsor']] },
  { id: 'universal-design', label: 'Universal design practices', cells: [['part', 'Campus audits'], ['part', 'Campus audits'], 'yes', 'yes'] },
];

function Mark({ cell }) {
  if (!cell) return null;
  if (cell === 'yes') return <i className="pr-yes" role="img" aria-label="Yes" />;
  return <i className="pr-part" role="img" aria-label={cell[1]} />;
}

function Facts({ items }) {
  return (
    <div className="pr-facts">
      {items.map(([k, v]) => (
        <div key={k}>
          <span>{k}</span>
          <b>{v}</b>
        </div>
      ))}
    </div>
  );
}

function Cards({ items, cols = 3 }) {
  return (
    <div className={`pr-grid pr-grid--${cols}`}>
      {items.map((c) => (
        <div className="pr-card" key={c.title}>
          <h3>{c.title}</h3>
          {c.ticks ? (
            <ul className={`pr-ticks pr-ticks--one${c.tone ? ` pr-ticks--${c.tone}` : ''}`}>
              {c.ticks.map((t) => <li key={t}>{t}</li>)}
            </ul>
          ) : (
            <p>{c.text}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function Section({ id, tint = false, title, sub, children }) {
  return (
    <section className={`section${tint ? ' section--tint' : ''}`} id={id}>
      <div className="split">
        <div className="split__head">
          <h2 className="section-title">{title}</h2>
          <p className="lede">{sub}</p>
        </div>
        <div className="split__body">{children}</div>
      </div>
    </section>
  );
}

export default function Practices() {
  const [practice, setPractice] = useState(PRACTICE_OPTIONS[0]);
  const [copied, setCopied] = useState(false);

  // The call-to-action buttons pick the practice and jump to the enquiry.
  const enquireAbout = (name) => () => setPractice(name);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the address is on screen to copy by hand */
    }
  };

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(`DIC enquiry: ${practice}`)}&body=${encodeURIComponent(
    `Practice: ${practice}\nName:\nInstitution or department:\nCity and state:\nWhat we are looking for (number of students or schools, timelines, labs we already have):\n`,
  )}`;

  return (
    <div className="pr">
      <header className="page-header page-header--wide">
        <div className="page-header__accent" />
        <h1>Design thinking, taken from the IIT campus into every classroom.</h1>
        <p>
          Five practices through which the DIC hub works with schools, colleges and governments:
          immersions at IIT Hyderabad, DICs in government schools, HCD Labs, design education
          centres, and universal design.
        </p>
      </header>

      <div className="pr-matrix-block">
        <div className="pr-delivered">
          <span className="pr-delivered__mk" aria-hidden="true">HCD</span>
          <p>
            <b>Delivered through The Institute of Human-Centred Design.</b> HCD Institute (est.
            2011) designs the curricula, trains facilitators and runs the programmes for the DIC hub.
          </p>
        </div>
        <div className="pr-matrix-wrap">
          <table className="pr-matrix" aria-label="Which practice fits which institution">
            <thead>
              <tr>
                <th scope="col">Practice</th>
                {AUDIENCES.map((a) => <th scope="col" key={a}>{a}</th>)}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row) => (
                <tr key={row.id}>
                  <th scope="row"><a href={`#${row.id}`}>{row.label}</a></th>
                  {row.cells.map((cell, i) => (
                    <td key={AUDIENCES[i]}><Mark cell={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pr-key">
          <span><i className="pr-yes" />Built for this audience</span>
          <span><i className="pr-part" />Partly, or as a sponsor</span>
        </div>
      </div>

      <Section
        id="immersion"
        title="Immersion programmes at DIC, IIT Hyderabad"
        sub="Five residential days on the IIT campus, in the labs, with the people who build things."
      >
        <p>
          The Design Thinking, Entrepreneurship &amp; Innovation Certificate Programme brings school
          and college students to the DIC hub. They work in studios and labs, meet startups at the
          IIT Hyderabad incubator, and present their work to a jury of faculty and practitioners.
        </p>
        <Facts items={[['Duration', '5 days, residential'], ['Cohort', '30 students a month'], ['Stay', 'IIT Hyderabad guest house'], ['Credential', 'DIC, IIT Hyderabad certificate']]} />
        <ol className="pr-arc" aria-label="The five-day arc">
          {[
            ['Day 1', 'Discover', 'Problem framing and ecosystem mapping.'],
            ['Day 2', 'Empathise', 'Field research with real users.'],
            ['Day 3', 'Prototype', 'Build, test and stress-test ideas.'],
            ['Day 4', 'Industry', 'Incubator visit: drone and space-tech startups, how to register a company.'],
            ['Day 5', 'Jury', 'Studio visit and the Grand Jury pitch.'],
          ].map(([d, t, x]) => (
            <li key={d}><b>{d}</b><strong>{t}</strong>{x}</li>
          ))}
        </ol>
        <Cards items={[
          { title: 'School edition', text: 'For students in Grades 9–12 exploring engineering, design, management or starting a company.' },
          { title: 'College edition', text: 'For undergraduates who want hands-on design and innovation practice at an IIT.' },
          { title: 'Faculty training', text: 'Five days at the DIC hub, once a quarter, so teachers can run design thinking in their own classrooms.' },
        ]} />
        <p className="pr-note">
          Labs students visit include AR/VR immersion, autonomous vehicles and drones, and space
          technology. Alumni get DIC alumni status, invitations to later immersions and reserved
          seats at DIC workshops.
        </p>
        <div className="pr-cta-row">
          <a className="btn" href="#enquire" onClick={enquireAbout('Immersion programmes at IIT Hyderabad')}>Enquire about immersions</a>
        </div>
      </Section>

      <Section
        id="gov-schools"
        tint
        title="Start a DIC in government schools"
        sub="A design innovation node inside the public school system, built on labs schools already have."
      >
        <p>
          NEP 2020 asks schools to build design thinking and innovation into learning. Many
          government schools already have an Atal Tinkering Lab but no structured curriculum or
          trained mentors to use it. The DIC hub works with state education departments and PM SHRI
          schools to turn those labs into DIC school nodes.
        </p>
        <Cards cols={2} items={[
          { title: 'What the department provides', tone: 'gold', ticks: ['Selection of schools and clusters', 'Lab space or existing ATL', 'Teachers released for training', 'A nodal officer for the programme'] },
          { title: 'What DIC and HCD provide', ticks: ['The DIC curriculum and course book', 'Teacher training at IIT Hyderabad', 'Mentoring by DIC faculty and IIT alumni', 'Juries, certification and impact research'] },
        ]} />
        <div className="pr-card">
          <h3>Research built in</h3>
          <p>
            PhD scholars at the DIC hub study how design thinking changes student aptitude over
            time. Findings from government school nodes feed into an India innovation curriculum
            strategy and improve the course materials.
          </p>
        </div>
        <div className="pr-cta-row">
          <a className="btn btn--ghost" href="#enquire" onClick={enquireAbout('Start a DIC in government schools')}>Talk to us as a department</a>
          <span className="pr-cta-note">Engagements start with an MoU between the department and HCD-DIC.</span>
        </div>
      </Section>

      <Section
        id="hcd-lab"
        title="HCD Lab in schools"
        sub="A year-long design thinking and innovation programme that runs inside the school, for every student."
      >
        <p>
          HCD Labs is the DIC hub's school programme. It uses the school's design lab or Atal
          Tinkering Lab, or helps the school set one up with vendors. DIC faculty, design
          practitioners and IIT alumni teach it, and school teachers join the workshop and co-mentor
          the projects.
        </p>
        <div>
          <h3 className="pr-block-title">Each semester</h3>
          <div className="pr-rhythm">
            <div><span>Week 1</span><strong>5-day workshop</strong>Design thinking and innovation, hands-on.</div>
            <div><span>Next 3 weeks</span><strong>Classroom project</strong>20 hours of guided project work, the standard NID project time.</div>
            <div><span>End</span><strong>Jury</strong>External review.</div>
          </div>
        </div>
        <Facts items={[['Grades', '5–8 and 9–12'], ['Cohort', '30 students'], ['Best start', 'Class 6'], ['Credential', 'DIC, IIT Hyderabad certificate']]} />
        <ul className="pr-ticks">
          <li>Runs continuously so every student in the school takes part</li>
          <li>Course book: <i>Introduction to Design Thinking and Innovation</i></li>
          <li>Selected projects move to pre-incubation</li>
          <li>Students mentored toward IITs and premier design and business schools</li>
        </ul>
        <div className="pr-cta-row">
          <a className="btn btn--ghost" href="#enquire" onClick={enquireAbout('HCD Lab in schools')}>Bring HCD Lab to your school</a>
          <span className="pr-cta-note">Fees are agreed per school, based on enrolment and faculty needed.</span>
        </div>
      </Section>

      <Section
        id="design-centres"
        tint
        title="Help in creating design education centres"
        sub="For colleges and universities that want to teach design, step by step, with the IIT hub behind them."
      >
        <p>
          Building a design school takes faculty, studios, curriculum and a track record. HCD
          Institute helps institutions build these in stages, so each step proves itself before the
          next one is funded. The approach comes from the NID and IIT design education tradition,
          adapted for liberal arts, engineering and management campuses.
        </p>
        <ol className="pr-ladder" aria-label="Four stages to a design education centre">
          {[
            [40, 'Stage 1', 'Student immersions', 'Cohorts attend DIC immersions at IIT Hyderabad.'],
            [70, 'Stage 2', 'HCD centre on campus', 'A studio and lab with a DIC-linked programme.'],
            [100, 'Stage 3', 'Faculty development', 'Your own faculty trained to teach design.'],
            [130, 'Stage 4', 'Degree programmes', 'Certificates, diplomas, then a B.Des in design thinking and AI-integrated design.'],
          ].map(([h, s, t, x]) => (
            <li key={s}><i style={{ '--h': `${h}px` }} /><small>{s}</small><strong>{t}</strong>{x}</li>
          ))}
        </ol>
        <Cards items={[
          { title: 'Curriculum', text: 'Programme design and curriculum review, benchmarked against NID and IIT programmes.' },
          { title: 'Spaces', text: 'Planning of studios, maker labs and skill-training and product centres.' },
          { title: 'Network', text: 'Entry into the DIC network as a node, with access to the IIT Hyderabad hub.' },
        ]} />
        <div className="pr-cta-row">
          <a className="btn btn--ghost" href="#enquire" onClick={enquireAbout('Design education centres')}>Plan a centre with us</a>
          <Link className="pr-cta-link" to="/nodal#apply">Or apply to become a DIC node</Link>
        </div>
      </Section>

      <Section
        id="universal-design"
        title="Universal design practices"
        sub="Places, services and digital products that work for everyone, including persons with disabilities."
      >
        <p>
          HCD Institute runs the universal design and accessibility practice for the DIC hub. It
          advises the Kerala State Commissionerate for Persons with Disabilities on accessibility
          design, and brings experts from DIC IIT Hyderabad and MG University's School of Behavioural
          Sciences to each engagement.
        </p>
        <div className="pr-grid pr-grid--2">
          <div className="pr-card">
            <h3>Audit and certification</h3>
            <p>
              Accessibility audits of buildings, public spaces, digital services, wayfinding and
              information, through the{' '}
              <a href="https://hcd.institute/universal-access" target="_blank" rel="noopener noreferrer">Universal Access</a> practice.
            </p>
          </div>
          <div className="pr-card"><h3>Education</h3><p>A Certificate in Universal &amp; Human-Centred Design being developed with MG University, for architects, designers, doctors and civil servants.</p></div>
          <div className="pr-card"><h3>Government digital accessibility</h3><p>Assessment, roadmaps and testing with disabled users, for public-sector websites and services.</p></div>
          <div className="pr-card"><h3>International</h3><p>Readiness audits against the Dubai Universal Design Code and other national standards.</p></div>
        </div>
        <div>
          <h3 className="pr-block-title">Certification tiers</h3>
          <div className="pr-tiers">
            {[
              [1, 'Compliant', 'Meets the legal floor in India: RPwD Act 2016 and the Harmonised Guidelines.'],
              [2, 'Universal', 'Goes beyond compliance, tested with real users across abilities.'],
              [3, 'Design for All', 'Meets the best international standards, such as EU benchmarks.'],
            ].map(([n, t, x]) => (
              <div key={t}>
                <span className="pr-bar" aria-hidden="true">
                  {[1, 2, 3].map((i) => <i key={i} className={i <= n ? 'on' : ''} />)}
                </span>
                <strong>{t}</strong>
                <p>{x}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="pr-pills" aria-label="Standards referenced">
          {['RPwD Act 2016', 'Harmonised Guidelines 2021', 'WCAG 2.2', 'EN 301 549', 'ISO 21542'].map((p) => <span key={p}>{p}</span>)}
        </div>
        <div className="pr-cta-row">
          <a className="btn btn--ghost" href="#enquire" onClick={enquireAbout('Universal design practices')}>Request an accessibility audit</a>
        </div>
      </Section>

      <section className="section section--ink pr-enquire" id="enquire">
        <div className="split">
          <div className="split__head">
            <h2 className="section-title">Start with a conversation</h2>
            <p className="pr-enquire__muted">
              Tell us which practice interests you. The HCD Institute team replies on behalf of the DIC hub.
            </p>
          </div>
          <div className="split__body">
            <div className="pr-enquire__panel">
              <label>
                Practice
                <select value={practice} onChange={(e) => setPractice(e.target.value)}>
                  {PRACTICE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>
              <p className="pr-enquire__how">
                Choose a practice, then email us. Mention your institution, city and state, and what
                you're looking for: number of students or schools, timelines, and labs you already have.
              </p>
              <div className="pr-enquire__actions">
                <a className="btn" href={mailto}>Email {EMAIL}</a>
                <button type="button" className="pr-copy" onClick={copyEmail}>{copied ? 'Copied' : 'Copy email'}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="pr-footer">
        <div>
          <b>Design Innovation Centre, IIT Hyderabad</b>
          <br />Department of Design, IIT Hyderabad, Kandi, Sangareddy, Telangana
          <br />Under the National Initiative for Design Innovation, Ministry of Education, Govt. of India
        </div>
        <div>
          Practices delivered by The Institute of Human-Centred Design
          <br /><a href="https://hcd.institute" target="_blank" rel="noopener noreferrer">hcd.institute</a>
        </div>
      </footer>
    </div>
  );
}
