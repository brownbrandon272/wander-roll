import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import HomePage from './pages/HomePage';
import TimerPage from './pages/TimerPage';
import DiceRollPage from './pages/DiceRollPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/roll" element={<DiceRollPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;
