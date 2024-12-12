// src/services/userStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const USER_KEY = 'USERS';

export interface User {
  id: string;
  nickname: string;
  password: string;
}

export async function loadUsers(): Promise<User[]> {
  const json = await AsyncStorage.getItem(USER_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveUsers(users: User[]): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(users));
}

export async function checkNicknameUnique(nickname: string): Promise<boolean> {
  const users = await loadUsers();
  return !users.some(u => u.nickname.toLowerCase() === nickname.toLowerCase());
}

export async function registerUser(nickname: string, password: string): Promise<void> {
  const users = await loadUsers();
  const newUser: User = {
    id: uuidv4(),
    nickname,
    password
  };
  users.push(newUser);
  await saveUsers(users);
}
