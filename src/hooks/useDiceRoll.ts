import { useState, useCallback, useEffect, useRef } from 'react';

interface UseDiceRollOptions {
  diceCount: 1 | 2;
  onRollComplete?: (values: number[]) => void;
}

interface UseDiceRollReturn {
  values: number[];
  isRolling: boolean;
  roll: () => void;
}

export function useDiceRoll({ diceCount, onRollComplete }: UseDiceRollOptions): UseDiceRollReturn {
  const [values, setValues] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(true);
  const hasRolledRef = useRef(false);

  const roll = useCallback(() => {
    setIsRolling(true);

    // Match the CSS animation duration (1.6s) + small buffer
    setTimeout(() => {
      const newValues = Array.from({ length: diceCount }, () =>
        Math.floor(Math.random() * 6) + 1
      );
      setValues(newValues);
      setIsRolling(false);
      onRollComplete?.(newValues);
    }, 1700);
  }, [diceCount, onRollComplete]);

  // Auto-roll on mount
  useEffect(() => {
    if (!hasRolledRef.current) {
      hasRolledRef.current = true;
      roll();
    }
  }, [roll]);

  return {
    values,
    isRolling,
    roll,
  };
}
