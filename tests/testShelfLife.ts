import assert from 'node:assert';
import { calculateLotShelfLife } from '../src/services/shelfLifeEngine';

console.log("Running Shelf Life Tests...");

// 1. A sprouted onion never receives > 7 days under ambient conditions.
const sproutedLot = calculateLotShelfLife([{ type: 'sprout' }], 0, 'ambient');
assert(sproutedLot.bulbMetrics[0].remainingDays <= 7, "Sprouted onion should not exceed 7 days under ambient");
console.log("✅ Sprouted onion constraint passed.");

// 2. Black rot > 10% drops shelf life to <= 5 days.
const healthyWithMoldLot = calculateLotShelfLife([{ type: 'healthy' }, { type: 'healthy' }], 15, 'ambient');
assert(healthyWithMoldLot.lotSafeStorageDays <= 5, "Lot with > 10% black rot should have safe storage <= 5 days");
console.log("✅ Black rot lot constraint passed.");

// 3. Cold storage triples base longevity.
const healthyAmbient = calculateLotShelfLife([{ type: 'healthy' }], 0, 'ambient');
const healthyCold = calculateLotShelfLife([{ type: 'healthy' }], 0, 'cold_storage');
// Our multiplier for cold storage is 3.2, which is > 3.
assert(healthyCold.bulbMetrics[0].remainingDays >= healthyAmbient.bulbMetrics[0].remainingDays * 3, "Cold storage should at least triple the base longevity");
console.log("✅ Cold storage longevity constraint passed.");

console.log("All tests passed!");
