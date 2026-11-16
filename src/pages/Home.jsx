import HomeClassic from './HomeClassic';
import HomeRedesign from './HomeRedesign';
import { useDesign } from '../lib/designVariant';

// The home page for each site design (see lib/designVariant.js):
//   a — HomeRedesign: the LFS-style redesign
//   b — HomeClassic:  the home page as it was before the redesign (unchanged)
export default function Home() {
  return useDesign() === 'a' ? <HomeRedesign /> : <HomeClassic />;
}
