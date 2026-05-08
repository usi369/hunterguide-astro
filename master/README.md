# モンちゃんDB 引き継ぎ＆実装サマリー

このディレクトリは、モンちゃんDBのマスター情報を管理する場所です。今後はここに置くCSVを正本として、Web版とスマホアプリ版の両方へ同じデータを取り込む方針です。

## プロジェクト概要

- 通称: モンちゃんDB
- GitHub: `https://github.com/usi369/hunterguide-astro`
- 作業ディレクトリ: `C:\Users\no369\Documents\Codex\hunterguide_astro`
- Web版: Astro / React / Tailwind CSS
- ローカルプレビュー: `http://127.0.0.1:4321/`
- 現在の主なページ:
  - `/` トップ
  - `/monsters` モンスター一覧
  - `/monsters/{id}` モンスター詳細
  - `/attribute-search` 属性別検索

## データ管理方針

今後の基本方針は、データとフロントを分離することです。

```text
master CSV
  ↓ 変換/取り込み
共通データ JSON または API
  ↓
Web版 Astro
スマホアプリ版
```

モンスター情報の正本は1つにします。Web版とスマホアプリ版は、それぞれ別のUIを持ちながら、同じ変換済みデータを参照する想定です。

## 現在のマスターCSV

現在のCSV:

- `MHNow_モンスター情報 - 202603171102_モンスター (1).csv`

重要な列:

- `ID`: 今後システム側で使うモンスター固有ID
- `ナンバリング`: 旧ID。詳細URL互換のため一部で残すが、画面表示上の主IDにはしない
- `モンスター格付け`: 一覧画面のフィルタに使用
- 弱点属性、攻撃属性、出現情報、初登場作品、有効武器など: 詳細ページや属性別検索に使用

注意:

- CSV内の旧S3リンクは今後使わない方針です。
- 画像はCloudflare R2のURLを使います。

## 現在のWeb版データ参照

Web版は現在、外部APIではなくローカルJSONを参照しています。

- 実装: `src/lib/api.ts`
- 参照元: `src/data/monsters.json`
- 公開用JSON: `public/api/monsters.json`

`getMonsters()` は `src/data/monsters.json` を返すだけのシンプルな実装です。現時点ではCSVからJSONを自動生成するスクリプトは未整備なので、今後の優先タスクとして追加するのが望ましいです。

## 画像URL

モンスター詳細画像:

- R2 base: `https://pub-01b01edbea164ba6a4151fab7b1b0edc.r2.dev/monsters-detail/`
- 例: `ViperTobiKadachi.png`

モンスターアイコン画像:

- R2 base: `https://pub-62d400fd96b4407a9a040615c529457a.r2.dev/`
- 例: `Viper%20Tobi-Kadachi_i.png`

属性アイコン画像:

- R2 base: `https://pub-14ced31a180247fcb2f291b43046e2f4.r2.dev/`
- 例: `element_fire.png`, `element_thunder.png`

補足:

- Codexから公開R2 URLへの読み取り確認は可能です。
- R2バケットの一覧取得、アップロード、削除などはCloudflareの認証情報/APIトークンが必要です。

## 実装済みサマリー

トップページ:

- タイトル、ボタン類を中央上詰めに調整
- ホームボタンを丸みのあるグラデーションデザインへ変更
- `<a><button>` の入れ子を解消し、プレビュー内でクリックが固まる問題を修正

モンスター一覧:

- ポケモン図鑑風のカードグリッドへリデザイン
- モンスター名とアイコン画像のみ表示
- スマホ表示を考慮した4列ベースのレスポンシブグリッド
- `モンスター格付け` によるフィルタを追加
- フィルタ項目: `ALL`, `次元臨界`, `次元変異`, `希少種`, `亜種`, `古龍種`
- React islandではなく、Astro静的HTML + 軽いJSで実装

モンスター詳細:

- スマホアプリ版の情報を参考に、カード型レイアウトへリデザイン
- モンスター詳細画像を表示
- モンスター名の上にシステムIDを表示
- 表示中の主な情報:
  - ID
  - モンスター名
  - 別名
  - 種族
  - 格付け
  - 弱点属性
  - 攻撃属性
  - 出現エリア
  - 登場日
  - 破壊推奨部位
  - 初登場作品
  - 有効武器
- `/monsters/{システムID}` と `/monsters/{旧ナンバリング}` の両方で表示可能

属性別検索:

- React component `AttributeSearchFilter` の描画がプレビュー環境で `jsxDEV is not a function` に落ちていたため、Astro静的HTML + 軽いJSへ置き換え
- 一覧画面と同じ白ベースのモダンUIへ調整
- 弱点属性で絞り込み可能
- 対応属性: `火`, `水`, `雷`, `氷`, `龍`, `毒`, `麻痺`, `睡眠`, `爆破`

## 既知の注意点

ビルド時に以下の警告が出ます。

```text
Skipping src/pages/api/monsters.json.ts because a file with the same name exists in the public folder: api/monsters.json
```

これは `src/pages/api/monsters.json.ts` と `public/api/monsters.json` が同じ公開パスを持っているためです。現時点ではビルドは成功しており、動作上のブロッカーではありません。

今後整理するなら、どちらを正式な公開JSONにするか決めて片方へ寄せるのがよいです。

## 今後の推奨タスク

1. CSVからJSONを生成するスクリプトを追加する
2. `src/data/monsters.json` と `public/api/monsters.json` の役割を整理する
3. Web版とスマホアプリ版が参照する共通データ配信先を決める
4. R2画像URLの命名規則をドキュメント化する
5. スマホアプリ版側のデータ取り込み方式をWeb版と揃える

## 開発コマンド

依存関係のインストール:

```powershell
npm install --legacy-peer-deps
```

開発サーバー:

```powershell
npm run dev -- --host 127.0.0.1
```

ビルド:

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run build
```

## 引き継ぎメモ

- Web版の画面変更はスマホアプリ版へ直接影響しません。
- `src/data/monsters.json` などの共通データを変える場合は、将来的にWeb版とスマホアプリ版の両方へ影響する想定です。
- 今後は「CSVを更新する人」と「変換スクリプト/フロントを実装する人」の役割を分けられるようにしておくと運用しやすいです。
