// app/menus/index.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { loadCats } from '../../src/services/catStorage';
import { loadFoods } from '../../src/services/foodStorage';
import { Cat } from '../../src/models/Cat';
import { Food } from '../../src/models/Food';

type PriorityType = 'cost' | 'single' | 'balance';

interface ResultItem {
  feedingNo: number;
  foodName: string;
  amount: string;    // ユーザー編集用
  unit: 'g' | 'bag';
  lineCalorie: number; // 各回分のカロリー
}

export default function MenuPlanScreen() {
  const router = useRouter();
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [foods, setFoods] = useState<Food[]>([]);

  const [times, setTimes] = useState('3');
  const [priority, setPriority] = useState<PriorityType>('balance');
  const [result, setResult] = useState<ResultItem[]>([]);
  const [savedMessage, setSavedMessage] = useState('');
  const [calculated, setCalculated] = useState(false); // 計算後表示切り替え

  useEffect(() => {
    (async () => {
      const catList = await loadCats();
      setCats(catList);
      if (catList.length > 0) {
        setSelectedCatId(catList[0].id);
      }
      const foodList = await loadFoods();
      setFoods(foodList);
    })();
  }, []);

  const handleCalculate = () => {
    Keyboard.dismiss();

    if (cats.length === 0 || foods.length === 0) {
      Alert.alert("データ不足", "猫またはフードの情報がありません。");
      return;
    }

    const cat = cats.find(c => c.id === selectedCatId);
    if (!cat) {
      Alert.alert("エラー", "選択された猫が見つかりません。");
      return;
    }

    const N = parseInt(times, 10) || 1;
    const T = cat.dailyCalorie;

    // フード選択
    let selectedFoods: Food[] = [];
    if (priority === 'single') {
      if (foods.length === 0) {
        Alert.alert("エラー", "フードがありません。");
        return;
      }
      selectedFoods = [foods[0]];
    } else if (priority === 'balance') {
      if (foods.length === 0) {
        Alert.alert("エラー", "フードがありません。");
        return;
      }
      selectedFoods = foods;
    } else if (priority === 'cost') {
      const pricedFoods = foods.filter(f => f.price > 0);
      if (pricedFoods.length === 0) {
        Alert.alert("エラー", "価格が入力されたフードがありません。");
        return;
      }
      const cheapest = pricedFoods.reduce((min, f) => (f.price < min.price ? f : min), pricedFoods[0]);
      selectedFoods = [cheapest];
    }

    let resultData: ResultItem[] = [];

    const calcGFood = (f: Food, neededCal: number, totalTimes: number) => {
      // gフードは小数グラム対応
      // caloriePerUnitは100gあたりのカロリー
      // 必要グラム = (neededCal / caloriePerUnit)*100g
      const unitsNeeded = neededCal / f.caloriePerUnit; // これが100g単位数
      const gramsNeeded = unitsNeeded * 100; // 実際のグラム数
      const perFeedingGrams = gramsNeeded / totalTimes;

      // lineCalは各回 perFeedingGrams /100 * caloriePerUnit
      const lineCal = (perFeedingGrams / 100) * f.caloriePerUnit;

      for (let i = 1; i <= totalTimes; i++) {
        // 小数グラムもOK、toFixedやMath.roundせずそのまま表示可
        const dispGrams = perFeedingGrams.toFixed(1).replace(/\.0$/, ''); // 小数点.0は削除
        resultData.push({
          feedingNo: i,
          foodName: f.name,
          amount: dispGrams, 
          unit: 'g',
          lineCalorie: lineCal
        });
      }
    };

    const calcBagFood = (f: Food, T: number, totalTimes: number, gFoods: Food[]) => {
      // bagは1日1袋まで
      const bagCal = f.caloriePerUnit;
      if (bagCal >= T) {
        // 1袋で十分
        // 1袋をN回で分けるか1回目のみ1袋など要決定
        // ここでは1回目に1袋、残り0
        for (let i = 1; i <= totalTimes; i++) {
          if (i === 1) {
            resultData.push({
              feedingNo: i,
              foodName: f.name,
              amount: '1',
              unit: 'bag',
              lineCalorie: bagCal
            });
          } else {
            resultData.push({
              feedingNo: i,
              foodName: f.name,
              amount: '0',
              unit: 'bag',
              lineCalorie: 0
            });
          }
        }
      } else {
        // 1袋で足りない
        // 1袋は与えて残りはgフードで補う
        const needCal = T - bagCal;
        // 同様に1回目にbag、残り0
        resultData.push({
          feedingNo: 1,
          foodName: f.name,
          amount: '1',
          unit: 'bag',
          lineCalorie: bagCal
        });
        for (let i = 2; i <= totalTimes; i++) {
          resultData.push({feedingNo: i, foodName:f.name, amount:'0', unit:'bag', lineCalorie:0});
        }
        if (gFoods.length > 0) {
          // gフードで不足分補う
          const gf = gFoods[0]; // とりあえず先頭
          // gフード計算はN回分全部に追加
          // ここではbagとgを同時に与えるため、gフード分のResultItemもN回分追加
          // 1日分のgをN回に均等割
          const unitsNeeded = needCal / gf.caloriePerUnit;
          const gramsNeeded = unitsNeeded * 100;
          const perFeedingGrams = gramsNeeded / totalTimes;
          const lineCal = (perFeedingGrams / 100) * gf.caloriePerUnit;
          for (let i=1; i<=totalTimes; i++) {
            const dispGrams = perFeedingGrams.toFixed(1).replace(/\.0$/, '');
            resultData.push({
              feedingNo: i,
              foodName: gf.name,
              amount: dispGrams,
              unit:'g',
              lineCalorie: lineCal
            });
          }
        } else {
          // gフードなし、補えず不足状態
          // このままにする
        }
      }
    };

    const calcSingle = (selectedFoods: Food[], priority: PriorityType, T: number, N: number) => {
      const f = selectedFoods[0];
      if (f.unit === 'bag') {
        // bag単一食
        const gFoods = foods.filter(ff=>ff.unit==='g');
        calcBagFood(f, T, N, gFoods);
      } else {
        // g単一食
        calcGFood(f, T, N);
      }
    };

    const calcCost = (selectedFoods: Food[], T: number, N: number) => {
      // costはsingleと同様
      calcSingle(selectedFoods, 'single', T, N);
    };

    const calcBalance = (selectedFoods: Food[], T:number, N:number) => {
      // 簡易対応: 全フード均等割当
      // bagフードは1袋まで、超過分はgフードで
      // 完全実装は複雑だが要件シンプル対応
      const M = selectedFoods.length;
      const perFoodCal = T / M;

      const bagFoods = selectedFoods.filter(f => f.unit==='bag');
      const gFoods = selectedFoods.filter(f => f.unit==='g');

      // まずbagを配分
      let totalUsedCal = 0;
      let gNeededCal = 0;

      for (const f of bagFoods) {
        if (f.caloriePerUnit >= perFoodCal) {
          // bag1袋でok
          result.push({
            feedingNo:1, foodName:f.name, amount:'1', unit:'bag', lineCalorie:f.caloriePerUnit
          });
          for (let i=2;i<=N;i++){
            result.push({feedingNo:i, foodName:f.name, amount:'0', unit:'bag', lineCalorie:0});
          }
          totalUsedCal+=f.caloriePerUnit;
        } else {
          // bag1袋でも不足
          result.push({
            feedingNo:1, foodName:f.name, amount:'1', unit:'bag', lineCalorie:f.caloriePerUnit
          });
          for (let i=2;i<=N;i++){
            result.push({feedingNo:i, foodName:f.name, amount:'0', unit:'bag', lineCalorie:0});
          }
          totalUsedCal+=f.caloriePerUnit;
          gNeededCal+=(perFoodCal - f.caloriePerUnit);
        }
      }

      // gフード処理
      // 残りフード(含むgFoods)に対し、(T - totalUsedCal)をgで補う想定
      let remainCal = T - totalUsedCal;
      if (remainCal>0 && gFoods.length>0) {
        // 全gで均等分配
        const gPerFoodCal = remainCal/gFoods.length;
        for (const gf of gFoods){
          if (gPerFoodCal>0) {
            // gフード計算
            const unitsNeeded = gPerFoodCal/gf.caloriePerUnit;
            const gramsNeeded=unitsNeeded*100;
            const perFeedingGrams = gramsNeeded/N;
            const lineCal = (perFeedingGrams/100)*gf.caloriePerUnit;
            for(let i=1;i<=N;i++){
              const dispGrams = perFeedingGrams.toFixed(1).replace(/\.0$/,'');
              result.push({
                feedingNo:i, foodName:gf.name, amount:dispGrams, unit:'g', lineCalorie:lineCal
              });
            }
          }
        }
      }

      setResult(result);
    };

    // メイン計算ロジック
    let result: ResultItem[] = [];
    if (priority === 'single') {
      calcSingle(selectedFoods, 'single', T, N);
    } else if (priority==='cost') {
      calcCost(selectedFoods, T, N);
    } else {
      calcBalance(selectedFoods, T, N);
    }

    setResult(result);
    setSavedMessage('');
    setCalculated(true);
  };

  const handleSave = () => {
    setSavedMessage("保存しました");
  };

  const handleBackFromResult = () => {
    setCalculated(false);
    setResult([]);
    setSavedMessage('');
  };

  const totalCalorie = result.reduce((sum, r)=> sum+r.lineCalorie,0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>メニュー計画</Text>

      {!calculated && (
        <View>
          <View style={styles.field}>
            <Text style={styles.label}>対象の猫を選択:</Text>
            {cats.length > 0 ? (
              <Picker
                selectedValue={selectedCatId}
                style={[styles.input, styles.blackText]}
                onValueChange={(val) => setSelectedCatId(val)}
                itemStyle={{ color: 'black' }}
              >
                {cats.map((c) => (
                  <Picker.Item key={c.id} label={c.name} value={c.id} />
                ))}
              </Picker>
            ) : (
              <Text style={styles.normalText}>猫情報がありません</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>一日にごはんをあげる回数:</Text>
            <TextInput
              style={[styles.input, styles.blackText]}
              value={times}
              onChangeText={setTimes}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>優先度:</Text>
            <Picker
              selectedValue={priority}
              style={[styles.input, styles.blackText]}
              onValueChange={(val) => setPriority(val as PriorityType)}
              itemStyle={{ color: 'black' }}
            >
              <Picker.Item label="コスト優先" value="cost" />
              <Picker.Item label="単一食" value="single" />
              <Picker.Item label="バランス型" value="balance" />
            </Picker>
          </View>

          {priority === 'cost' && (
            <Text style={styles.warning}>※コスト優先はフードの価格が入力されたものだけで計算します</Text>
          )}

          <Button title="計算" onPress={handleCalculate} />
          <Button title="戻る" onPress={() => router.back()} />
        </View>
      )}

      {calculated && result.length > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.title}>計算結果</Text>
          <Text style={styles.totalCalorie}>合計{totalCalorie}カロリー</Text>
          {result.map((r, idx) => (
            <View key={idx} style={styles.resultItem}>
              <Text>{r.feedingNo}回目：{r.foodName}：{r.amount}{r.unit}（{r.lineCalorie}カロリー）</Text>
              <Text>分量を調整:</Text>
              <TextInput
                style={styles.resultInput}
                value={r.amount}
                onChangeText={(val) => {
                  const newResult = [...result];
                  newResult[idx] = { ...newResult[idx], amount: val };
                  // lineCalorie再計算は省略可
                  setResult(newResult);
                }}
                keyboardType="numeric"
              />
            </View>
          ))}
          <Button title="決定" onPress={handleSave} />
          {savedMessage !== '' && <Text style={styles.savedMessage}>{savedMessage}</Text>}
          <Button title="戻る" onPress={handleBackFromResult} />
        </View>
      )}

      {calculated && result.length === 0 && (
        <View>
          <Text>計算結果がありません。</Text>
          <Button title="戻る" onPress={handleBackFromResult} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding:20 },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20, color:'black' },
  field: { marginBottom:20 },
  label: { color:'black', fontSize:16, marginBottom:4 },
  input: { borderWidth:1, borderColor:'#ccc', padding:8, marginTop:8, width:150 },
  blackText: { color:'black' },
  normalText: { color:'black' },
  warning: { color:'red', fontSize:12, marginVertical:4 },
  resultContainer: { marginVertical:20 },
  totalCalorie: { color:'black', marginBottom:16 },
  resultItem: { marginBottom:10, borderBottomWidth:1, borderColor:'#ccc', paddingBottom:10 },
  resultInput: { borderWidth:1, borderColor:'#ccc', padding:4, marginTop:4, width:80, color:'black' },
  savedMessage: { color:'green', marginVertical:10 }
});
