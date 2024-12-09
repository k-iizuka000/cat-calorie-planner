// app/cats/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Cat, CatStateCategory } from '../../src/models/Cat';

// 仮：猫情報取得関数
async function loadCat(id: string): Promise<Cat | null> {
  // ダミー実装：id="1"のときのみ存在する猫を返す
  if (id === '1') {
    return { id: '1', name: 'Tama', weight: 4.5, state: 'normal' };
  }
  return null;
}

// 仮：猫情報更新関数
async function updateCat(id: string, name: string, weight: number, state: CatStateCategory) {
  // TODO: 実際の更新処理を実装（AsyncStorageやAPI呼び出しなど）
  console.log('Updating cat:', { id, name, weight, state });
  return true;
}

export default function EditCatScreen() {
  const { id } = useLocalSearchParams();
  const [cat, setCat] = useState<Cat | null>(null);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('4.0');
  const [state, setState] = useState<CatStateCategory>('normal');

  const router = useRouter();

  useEffect(() => {
    if (id && typeof id === 'string') {
      (async () => {
        const c = await loadCat(id);
        if (c) {
          setCat(c);
          setName(c.name);
          setWeight(c.weight.toString());
          setState(c.state);
        }
      })();
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!cat) return;
    const w = parseFloat(weight);
    if (await updateCat(cat.id, name, w, state)) {
      router.replace('/cats');
    }
  };

  if (!cat) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>猫情報編集</Text>
      <Text>名前:</Text>
      <TextInput 
        value={name} 
        onChangeText={setName} 
        style={{ borderWidth: 1, marginBottom: 16, padding: 8 }} 
      />
      <Text>体重(kg):</Text>
      <TextInput 
        value={weight} 
        onChangeText={setWeight} 
        keyboardType="numeric" 
        style={{ borderWidth: 1, marginBottom: 16, padding: 8 }} 
      />
      <Text>状態カテゴリ:</Text>
      {/* 状態カテゴリ選択はシンプルなTextInputやPicker等を利用、ここでは簡易的に */}
      {/* 将来的にはPickerか、セレクトコンポーネントを使う */}
      <TextInput
        value={state}
        onChangeText={(val) => setState(val as CatStateCategory)}
        style={{ borderWidth: 1, marginBottom: 16, padding: 8 }}
      />
      <Button title="更新" onPress={handleUpdate} />
    </View>
  );
}
