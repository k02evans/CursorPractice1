# IndieLab - Music Artist Resources & Community Platform

A full-stack Next.js application powered by InstantDB for independent music artists to share, discover, and discuss resources, tools, and insights.

## Features

- **User Authentication**: Magic link authentication with 6-digit verification codes
- **User Profiles**: Customizable profiles with avatar and social media links (Spotify, Instagram, SoundCloud, YouTube, TikTok, Twitter, Bandcamp, Apple Music)
- **Community Recommendations**: Submit and browse recommendations across multiple categories:
  - Community Management (Discord, Bandcamp, Skool, Whop)
  - Market Your Music
  - Essential Software & Hardware
  - Learning Resources
  - Local Performance Venues
- **Engagement Features**:
  - 5-star rating system
  - Recommend/upvote functionality
  - Comment threads
  - Share capabilities
- **Real-time Updates**: Powered by InstantDB for instant data synchronization
- **Responsive Design**: Mobile-first design with modern UI

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: InstantDB
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 747FM
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  /[section]/[category]/page.tsx - Dynamic category pages
  /profile/[userId]/page.tsx - User profile pages
  /page.tsx - Home page
  /layout.tsx - Root layout
  /globals.css - Global styles

/components
  /auth - Authentication components
  /layout - Layout components (Navbar, Footer, CursorLight)
  /recommendation - Recommendation and interaction components
  /profile - Profile management components
  /ui - Reusable UI components

/lib
  /instant.ts - InstantDB configuration and schema
  /utils.ts - Utility functions
```

## Design System

The app uses a minimalist design with the following color palette:
- Navy Blue (#0b1c34)
- Beige (#f5f1eb)
- Beige Dark (#d4c5b9)
- Silver (#c0c0c0)
- Light Grey (#e8e8e8)

## InstantDB Schema

The application uses the following data entities:
- **users**: User profiles and authentication
- **recommendations**: User-submitted resources and insights
- **comments**: Comment threads on recommendations
- **ratings**: 5-star ratings on recommendations
- **recommends**: User upvotes/recommendations
- **shares**: Share tracking

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

All rights reserved © 2024 IndieLab

