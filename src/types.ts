// src/types.ts
export interface Property {
    readonly squareFootage: number;
    readonly lighting: 'low' | 'medium' | 'high';
    readonly price: number;
    readonly rooms: number;
    readonly bathrooms: number;
    readonly location: readonly [number, number];
    readonly description: string;
    readonly ammenities: Readonly<Record<string, boolean>>;
}

export type ComparisonOperator = 'eq' | 'lt' | 'gt';
export type NumberField = 'squareFootage' | 'price' | 'rooms' | 'bathrooms';
export type AmenityType = 'yard' | 'garage' | 'pool' | 'patio' | 'fireplace';
