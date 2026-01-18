export type DynamoDBValue =
    | { S: string } // 文字列
    | { N: string } //数値
    | { BOOL: boolean } // 真偽値
    | { NULL: boolean } // null
    | { L: DynamoDBValue[] } // リスト
    | { M: DynamoDBObject } // マップ
    | { SS: string[] } // 文字列セット
    | { NS: string[] } // 数値セット
    | { BS: string[] }; // バイナリセット

export type DynamoDBObject = {
    [key: string]: DynamoDBValue;
};

export type NormalValue = string | number | boolean | null | NormalValue[] | NormalObject;

export type NormalObject = {
    [key: string]: NormalValue;
};
