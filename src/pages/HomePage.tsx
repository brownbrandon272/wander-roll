import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page home-page fade-in">
      <div className="home-title">
        <h1>Wander Roll</h1>
        <p className="home-subtitle">Let chance decide your next move</p>
      </div>

      <div className="button-group">
        <Button size="lg" onClick={() => navigate('/timer')}>
          Start Timer
        </Button>
        <Button variant="secondary" onClick={() => navigate('/settings')}>
          Settings
        </Button>
      </div>
    </div>
  );
}
