# AdSense セットアップガイド

このドキュメントでは、Google AdSenseをこのプロジェクトに統合するための手順を説明します。

## 前提条件

1. Google AdSenseアカウントを持っていること
2. サイトがGoogle AdSenseの承認を受けていること
3. Cloudflare Pagesにデプロイ済みであること

## セットアップ手順

### 1. AdSense クライアントIDを取得

1. [Google AdSense](https://www.google.com/adsense/)にログイン
2. 左側のナビゲーションメニューから「アカウント」を選択
3. 「アカウント情報」タブで「パブリッシャーID」をコピー
   - 形式: `ca-pub-xxxxxxxxxxxxxxxx`

### 2. AdSenseコンポーネントを更新

以下のファイルのプレースホルダーを置き換えます：

#### `src/components/AdSense.astro`
```astro
const ADSENSE_CLIENT_ID = 'ca-pub-xxxxxxxxxxxxxxxx'; // ← ここを置き換え
```

#### `src/components/AdDisplayUnit.astro`
```astro
data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" // ← ここを置き換え
```

### 3. 広告ユニットIDを取得

1. Google AdSenseダッシュボードで「広告」→「広告ユニット」を選択
2. 新しい広告ユニットを作成
3. 広告ユニットIDをコピー（形式: `1234567890`）

### 4. ページに広告を追加

各ページで`AdDisplayUnit`コンポーネントを使用します：

```astro
---
import AdDisplayUnit from '../components/AdDisplayUnit.astro';
---

<Layout>
  {/* ページコンテンツ */}
  
  <AdDisplayUnit slot="1234567890" format="auto" responsive={true} />
</Layout>
```

## 推奨される広告配置

### ホームページ（`src/pages/index.astro`）
- メインコンテンツの下部

### モンスター一覧（`src/pages/monsters.astro`）
- グリッドの上部
- グリッドの下部

### モンスター詳細（`src/pages/monsters/[id].astro`）
- 詳細情報の右側
- ページ下部

### 属性別検索（`src/pages/attribute-search.astro`）
- 各属性セクションの下部

## AdSenseポリシー

- **コンテンツポリシー**: 違法なコンテンツを含まないこと
- **トラフィック**: 自動クリックやボット トラフィックは禁止
- **配置**: 広告を過度に配置しないこと
- **ユーザー体験**: 広告がサイトの使用を妨げないこと

## トラブルシューティング

### 広告が表示されない場合

1. クライアントIDが正しいか確認
2. サイトがAdSenseで承認されているか確認
3. ブラウザのコンソールでエラーを確認
4. AdSenseダッシュボードで広告ユニットが有効か確認

### 低い収益の場合

1. トラフィックを増やす
2. 複数の広告ユニットを配置
3. 異なる広告フォーマットを試す
4. ユーザーエクスペリエンスを改善

## 参考リンク

- [Google AdSense ヘルプ](https://support.google.com/adsense)
- [AdSense ポリシー](https://support.google.com/adsense/answer/48182)
- [広告配置のベストプラクティス](https://support.google.com/adsense/answer/17954)
