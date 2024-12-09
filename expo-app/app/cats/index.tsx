// app/cats/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Cat } from '../../src/models/Cat';

// 仮：ローカルストレージから猫一覧を取得する処理（実装は後でstorage.tsなどに）
async function fetchCats(): Promise<Cat[]> {
  // ダミーデータ
  return [
    { id: '1', name: 'Tama', weight: 4.5, state: 'normal' },
    { id: '2', name: 'Mike', weight: 5.0, state: 'spayed_neutered' },
  ];
}

export default function CatListScreen() {
  const [cats, setCats] = useState<Cat[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const data = await fetchCats();
      setCats(data);
    })();
  }, []);

  const handlePressCat = (cat: Cat) => {
    // [id].tsx を使って編集画面へ移動
    // /cats/1 のようなURLになる
    router.push({ pathname: '/cats/[id]', params: { id: cat.id } });

  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>猫一覧</Text>
      <Button title="新規猫登録" onPress={() => router.push('/cats/Create')} />
      <FlatList
        data={cats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handlePressCat(item)} 
            style={{ padding: 12, borderBottomWidth: 1, borderColor: '#ccc' }}
          >
            <Text style={{ fontSize: 16 }}>{item.name} - {item.weight}kg</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
