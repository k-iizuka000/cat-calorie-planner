// app/cats/[id].tsx
import React, { useEffect, useState } from 'react';
import { Alert, View, Text, TextInput, Button, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CatStateCategory, calcDailyCalorie, Cat } from '../../src/models/Cat';
import { loadCats, saveCats, deleteCat } from '../../src/services/catStorage';

export default function EditCatScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();

  const [cat, setCat] = useState<Cat | null>(null);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('4.0');
  const [state, setState] = useState<CatStateCategory>('baby');
  const [adjustedCalorie, setAdjustedCalorie] = useState(0);

  useEffect(() => {
    if (typeof id === 'string') {
      loadCatData(id);
    }
  }, [id]);

  const loadCatData = async (catId: string) => {
    const cats = await loadCats();
    const found = cats.find(c => c.id === catId);
    if (found) {
      setCat(found);
      setName(found.name);
      setWeight(found.weight.toString());
      setState(found.state);
      setAdjustedCalorie(found.dailyCalorie);
    }
  };

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const cal = calcDailyCalorie(w, state);
    setAdjustedCalorie(cal);
  };

  const handleSave = async () => {
    if (!cat) return;
    const w = parseFloat(weight);
    const cal = adjustedCalorie || calcDailyCalorie(w, state);

    const cats = await loadCats();
    const updatedCats = cats.map(c => {
      if (c.id === cat.id) {
        return { ...c, name, weight: w, state, dailyCalorie: cal };
      }
      return c;
    });
    await saveCats(updatedCats);
    router.replace('/cats');
  };

  const handleDelete = async () => {
    if (!cat || typeof id !== 'string') return;
    await deleteCat(id);
    router.replace('/cats');
  };

  if (!cat) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>猫情報編集</Text>

      <Text>名前:</Text>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </TouchableWithoutFeedback>

      <Text>体重(kg):</Text>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
      </TouchableWithoutFeedback>

      <Text>状態カテゴリ:</Text>
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

      <Button 
        title="更新" 
        onPress={() => {
          Alert.alert(
            "更新",
            "更新しますか？",
            [
              { text: "いいえ", style: "cancel" },
              { text: "はい", onPress: handleSave }
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
              { text: "はい", onPress: handleDelete }
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
