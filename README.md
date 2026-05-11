# モンハンNow DB - Astro SSG版

モンスターハンターNowのモンスター情報、属性別検索、詳細情報を提供するデータベース。

**技術スタック:**
- **フレームワーク**: Astro 6.x
- **レンダリング**: SSG（Static Site Generation）
- **スタイリング**: Tailwind CSS
- **UI**: React コンポーネント
- **デプロイ**: Cloudflare Pages
- **収益化**: Google AdSense

## 機能

- 📱 **モンスター一覧** - 全64体のモンスター情報
- 🔍 **属性別検索** - 火、水、雷、氷、龍属性で検索
- 📊 **詳細情報** - 弱点、出現地、説明など
- 🌐 **SEO最適化** - メタタグ、OGP、サイトマップ
- 💰 **AdSense対応** - 広告による収益化

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. ローカル開発サーバーを起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

### 3. ビルド

```bash
npm run build
```

静的ファイルが `dist/` ディレクトリに生成されます。

### 4. プレビュー

```bash
npm run preview
```

## デプロイ

### Cloudflare Pages へのデプロイ

詳細は [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) を参照してください。

### AdSense の設定

詳細は [ADSENSE_SETUP.md](./ADSENSE_SETUP.md) を参照してください。

## プロジェクト構造

```
hunterguide_astro/
├── src/
│   ├── components/
│   │   ├── MonsterCard.jsx      # モンスターカードコンポーネント
│   │   ├── AdSense.astro        # AdSenseスクリプト
│   │   └── AdDisplayUnit.astro  # 広告ユニット
│   ├── layouts/
│   │   └── Layout.astro         # ベースレイアウト
│   ├── pages/
│   │   ├── index.astro          # ホームページ
│   │   ├── monsters.astro       # モンスター一覧
│   │   ├── monsters/[id].astro  # モンスター詳細
│   │   ├── attribute-search.astro # 属性別検索
│   │   └── sitemap.xml.ts       # サイトマップ
│   ├── lib/
│   │   ├── api.ts               # API関数
│   │   └── seo.ts               # SEOユーティリティ
│   └── styles/
│       └── global.css           # グローバルスタイル
├── public/
│   └── robots.txt               # ロボット指示ファイル
├── astro.config.mjs             # Astro設定
├── tailwind.config.mjs          # Tailwind設定
└── tsconfig.json                # TypeScript設定
```

## データソース

モンスター情報は以下のAPIから取得されます：
- **API**: `https://monchan3.xsrv.jp/api/monsters.json`

## SEO

- ✅ メタタグ（description、keywords）
- ✅ Open Graph（OGP）タグ
- ✅ Twitter Cardタグ
- ✅ Canonical URL
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ 構造化データ（JSON-LD）

## パフォーマンス

- **ビルド時間**: ~10秒
- **ページ数**: 67ページ
- **ファイルサイズ**: 最小化

## ブラウザ対応

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ライセンス

MIT

## 貢献

バグ報告や機能リクエストは、GitHubのIssuesで受け付けています。

## サポート

問題が発生した場合は、以下を確認してください：

1. [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) - デプロイに関する問題
2. [ADSENSE_SETUP.md](./ADSENSE_SETUP.md) - AdSenseに関する問題
3. [Astro ドキュメント](https://docs.astro.build/)
4. [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)

## 更新履歴

### v1.0.0 (2024-04-30)
- Astro SSG版として再実装
- Cloudflare Pages対応
- SEO最適化
- AdSense統合
