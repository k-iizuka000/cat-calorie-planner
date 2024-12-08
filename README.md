# cat-calorie-planner
- 猫の1日分の給餌計画をカロリー計算しておすすめメニューを作ってくれるアプリ

### 実行コマンド一覧
- cd cat-calorie-planner
- Dockerイメージビルド
  - docker build -t expo-env -f docker/dockerfile .
- Expoアプリの作成
  - docker run -it --rm -v $(pwd):/app expo-env npx create-expo-app cat-calorie-planner
- 開発サーバーの起動 
  - cd cat-calorie-planner/cat-calorie-planner
  - docker run -it --rm -v $(pwd):/app -p 19000:19000 -p 19001:19001 -p 19002:19002 expo-env expo start
    - npmが見つからない場合は：docker run -it --rm -v $(pwd):/app expo-env npm install

