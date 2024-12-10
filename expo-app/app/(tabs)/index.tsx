import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();
  
  const goToCats = () => {
    router.push('../cats');
  };

  const goToFoods = () => {
    router.push('../foods');
  };

  return (
    <View style={styles.container}>
      <Text>ahhhaこんにちは、これはExpo Routerでの最初の画面です！</Text>
      <Button title="猫一覧へ移動" onPress={goToCats} />
      <Button title="フード一覧へ移動" onPress={goToFoods} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
});
