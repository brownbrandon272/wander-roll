import { useMemo } from 'react';
import './Die.css';

interface DieProps {
  value: number;
  isRolling: boolean;
  customFace?: string;
  selected?: boolean;
  onClick?: () => void;
}

function getTextSizeClass(text: string): string {
  const len = text.length;
  if (len <= 10) return 'text-short';
  if (len <= 18) return 'text-medium';
  return 'text-long';
}

// Map value to rotation needed to show that face facing the viewer
// Standard die: opposite faces sum to 7 (1-6, 2-5, 3-4)
function getRotationForValue(value: number): { x: number; y: number } {
  const rotations: Record<number, { x: number; y: number }> = {
    1: { x: 0, y: 0 },        // front face
    6: { x: 0, y: 180 },      // back face (rotate to see it)
    2: { x: -90, y: 0 },      // top face (tilt down to see it)
    5: { x: 90, y: 0 },       // bottom face (tilt up to see it)
    3: { x: 0, y: -90 },      // right face (rotate left to see it)
    4: { x: 0, y: 90 },       // left face (rotate right to see it)
  };
  return rotations[value] || { x: 0, y: 0 };
}

export default function Die({ value, isRolling, customFace, selected, onClick }: DieProps) {
  const textClass = customFace ? getTextSizeClass(customFace) : '';
  const finalRotation = getRotationForValue(value);

  // Generate random extra spins (full rotations) for variety
  // This is memoized per value so it stays consistent during the roll
  const randomSpins = useMemo(() => ({
    x: Math.floor(Math.random() * 3 + 2) * 360, // 2-4 full X rotations
    y: Math.floor(Math.random() * 3 + 2) * 360, // 2-4 full Y rotations
  }), [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate the final transform that lands on the correct face
  // Add random full rotations + the rotation needed to show the value
  const finalTransform = `rotateX(${randomSpins.x + finalRotation.x}deg) rotateY(${randomSpins.y + finalRotation.y}deg)`;

  return (
    <div
      className={`die ${isRolling ? 'die--rolling' : ''} ${selected ? 'die--selected' : ''} ${onClick ? 'die--clickable' : ''}`}
      onClick={onClick}
    >
      <div
        className="die__cube"
        style={{
          transform: isRolling ? undefined : finalTransform,
          // CSS variable for the animation to use as endpoint
          '--final-transform': finalTransform,
        } as React.CSSProperties}
      >
        {/* Face 1 - Front */}
        <div className="die__face die__face--front">
          <span className="die__pip">{isRolling ? '' : '1'}</span>
        </div>
        {/* Face 6 - Back */}
        <div className="die__face die__face--back">
          <span className="die__pip">{isRolling ? '' : '6'}</span>
        </div>
        {/* Face 2 - Top */}
        <div className="die__face die__face--top">
          <span className="die__pip">{isRolling ? '' : '2'}</span>
        </div>
        {/* Face 5 - Bottom */}
        <div className="die__face die__face--bottom">
          <span className="die__pip">{isRolling ? '' : '5'}</span>
        </div>
        {/* Face 3 - Right */}
        <div className="die__face die__face--right">
          <span className="die__pip">{isRolling ? '' : '3'}</span>
        </div>
        {/* Face 4 - Left */}
        <div className="die__face die__face--left">
          <span className="die__pip">{isRolling ? '' : '4'}</span>
        </div>
      </div>

      {/* Result overlay - only show custom face text if present */}
      {!isRolling && customFace && (
        <div className="die__result-overlay fade-in">
          <span className={`die__result-text ${textClass}`}>{customFace}</span>
        </div>
      )}
    </div>
  );
}
