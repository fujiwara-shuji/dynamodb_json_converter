import { describe, it, expect } from 'vitest';
import { dynamoToNormal, normalToDynamo } from './converter';

describe('dynamoToNormal', () => {
    it('文字列を変換できる', () => {
        const input = {
            name: { S: '太郎' },
        };

        const result = dynamoToNormal(input);

        expect(result).toEqual({
            name: '太郎',
        });
    });

    it('数値を変換できる', () => {
        const input = {
            age: { N: '25' },
        };

        const result = dynamoToNormal(input);

        expect(result).toEqual({
            age: 25,
        });
    });

    it('真偽値を変換できる', () => {
        const input = {
            isActive: { BOOL: true },
        };

        const result = dynamoToNormal(input);

        expect(result).toEqual({
            isActive: true,
        });
    });

    it('nullを変換できる', () => {
        const input = {
            address: { NULL: true },
        };

        const result = dynamoToNormal(input);

        expect(result).toEqual({
            address: null,
        });
    });

    it('配列を変換できる', () => {
        const input = {
            hobbies: {
                L: [{ S: '読書' }, { S: '旅行' }],
            },
        };

        const result = dynamoToNormal(input);

        expect(result).toEqual({
            hobbies: ['読書', '旅行'],
        });
    });

    it('ネストしたオブジェクトを変換できる', () => {
        const input = {
            profile: {
                M: {
                    bio: { S: 'エンジニア' },
                    score: { N: '95' },
                },
            },
        };

        const result = dynamoToNormal(input);

        expect(result).toEqual({
            profile: {
                bio: 'エンジニア',
                score: 95,
            },
        });
    });

    it('複雑なデータを変換できる', () => {
        const input = {
            name: { S: '太郎' },
            age: { N: '25' },
            isActive: { BOOL: true },
            address: { NULL: true },
            hobbies: {
                L: [{ S: '読書' }, { S: '旅行' }],
            },
            profile: {
                M: {
                    bio: { S: 'エンジニア' },
                    skills: {
                        L: [{ S: 'TypeScript' }, { S: 'Docker' }],
                    },
                },
            },
        };

        const result = dynamoToNormal(input);

        expect(result).toEqual({
            name: '太郎',
            age: 25,
            isActive: true,
            address: null,
            hobbies: ['読書', '旅行'],
            profile: {
                bio: 'エンジニア',
                skills: ['TypeScript', 'Docker'],
            },
        });
    });
});

describe('normalToDynamo', () => {
    it('文字列を変換できる', () => {
        const input = {
            name: '太郎',
        };

        const result = normalToDynamo(input);

        expect(result).toEqual({
            name: { S: '太郎' },
        });
    });

    it('数値を変換できる', () => {
        const input = {
            age: 25,
        };

        const result = normalToDynamo(input);

        expect(result).toEqual({
            age: { N: '25' },
        });
    });

    it('真偽値を変換できる', () => {
        const input = {
            isActive: true,
        };

        const result = normalToDynamo(input);

        expect(result).toEqual({
            isActive: { BOOL: true },
        });
    });

    it('nullを変換できる', () => {
        const input = {
            address: null,
        };

        const result = normalToDynamo(input);

        expect(result).toEqual({
            address: { NULL: true },
        });
    });

    it('配列を変換できる', () => {
        const input = {
            hobbies: ['読書', '旅行'],
        };

        const result = normalToDynamo(input);

        expect(result).toEqual({
            hobbies: {
                L: [{ S: '読書' }, { S: '旅行' }],
            },
        });
    });

    it('ネストしたオブジェクトを変換できる', () => {
        const input = {
            profile: {
                bio: 'エンジニア',
                score: 95,
            },
        };

        const result = normalToDynamo(input);

        expect(result).toEqual({
            profile: {
                M: {
                    bio: { S: 'エンジニア' },
                    score: { N: '95' },
                },
            },
        });
    });

    it('複雑なデータを変換できる', () => {
        const input = {
            name: '太郎',
            age: 25,
            isActive: true,
            address: null,
            hobbies: ['読書', '旅行'],
            profile: {
                bio: 'エンジニア',
                skills: ['TypeScript', 'Docker'],
            },
        };

        const result = normalToDynamo(input);

        expect(result).toEqual({
            name: { S: '太郎' },
            age: { N: '25' },
            isActive: { BOOL: true },
            address: { NULL: true },
            hobbies: {
                L: [{ S: '読書' }, { S: '旅行' }],
            },
            profile: {
                M: {
                    bio: { S: 'エンジニア' },
                    skills: {
                        L: [{ S: 'TypeScript' }, { S: 'Docker' }],
                    },
                },
            },
        });
    });
});

describe('往復変換', () => {
    it('DynamoDB → 通常 → DynamoDB で元に戻る', () => {
        const original = {
            name: { S: '太郎' },
            age: { N: '25' },
            isActive: { BOOL: true },
        };

        const normal = dynamoToNormal(original);
        const backToDynamo = normalToDynamo(normal);

        expect(backToDynamo).toEqual(original);
    });

    it('通常 → DynamoDB → 通常 で元に戻る', () => {
        const original = {
            name: '花子',
            age: 30,
            isActive: false,
        };

        const dynamo = normalToDynamo(original);
        const backToNormal = dynamoToNormal(dynamo);

        expect(backToNormal).toEqual(original);
    });
});
