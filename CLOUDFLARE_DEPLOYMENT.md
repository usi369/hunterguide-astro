# Cloudflare Pages デプロイガイド

このドキュメントでは、Astro SSGプロジェクトをCloudflare Pagesにデプロイする手順を説明します。

## 前提条件

1. GitHubアカウント
2. Cloudflareアカウント
3. このプロジェクトをGitHubリポジトリにプッシュ済み

## デプロイ手順

### 1. GitHubにリポジトリをプッシュ

```bash
# リポジトリを初期化（初回のみ）
git init
git add .
git commit -m "Initial commit: Astro SSG project"

# リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/monchan-astro.git
git branch -M main
git push -u origin main
```

### 2. Cloudflare Pagesに接続

1. [Cloudflare Dashboard](https://dash.cloudflare.com/)にログイン
2. 左側のナビゲーションから「Pages」を選択
3. 「プロジェクトを作成」をクリック
4. 「GitHubに接続」を選択
5. GitHubアカウントを認可
6. リポジトリ「monchan-astro」を選択

### 3. ビルド設定を確認

以下の設定で自動的に検出されます：

| 項目 | 値 |
|------|-----|
| **フレームワーク** | Astro |
| **ビルドコマンド** | `npm run build` |
| **ビルド出力ディレクトリ** | `dist` |

### 4. 環境変数を設定（オプション）

1. プロジェクト設定 → 環境変数
2. 必要に応じて環境変数を追加

### 5. デプロイ

1. 「保存してデプロイ」をクリック
2. ビルドが開始されます（1-2分）
3. デプロイ完了後、URLが表示されます

### 6. カスタムドメインを設定

1. プロジェクト設定 → カスタムドメイン
2. 「カスタムドメインを追加」をクリック
3. ドメイン名を入力
4. DNS設定に従う

## デプロイ後の確認

### サイトの動作確認

- [ ] ホームページが表示される
- [ ] モンスター一覧が表示される
- [ ] モンスター詳細ページが表示される
- [ ] 属性別検索が機能する
- [ ] 広告が表示される（AdSense設定後）

### SEOの確認

- [ ] `robots.txt`がアクセス可能（`/robots.txt`）
- [ ] `sitemap.xml`がアクセス可能（`/sitemap.xml`）
- [ ] メタタグが正しく設定されている
- [ ] OGPタグが正しく設定されている

### Google Search Consoleに登録

1. [Google Search Console](https://search.google.com/search-console)にアクセス
2. 「プロパティを追加」をクリック
3. ドメイン名を入力
4. DNS TXTレコードを追加して確認
5. `sitemap.xml`をサブミット

## トラブルシューティング

### ビルドが失敗する場合

1. ローカルで`npm run build`を実行して確認
2. エラーメッセージを確認
3. 依存関係をインストール：`npm install`
4. キャッシュをクリア：`npm cache clean --force`

### ページが表示されない場合

1. ビルド出力ディレクトリが正しいか確認（`dist`）
2. `dist/index.html`が存在するか確認
3. ブラウザのキャッシュをクリア
4. Cloudflareのキャッシュをクリア

### 広告が表示されない場合

1. AdSenseクライアントIDが正しいか確認
2. AdSenseで承認されているか確認
3. ブラウザコンソールでエラーを確認

## 自動デプロイ

Cloudflare Pagesは、GitHubにプッシュされるたびに自動的にビルド・デプロイします。

```bash
# 変更をコミット
git add .
git commit -m "Update: Add new features"

# GitHubにプッシュ
git push origin main

# 自動的にCloudflare Pagesにデプロイされます
```

## 参考リンク

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)
- [Astro デプロイガイド](https://docs.astro.build/ja/guides/deploy/)
- [Cloudflare Pages + Astro](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
