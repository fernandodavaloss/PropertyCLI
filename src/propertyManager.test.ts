import { PropertyManager } from '../propertyManager';
import * as fs from 'fs';
import { Property } from '../types';

jest.mock('fs');

describe('PropertyManager', () => {
    let propertyManager: PropertyManager;
    const testFilePath = 'test-properties.json';

    beforeEach(() => {
        jest.clearAllMocks();
        propertyManager = new PropertyManager(testFilePath);
    });

    describe('generateProperty', () => {
        it('should generate valid property', () => {
            const property = propertyManager.generateProperty();
            
            expect(property).toHaveProperty('squareFootage');
            expect(property.squareFootage).toBeGreaterThanOrEqual(1000);
            expect(property.squareFootage).toBeLessThanOrEqual(5000);
            
            expect(property).toHaveProperty('lighting');
            expect(['low', 'medium', 'high']).toContain(property.lighting);
            
            expect(property).toHaveProperty('price');
            expect(property).toHaveProperty('rooms');
            expect(property).toHaveProperty('bathrooms');
            expect(property).toHaveProperty('location');
            expect(property).toHaveProperty('description');
            expect(property).toHaveProperty('ammenities');
        });
    });

    describe('File Operations', () => {
        const mockProperty: Property = {
            squareFootage: 2000,
            lighting: 'medium',
            price: 300000,
            rooms: 3,
            bathrooms: 2,
            location: [37.7749, -122.4194],
            description: 'Test property',
            ammenities: {
                yard: true,
                garage: true,
                pool: false,
                patio: true,
                fireplace: false
            }
        };

        beforeEach(() => {
            (fs.existsSync as jest.Mock).mockReturnValue(true);
        });

        it('should load properties from file', () => {
            const mockFileData = JSON.stringify({ 0: mockProperty });
            (fs.readFileSync as jest.Mock).mockReturnValue(mockFileData);
            
            propertyManager.loadProperties();
            expect(propertyManager.getAllProperties()).toHaveLength(1);
            expect(propertyManager.getProperty(0)).toEqual(mockProperty);
        });

        it('should save properties to file', () => {
            propertyManager['propertiesMap'].set(0, mockProperty);
            propertyManager.saveProperties();
            
            expect(fs.writeFileSync).toHaveBeenCalled();
            const savedData = (fs.writeFileSync as jest.Mock).mock.calls[0][1];
            expect(JSON.parse(savedData)[0]).toEqual(mockProperty);
        });
    });
});
