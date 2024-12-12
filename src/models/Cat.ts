// src/models/Cat.ts
export type CatStateCategory = 'baby' | 'not_spayed_neutered' | 'spayed_neutered' | 'active'| 'not_active' | 'weight_loss' | 'weight_up' | 'old_age';

export interface Cat {
  id: string;
  name: string;
  weight: number; // in kg
  state: CatStateCategory;
  // この辺りに目標カロリーを保存しておいてもいい
  dailyCalorie: number;
}

export const CAT_STATE_FACTOR: Record<CatStateCategory, number> = {
  baby: 2.5,
  not_spayed_neutered: 1.5,
  spayed_neutered: 1.2,
  active: 1.6,
  not_active: 1.0,
  weight_loss: 0.8,
  weight_up: 1.3,
  old_age: 1.1
};

export function calcRER(weight: number): number {
  return weight * 30 + 70;
}

export function calcDailyCalorie(weight: number, state: CatStateCategory): number {
  const rer = calcRER(weight);
  const factor = CAT_STATE_FACTOR[state] || 1.0;
  return Math.round(rer * factor);
}
