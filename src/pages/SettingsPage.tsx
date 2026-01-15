import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useSound } from '../hooks/useSound';
import { SOUND_OPTIONS, type SoundType } from '../types';
import Button from '../components/Button';
import './SettingsPage.css';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { settings, updateSetting, resetToDefaults } = useSettings();
  const { preview } = useSound();

  // Local state for inputs to allow spaces while typing
  const [localFaces, setLocalFaces] = useState<Record<number, string>>(
    settings.customFaces || {}
  );

  const handleCustomFaceChange = (dieValue: number, text: string) => {
    // Update local state immediately (allows spaces)
    setLocalFaces(prev => ({ ...prev, [dieValue]: text }));

    // Update settings with the value (preserve spaces, just limit length)
    const currentFaces = settings.customFaces || {};
    if (text === '') {
      const newFaces = { ...currentFaces };
      delete newFaces[dieValue];
      updateSetting('customFaces', Object.keys(newFaces).length > 0 ? newFaces : null);
    } else {
      updateSetting('customFaces', { ...currentFaces, [dieValue]: text });
    }
  };

  const handleSoundSelect = (soundType: SoundType) => {
    updateSetting('soundType', soundType);
    preview(soundType);
  };

  // Determine which face numbers to show based on dice settings
  const getFaceNumbers = (): number[] => {
    if (settings.diceCount === 2 && settings.twoDiceMode === 'sum') {
      // Sum of two dice ranges from 2-12
      return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }
    // Single die or choose mode: 1-6
    return [1, 2, 3, 4, 5, 6];
  };

  const getPlaceholder = (num: number): string => {
    if (settings.diceCount === 2 && settings.twoDiceMode === 'sum') {
      const examples: Record<number, string> = {
        2: 'Snake eyes!',
        3: 'Turn around',
        7: 'Lucky seven',
        12: 'Boxcars!',
      };
      return examples[num] || 'Action...';
    }
    const examples: Record<number, string> = {
      1: 'Turn left',
      2: 'Buy something',
    };
    return examples[num] || 'Action...';
  };

  const faceNumbers = getFaceNumbers();

  return (
    <div className="page settings-page fade-in">
      <div className="settings-header">
        <h1>Settings</h1>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          Back
        </Button>
      </div>

      <div className="settings-content">
        {/* Timer Duration */}
        <section className="settings-section">
          <h2>Timer</h2>

          <div className="setting-item">
            <label className="setting-label">
              Duration: {settings.timerDuration}s
            </label>
            <input
              type="range"
              min="5"
              max="300"
              step="5"
              value={settings.timerDuration}
              onChange={(e) => updateSetting('timerDuration', Number(e.target.value))}
              className="setting-slider"
            />
          </div>

          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.useRandomTimer}
                onChange={(e) => updateSetting('useRandomTimer', e.target.checked)}
                className="setting-checkbox"
              />
              Use random timer
            </label>
          </div>

          {settings.useRandomTimer && (
            <div className="setting-item setting-item--nested">
              <div className="setting-range">
                <label>
                  Min: {settings.randomTimerMin}s
                  <input
                    type="range"
                    min="5"
                    max={settings.randomTimerMax - 5}
                    step="5"
                    value={settings.randomTimerMin}
                    onChange={(e) => updateSetting('randomTimerMin', Number(e.target.value))}
                    className="setting-slider"
                  />
                </label>
                <label>
                  Max: {settings.randomTimerMax}s
                  <input
                    type="range"
                    min={settings.randomTimerMin + 5}
                    max="300"
                    step="5"
                    value={settings.randomTimerMax}
                    onChange={(e) => updateSetting('randomTimerMax', Number(e.target.value))}
                    className="setting-slider"
                  />
                </label>
              </div>
            </div>
          )}
        </section>

        {/* Dice Settings */}
        <section className="settings-section">
          <h2>Dice</h2>

          <div className="setting-item">
            <label className="setting-label">Number of dice</label>
            <div className="setting-buttons">
              <button
                className={`setting-btn ${settings.diceCount === 1 ? 'setting-btn--active' : ''}`}
                onClick={() => updateSetting('diceCount', 1)}
              >
                1
              </button>
              <button
                className={`setting-btn ${settings.diceCount === 2 ? 'setting-btn--active' : ''}`}
                onClick={() => updateSetting('diceCount', 2)}
              >
                2
              </button>
            </div>
          </div>

          {settings.diceCount === 2 && (
            <div className="setting-item setting-item--nested">
              <label className="setting-label">Two dice mode</label>
              <div className="setting-buttons">
                <button
                  className={`setting-btn ${settings.twoDiceMode === 'sum' ? 'setting-btn--active' : ''}`}
                  onClick={() => updateSetting('twoDiceMode', 'sum')}
                >
                  Sum
                </button>
                <button
                  className={`setting-btn ${settings.twoDiceMode === 'choose' ? 'setting-btn--active' : ''}`}
                  onClick={() => updateSetting('twoDiceMode', 'choose')}
                >
                  Choose favorite
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Custom Faces */}
        <section className="settings-section">
          <h2>Custom {settings.diceCount === 2 && settings.twoDiceMode === 'sum' ? 'Results' : 'Die Faces'}</h2>
          <p className="setting-hint">
            {settings.diceCount === 2 && settings.twoDiceMode === 'sum'
              ? 'Assign meanings to each possible sum (2-12)'
              : 'Assign meanings to each die number'}
          </p>

          <div className="custom-faces-grid">
            {faceNumbers.map((num) => (
              <div key={num} className="custom-face-item">
                <span className="custom-face-number">{num}</span>
                <input
                  type="text"
                  placeholder={getPlaceholder(num)}
                  value={localFaces[num] ?? settings.customFaces?.[num] ?? ''}
                  onChange={(e) => handleCustomFaceChange(num, e.target.value)}
                  className="custom-face-input"
                  maxLength={25}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Sound */}
        <section className="settings-section">
          <h2>Sound</h2>

          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                className="setting-checkbox"
              />
              Play sound when timer completes
            </label>
          </div>

          {settings.soundEnabled && (
            <div className="setting-item setting-item--nested">
              <label className="setting-label">Sound type (tap to preview)</label>
              <div className="sound-options">
                {SOUND_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`sound-option ${settings.soundType === option.value ? 'sound-option--active' : ''}`}
                    onClick={() => handleSoundSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Footer buttons */}
        <section className="settings-section settings-section--footer">
          <div className="settings-footer-buttons">
            <Button variant="ghost" size="sm" onClick={resetToDefaults}>
              Reset to defaults
            </Button>
            <Button size="sm" onClick={() => navigate('/')}>
              Done
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
