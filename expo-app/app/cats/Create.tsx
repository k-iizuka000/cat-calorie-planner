// app/cats/create.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { CatStateCategory, calcDailyCalorie } from '../../src/models/Cat';
import { addCat } from '../../src/services/storage';
import { v4 as uuidv4 } from 'uuid'; // uuidを利用する場合は `npm install uuid`してください

export default function CreateCatScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('4.0');
  const [state, setState] = useState<CatStateCategory>('baby');
  const [adjustedCalorie, setAdjustedCalorie] = useState(0);

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const cal = calcDailyCalorie(w, state);
    setAdjustedCalorie(cal);
  };

  const handleSave = async () => {
    const w = parseFloat(weight);
    const cal = adjustedCalorie || calcDailyCalorie(w, state); 
    const newCat = {
      id: uuidv4(),
      name,
      weight: w,
      state,
      dailyCalorie: cal
    };
    await addCat(newCat);
    router.replace('/cats');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>新規猫登録</Text>
      <Text>名前:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text>体重(kg):</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <Text>状態カテゴリ:</Text>
      {/* @react-native-picker/picker を利用する場合: npm install @react-native-picker/picker */}
      <Picker
        selectedValue={state}
        style={styles.input}
        onValueChange={(itemValue) => setState(itemValue as CatStateCategory)}
        itemStyle={{ color: 'black' }}

      >
        <Picker.Item label="成長期の猫（生後1歳まで）" value="baby" />
        <Picker.Item label="未避妊・未去勢猫" value="not_spayed_neutered" />
        <Picker.Item label="避妊・去勢済み" value="spayed_neutered" />
        <Picker.Item label="活動的な成猫" value="active" />
        <Picker.Item label="非活動的・肥満傾向の猫" value="not_active" />
        <Picker.Item label="減量中" value="weight_loss" />
        <Picker.Item label="増量が必要な猫" value="weight_up" />
        <Picker.Item label="高齢猫" value="old_age" />
      </Picker>

      <Button title="カロリー再計算" onPress={handleCalculate} />
      {adjustedCalorie > 0 && (
        <Text>目標カロリー: {adjustedCalorie} kcal/日</Text>
      )}

      <Button title="保存" onPress={handleSave} />
      <Button title="戻る" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#fff' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  input: { borderWidth:1, borderColor:'#ccc', padding:8, marginBottom:16 }
});
