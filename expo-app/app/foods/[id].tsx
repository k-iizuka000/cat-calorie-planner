// app/foods/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Keyboard, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { loadFoods, updateFood } from '../../src/services/foodStorage';
import { Food } from '../../src/models/Food';
import { Picker } from '@react-native-picker/picker';

export default function EditFoodScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [food, setFood] = useState<Food | null>(null);
  const [name, setName] = useState('');
  const [caloriePerUnit, setCaloriePerUnit] = useState('');
  const [unit, setUnit] = useState<'g' | 'bag'>('g');
  const [salt, setSalt] = useState('');
  const [fat, setFat] = useState('');
  const [price, setPrice] = useState('');
  const [contentAmount, setContentAmount] = useState('');

  useEffect(() => {
    if (typeof id === 'string') {
      loadData(id);
    }
  }, [id]);

  const loadData = async (foodId: string) => {
    const foods = await loadFoods();
    const found = foods.find(f => f.id === foodId);
    if (found) {
      setFood(found);
      // 取得したFoodをステートに反映
      setName(found.name);
      setCaloriePerUnit(found.caloriePerUnit.toString());
      setUnit(found.unit);
      setSalt(found.salt.toString());
      setFat(found.fat.toString());
      setPrice(found.price.toString());
      setContentAmount(found.contentAmount.toString());
    }
  };

  const handleSave = async () => {
    if (!food) return;
    const parsedCalorie = parseFloat(caloriePerUnit);
    const parsedSalt = parseFloat(salt);
    const parsedFat = parseFloat(fat);
    const parsedPrice = parseFloat(price);
    const parsedContentAmount = parseFloat(contentAmount);

    const updatedFood: Food = {
      ...food,
      name,
      caloriePerUnit: parsedCalorie,
      unit,
      salt: parsedSalt,
      fat: parsedFat,
      price: parsedPrice,
      contentAmount: parsedContentAmount
    };

    await updateFood(updatedFood);
    router.replace('/foods');
  };

  const displayUnitText = unit === 'g' ? '100グラム' : '1袋';

  if (!food) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>フード情報編集</Text>

      <Text>フード名:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        returnKeyType="done"
        onSubmitEditing={() => Keyboard.dismiss()}
      />

      <Text>カロリー(1単位あたり):</Text>
      <TextInput
        style={styles.input}
        value={caloriePerUnit}
        onChangeText={setCaloriePerUnit}
        keyboardType="numeric"
        returnKeyType="done"
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      {caloriePerUnit.trim().length > 0 && (
        <Text style={styles.unitLabel}>入力値は{displayUnitText}あたりのカロリーです</Text>
      )}

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
            "変更内容を保存しますか？",
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
