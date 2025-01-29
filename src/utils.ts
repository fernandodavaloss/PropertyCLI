import { ComparisonOperator, NumberField, Property } from './types';

export const CONSTANTS = {
    SQFT: { MIN: 1000, MAX: 5000 },
    PRICE: { MIN: 200000, MAX: 1500000 },
    ROOMS: { MIN: 1, MAX: 6 },
    BATHS: { MIN: 1, MAX: 5 },
    LIGHTING: ['low', 'medium', 'high'] as const,
    DATA_FILE: 'properties.json'
} as const;

export const amenityTypes = ['yard', 'garage', 'pool', 'patio', 'fireplace'] as const;
export const lightingOptions = CONSTANTS.LIGHTING;

export const formatCurrency = (amount: number): string => 
    `$${amount.toLocaleString()}`;

export const propertyToTableRow = (p: Property) => ({
    sqft: p.squareFootage,
    price: formatCurrency(p.price),
    rooms: p.rooms,
    baths: p.bathrooms,
    lighting: p.lighting
});

export const calculateDistance = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

export const compareNumber = (
    field: NumberField, 
    operator: ComparisonOperator, 
    value: number,
    property: Property
): boolean => {
    switch(operator) {
        case 'eq': return property[field] === value;
        case 'lt': return property[field] < value;
        case 'gt': return property[field] > value;
        default: return false;
    }
};

export const parseComparisonOption = (option: string): [ComparisonOperator, number] => {
    const [operator, valueStr] = option.split(',');
    if (!['eq', 'lt', 'gt'].includes(operator)) {
        throw new Error('Invalid operator. Use eq, lt, or gt');
    }
    const value = Number(valueStr);
    if (isNaN(value)) {
        throw new Error('Invalid number value');
    }
    return [operator as ComparisonOperator, value];
};
