export type SoundType = 'soft-chime' | 'gentle-ping' | 'mellow-bell' | 'wooden-tap' | 'quiet-ding' | 'ding-ping';

export interface Settings {
  timerDuration: number;
  useRandomTimer: boolean;
  randomTimerMin: number;
  randomTimerMax: number;
  diceCount: 1 | 2;
  twoDiceMode: 'sum' | 'choose';
  customFaces: Record<number, string> | null;
  soundEnabled: boolean;
  soundType: SoundType;
}

export const DEFAULT_SETTINGS: Settings = {
  timerDuration: 30,
  useRandomTimer: false,
  randomTimerMin: 10,
  randomTimerMax: 60,
  diceCount: 1,
  twoDiceMode: 'sum',
  customFaces: null,
  soundEnabled: true,
  soundType: 'ding-ping',
};

export interface SettingsContextValue {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetToDefaults: () => void;
}

export const SOUND_OPTIONS: { value: SoundType; label: string }[] = [
  { value: 'ding-ping', label: 'Ding + Ping' },
  { value: 'soft-chime', label: 'Soft Chime' },
  { value: 'gentle-ping', label: 'Gentle Ping' },
  { value: 'mellow-bell', label: 'Mellow Bell' },
  { value: 'wooden-tap', label: 'Wooden Tap' },
  { value: 'quiet-ding', label: 'Quiet Ding' },
];
