import { setDesign, useDesign } from '../lib/designVariant';
import '../styles/DesignToggle.css';

// Temporary switch between the two site designs (see lib/designVariant.js).
export default function DesignToggle() {
  const design = useDesign();
  return (
    <div className="dtg" role="group" aria-label="Site design">
      <span className="dtg__label">Design</span>
      <button type="button" className="dtg__btn" aria-pressed={design === 'a'} onClick={() => setDesign('a')}>
        1 <span>Redesign</span>
      </button>
      <button type="button" className="dtg__btn" aria-pressed={design === 'b'} onClick={() => setDesign('b')}>
        2 <span>Current</span>
      </button>
    </div>
  );
}
