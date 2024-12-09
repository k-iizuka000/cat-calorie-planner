// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cat } from '../models/Cat';

const CAT_KEY = 'MY_CATS';

export async function loadCats(): Promise<Cat[]> {
  const json = await AsyncStorage.getItem(CAT_KEY);
  if (json) {
    return JSON.parse(json) as Cat[];
  }
  return [];
}

export async function saveCats(cats: Cat[]): Promise<void> {
  await AsyncStorage.setItem(CAT_KEY, JSON.stringify(cats));
}

export async function addCat(newCat: Cat): Promise<void> {
  const cats = await loadCats();
  cats.push(newCat);
  await saveCats(cats);
}
