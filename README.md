# Roman Numerals Learning Site

A single-page application for learning and practicing Roman numerals.

## Features

- **Quiz Mode**: Practice converting between Arabic and Roman numerals with multiple difficulty levels
- **Converter**: Bidirectional converter with auto-detection of input type
- **Reference**: Collapsible guide covering basic numerals, subtractive notation, vinculum (overline), rules, and examples

## Tech Stack

- React 19
- TypeScript
- Vite 7
- Tailwind CSS v4

## Range

Supports numbers from 1 to 3,999,999 using vinculum notation (overline for ×1000 multiplier).

## Development

```bash
cd mysite
npm install
npm run dev
```

## Testing

```bash
npm test
```

## Build

```bash
npm run build
```

## Docker

```bash
docker build -t roman-numerals .
docker run -p 8080:80 roman-numerals
```
