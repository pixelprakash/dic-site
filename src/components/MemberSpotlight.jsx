import MemberCard from './MemberCard';

// Single-member categories (Principal Investigator, Design Head) read better
// as one wide row than a lonely card in a grid — the same card, laid out
// horizontally.
export default function MemberSpotlight({ member }) {
  return <MemberCard member={member} variant="spotlight" />;
}
