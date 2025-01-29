import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import { Property } from './types';
import { CONSTANTS, amenityTypes, lightingOptions } from './utils';

export class PropertyManager {
    private propertiesMap = new Map<number, Property>();
    private readonly dataFilePath: string;

    constructor(dataFilePath: string = 'properties.json') {
        this.dataFilePath = path.join(process.cwd(), dataFilePath);
        this.loadProperties();
    }

    private generateAmenities(): Readonly<Record<string, boolean>> {
        const amenities: Record<string, boolean> = {};
        amenityTypes.forEach(amenity => {
            amenities[amenity] = faker.datatype.boolean();
        });
        return Object.freeze(amenities);
    }

    generateProperty(): Property {
        return {
            squareFootage: faker.number.int({ 
                min: CONSTANTS.SQFT.MIN, 
                max: CONSTANTS.SQFT.MAX 
            }),
            lighting: lightingOptions[
                faker.number.int({ min: 0, max: lightingOptions.length - 1 })
            ],
            price: faker.number.int({ 
                min: CONSTANTS.PRICE.MIN, 
                max: CONSTANTS.PRICE.MAX 
            }),
            rooms: faker.number.int({ 
                min: CONSTANTS.ROOMS.MIN, 
                max: CONSTANTS.ROOMS.MAX 
            }),
            bathrooms: faker.number.int({ 
                min: CONSTANTS.BATHS.MIN, 
                max: CONSTANTS.BATHS.MAX 
            }),
            location: [
                Number(faker.location.latitude()),
                Number(faker.location.longitude())
            ],
            description: faker.lorem.paragraph(),
            ammenities: this.generateAmenities()
        };
    }

    loadProperties(): void {
        try {
            if (fs.existsSync(this.dataFilePath)) {
                const data = JSON.parse(fs.readFileSync(this.dataFilePath, 'utf8'));
                this.propertiesMap = new Map(
                    Object.entries(data).map(([key, value]) => [Number(key), value as Property])
                );
                console.log(`Loaded ${this.propertiesMap.size} properties from file.`);
            }
        } catch (error) {
            console.error('Error loading properties:', (error as Error).message);
        }
    }

    saveProperties(): void {
        try {
            const data = Object.fromEntries(this.propertiesMap);
            fs.writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2));
            console.log(`Saved ${this.propertiesMap.size} properties to file.`);
        } catch (error) {
            console.error('Error saving properties:', (error as Error).message);
        }
    }

    generateProperties(count: number): void {
        this.propertiesMap.clear();
        const CHUNK_SIZE = 1000;
        
        for (let i = 0; i < count; i += CHUNK_SIZE) {
            const chunk = Math.min(CHUNK_SIZE, count - i);
            Array.from({ length: chunk }, (_, index) => {
                this.propertiesMap.set(i + index, this.generateProperty());
            });
        }
        
        this.saveProperties();
    }

    getAllProperties(): Property[] {
        return Array.from(this.propertiesMap.values());
    }

    getProperty(index: number): Property | undefined {
        return this.propertiesMap.get(index);
    }
}
