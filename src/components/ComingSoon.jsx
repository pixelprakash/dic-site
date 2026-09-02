import '../styles/ComingSoon.css';

// A plain, honest empty state for sections that exist in the nav ahead of
// having real content — reuses the same "don't fabricate" convention as
// People's "No {label} listed yet" and the Lorem Ipsum placeholder news,
// rather than inventing sample conferences/posts that don't exist yet.
export default function ComingSoon({ note }) {
  return (
    <div className="coming-soon">
      <p>Content for this section is being put together and will be published here soon.</p>
      {note && <p className="coming-soon__note">{note}</p>}
    </div>
  );
}
