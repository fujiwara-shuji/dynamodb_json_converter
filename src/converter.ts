import {
  DynamoDBValue,
  DynamoDBObject,
  NormalValue,
  NormalObject,
} from "./types";

// DynamoDB JSON → 通常のJSON
export function dynamoToNormal(dynamoJson: DynamoDBObject): NormalObject {
  const result: NormalObject = {};
  for (const key in dynamoJson) {
    result[key] = convertDynamoValueToNormal(dynamoJson[key]);
  }
  return result;
}

/**
 * DynamoDB の値を通常の値に変換する関数
 */
function convertDynamoValueToNormal(value: DynamoDBValue): NormalValue {
  // 文字列型
  if ("S" in value) {
    return value.S;
  }

  // 数値型（文字列から数値に変換）
  if ("N" in value) {
    return Number(value.N);
  }

  // 真偽値型
  if ("BOOL" in value) {
    return value.BOOL;
  }

  // null型
  if ("NULL" in value) {
    return null;
  }

  // リスト型（再帰的に変換）
  if ("L" in value) {
    return value.L.map((item) => convertDynamoValueToNormal(item));
  }

  // マップ型（再帰的に変換）
  if ("M" in value) {
    const result: NormalObject = {};
    for (const key in value.M) {
      result[key] = convertDynamoValueToNormal(value.M[key]);
    }
    return result;
  }

  // 文字列セット（配列に変換）
  if ("SS" in value) {
    return value.SS;
  }

  // 数値セット（配列に変換、数値化）
  if ("NS" in value) {
    return value.NS.map((n) => Number(n));
  }

  // バイナリセット（今回は文字列配列として扱う）
  if ("BS" in value) {
    return value.BS;
  }

  throw new Error(`Unknown DynamoDB type: ${JSON.stringify(value)}`);
}

// 通常のJSON → DynamoDB JSON
export function normalToDynamo(normalJson: NormalObject): DynamoDBObject {
  const result: DynamoDBObject = {};
  for (const key in normalJson) {
    result[key] = convertNormalValueToDynamo(normalJson[key]);
  }
  return result;
}

/**
 * 通常の値をDynamoDB の値に変換する関数
 */
function convertNormalValueToDynamo(value: NormalValue): DynamoDBValue {
  // null
  if (value === null) {
    return { NULL: true };
  }

  // 真偽値
  if (typeof value === "boolean") {
    return { BOOL: value };
  }

  // 数値（文字列に変換）
  if (typeof value === "number") {
    return { N: String(value) };
  }

  // 文字列
  if (typeof value === "string") {
    return { S: value };
  }

  // 配列（再帰的に変換）
  if (Array.isArray(value)) {
    return { L: value.map((item) => convertNormalValueToDynamo(item)) };
  }

  // オブジェクト（再帰的に変換）
  if (typeof value === "object") {
    const result: DynamoDBObject = {};
    for (const key in value) {
      result[key] = convertNormalValueToDynamo(value[key]);
    }
    return { M: result };
  }

  throw new Error(`Unknown value type: ${typeof value}`);
}
