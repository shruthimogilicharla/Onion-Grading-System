export type StorageCondition = 'ambient' | 'ventilated' | 'cold_storage';

export const STORAGE_MULTIPLIERS: Record<StorageCondition, number> = {
  ambient: 1.0,
  ventilated: 1.4,
  cold_storage: 3.2,
};

export interface BulbShelfLife {
  remainingDays: number;
  endDate: string;
  urgencyLevel: 'CRITICAL_IMMEDIATE_CONSUMPTION' | 'SHORT_TERM_TRANSIT' | 'LONG_TERM_BUFFER_STORAGE';
}

export interface LotShelfLife {
  lotSafeStorageDays: number;
  lotExpiryDate: string;
  bulbMetrics: BulbShelfLife[];
}

export function calculateBulbBaseShelfLife(type: string): number {
  switch (type) {
    case 'sprout':
      return 7; // Sprouted onion never receives > 7 days ambient
    case 'mold':
      return 3;
    case 'mechanical':
    case 'thick_neck':
    case 'double':
      return 15;
    case 'under_size':
      return 30;
    case 'healthy':
    default:
      return 45;
  }
}

export function getUrgencyLevel(days: number): 'CRITICAL_IMMEDIATE_CONSUMPTION' | 'SHORT_TERM_TRANSIT' | 'LONG_TERM_BUFFER_STORAGE' {
  if (days <= 7) return 'CRITICAL_IMMEDIATE_CONSUMPTION';
  if (days <= 21) return 'SHORT_TERM_TRANSIT';
  return 'LONG_TERM_BUFFER_STORAGE';
}

export function formatExpiryDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(daysFromNow));
  return date.toISOString().split('T')[0];
}

export function calculateLotShelfLife(
  detections: { type: string }[],
  moldPercent: number,
  condition: StorageCondition
): LotShelfLife {
  const multiplier = STORAGE_MULTIPLIERS[condition];
  
  const bulbMetrics = detections.map(d => {
    const baseDays = calculateBulbBaseShelfLife(d.type);
    const totalDays = Math.floor(baseDays * multiplier);
    return {
      remainingDays: totalDays,
      endDate: formatExpiryDate(totalDays),
      urgencyLevel: getUrgencyLevel(totalDays),
    };
  });

  if (bulbMetrics.length === 0) {
    return {
      lotSafeStorageDays: 0,
      lotExpiryDate: formatExpiryDate(0),
      bulbMetrics: []
    };
  }

  // 10th percentile rule for lot safe storage days
  const sortedDays = bulbMetrics.map(b => b.remainingDays).sort((a, b) => a - b);
  const p10Index = Math.max(0, Math.floor(sortedDays.length * 0.1));
  let lotSafeDays = sortedDays[p10Index];

  // Black rot > 10% drops shelf life to <= 5 days
  if (moldPercent > 10) {
    lotSafeDays = Math.min(lotSafeDays, 5);
  }

  return {
    lotSafeStorageDays: lotSafeDays,
    lotExpiryDate: formatExpiryDate(lotSafeDays),
    bulbMetrics
  };
}
