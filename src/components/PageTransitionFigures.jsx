// The drawings shown on the page-switch sheet (components/PageTransition.jsx),
// one per section, each a small technical drawing of what that page is about:
//   home      the Double Diamond design process
//   about     the lab's floor plan (the four facilities in the About text)
//   research  the four research areas around the Centre
//   projects  sketch → prototype → build
//   people    the team structure (People page categories)
//   education the course ladder (courses, catalogue, impact, future programs)
//   practices the five-stage design-thinking cycle
//   nodal     the hub-and-spoke national network (80+ nodes)
//   contact   the campus location, by coordinates
//   news      a broadsheet layout
//   events    a calendar month
//   workshops a set square, ruler and pencil
//   conferences an auditorium
//   blogs     an article with a pull quote
// Everything is a stroke or a fade-in timed by --d; the styles are in
// PageTransition.css (.f-*). All drawings share a 880 × 352 viewBox.

const ms = (n) => ({ '--d': `${n}ms` });

function Draw({ d, at = 0, t, cls = '' }) {
  return (
    <path
      className={`f-d ${cls}`}
      pathLength="1"
      d={d}
      style={t ? { ...ms(at), '--t': `${t}ms` } : ms(at)}
    />
  );
}

function Fade({ at = 0, o, children, cls = '' }) {
  return (
    <g className={`f-a ${cls}`} style={o ? { ...ms(at), '--o': o } : ms(at)}>
      {children}
    </g>
  );
}

function Label({ x, y, at = 0, anchor = 'middle', size, children }) {
  return (
    <text className="f-l" x={x} y={y} textAnchor={anchor} style={size ? { ...ms(at), fontSize: size } : ms(at)}>
      {children}
    </text>
  );
}

const pt = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [+(cx + r * Math.cos(a)).toFixed(1), +(cy + r * Math.sin(a)).toFixed(1)];
};

function Home() {
  return (
    <>
      <Fade at={420} o={0.4} cls="f-dash"><path d="M240 30V270M640 30V270" /></Fade>
      <Draw at={160} d="M40 150 240 30 440 150 240 270Z" />
      <Draw at={300} d="M440 150 640 30 840 150 640 270Z" />
      <Fade at={560} o={0.7} cls="f-thin"><path d="M40 292H840M40 284V300M240 284V300M440 284V300M640 284V300M840 284V300" /></Fade>
      <Draw at={140} t={620} cls="f-r f-bold" d="M40 150H840" />
      <circle className="f-run" cx="40" cy="150" r="6" style={ms(140)} />
      <Label x={140} y={326} at={380}>Discover</Label>
      <Label x={340} y={326} at={460}>Define</Label>
      <Label x={540} y={326} at={540}>Develop</Label>
      <Label x={740} y={326} at={620}>Deliver</Label>
    </>
  );
}

function About() {
  return (
    <>
      <Draw at={100} d="M90 40H790V280H90Z" />
      <Draw at={260} d="M440 40V70M440 130V280M90 160H230M290 160H440M440 160H590M650 160H790" />
      <Fade at={440} o={0.55} cls="f-thin"><path d="M230 160A60 60 0 0 1 290 160M440 70A60 60 0 0 1 440 130M590 160A60 60 0 0 1 650 160" /></Fade>
      <Draw at={420} cls="f-r f-bold" t={640} d="M150 230H260V100H620V230H740" />
      <circle className="f-run f-run--plan" cx="150" cy="230" r="6" style={ms(420)} />
      <Fade at={380} o={0.55} cls="f-thin"><path d="M90 304H790M90 296V312M790 296V312" /></Fade>
      <Label x={440} y={326} at={620}>3,000+ sq ft</Label>
      <Label x={265} y={68} at={480} size={13}>Fabrication</Label>
      <Label x={615} y={68} at={540} size={13}>Mixed reality</Label>
      <Label x={190} y={262} at={600} size={13}>Prototyping</Label>
      <Label x={615} y={262} at={660} size={13}>Preservation</Label>
    </>
  );
}

function Research() {
  const nodes = [[170, 88], [710, 88], [170, 232], [710, 232]];
  return (
    <>
      <Fade at={200} o={0.4} cls="f-dash"><circle cx="440" cy="160" r="78" /><circle cx="440" cy="160" r="128" /></Fade>
      <Draw at={150} d={nodes.map(([x, y]) => { const L = Math.hypot(x - 440, y - 160); const sx = (440 + ((x - 440) / L) * 38).toFixed(1); const sy = (160 + ((y - 160) / L) * 38).toFixed(1); return `M${sx} ${sy}L${x} ${y}`; }).join('')} />
      <Fade at={380}>{nodes.map(([x, y]) => <circle key={x + '-' + y} cx={x} cy={y} r="20" className="f-solid" />)}</Fade>
      <Draw at={120} t={520} cls="f-r f-bold" d="M478 160A38 38 0 1 1 477.9 159.4Z" />
      <Label x={440} y={166} at={420} size={15}>DIC</Label>
      <Label x={170} y={46} at={460}>Cultural heritage</Label>
      <Label x={710} y={46} at={520}>Autonomous mobility</Label>
      <Label x={170} y={296} at={580}>Immersive education</Label>
      <Label x={710} y={296} at={640}>Sustainable innovation</Label>
    </>
  );
}

function Projects() {
  return (
    <>
      <Fade at={140} o={0.8} cls="f-dash"><path d="M120 90H260V230H120Z" /></Fade>
      <Draw at={260} d="M370 90H510V230H370Z" />
      <Draw at={420} cls="f-thin" d="M370 150 430 90M370 210 490 90M390 230 510 110M450 230 510 170" />
      <Draw at={420} d="M620 110H740V240H620Z M620 110 660 70H780L740 110 M780 70V200L740 240" />
      <Draw at={640} cls="f-r f-bold" t={300} d="M280 160H350M338 150 350 160 338 170" />
      <Draw at={760} cls="f-r f-bold" t={300} d="M530 160H600M588 150 600 160 588 170" />
      <Label x={190} y={296} at={240}>Sketch</Label>
      <Label x={440} y={296} at={400}>Prototype</Label>
      <Label x={690} y={296} at={560}>Build</Label>
    </>
  );
}

function People() {
  const boxes = [[330, 24, 220, 44], [330, 104, 220, 44], [105, 214, 190, 44], [345, 214, 190, 44], [585, 214, 190, 44]];
  const names = ['Principal Investigator', 'Design Head', 'Phd Students', 'Project Staff', 'Interns'];
  return (
    <>
      <Draw at={100} d={boxes.map(([x, y, w, h]) => `M${x} ${y}H${x + w}V${y + h}H${x}Z`).join('')} />
      <Draw at={300} d="M440 68V104M440 148V182M200 182H680M200 182V214M440 182V214M680 182V214" />
      <Draw at={520} cls="f-r f-bold" t={420} d="M440 68V104M440 148V214" />
      {names.map((n, i) => (
        <Label key={n} x={boxes[i][0] + boxes[i][2] / 2} y={boxes[i][1] + 28} at={260 + i * 90} size={12}>{n}</Label>
      ))}
      <Label x={440} y={310} at={700} size={13}>The team</Label>
    </>
  );
}

function Education() {
  return (
    <>
      <Draw at={120} d="M100 270V210H270V160H440V110H610V60H780V270Z" />
      <Draw at={280} cls="f-thin" d="M100 270H780" />
      <Draw at={380} cls="f-r f-bold" t={560} d="M100 210H270V160H440V110H610V60H780" />
      <circle className="f-run f-run--end" cx="780" cy="60" r="6" style={ms(900)} />
      <Label x={185} y={304} at={420}>Courses</Label>
      <Label x={355} y={304} at={500}>Catalogue</Label>
      <Label x={525} y={304} at={580}>Impact</Label>
      <Label x={695} y={304} at={660}>Future programs</Label>
    </>
  );
}

function Practices() {
  const cx = 440, cy = 176, R = 112;
  const nodes = [-90, -18, 54, 126, 198].map((a) => pt(cx, cy, R, a));
  return (
    <>
      <Fade at={120} o={0.45} cls="f-dash"><circle cx={cx} cy={cy} r={R} /></Fade>
      <Draw at={160} t={760} cls="f-r f-bold" d={`M${cx} ${cy - R}A${R} ${R} 0 1 1 ${cx - 0.1} ${cy - R}`} />
      <Fade at={300}>{nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="20" className="f-solid" />)}</Fade>
      <circle className="f-spin" cx={cx} cy={cy - R} r="7" style={ms(160)} />
      {nodes.map(([x, y], i) => (
        <Label key={i} x={x} y={y + 5} at={360 + i * 70} size={14}>{i + 1}</Label>
      ))}
      <Label x={440} y={34} at={420}>Empathise</Label>
      <Label x={cx + 130} y={cy - 26} at={490} anchor="start">Define</Label>
      <Label x={cx + 68} y={cy + 128} at={560} anchor="start">Ideate</Label>
      <Label x={cx - 68} y={cy + 128} at={630} anchor="end">Prototype</Label>
      <Label x={cx - 130} y={cy - 26} at={700} anchor="end">Test</Label>
    </>
  );
}

function Nodal() {
  const hub = [440, 166];
  const mid = Array.from({ length: 8 }, (_, i) => pt(hub[0], hub[1], 96, i * 45));
  const outer = Array.from({ length: 16 }, (_, i) => pt(hub[0], hub[1], 150, i * 22.5));
  return (
    <>
      <Draw at={140} d={mid.map(([x, y]) => `M${hub[0]} ${hub[1]}L${x} ${y}`).join('')} />
      <Draw at={300} cls="f-thin" d={outer.map(([x, y], i) => `M${mid[Math.floor(i / 2)][0]} ${mid[Math.floor(i / 2)][1]}L${x} ${y}`).join('')} />
      <Fade at={300}>{mid.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" className="f-solid" />)}</Fade>
      <Fade at={460}>{outer.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" className="f-fill" />)}</Fade>
      <Draw at={120} t={520} cls="f-r f-bold" d="M474 166A34 34 0 1 1 473.9 165.4Z" />
      <circle className="f-pulse" cx={hub[0]} cy={hub[1]} r="10" style={ms(560)} />
      <Label x={440} y={342} at={620}>80+ DIC nodes</Label>
    </>
  );
}

function Contact() {
  return (
    <>
      <Fade at={120} o={0.4} cls="f-dash"><circle cx="440" cy="160" r="50" /><circle cx="440" cy="160" r="100" /><circle cx="440" cy="160" r="146" /></Fade>
      <Draw at={100} d="M140 160H740M440 8V312" />
      <Draw at={300} cls="f-thin" d="M440 8V20M440 300V312M140 160H152M728 160H740" />
      <circle className="f-pulse f-pulse--solid" cx="440" cy="160" r="8" style={ms(420)} />
      <Draw at={240} t={460} cls="f-r f-bold" d="M440 160H586" />
      <Label x={440} y={328} at={520}>17.59° N · 78.12° E</Label>
    </>
  );
}

function News() {
  const rows = (x0, x1, y0, n, gap, at) => Array.from({ length: n }, (_, i) => `M${x0} ${y0 + i * gap}H${i === n - 1 ? x0 + (x1 - x0) * 0.6 : x1}`).join('');
  return (
    <>
      <Draw at={100} cls="f-bold" d="M80 44H800" />
      <Draw at={200} d="M80 62H800" />
      <Draw at={300} d="M80 100H400V230H80Z M80 100 400 230M400 100 80 230" cls="f-thin" />
      <Draw at={360} cls="f-bold" d="M440 108H800M440 132H700" />
      <Draw at={440} cls="f-thin" d={rows(440, 800, 164, 4, 22)} />
      <Draw at={520} cls="f-thin" d={rows(80, 400, 256, 3, 20) + rows(440, 800, 256, 3, 20)} />
      <Draw at={560} t={360} cls="f-r f-bold" d="M80 246H160" />
      <Label x={440} y={328} at={620} size={13}>News &amp; updates</Label>
    </>
  );
}

function Events() {
  const v = Array.from({ length: 6 }, (_, k) => `M${139 + 86 * (k + 1)} 40V280`).join('');
  const h = Array.from({ length: 4 }, (_, k) => `M139 ${40 + 48 * (k + 1)}H741`).join('');
  return (
    <>
      <Draw at={100} d="M139 40H741V280H139Z" />
      <Draw at={240} cls="f-thin" d={v + h} />
      <Draw at={360} d="M139 88H741" cls="f-bold" />
      <Draw at={520} cls="f-r f-bold" t={380} d="M397 136H483V184H397Z" />
      <circle className="f-pulse f-pulse--solid" cx="440" cy="160" r="7" style={ms(760)} />
      <Label x={440} y={316} at={600} size={13}>Events</Label>
    </>
  );
}

function Workshops() {
  const ticks = Array.from({ length: 21 }, (_, i) => `M${480 + i * 15} 120V${i % 5 === 0 ? 148 : 136}`).join('');
  return (
    <>
      <Draw at={100} d="M140 280H440L140 80Z" />
      <Draw at={260} cls="f-thin" d="M185 252H356L185 138Z" />
      <Draw at={200} d="M480 120H780V176H480Z" />
      <Draw at={360} cls="f-thin" d={ticks} />
      <Draw at={400} d="M480 224H740L790 242 740 260H480Z M522 224V260" />
      <Draw at={620} cls="f-r f-bold" t={460} d="M480 296H790" />
      <circle className="f-run f-run--pencil" cx="480" cy="296" r="6" style={ms(620)} />
    </>
  );
}

function Conferences() {
  const arc = (r) => {
    const [x1, y1] = pt(440, 60, r, 22);
    const [x2, y2] = pt(440, 60, r, 158);
    return `M${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}`;
  };
  return (
    <>
      <Draw at={100} d="M300 36H580V62H300Z" />
      <g>
        {[80, 115, 150, 185, 220].map((r, i) => <path key={r} d={arc(r)} style={ms(260 + i * 90)} className="f-seatrow" />)}
      </g>
      <circle className="f-pulse f-pulse--solid" cx="440" cy="49" r="7" style={ms(420)} />
      <Draw at={300} t={560} cls="f-r f-bold" d="M392 49H488" />
      <Label x={440} y={326} at={640} size={13}>Conferences</Label>
    </>
  );
}

function Blogs() {
  const widths = [440, 380, 440, 410, 440, 300];
  return (
    <>
      <Draw at={100} cls="f-bold" d="M220 56H640M220 84H520" />
      <Draw at={280} cls="f-thin" d={widths.map((w, i) => `M240 ${130 + i * 24}H${240 + w - 20}`).join('')} />
      <Draw at={420} cls="f-r f-bold" t={420} d="M210 130V268" />
      <Draw at={480} cls="f-thin" d="M240 290H520" />
      <Label x={440} y={328} at={600} size={13}>Blogs &amp; articles</Label>
    </>
  );
}

const FIGURES = { '': Home, about: About, research: Research, projects: Projects, people: People, education: Education, practices: Practices, nodal: Nodal, contact: Contact, news: News, events: Events, workshops: Workshops, conferences: Conferences, blogs: Blogs };

export function figureKey(pathname) {
  const seg = pathname.split('/')[1] || '';
  return seg in FIGURES ? seg : '';
}

export default function Figure({ name }) {
  const F = FIGURES[name] || Home;
  return <F />;
}
