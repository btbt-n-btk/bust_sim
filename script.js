/**
 * バストカップ計算ロジック
 *
 * 参考: https://en.wikipedia.org/wiki/Bra_size#Manufacturer_design_standards
 * 添付Excel（bust_sim.xlsx）の計算式を忠実に移植したもの。
 *
 * Excel側の列と本ロジックの対応:
 *   A: Bust weight (kg)        -> massKg        （両胸合計の質量）
 *   B: Under bust (in)         -> underBustIn    （実装ではcm入力→inに変換）
 *   C: Bust volume (cm3)       -> volumeCm3      （片胸の体積）
 *   D: D (cm)                  -> radiusCm       （曲率半径）
 *   E: Underwire size          -> underwireSize
 *   F: cup (連続値)             -> cupNumber
 *   H: cup (表記)               -> cupLabel
 *   I: Under JP                -> underJP
 *   J: Diff                    -> diff
 *   K: Top                     -> topBust        （トップバスト cm）
 *
 * 注意: 日本式アンダーバスト(cm)と米国式(in)は単純な単位換算(×2.54)ではない。
 * Excelの I列 (Under JP = B*2.5 - 10) が「米国式inchを日本式cmに変換する実測式」
 * であるため、その逆算 in = (cm + 10) / 2.5 を使う
 * （30in→65cm, 32in→70cm, 34in→75cm）。
 */

function calcBustCup(massKg, underBustCm) {
  if (!(massKg > 0) || !(underBustCm > 0)) {
    throw new Error("質量とアンダーバストは正の数で入力してください。");
  }

  // 日本式アンダーバスト(cm) -> 米国式(in)。Excelの I = B*2.5-10 の逆算。
  const underBustIn = (underBustCm + 10) / 2.5;

  // C: 片胸の体積 (cm3) = 質量(g) / 密度0.9 / 2
  const volumeCm3 = (massKg * 1000) / 0.9 / 2;

  // D: 曲率半径 (cm)
  // Excel側では円周率に厳密なPIではなく 3.14 が使われているため、
  // 境界値(カップの切り替わり)を一致させるためここでも 3.14 を用いる。
  const PI_EXCEL = 3.14;
  const radiusCm = Math.cbrt((volumeCm3 / PI_EXCEL) * 12);

  // E: アンダーワイヤーサイズ
  const underwireSize = radiusCm * (2 / 0.85) + 7.176;

  // F: カップ数（連続値）
  const cupNumber = (underwireSize - 30) / 2 + (32 - underBustIn) / 2 + 1;

  // H: カップ表記
  //   ・1〜25の範囲: A〜Y のアルファベット
  //   ・26以上: "nZ"（Zからnランク上）
  //   ・1未満: "AA", "AAA", ... （Aを重ねて下限側を表現）
  let cupLabel;
  const level = Math.floor(cupNumber); // Excelの CHAR() は整数化(切り捨て)相当
  if (cupNumber < 26) {
    if (level >= 1) {
      cupLabel = String.fromCharCode(64 + level);
    } else {
      const aCount = 2 - level; // level=0 -> "AA", level=-1 -> "AAA", ...
      cupLabel = "A".repeat(aCount);
    }
  } else {
    cupLabel = Math.round(cupNumber - 25) + "Z";
  }

  // I: アンダー（JP換算, cm）
  const underJP = underBustIn * 2.5 - 10;

  // J: 差分（カップ増加分, cm）
  const diff = (cupNumber - 1) * 2.5 + 10;

  // K: トップバスト (cm)
  const topBust = underJP + diff;

  return {
    volumeCm3,
    radiusCm,
    cupNumber,
    cupLabel,
    topBust,
  };
}

document.getElementById("calc-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const massKg = parseFloat(document.getElementById("mass").value);
  const underBustCm = parseFloat(document.getElementById("underbust").value);

  const resultEl = document.getElementById("result");
  const errorEl = document.getElementById("error");

  try {
    const r = calcBustCup(massKg, underBustCm);

    document.getElementById("out-volume").textContent = r.volumeCm3.toFixed(1);
    document.getElementById("out-radius").textContent = r.radiusCm.toFixed(2);
    document.getElementById("out-cup").textContent = r.cupLabel;
    document.getElementById("out-top").textContent = r.topBust.toFixed(1);

    resultEl.hidden = false;
    errorEl.hidden = true;
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
    resultEl.hidden = true;
  }
});
