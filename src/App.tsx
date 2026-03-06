import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ResourcesPage from './pages/ResourcesPage';
import CombatPage from './pages/CombatPage';
import ReferencePage from './pages/ReferencePage';
import TimerPage from './pages/TimerPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ResourcesPage />} />
          <Route path="/combat" element={<CombatPage />} />
          <Route path="/reference" element={<ReferencePage />} />
          <Route path="/timer" element={<TimerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
