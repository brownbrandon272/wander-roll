import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useDiceRoll } from '../hooks/useDiceRoll';
import { useSound } from '../hooks/useSound';
import Die from '../components/Die';
import Button from '../components/Button';
import './DiceRollPage.css';

export default function DiceRollPage() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { play: playDing } = useSound();
  const [selectedDie, setSelectedDie] = useState<number | null>(null);
  const soundPlayedRef = useRef(false);

  const { values, isRolling, roll } = useDiceRoll({
    diceCount: settings.diceCount,
  });

  // Play sound when roll completes (only once)
  useEffect(() => {
    if (!isRolling && values.length > 0 && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      playDing();
    }
  }, [isRolling, values, playDing]);

  const handleRollAgain = () => {
    soundPlayedRef.current = false;
    setSelectedDie(null);
    roll();
  };

  const showChooseMode = settings.diceCount === 2 && settings.twoDiceMode === 'choose' && !isRolling;
  const showSum = settings.diceCount === 2 && settings.twoDiceMode === 'sum' && !isRolling;

  // Get the result value and custom face text
  const getResult = (): { value: number | null; customFace: string | null } => {
    if (isRolling || values.length === 0) return { value: null, customFace: null };

    if (showSum) {
      const sum = values[0] + values[1];
      return { value: sum, customFace: settings.customFaces?.[sum] || null };
    }

    if (showChooseMode && selectedDie !== null) {
      const val = values[selectedDie];
      return { value: val, customFace: settings.customFaces?.[val] || null };
    }

    if (settings.diceCount === 1) {
      const val = values[0];
      return { value: val, customFace: settings.customFaces?.[val] || null };
    }

    return { value: null, customFace: null };
  };

  const result = getResult();

  return (
    <div className="page dice-roll-page fade-in">
      {/* Rolling state */}
      {isRolling && (
        <div className="dice-container">
          {Array.from({ length: settings.diceCount }).map((_, index) => (
            <Die
              key={index}
              value={1}
              isRolling={true}
            />
          ))}
        </div>
      )}

      {/* Result state - single die or choose mode */}
      {!isRolling && !showSum && (
        <>
          <div className="dice-container dice-container--with-labels">
            {values.map((val, index) => (
              <Die
                key={index}
                value={val}
                isRolling={false}
                customFace={settings.customFaces?.[val] || undefined}
                selected={selectedDie === index}
                onClick={showChooseMode ? () => setSelectedDie(index) : undefined}
              />
            ))}
          </div>

          {/* Prompt for choose mode */}
          {showChooseMode && selectedDie === null && (
            <p className="dice-prompt">Tap your favorite!</p>
          )}

          {/* Result for choose mode after selection */}
          {showChooseMode && selectedDie !== null && result.customFace && (
            <div className="result-card fade-in">
              <span className="result-card__text">{result.customFace}</span>
            </div>
          )}
        </>
      )}

      {/* Result state - sum mode */}
      {!isRolling && showSum && (
        <>
          <div className="dice-container">
            {values.map((val, index) => (
              <Die
                key={index}
                value={val}
                isRolling={false}
              />
            ))}
          </div>

          <div className="result-card result-card--large fade-in">
            <span className="result-card__number">{result.value}</span>
            {result.customFace && (
              <span className="result-card__text">{result.customFace}</span>
            )}
          </div>
        </>
      )}

      <div className="button-group">
        <Button variant="secondary" onClick={handleRollAgain}>
          Roll Again
        </Button>
        <Button onClick={() => navigate('/timer')}>
          Start Timer
        </Button>
        <Button variant="ghost" onClick={() => navigate('/')}>
          Back Home
        </Button>
      </div>
    </div>
  );
}
