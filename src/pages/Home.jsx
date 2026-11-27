import { lazy } from 'react';
import HomeRedesign from './HomeRedesign';
import { useDesign } from '../lib/designVariant';

const HomeClassic = lazy(() => import('./HomeClassic'));
const HomeC = lazy(() => import('./HomeC'));

// The home page for each site design (see lib/designVariant.js):
//   a — HomeRedesign: the LFS-style redesign
//   b — HomeClassic:  the home page as it was before the redesign (unchanged)
//   c — HomeC:        the soft, cream-and-pastel design after quakerschool.org
export default function Home() {
  const design = useDesign();
  if (design === 'a') return <HomeRedesign />;
  if (design === 'c') return <HomeC />;
  return <HomeClassic />;
}
