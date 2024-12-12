// src/services/foodStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Food } from '../models/Food';

const FOOD_KEY = 'MY_FOODS';

export async function loadFoods(): Promise<Food[]> {
  const json = await AsyncStorage.getItem(FOOD_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveFoods(foods: Food[]): Promise<void> {
  await AsyncStorage.setItem(FOOD_KEY, JSON.stringify(foods));
}

export async function addFood(newFood: Food): Promise<void> {
  const foods = await loadFoods();
  foods.push(newFood);
  await saveFoods(foods);
}

export async function updateFood(updatedFood: Food): Promise<void> {
  const foods = await loadFoods();
  const newArray = foods.map((f) => f.id === updatedFood.id ? updatedFood : f);
  await saveFoods(newArray);
}

export async function deleteFood(id: string): Promise<void> {
  const foods = await loadFoods();
  const filtered = foods.filter(f => f.id !== id);
  await saveFoods(filtered);
}
