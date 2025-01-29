import { 
    formatCurrency, 
    propertyToTableRow, 
    calculateDistance,
    compareNumber,
    parseComparisonOption 
} from '../utils';
import { Property } from '../types';

describe('Utils', () => {
    const mockProperty: Property = {
        squareFootage: 2000,
        lighting: 'medium',
        price: 300000,
        rooms: 3,
        bathrooms: 2,
        location: [37.7749, -122.4194],
        description: 'A beautiful modern home',
        ammenities: {
            yard: true,
            garage: true,
            pool: false,
            patio: true,
            fireplace: false
        }
    };

    describe('formatCurrency', () => {
        it('should format numbers as currency', () => {
            expect(formatCurrency(1234567)).toBe('$1,234,567');
            expect(formatCurrency(1000)).toBe('$1,000');
            expect(formatCurrency(0)).toBe('$0');
        });
    });

    describe('propertyToTableRow', () => {
        it('should convert property to table row format', () => {
            const row = propertyToTableRow(mockProperty);
            expect(row).toEqual({
                sqft: 2000,
                price: '$300,000',
                rooms: 3,
                baths: 2,
                lighting: 'medium'
            });
        });
    });

    describe('calculateDistance', () => {
        it('should calculate distance between two points', () => {
            const distance = calculateDistance(
                37.7749, -122.4194, // San Francisco
                34.0522, -118.2437  // Los Angeles
            );
            expect(distance).toBeCloseTo(559.12, 0);
        });
    });

    describe('compareNumber', () => {
        it('should compare numbers correctly', () => {
            expect(compareNumber('squareFootage', 'eq', 2000, mockProperty)).toBe(true);
            expect(compareNumber('price', 'lt', 400000, mockProperty)).toBe(true);
            expect(compareNumber('rooms', 'gt', 2, mockProperty)).toBe(true);
            expect(compareNumber('bathrooms', 'eq', 3, mockProperty)).toBe(false);
        });
    });

    describe('parseComparisonOption', () => {
        it('should parse valid comparison options', () => {
            expect(parseComparisonOption('gt,2500')).toEqual(['gt', 2500]);
            expect(parseComparisonOption('lt,1000')).toEqual(['lt', 1000]);
            expect(parseComparisonOption('eq,3000')).toEqual(['eq', 3000]);
        });

        it('should throw error for invalid operator', () => {
            expect(() => parseComparisonOption('invalid,2500')).toThrow('Invalid operator');
        });

        it('should throw error for invalid number', () => {
            expect(() => parseComparisonOption('gt,invalid')).toThrow('Invalid number value');
        });
    });
});
