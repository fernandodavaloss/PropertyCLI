#!/usr/bin/env node

import { Command } from 'commander';
import { PropertyManager } from './propertyManager';
import { 
    formatCurrency, 
    propertyToTableRow, 
    calculateDistance,
    compareNumber,
    parseComparisonOption,
    amenityTypes
} from './utils';

const propertyManager = new PropertyManager();
const program = new Command();

program
    .name('property-cli')
    .description('A CLI tool for managing property data')
    .version('1.0.0');

program
    .command('generate')
    .argument('<count>', 'Number of properties to generate')
    .description('Generate random properties')
    .action((count: string) => {
        try {
            const numberOfProperties = parseInt(count);
            
            if (isNaN(numberOfProperties) || numberOfProperties <= 0) {
                throw new Error('Please provide a valid positive number');
            }

            propertyManager.generateProperties(numberOfProperties);
            console.log(`Generated ${numberOfProperties} properties.`);
            console.table(propertyManager.getAllProperties().map(propertyToTableRow));
        } catch (error) {
            console.error('Error generating properties:', (error as Error).message);
        }
    });

program
    .command('list')
    .description('List all properties')
    .action(() => {
        const properties = propertyManager.getAllProperties();
        if (properties.length === 0) {
            console.log('No properties available. Generate some using the generate command.');
            return;
        }
        console.table(properties.map(propertyToTableRow));
    });

program
    .command('details')
    .argument('<index>', 'Index of the property')
    .description('Show detailed information about a property')
    .action((index: string) => {
        try {
            const propertyIndex = parseInt(index);
            const property = propertyManager.getProperty(propertyIndex);

            if (!property) {
                throw new Error('Invalid property index');
            }

            console.log('\nProperty Details:');
            console.log('----------------');
            console.log(`Square Footage: ${property.squareFootage}`);
            console.log(`Lighting: ${property.lighting}`);
            console.log(`Price: ${formatCurrency(property.price)}`);
            console.log(`Rooms: ${property.rooms}`);
            console.log(`Bathrooms: ${property.bathrooms}`);
            console.log(`Location: ${property.location.join(', ')}`);
            console.log(`Description: ${property.description}`);
            console.log('\nAmmenities:');
            Object.entries(property.ammenities)
                .forEach(([key, value]) => {
                    console.log(`- ${key}: ${value ? '✓' : '✗'}`);
                });
        } catch (error) {
            console.error('Error:', (error as Error).message);
        }
    });

program
    .command('search')
    .description('Search properties by criteria')
    .option('-sf, --square-feet <operator,value>', 'Filter by square feet (eq,lt,gt,value)')
    .option('-p, --price <operator,value>', 'Filter by price (eq,lt,gt,value)')
    .option('-r, --rooms <operator,value>', 'Filter by rooms (eq,lt,gt,value)')
    .option('-b, --bathrooms <operator,value>', 'Filter by bathrooms (eq,lt,gt,value)')
    .option('-a, --amenities <amenities...>', 'Required amenities (space-separated)')
    .option('-d, --description <text>', 'Text to search in description')
    .option('-l, --location <lat,lon,radius>', 'Filter by location (latitude,longitude,radiusInKm)')
    .action((options) => {
        try {
            let filtered = propertyManager.getAllProperties();

            if (options.squareFeet) {
                const [operator, value] = parseComparisonOption(options.squareFeet);
                filtered = filtered.filter(p => 
                    compareNumber('squareFootage', operator, value, p)
                );
                console.log(`Filtering by square feet ${operator} ${value}`);
            }

            if (options.price) {
                const [operator, value] = parseComparisonOption(options.price);
                filtered = filtered.filter(p => 
                    compareNumber('price', operator, value, p)
                );
                console.log(`Filtering by price ${operator} ${formatCurrency(value)}`);
            }

            if (options.rooms) {
                const [operator, value] = parseComparisonOption(options.rooms);
                filtered = filtered.filter(p => 
                    compareNumber('rooms', operator, value, p)
                );
                console.log(`Filtering by rooms ${operator} ${value}`);
            }

            if (options.bathrooms) {
                const [operator, value] = parseComparisonOption(options.bathrooms);
                filtered = filtered.filter(p => 
                    compareNumber('bathrooms', operator, value, p)
                );
                console.log(`Filtering by bathrooms ${operator} ${value}`);
            }

            if (options.amenities) {
                const requiredAmenities: string[] = options.amenities;
                filtered = filtered.filter(p => 
                    requiredAmenities.every((amenity: string) => {
                        if (!amenityTypes.includes(amenity as any)) {
                            throw new Error(`Invalid amenity: ${amenity}. Available options: ${amenityTypes.join(', ')}`);
                        }
                        return p.ammenities[amenity];
                    })
                );
                console.log(`Filtering by amenities: ${requiredAmenities.join(', ')}`);
            }

            if (options.description) {
                const searchText = options.description.toLowerCase();
                filtered = filtered.filter(p => 
                    p.description.toLowerCase().includes(searchText)
                );
                console.log(`Filtering by description containing: "${options.description}"`);
            }

            if (options.location) {
                const [lat, lon, radius] = options.location.split(',').map(Number);
                if ([lat, lon, radius].some(isNaN)) {
                    throw new Error('Invalid location format. Use: latitude,longitude,radiusInKm');
                }
                filtered = filtered.filter(p => {
                    const distance = calculateDistance(lat, lon, p.location[0], p.location[1]);
                    return distance <= radius;
                });
                console.log(`Filtering by location: ${radius}km radius from [${lat}, ${lon}]`);
            }

            if (filtered.length === 0) {
                console.log('No properties found matching your criteria.');
                return;
            }

            console.log(`\nFound ${filtered.length} matching properties:`);
            console.table(filtered.map(propertyToTableRow));
        } catch (error) {
            console.error('Error:', (error as Error).message);
        }
    });

program.parse(process.argv);
