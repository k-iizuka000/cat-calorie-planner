// app/auth/register.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { checkNicknameUnique, registerUser } from '../../src/services/userStorage';

export default function RegisterScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [nicknameUnique, setNicknameUnique] = useState(true);
  const [passwordValid, setPasswordValid] = useState(false);

  useEffect(() => {
    (async () => {
      if (nickname.trim().length > 0) {
        const unique = await checkNicknameUnique(nickname.trim());
        setNicknameUnique(unique);
      } else {
        // 空なら一旦ユニーク扱い（入力が無い状態なのでまだ判定不可）
        setNicknameUnique(true);
      }
    })();
  }, [nickname]);

  useEffect(() => {
    const regex = /^[A-Za-z0-9]{4,8}$/;
    setPasswordValid(regex.test(password));
  }, [password]);

  const canRegister = nickname.trim().length > 0 && nicknameUnique && passwordValid;

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!canRegister) return;
    await registerUser(nickname.trim(), password);
    Alert.alert("登録完了", "ユーザー登録が完了しました。");
    router.replace('/(tabs)'); // ログイン画面に戻る
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ユーザー登録</Text>

      <Text style={styles.label}>ニックネーム</Text>
      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
      />
      {!nicknameUnique && (
        <Text style={styles.warning}>そのニックネームはすでに使われています。</Text>
      )}

      <Text style={styles.label}>パスワード(4~8桁の英数字)</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!passwordValid && password.length > 0 && (
        <Text style={styles.warning}>パスワードは4~8桁の英数字で設定してください。</Text>
      )}

      <Button title="登録" onPress={handleRegister} disabled={!canRegister} />
      <Button title="戻る" onPress={handleBack} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff', padding:20},
  title: {
    fontSize:24,
    fontWeight:'bold',
    marginBottom:40,
    color:'black'
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
  warning:{
    alignSelf:'flex-start',
    color:'red',
    marginBottom:20
  }
});
