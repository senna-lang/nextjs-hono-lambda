# 技術コンテキスト

## 使用技術

### フロントエンド
- **Next.js**: Reactベースのフレームワーク（App Routerを使用）
- **TypeScript**: 型安全なJavaScriptスーパーセット
- **Tailwind CSS**: ユーティリティファーストのCSSフレームワーク
- **React**: UIコンポーネントライブラリ
- **Hono Client**: バックエンドAPIとの通信用クライアント

### バックエンド
- **Hono**: 軽量で高速なWebフレームワーク
- **AWS Lambda**: サーバーレス関数実行環境
- **AWS API Gateway**: RESTful APIエンドポイント管理
- **Zod**: スキーマ検証ライブラリ

### インフラストラクチャ
- **AWS CDK**: AWSリソースをTypeScriptで定義
- **AWS CloudFormation**: インフラストラクチャのプロビジョニング

## 開発環境セットアップ

### 前提条件
- Node.js (v20.x以上)
- npm または yarn
- AWS CLI（デプロイ時）
- AWS CDK（デプロイ時）

### フロントエンド開発
```bash
# フロントエンドディレクトリに移動
cd frontend

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### バックエンド開発
```bash
# バックエンドディレクトリに移動
cd hono-lambda

# 依存関係のインストール
npm install

# ビルド
npm run build

# ローカルでのテスト
npm run test
```

### デプロイ
```bash
# バックエンドディレクトリに移動
cd hono-lambda

# AWSへのデプロイ
npx cdk deploy
```

## 主要な依存関係

### フロントエンド依存関係
- **next**: Next.jsフレームワーク
- **react**: UIライブラリ
- **react-dom**: DOMレンダリング
- **hono/client**: APIクライアント
- **tailwindcss**: CSSフレームワーク

### バックエンド依存関係
- **hono**: Webフレームワーク
- **hono/aws-lambda**: AWS Lambda統合
- **hono/zod-validator**: リクエスト検証
- **zod**: スキーマ検証
- **aws-cdk-lib**: AWSリソース定義
- **aws-lambda**: Lambda関数タイプ定義

## 環境変数

### フロントエンド環境変数
- **NEXT_PUBLIC_LAMBDA_URL**: バックエンドLambda関数のURL

### バックエンド環境変数
- 現在は特に必要なし（将来的にはデータベース接続情報などが必要になる可能性あり）

## 技術的制約

### データ永続化
- 現在のバージョンではメモリ内データストア（Map）を使用
- Lambda関数が再起動するとデータが失われる
- 将来的にはDynamoDBなどを使用して永続化する予定

### CORS
- フロントエンドとバックエンドが異なるドメインで実行される場合、CORS設定が必要
- 現在は開発のためにすべてのオリジンを許可しているが、本番環境では制限すべき

### Lambda制限
- 実行時間: 最大900秒（15分）
- メモリ: 128MB〜10GB
- ペイロードサイズ: 最大6MB

### API Gateway制限
- スロットリング: デフォルトで10,000リクエスト/秒
- ペイロードサイズ: 最大10MB
- タイムアウト: 最大29秒

## 開発ワークフロー

1. ローカル開発環境でコードを変更
2. フロントエンドとバックエンドを別々に起動してテスト
3. 変更をコミット
4. バックエンドをAWS CDKでデプロイ
5. フロントエンドをVercelなどにデプロイ（または静的ファイルとしてS3にホスティング）

## 将来的な技術拡張

1. **データベース統合**: DynamoDBなどを使用したデータ永続化
2. **認証**: Amazon Cognitoなどを使用したユーザー認証
3. **CI/CD**: GitHub ActionsなどによるCI/CDパイプライン
4. **モニタリング**: CloudWatchなどを使用したパフォーマンスモニタリング
5. **テスト自動化**: Jest, Cypressなどを使用した自動テスト