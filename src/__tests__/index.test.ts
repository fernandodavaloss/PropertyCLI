// src/__tests__/index.test.ts

import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import { PropertyManager } from '../propertyManager';
import { Property } from '../types';
import { 
    formatCurrency, 
    propertyToTableRow, 
    calculateDistance,
    compareNumber,
    parseComparisonOption 
} from '../utils';

// Mock fs and commander
jest.mock('fs');
jest.mock('commander');

describe('Property CLI Tool', () => {
    let propertyManager: PropertyManager;

    // Test data
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

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        propertyManager = new PropertyManager('test-properties.json');
    });

    describe('Property Generation', () => {
        it('should generate a valid property', () => {
            const property = propertyManager.generateProperty();
            
            expect(property).toHaveProperty('squareFootage');
            expect(property.squareFootage).toBeGreaterThanOrEqual(1000);
            expect(property.squareFootage).toBeLessThanOrEqual(5000);
            
            expect(property).toHaveProperty('lighting');
            expect(['low', 'medium', 'high']).toContain(property.lighting);
            
            expect(property).toHaveProperty('price');
            expect(property.price).toBeGreaterThanOrEqual(200000);
            expect(property.price).toBeLessThanOrEqual(1500000);
            
            expect(property).toHaveProperty('rooms');
            expect(property.rooms).toBeGreaterThanOrEqual(1);
            expect(property.rooms).toBeLessThanOrEqual(6);
            
            expect(property).toHaveProperty('bathrooms');
            expect(property.bathrooms).toBeGreaterThanOrEqual(1);
            expect(property.bathrooms).toBeLessThanOrEqual(5);
            
            expect(property).toHaveProperty('location');
            expect(property.location).toHaveLength(2);
            
            expect(property).toHaveProperty('description');
            expect(typeof property.description).toBe('string');
            
            expect(property).toHaveProperty('ammenities');
            expect(Object.keys(property.ammenities)).toEqual(
                expect.arrayContaining(['yard', 'garage', 'pool', 'patio', 'fireplace'])
            );
        });
    });

    describe('Property Filtering', () => {
        const mockProperties = [
            mockProperty,
            {
                ...mockProperty,
                squareFootage: 3000,
                price: 500000,
                rooms: 4,
                bathrooms: 3,
                description: 'A spacious family home'
            },
            {
                ...mockProperty,
                squareFootage: 1500,
                price: 250000,
                rooms: 2,
                bathrooms: 1,
                ammenities: { ...mockProperty.ammenities, pool: true }
            }
        ];

        describe('Numeric Comparisons', () => {
            it('should filter by square footage', () => {
                const filtered = mockProperties.filter(p => 
                    compareNumber('squareFootage', 'gt', 2500, p)
                );
                expect(filtered).toHaveLength(1);
                expect(filtered[0].squareFootage).toBe(3000);
            });

            it('should filter by price', () => {
                const filtered = mockProperties.filter(p => 
                    compareNumber('price', 'lt', 300000, p)
                );
                expect(filtered).toHaveLength(1);
                expect(filtered[0].price).toBe(250000);
            });

            it('should filter by rooms', () => {
                const filtered = mockProperties.filter(p => 
                    compareNumber('rooms', 'eq', 3, p)
                );
                expect(filtered).toHaveLength(1);
                expect(filtered[0].rooms).toBe(3);
            });

            it('should filter by bathrooms', () => {
                const filtered = mockProperties.filter(p => 
                    compareNumber('bathrooms', 'gt', 2, p)
                );
                expect(filtered).toHaveLength(1);
                expect(filtered[0].bathrooms).toBe(3);
            });
        });

        describe('Amenities Filter', () => {
            it('should filter properties by amenities', () => {
                const filtered = mockProperties.filter(p => 
                    ['garage', 'pool'].every(amenity => p.ammenities[amenity])
                );
                expect(filtered).toHaveLength(1);
            });
        });

        describe('Description Search', () => {
            it('should filter properties by description text', () => {
                const filtered = mockProperties.filter(p => 
                    p.description.toLowerCase().includes('spacious')
                );
                expect(filtered).toHaveLength(1);
                expect(filtered[0].description).toContain('spacious');
            });
        });

        describe('Location Filter', () => {
            it('should calculate distance correctly', () => {
                const distance = calculateDistance(
                    37.7749, -122.4194, // San Francisco
                    34.0522, -118.2437  // Los Angeles
                );
                expect(distance).toBeCloseTo(559.12, 0); // Approximately 559 km
            });

            it('should filter properties by distance', () => {
                const filtered = mockProperties.filter(p => {
                    const distance = calculateDistance(
                        37.7749, -122.4194,
                        p.location[0], p.location[1]
                    );
                    return distance <= 10;
                });
                expect(filtered).toHaveLength(3); // All mock properties use same location
            });
        });
    });

    describe('File Operations', () => {
        const testFilePath = 'test-properties.json';

        beforeEach(() => {
            // Mock fs.existsSync to return true
            (fs.existsSync as jest.Mock).mockReturnValue(true);
        });

        it('should load properties from file', () => {
            const mockFileData = JSON.stringify({ 
                0: mockProperty 
            });
            
            (fs.readFileSync as jest.Mock).mockReturnValue(mockFileData);
            
            propertyManager.loadProperties();
            
            expect(fs.readFileSync).toHaveBeenCalled();
            expect(propertyManager.getAllProperties().length).toBe(1);
            expect(propertyManager.getProperty(0)).toEqual(mockProperty);
        });

        it('should save properties to file', () => {
            propertyManager.generateProperties(1);
            propertyManager.saveProperties();
            
            expect(fs.writeFileSync).toHaveBeenCalled();
            const savedData = (fs.writeFileSync as jest.Mock).mock.calls[0][1];
            expect(JSON.parse(savedData)).toBeDefined();
        });
    });

    describe('Formatting', () => {
        it('should format currency correctly', () => {
            expect(formatCurrency(1234567)).toBe('$1,234,567');
            expect(formatCurrency(1000)).toBe('$1,000');
            expect(formatCurrency(0)).toBe('$0');
        });

        it('should format property to table row', () => {
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

    describe('Command Line Interface', () => {
        it('should parse comparison options correctly', () => {
            const [operator, value] = parseComparisonOption('gt,2500');
            expect(operator).toBe('gt');
            expect(value).toBe(2500);
        });

        it('should throw error for invalid comparison operator', () => {
            expect(() => {
                parseComparisonOption('invalid,2500');
            }).toThrow('Invalid operator');
        });

        it('should throw error for invalid number value', () => {
            expect(() => {
                parseComparisonOption('gt,invalid');
            }).toThrow('Invalid number value');
        });
    });
});
