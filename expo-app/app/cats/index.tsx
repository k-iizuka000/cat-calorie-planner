// app/cats/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { loadCats } from '../../src/services/storage';
import { Cat } from '../../src/models/Cat';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function CatListScreen() {
  const [cats, setCats] = useState<Cat[]>([]);
  const router = useRouter();

  const fetchData = async () => {
    const data = await loadCats();
    setCats(data);
  };


  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>猫一覧</Text>
      <Button title="新規登録" onPress={() => router.push('/cats/create')} />
      <FlatList
        data={cats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.catItem}>
            <Text style={styles.catName}>{item.name}</Text>
            <Text>体重: {item.weight} kg</Text>
            <Text>状態: {item.state}</Text>
            <Text>目標カロリー: {item.dailyCalorie} kcal/日</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#fff' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  catItem: { padding:10, borderBottomWidth:1, borderColor:'#ddd' },
  catName: { fontSize:18, fontWeight:'bold' }
});
