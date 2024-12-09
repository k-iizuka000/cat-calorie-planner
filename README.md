# cat-calorie-planner
- 猫の1日分の給餌計画をカロリー計算しておすすめメニューを作ってくれるアプリ

# 環境
- React Native＋Expo

### WSL上でnpm installなどを実行してnode_modulesを揃える（ホスト側で環境を整える）
- cd /mnt/c/k-iizuka000/cat-calorie-planner/expo-app
- npm install

### Dockerコンテナ起動（ソースとnode_modulesをマウント）
- docker run -it --rm \
  -v $(pwd):/app \
  -p 19000:19000 -p 19001:19001 -p 19002:19002 \
  expo-env npx expo start --lan

### 実行コマンド一覧F
- cd cat-calorie-planner
- Dockerイメージビルド
  - docker build -t expo-env -f docker/dockerfile .
- Expoアプリの作成
  - docker run -it --rm -v $(pwd):/app expo-env npx create-expo-app expo-app
- 開発サーバーの起動 
  - cd cat-calorie-planner/expo-app
  - npx expo start --tunnel


## ディレクトリ構成の考え方

本プロジェクトは、React Native + Expo Router を用いたアプリ開発を想定しています。  
機能別、責務別にフォルダを分けることで、コードの見通しと再利用性を高めます。

- `app/`  
  画面（ページ）コンポーネントを配置するディレクトリです。  
  Expo Routerでは`app`ディレクトリ配下の`index.tsx`や`_layout.tsx`などを基点にルーティングが決まります。  
  各ページは、特定の機能やエンティティ（例：`cats/`で猫管理画面、`foods/`でフード管理画面など）に対応するディレクトリ・ファイルを作っていくことで管理しやすくなります。

- `assets/`  
  画像、フォント、アイコンなどの静的ファイルを格納します。  
  UIやデザイン要素に関わるリソースはここにまとめることで、一元的な管理が可能です。

- `components/`  
  再利用可能なUIコンポーネントやカスタムビジュアル要素を配置します。  
  画面ごとに同様のUIを何度も定義することを避け、ここに共通パーツとして切り出すことで、保守性と拡張性が向上します。

- `constants/`  
  カラーコード、スタイル定数、エンドポイントURLやキーなど、アプリ全体で参照される定数類をまとめます。  
  Magic numberやハードコーディングを避け、変更が必要な際にこのディレクトリを見れば済むようにします。

- `hooks/`  
  カスタムフック（`use~~~`）を配置します。  
  テーマ取得、レスポンシブ対応、ロジックの抽出など、複数箇所で使うロジックをReact Hooksとしてまとめることで、コードの再利用と分離が促進されます。

- `src/`  
  ドメインロジックやビジネスロジック、データアクセス、モデル定義など、UI以外のコアロジックを格納します。  
  - `src/models/`：データ構造（猫、フード、メニューなど）  
  - `src/utils/`：カロリー計算関数やユーティリティ関数  
  - `src/services/`：データの保存・取得（AsyncStorageやFirebaseなどを用いる場合）

UI層（`app`や`components`）とビジネスロジック層（`src`）を分離しておくことで、UIを変更してもロジックが影響を受けにくくなり、テストや保守が楽になります。

- `scripts/`  
  開発環境構築やデータリセットなどの補助的スクリプトを配置します。

以上のようなディレクトリ構成と役割分担により、  
「下位層（ビジネスロジック・モデル）→上位層（UIコンポーネント・画面）→開発補助要素（scripts、constants、hooks）」  
という形で拡張していく。

開発が進むにつれプロジェクト固有の要件やチームのコーディングスタイルに合わせて適宜調整する。
