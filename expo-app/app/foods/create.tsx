// app/foods/create.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { addFood } from '../../src/services/foodStorage';
import { v4 as uuidv4 } from 'uuid';
import { Picker } from '@react-native-picker/picker';
import { Food } from '../../src/models/Food';

export default function CreateFoodScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [caloriePerUnit, setCaloriePerUnit] = useState('');  // 数字は文字列管理
  const [unit, setUnit] = useState<'g' | 'bag'>('g');
  const [salt, setSalt] = useState('');
  const [fat, setFat] = useState('');
  const [price, setPrice] = useState('');
  const [contentAmount, setContentAmount] = useState('');

  const handleSave = async () => {
    const newFood: Food = {
      id: uuidv4(),
      name,
      caloriePerUnit: parseFloat(caloriePerUnit),
      unit,
      salt: parseFloat(salt),
      fat: parseFloat(fat),
      price: parseFloat(price),
      contentAmount: parseFloat(contentAmount)
    };
    await addFood(newFood);
    router.replace('/foods');
  };

  return (
    <ScrollView  style={styles.container}>
      <Text style={styles.title}>フード新規登録</Text>
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
        title="保存" 
        onPress={() => {
          Alert.alert(
            "保存",
            "保存しますか？",
            [
              { text: "いいえ", style: "cancel" },
              { text: "はい", onPress: handleSave }
            ],
            { cancelable: true }
          );
        }} 
      />
      <Button title="戻る" onPress={() => router.back()} />
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#fff' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  input: { borderWidth:1, borderColor:'#ccc', padding:8, marginBottom:16 }
});
