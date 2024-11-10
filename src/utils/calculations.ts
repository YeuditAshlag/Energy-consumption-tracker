// src/utils/calculations.ts
const ELECTRICITY_COST_PER_KWH = parseFloat(process.env.NEXT_PUBLIC_ELECTRICITY_COST || '0.5');

export function calculateDailyCost(power: number, hours: number) {
  return power * hours * 0.001 * ELECTRICITY_COST_PER_KWH;
}

export function calculateWeeklyCost(dailyCost: number) {
  return dailyCost * 7;
}

export function calculateMonthlyCost(dailyCost: number) {
  return dailyCost * 30;
}
