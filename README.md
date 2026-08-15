# バストカップ計算機

質量 (kg) とアンダーバスト (cm) を入力すると、以下を計算する静的Webアプリです。

- 片胸の体積 (cm³)
- 曲率半径 D (cm)
- カップ数（アルファベット表記。Zを超える場合は「4Z」のようにZから何段階上かを表記）
- トップバスト (cm)

計算式は [Wikipedia: Bra size – Manufacturer design standards](https://en.wikipedia.org/wiki/Bra_size#Manufacturer_design_standards) を参考にしました）。

## ファイル構成

```
index.html   画面構造
style.css    スタイル
script.js    計算ロジック + イベント処理
```
