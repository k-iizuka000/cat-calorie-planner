// app/foods/create.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Keyboard, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { addFood } from '../../src/services/foodStorage';
import { v4 as uuidv4 } from 'uuid';
import { Picker } from '@react-native-picker/picker';
import { Food } from '../../src/models/Food';

export default function CreateFoodScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [caloriePerUnit, setCaloriePerUnit] = useState('');  
  const [unit, setUnit] = useState<'g' | 'bag'>('g');
  const [salt, setSalt] = useState('');
  const [fat, setFat] = useState('');
  const [price, setPrice] = useState('');
  const [contentAmount, setContentAmount] = useState('');

  const handleSave = async () => {
    const parsedCalorie = parseFloat(caloriePerUnit);
    const parsedSalt = parseFloat(salt);
    const parsedFat = parseFloat(fat);
    const parsedPrice = parseFloat(price);
    const parsedContentAmount = parseFloat(contentAmount);

    const newFood: Food = {
      id: uuidv4(),
      name,
      caloriePerUnit: parsedCalorie,
      unit,
      salt: parsedSalt,
      fat: parsedFat,
      price: parsedPrice,
      contentAmount: parsedContentAmount
    };

    await addFood(newFood);
    router.replace('/foods');
  };

  // unit変更時にcaloriePerUnitの表示を微調整する場合、"100g"や"1袋"など文字追加が必要な場合は
  // 実際にはラベル表示するか、保存時に不要な文字を取り除いてパースするか検討が必要
  // ここでは「入力値の最後に選んだ単位に応じた文字をセット」とあるが、
  // 入力中に自動付与するとパースが困難になるため、
  // 実装としては「表示用の補足」を下記で行い、保存時は数値のみパースする簡易対応とします。

  // 例：表示は"100"と入力したら「100g」などと下に補足テキストで表示。

  const displayUnitText = unit === 'g' ? 'グラム' : '袋';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>フード新規登録</Text>

      <Text>フード名:</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        returnKeyType="done" 
        onSubmitEditing={() => Keyboard.dismiss()}
      />

      <Text>カロリー({caloriePerUnit}{displayUnitText}):</Text>
      <TextInput 
        style={styles.input} 
        value={caloriePerUnit} 
        onChangeText={setCaloriePerUnit} 
        keyboardType="numeric" 
        returnKeyType="done" 
        onSubmitEditing={() => Keyboard.dismiss()} 
      />

      <Text>単位:</Text>
      <Picker 
        selectedValue={unit} 
        style={styles.input} 
        onValueChange={(val) => setUnit(val as 'g' | 'bag')}
        itemStyle={{ color: 'black' }}
      >
        <Picker.Item label="100g" value="g" />
        <Picker.Item label="1袋" value="bag" />
      </Picker>

      <Text>塩分(g):</Text>
      <TextInput 
        style={styles.input} 
        value={salt} 
        onChangeText={setSalt} 
        keyboardType="numeric" 
        returnKeyType="done" 
        onSubmitEditing={() => Keyboard.dismiss()}
      />

      <Text>脂質(g):</Text>
      <TextInput 
        style={styles.input} 
        value={fat} 
        onChangeText={setFat} 
        keyboardType="numeric" 
        returnKeyType="done" 
        onSubmitEditing={() => Keyboard.dismiss()}
      />

      <Text>価格(円):</Text>
      <TextInput 
        style={styles.input} 
        value={price} 
        onChangeText={setPrice} 
        keyboardType="numeric" 
        returnKeyType="done" 
        onSubmitEditing={() => Keyboard.dismiss()}
      />

      <Text>内容量:</Text>
      <TextInput 
        style={styles.input} 
        value={contentAmount} 
        onChangeText={setContentAmount} 
        keyboardType="numeric" 
        returnKeyType="done" 
        onSubmitEditing={() => Keyboard.dismiss()}
      />

      <Button 
        title="保存" 
        onPress={() => {
          Keyboard.dismiss();
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#fff' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20, color:'black' },
  input: { borderWidth:1, borderColor:'#ccc', padding:8, marginBottom:16, color:'black' },
  unitLabel: { color:'black', marginBottom:16 }
});
