// app/(tabs)/index.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { loadUsers } from '../../src/services/userStorage';

export default function LoginScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    const users = await loadUsers();
    const user = users.find(u => u.nickname.toLowerCase() === nickname.toLowerCase() && u.password === password);

    if (user) {
      setLoginError(false);
      router.replace('/dashboard');
    } else {
      setLoginError(true);
    }
  };

  const handleRegisterLink = () => {
    router.push('/auth/register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>あす猫</Text>

      <Text style={styles.label}>ニックネーム</Text>
      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={(val) => {
          setNickname(val);
          setLoginError(false); // 入力変更でエラー表示解除
        }}
      />

      <Text style={styles.label}>パスワード</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(val) => {
          setPassword(val);
          setLoginError(false); // 入力変更でエラー表示解除
        }}
        secureTextEntry
      />

      {loginError && (
        <Text style={styles.errorText}>ニックネーム、パスワードが一致しません。</Text>
      )}

      <Button title="ログイン" onPress={handleLogin} />

      <TouchableOpacity style={styles.registerLinkContainer} onPress={handleRegisterLink}>
        <Text style={styles.registerLink}>初めての方</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff', padding:20},
  title: {
    fontSize:36,
    fontWeight:'bold',
    marginBottom:40,
    color:'#333',
    // ポップな書体を使いたい場合、カスタムフォント導入を検討
  },
  label:{
    alignSelf:'flex-start',
    fontSize:16,
    color:'black',
    marginBottom:4
  },
  input:{
    width:'100%',
    borderWidth:1,
    borderColor:'#ccc',
    padding:8,
    marginBottom:20,
    color:'black'
  },
  errorText:{
    color:'red',
    marginBottom:20
  },
  registerLinkContainer:{
    marginTop:20
  },
  registerLink:{
    color:'blue',
    textDecorationLine:'underline'
  }
});
