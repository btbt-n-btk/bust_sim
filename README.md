# バストカップ計算機

質量 (kg) とアンダーバスト (cm) を入力すると、以下を計算する静的Webアプリです。

- 片胸の体積 (cm³)
- 曲率半径 D (cm)
- カップ数（アルファベット表記。Zを超える場合は「4Z」のようにZから何段階上かを表記）
- トップバスト (cm)

計算式は [Wikipedia: Bra size – Manufacturer design standards](https://en.wikipedia.org/wiki/Bra_size#Manufacturer_design_standards) を参考にした Excel シートのロジックをそのまま移植しています（`script.js` 内のコメント参照）。

## 使い方

ビルド不要の素の HTML / CSS / JS のみで構成されています。`index.html` をブラウザで開くだけで動作します。

## GitHub Pages で公開する場合

1. このフォルダの中身をリポジトリのルート（または `/docs`）にアップロード
2. リポジトリの Settings → Pages で公開ブランチ／フォルダを指定
3. 数分後に公開URLが発行されます

## ファイル構成

```
index.html   画面構造
style.css    スタイル
script.js    計算ロジック + イベント処理
```
