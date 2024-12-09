// app/cats/Create.tsx
import { Picker } from '@react-native-picker/picker';

import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native'; // Pickerはdeprecatedの場合もあるので実際には別UIを利用
import { useRouter } from 'expo-router';
import { CatStateCategory } from '../../src/models/Cat';

// 保存処理は実際にはAsyncStorageやDBアクセスを行う（MVP版ではダミー）
async function saveCat(name: string, weight: number, state: CatStateCategory) {
  // TODO: 実装
  return true;
}

export default function CreateCatScreen() {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('4.0');
  const [state, setState] = useState<CatStateCategory>('normal');
  const router = useRouter();

  const handleSave = async () => {
    const w = parseFloat(weight);
    if (await saveCat(name, w, state)) {
        router.push({ pathname: '/cats' as const }); // 保存後、一覧に戻る
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>新規猫登録</Text>
      <Text>名前:</Text>
      <TextInput value={name} onChangeText={setName} style={{ borderWidth: 1, marginBottom: 16 }} />
      <Text>体重(kg):</Text>
      <TextInput value={weight} onChangeText={setWeight} keyboardType="numeric" style={{ borderWidth: 1, marginBottom: 16 }} />
      <Text>状態カテゴリ:</Text>
      <Picker selectedValue={state} onValueChange={(val: CatStateCategory) => setState(val)} style={{ borderWidth: 1, marginBottom: 16 }}>
        <Picker.Item label="通常" value="normal" />
        <Picker.Item label="避妊/去勢済み" value="spayed_neutered" />
        <Picker.Item label="活発" value="active" />
        <Picker.Item label="減量" value="weight_loss" />
      </Picker>
      <Button title="保存" onPress={handleSave} />
    </View>
  );
}
