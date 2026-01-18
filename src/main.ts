import './style.css';
import { dynamoToNormal, normalToDynamo } from './converter';
import { DynamoDBObject, NormalObject } from './types';

// 要素取得するヘルパー関数
function getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id "${id}" not found`);
    }
    return element as T;
}

// DOM要素の取得
const normalTextarea = getElement<HTMLTextAreaElement>('normalTextarea');
const dynamoTextarea = getElement<HTMLTextAreaElement>('dynamoTextarea');
const toDynamoBtn = getElement<HTMLButtonElement>('toDynamoBtn');
const toNormalBtn = getElement<HTMLButtonElement>('toNormalBtn');
const normalCopyBtn = getElement<HTMLButtonElement>('normalCopyBtn');
const dynamoCopyBtn = getElement<HTMLButtonElement>('dynamoCopyBtn');
const errorDiv = getElement<HTMLDivElement>('error');
const sampleBtn = getElement<HTMLButtonElement>('sampleBtn');

// エラー表示
function showError(message: string) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// エラー非表示
function hideError() {
    errorDiv.style.display = 'none';
}

// 変換処理
function convert(
    input: string,
    direction: 'dynamoToNormal' | 'normalToDynamo'
): DynamoDBObject | NormalObject | null {
    hideError();

    if (!input) {
        showError('入力が空です');
        return null;
    }

    try {
        // JSONをパース
        const inputJson = JSON.parse(input);

        // 変換
        let result;

        if (direction === 'dynamoToNormal') {
            result = dynamoToNormal(inputJson);
        } else {
            result = normalToDynamo(inputJson);
        }

        return result;
    } catch (error) {
        if (error instanceof SyntaxError) {
            showError('不正なJSON形式です');
        } else if (error instanceof Error) {
            showError(`エラー: ${error.message}`);
        } else {
            showError('予期しないエラーが発生しました');
        }
        return null;
    }
}

function convertToDynamo() {
    const input = normalTextarea.value.trim();
    const result = convert(input, 'normalToDynamo');
    if (result) {
        dynamoTextarea.value = JSON.stringify(result, null, 2);
    }
}

function convertToNormal() {
    const input = dynamoTextarea.value.trim();
    const result = convert(input, 'dynamoToNormal');
    if (result) {
        normalTextarea.value = JSON.stringify(result, null, 2);
    }
}

// コピー処理
async function copyToClipboard(output: string, copyBtn: HTMLButtonElement) {
    if (!output) {
        showError('コピーする内容がありません');
        return;
    }

    try {
        await navigator.clipboard.writeText(output);

        // ボタンのテキストを一時的に変更
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'コピーしました';
        copyBtn.style.backgroundColor = '#27ae60';

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    } catch (error) {
        showError('コピーに失敗しました');
    }
}

async function copyNormalToClipboard() {
    const output = normalTextarea.value;
    await copyToClipboard(output, normalCopyBtn);
}

async function copyDynamoToClipboard() {
    const output = dynamoTextarea.value;
    await copyToClipboard(output, dynamoCopyBtn);
}

function setSampleToNormal() {
    const sampleText = `{
  "name": "John",
  "age": "25",
  "height": "1.60",
  "hobbies": [ 
    {
      "category": "fishing",
      "history": "3years",
      "motivation": "high"
    },
    {
      "category": "walking",
      "totalLength": 14,
      "motivation": "low"
    }
  ]
}`;
    normalTextarea.value = sampleText;
}

// イベントリスナー
toDynamoBtn.addEventListener('click', convertToDynamo);
toNormalBtn.addEventListener('click', convertToNormal);
normalCopyBtn.addEventListener('click', copyNormalToClipboard);
dynamoCopyBtn.addEventListener('click', copyDynamoToClipboard);
sampleBtn.addEventListener('click', setSampleToNormal);

// Enter + Ctrl で変換
normalTextarea.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        convertToDynamo();
    }
});

dynamoTextarea.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        convertToNormal();
    }
});

console.log('DynamoDB JSON Converter が起動しました');
