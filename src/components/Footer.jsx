import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <h3>Design Innovation Centre</h3>
          <p>
            Hub &amp; Nodal Centre at IIT Hyderabad. Interdisciplinary design research
            bridging heritage, technology, and social impact.
          </p>
        </div>
        <div className="footer__col">
          <h4>Navigate</h4>
          <Link to="/about">About</Link>
          <Link to="/research">Research</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/education">Education</Link>
        </div>
        <div className="footer__col">
          <h4>Research</h4>
          <a href="/research">Cultural Heritage</a>
          <a href="/research">Air Mobility</a>
          <a href="/research">VR/AR Education</a>
          <a href="/research">Product Design</a>
        </div>
        <div className="footer__col">
          <h4>Connect</h4>
          <a href="mailto:dic@des.iith.ac.in">dic@des.iith.ac.in</a>
          <a href="https://dic.iith.ac.in" target="_blank" rel="noopener noreferrer">dic.iith.ac.in</a>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>
      <div className="footer__bottom">
        <span>&copy; {new Date().getFullYear()} DIC, IIT Hyderabad</span>
        <span>Department of Design</span>
      </div>
    </footer>
  );
}
