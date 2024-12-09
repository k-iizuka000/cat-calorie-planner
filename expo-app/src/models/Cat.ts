// src/models/Cat.ts
export type CatStateCategory = 'normal' | 'spayed_neutered' | 'active' | 'weight_loss';

export interface Cat {
  id: string;
  name: string;
  weight: number; // kg
  state: CatStateCategory;
}

// 状態毎の係数（仮例）
export const CAT_STATE_FACTOR: Record<CatStateCategory, number> = {
  normal: 1.0,
  spayed_neutered: 1.2,
  active: 1.6,
  weight_loss: 0.8,
};

// RER計算例
export function calcRER(weight: number): number {
  return weight * 30 + 70;
}

// 1日の目標カロリー計算例
export function calcDailyCalorie(weight: number, state: CatStateCategory): number {
  const rer = calcRER(weight);
  const factor = CAT_STATE_FACTOR[state] || 1.0;
  return Math.round(rer * factor);
}
