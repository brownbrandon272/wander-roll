# Wander Roll

A timer countdown app that rolls dice when the timer completes. Perfect for making random decisions while walking around a neighborhood or any situation requiring spontaneous choices.

## Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- React Router v7 (navigation)
- Pure CSS/SVG animations

## Project Structure

```
src/
├── assets/sounds/       # Sound files
├── components/          # Reusable UI components
├── pages/               # Route page components
├── hooks/               # Custom React hooks
├── context/             # React Context providers
├── types/               # TypeScript type definitions
```

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Features

- **Timer**: Circular countdown with visual progress indicator
- **Dice Roll**: 1 or 2 dice with 3D rolling animation
- **Settings**: Timer duration, random timer, dice options, custom face meanings, sound toggle
- **Dark Mode**: Default dark theme with accent colors

## Routes

- `/` - Home page
- `/timer` - Timer countdown
- `/roll` - Dice roll result
- `/settings` - Settings page
