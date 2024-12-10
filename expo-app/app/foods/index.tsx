// app/foods/index.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { loadFoods } from '../../src/services/foodStorage';
import { Food } from '../../src/models/Food';

export default function FoodListScreen() {
  const [foods, setFoods] = useState<Food[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await loadFoods();
        setFoods(data);
      })();
    }, [])
  );

  const handlePressFood = (foodId: string) => {
    router.push({ pathname: '/foods/[id]', params: { id: foodId } });
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>フード一覧</Text>
      <Button title="新規登録" onPress={() => router.push('/foods/create')} />
      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handlePressFood(item.id)}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text>カロリー: {item.caloriePerUnit}{item.unit}あたり</Text>
            <Text>塩分: {item.salt}g</Text>
            <Text>脂質: {item.fat}g</Text>
            <Text>価格: {item.price}円</Text>
            <Text>内容量: {item.contentAmount}{item.unit}</Text>
            <Text style={styles.editHint}>タップで編集</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#fff' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  item: { padding:10, borderBottomWidth:1, borderColor:'#ddd' },
  itemName: { fontSize:18, fontWeight:'bold' },
  editHint: { fontSize:12, color:'blue', marginTop:5 }
});
