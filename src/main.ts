import "./style.css";
import { dynamoToNormal, normalToDynamo } from "./converter";

// DOM要素の取得
const inputTeextarea = document.getElementById("input") as HTMLTextAreaElement;
const outputTeextarea = document.getElementById(
  "output",
) as HTMLTextAreaElement;
const convertBtn = document.getElementById("convertBtn") as HTMLButtonElement;
const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement;
const errorDiv = document.getElementById("error") as HTMLDivElement;
const inputLabel = document.getElementById("inputLabel") as HTMLHeadingElement;
const outputLabel = document.getElementById(
  "outputLabel",
) as HTMLHeadingElement;

// ラジオボタン
const directionRadios = document.querySelectorAll(
  'input[name="direction"]',
) as NodeListOf<HTMLInputElement>;

// 変換方法の取得
function getDirection(): "dynamoToNormal" | "normalToDynamo" {
  const checked = document.querySelector(
    'input[name="direction"]:checked',
  ) as HTMLInputElement;
  return checked.value as "dynamoToNormal" | "normalToDynamo";
}

// ラベルを更新
function updateLabels() {
  const direction = getDirection();

  if (direction === "dynamoToNormal") {
    inputLabel.textContent = "入力（DynamoDB JSON）";
    outputLabel.textContent = "出力（通常の JSON）";
  } else {
    inputLabel.textContent = "入力（通常の JSON）";
    outputLabel.textContent = "出力（DynamoDB JSON）";
  }
}

// エラー表示
function showError(message: string) {
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

// エラー非表示
function hideError() {
  errorDiv.style.display = "none";
}

// 変換処理
function convert() {
  hideError();

  const input = inputTeextarea.value.trim();

  if (!input) {
    showError("入力が空です");
    return;
  }

  try {
    // JSONをパース
    const inputJson = JSON.parse(input);

    // 変換
    const direction = getDirection();
    let result;

    if (direction === "dynamoToNormal") {
      result = dynamoToNormal(inputJson);
    } else {
      result = normalToDynamo(inputJson);
    }

    // 結果を整形して表示
    outputTeextarea.value = JSON.stringify(result, null, 2);
  } catch (error) {
    if (error instanceof SyntaxError) {
      showError("不正なJSON形式です");
    } else if (error instanceof Error) {
      showError(`エラー: ${error.message}`);
    } else {
      showError("予期しないエラーが発生しました");
    }
  }
}

// コピー処理
async function copyToClipboard() {
  const output = outputTeextarea.value;

  if (!output) {
    showError("コピーする内容がありません");
    return;
  }

  try {
    await navigator.clipboard.writeText(output);

    // ボタンのテキストを一時的に変更
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "コピーしました";
    copyBtn.style.backgroundColor = "#27ae60";

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.backgroundColor = "";
    }, 2000);
  } catch (error) {
    showError("コピーに失敗しました");
  }
}

// イベントリスナー
convertBtn.addEventListener("click", convert);
copyBtn.addEventListener("click", copyToClipboard);

// ラジオボタンの変更でラベル更新
directionRadios.forEach((radio) => {
  radio.addEventListener("change", updateLabels);
});

// Enter + Ctrl で変換
inputTeextarea.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    convert();
  }
});

// 初期化
updateLabels();

console.log("DynamoDB JSON Converter が起動しました");
