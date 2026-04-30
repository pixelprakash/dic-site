export default function Contact() {
  return (
    <>
      <div className="page-header">
        <div className="page-header__accent" />
        <p className="section-label" style={{ color: 'var(--color-terracotta-light)' }}>Connect</p>
        <h1>Get in touch</h1>
        <p>
          Interested in collaboration, research partnerships, or learning more
          about our work at the Design Innovation Centre?
        </p>
      </div>

      <section className="contact-content">
        <div className="contact-info">
          <h3>Contact details</h3>

          <div className="contact-info__item">
            <h4>Email</h4>
            <p>
              <a href="mailto:dic@des.iith.ac.in" style={{ color: 'var(--color-terracotta)' }}>
                dic@des.iith.ac.in
              </a>
            </p>
          </div>

          <div className="contact-info__item">
            <h4>Website</h4>
            <p>
              <a href="https://dic.iith.ac.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-terracotta)' }}>
                dic.iith.ac.in
              </a>
            </p>
          </div>

          <div className="contact-info__item">
            <h4>Principal Investigator</h4>
            <p>Prof. Deepak John Mathew</p>
          </div>

          <div className="contact-info__item">
            <h4>Location</h4>
            <p>
              Design Innovation Centre<br />
              Department of Design<br />
              IIT Hyderabad<br />
              Kandi, Sangareddy,<br />
              Telangana 502284, India
            </p>
          </div>

          <div className="contact-info__item">
            <h4>Hub &amp; Spoke Network</h4>
            <p>
              IIT Hyderabad (Hub)<br />
              IITDM Kancheepuram (Spoke)<br />
              IIT Trichy (Spoke)
            </p>
          </div>
        </div>

        <div className="contact-map">
          <iframe
            title="DIC IIT Hyderabad Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3803.8!2d78.1196!3d17.5915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcbf7d3a68ea0d7%3A0xc0e245e63f7e22b0!2sIIT%20Hyderabad!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="100%"
            style={{ border: 'none', borderRadius: 'var(--border-radius)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
