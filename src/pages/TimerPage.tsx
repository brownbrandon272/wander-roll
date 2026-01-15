import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useTimer } from '../hooks/useTimer';
import CircularProgress from '../components/CircularProgress';
import Button from '../components/Button';
import './TimerPage.css';

export default function TimerPage() {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const duration = useMemo(() => {
    if (settings.useRandomTimer) {
      const min = settings.randomTimerMin;
      const max = settings.randomTimerMax;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return settings.timerDuration;
  }, [settings.useRandomTimer, settings.randomTimerMin, settings.randomTimerMax, settings.timerDuration]);

  const { timeRemaining, progress } = useTimer({
    duration,
    onComplete: () => {
      navigate('/roll');
    },
  });

  const displayTime = Math.ceil(timeRemaining);

  return (
    <div className="page timer-page fade-in">
      <CircularProgress progress={progress} size={280}>
        <span className="timer-display">{displayTime}</span>
        <span className="timer-label">seconds</span>
      </CircularProgress>

      <Button variant="ghost" onClick={() => navigate('/')}>
        Exit
      </Button>
    </div>
  );
}
