// app/foods/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Food } from '../../src/models/Food';
import { loadFoods, updateFood, deleteFood } from '../../src/services/foodStorage';
import { Picker } from '@react-native-picker/picker';

export default function EditFoodScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [food, setFood] = useState<Food | null>(null);
  const [name, setName] = useState('');
  const [caloriePerUnit, setCaloriePerUnit] = useState('100');
  const [unit, setUnit] = useState<'g' | 'bag'>('g');
  const [salt, setSalt] = useState('0.1');
  const [fat, setFat] = useState('1.0');
  const [price, setPrice] = useState('100');
  const [contentAmount, setContentAmount] = useState('100');

  useEffect(() => {
    if (typeof id === 'string') {
      loadFoodData(id);
    }
  }, [id]);

  const loadFoodData = async (foodId: string) => {
    const foods = await loadFoods();
    const found = foods.find(f => f.id === foodId);
    if (found) {
      setFood(found);
      setName(found.name);
      setCaloriePerUnit(found.caloriePerUnit.toString());
      setUnit(found.unit);
      setSalt(found.salt.toString());
      setFat(found.fat.toString());
      setPrice(found.price.toString());
      setContentAmount(found.contentAmount.toString());
    }
  };

  const handleUpdate = async () => {
    if (!food) return;
    const updated: Food = {
      ...food,
      name,
      caloriePerUnit: parseFloat(caloriePerUnit),
      unit,
      salt: parseFloat(salt),
      fat: parseFloat(fat),
      price: parseFloat(price),
      contentAmount: parseFloat(contentAmount)
    };
    await updateFood(updated);
    router.replace('/foods');
  };

  const handleDelete = async () => {
    if (!food || typeof id !== 'string') return;
    await deleteFood(id);
    router.replace('/foods');
  };

  const confirmDelete = () => {
    Alert.alert(
      "削除確認",
      "本当に削除しますか？",
      [
        { text: "いいえ", style: "cancel" },
        { text: "はい", onPress: handleDelete }
      ],
      { cancelable: true }
    );
  };

  if (!food) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>フード情報編集</Text>

      <Text>フード名:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} returnKeyType="done" onSubmitEditing={() => Keyboard.dismiss()}/>

      <Text>カロリー(1単位あたり):</Text>
      <TextInput style={styles.input} value={caloriePerUnit} onChangeText={setCaloriePerUnit} keyboardType="numeric" returnKeyType="done" onSubmitEditing={() => Keyboard.dismiss()} />

      <Text>単位:</Text>
      <Picker selectedValue={unit} style={styles.input} onValueChange={(val) => setUnit(val as 'g' | 'bag')} itemStyle={{ color: 'black' }}>
        <Picker.Item label="g" value="g" />
        <Picker.Item label="袋" value="bag" />
      </Picker>

      <Text>塩分(g):</Text>
      <TextInput style={styles.input} value={salt} onChangeText={setSalt} keyboardType="numeric" returnKeyType="done" onSubmitEditing={() => Keyboard.dismiss()}/>

      <Text>脂質(g):</Text>
      <TextInput style={styles.input} value={fat} onChangeText={setFat} keyboardType="numeric" returnKeyType="done" onSubmitEditing={() => Keyboard.dismiss()}/>

      <Text>価格(円):</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" returnKeyType="done" onSubmitEditing={() => Keyboard.dismiss()}/>

      <Text>内容量:</Text>
      <TextInput style={styles.input} value={contentAmount} onChangeText={setContentAmount} keyboardType="numeric" onSubmitEditing={() => Keyboard.dismiss()}/>

      <Button 
        title="更新" 
        onPress={() => {
          Alert.alert(
            "更新",
            "更新しますか？",
            [
              { text: "いいえ", style: "cancel" },
              { text: "はい", onPress: handleUpdate }
            ],
            { cancelable: true }
          );
        }} 
      />
      <Button 
        title="削除" 
        color="red" 
        onPress={() => {
          Alert.alert(
            "削除確認",
            "本当に削除しますか？",
            [
              { text: "いいえ", style: "cancel" },
              { text: "はい", onPress: confirmDelete }
            ],
            { cancelable: true }
          );
        }} 
      />
      <Button title="戻る" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#fff' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  input: { borderWidth:1, borderColor:'#ccc', padding:8, marginBottom:16 }
});
