import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();
  
  const goToCats = () => {
    router.push('../cats');
  };

  return (
    <View style={styles.container}>
      <Text>ahhhaこんにちは、これはExpo Routerでの最初の画面です！</Text>
      <Button title="猫一覧へ移動" onPress={goToCats} />
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
