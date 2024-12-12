// src/models/Food.ts
export interface Food {
  id: string;
  name: string;
  caloriePerUnit: number; // 1単位(例えば100gあたり)のカロリー
  unit: 'g' | 'bag'; // 単位: グラム or 袋
  salt: number;  // 塩分量(例: g/100g)
  fat: number;   // 脂質量(例: g/100g)
  price: number; // 価格(円)
  contentAmount: number; // 内容量(例: g単位、1袋あたり)
}
