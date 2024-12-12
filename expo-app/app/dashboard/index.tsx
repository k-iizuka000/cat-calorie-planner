import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const IndexPage: React.FC = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('../cats')}
            >
                <Text style={styles.buttonText}>猫一覧へ移動</Text>
            </TouchableOpacity>
            <Text style={styles.buttonDescription}>
                ここに行くと…あなたが登録した猫ちゃんたちのプロフィールがずらり！
                新しい猫ちゃんを追加したり、それぞれの子をタップして体重や目標カロリーを編集できます。
                あなたの愛猫たちを賢く管理して、ヘルシーな食生活をサポートしてあげましょう♪
            </Text>


            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('../foods')}
            >
                <Text style={styles.buttonText}>フード一覧へ移動</Text>
            </TouchableOpacity>
            <Text style={styles.buttonDescription}>
                ここに行くと…登録済みのキャットフードがわんさか！
                カロリーや袋orグラム単位、塩分・脂質、価格や内容量といった詳しい情報をチェックできます。
                お気に入りのフードを追加したり、編集して愛猫のごはんメニュー作りの準備をしよう♪
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('../menus')}
            >
                <Text style={styles.buttonText}>メニュー作成へ移動</Text>
            </TouchableOpacity>
            <Text style={styles.buttonDescription}>
                ここに行くと…今日のメニュー計画がサクッとできちゃう！
                一日にごはんをあげる回数や、バランス・単一食・コスト優先など優先度を指定すると、
                ピッタリの分量を自動で計算してくれます。与え方を微調整すれば、
                「よし、これで一日バッチリ！」な愛猫のごはんプランが完成。
                これで毎日の食事管理がもっと楽しくなるはず♪
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    greeting: {
        fontSize: 24,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
    },
    buttonDescription: {
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 20,
        paddingHorizontal: 10,
        
    },
});

export default IndexPage;
