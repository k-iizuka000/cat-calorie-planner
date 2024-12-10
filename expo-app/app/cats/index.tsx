// app/cats/index.tsx

import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { loadCats } from '../../src/services/catStorage';
import { Cat } from '../../src/models/Cat';

export default function CatListScreen() {
  const [cats, setCats] = useState<Cat[]>([]);
  const router = useRouter();

  // 画面がフォーカスされるたびにCatsを再読み込み
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await loadCats();
        setCats(data);
      })();
    }, [])
  );

  const handlePressCat = (catId: string) => {
    router.push({ pathname: '/cats/[id]', params: { id: catId } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>猫一覧</Text>
      <Button title="新規登録" onPress={() => router.push('/cats/create')} />
      <FlatList
        data={cats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.catItem} onPress={() => handlePressCat(item.id)}>
            <Text style={styles.catName}>{item.name}</Text>
            <Text>体重: {item.weight} kg</Text>
            <Text>状態: {item.state}</Text>
            <Text>目標カロリー: {item.dailyCalorie} kcal/日</Text>
            <Text style={styles.editHint}>タップで編集</Text>
          </TouchableOpacity>
        )}
      />
      
      <Text >aaaa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#fff' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  catItem: { padding:10, borderBottomWidth:1, borderColor:'#ddd' },
  catName: { fontSize:18, fontWeight:'bold' },
  editHint: { fontSize:12, color:'blue', marginTop:5 }
});
