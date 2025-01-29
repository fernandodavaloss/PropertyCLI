# Property CLI Tool

A command-line interface tool for managing and searching property listings. This tool allows you to generate random property data, save it persistently, and search through properties using various filters.

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Build the project:
```bash
npm run build
```
Usage
Generating Properties
Generate a specified number of random properties:
```bash
npm run start -- generate <count>
```
Example:
```bash
npm run start -- generate 20
```
Listing All Properties
Display all available properties:
```bash
npm run start -- list
```
Viewing Property Details
View detailed information about a specific property:
```bash
npm run start -- details <index>
```
Example:
```bash
npm run start -- details 0
```
Searching Properties
The search command supports multiple filtering criteria that can be combined:
```bash
npm run start -- search [options]
```
Available Search Options
Square Footage Filter ( -sf, --square-feet)
```bash
# Format: <operator>,<value>
# Operators: eq (equal), lt (less than), gt (greater than)
npm run start -- search -sf gt,2000
npm run start -- search -sf eq,3000
npm run start -- search -sf lt,2500
```
2.Price Filter ( -p, --price)
```bash
npm run start -- search -p lt,400000
npm run start -- search -p gt,300000
npm run start -- search -p eq,350000
```
3. Rooms Filter ( -r, --rooms)
```bash
npm run start -- search -r gt,2
npm run start -- search -r eq,3
npm run start -- search -r lt,4
```
4.Bathrooms Filter ( -b, --bathrooms)
```bash
npm run start -- search -b gt,2
npm run start -- search -b eq,2
npm run start -- search -b lt,3
```
5.Amenities Filter ( -a, --amenities)
```bash
# Search for properties with specific amenities
npm run start -- search -a garage pool
npm run start -- search -a yard fireplace
```
Available amenities:

yard

garage

pool

patio

fireplace

Description Search ( -d, --description)
```bash
# Search for text in property descriptions
npm run start -- search -d "beautiful"
npm run start -- search -d "modern"
```
7.Location Filter ( -l, --location)
```bash
# Format: latitude,longitude,radiusInKm
npm run start -- search -l 37.7749,-122.4194,10
```
Combining Multiple Filters
You can combine multiple filters to narrow down your search:
```bash
# Properties under $500,000 with more than 2 rooms and both garage and pool
npm run start -- search -p lt,500000 -r gt,2 -a garage pool

# Properties over 2000 sqft within 10km of a location with a fireplace
npm run start -- search -sf gt,2000 -l 37.7749,-122.4194,10 -a fireplace

# Properties with 3 bathrooms and "modern" in the description
npm run start -- search -b eq,3 -d "modern"
```
Data Persistence
Property data is automatically saved to properties.json in the current working directory

Data is loaded automatically when the program starts

The generate command will clear existing data before creating new properties

Property Attributes
Each property includes:

Square footage (1000-5000)

Lighting level (low, medium, high)

Price ($200,000-$1,500,000)

Number of rooms (1-6)

Number of bathrooms (1-5)

Location (latitude, longitude)

Description

Amenities (yard, garage, pool, patio, fireplace)

Error Handling
The tool includes error handling for:

Invalid number formats

Invalid operators in filters

Invalid amenity types

Invalid location formats

File read/write errors

Development
To modify the tool:

1. Update the source code in src/index.ts

2. Rebuild the project:
```bash
npm run build
```
3. Run the tool:
```bash
npm run start -- [command] [options]
```
License
Your License Here

This README provides a comprehensive guide to using your CLI tool. You might want to add:

1. A section about prerequisites (Node.js version, etc.)
2. Any specific configuration requirements
3. Troubleshooting section for common issues
4. Contributing guidelines if you want others to contribute
5. A license section with your chosen license
