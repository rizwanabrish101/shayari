# Overview

This is an Urdu poetry (Shayari) mobile web application that allows users to browse, search, and create images from Urdu poetry. The app features poems from famous poets like Allama Iqbal, Ghalib, and Faiz Ahmed Faiz. Users can explore poetry by poet, category, mark favorites, and generate beautiful images of selected verses.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with **TypeScript** for type safety
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack React Query** for server state management and caching
- **Shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with custom Urdu font support (Noto Nastaliq Urdu)
- **Mobile-first design** with RTL (right-to-left) text direction support

## Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with endpoints for poets, categories, shayaris, and favorites
- **In-memory storage** implementation (MemStorage class) for data persistence
- **Modular route handling** with separate storage interface for future database integration
- **Development/production** environment handling with Vite middleware integration

## Database Design
- **Drizzle ORM** configured for PostgreSQL (currently using in-memory storage)
- **Schema definition** includes poets, categories, shayaris, and favorites tables
- **Type-safe** database operations with Zod validation schemas
- **Foreign key relationships** between shayaris and poets/categories

## Key Features
- **Poetry browsing** by poet and category
- **Search functionality** across poetry content
- **Favorites system** for bookmarking preferred verses
- **Image generation** for creating shareable poetry images with customizable backgrounds
- **Responsive mobile layout** with bottom navigation
- **RTL text support** for proper Urdu text display

## Component Structure
- **Layout components**: Mobile-focused header and bottom navigation
- **UI components**: Comprehensive Shadcn/ui component library
- **Feature components**: Poetry cards, poet cards, category cards, and image creator
- **Shared hooks**: Favorites management, mobile detection, and toast notifications

## State Management
- **React Query** for server state, caching, and API calls
- **Local state** management with React hooks
- **Toast system** for user feedback and notifications
- **Favorites tracking** with optimistic updates

# External Dependencies

## Core Framework & Build Tools
- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **TypeScript** - Type safety and development experience

## UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Google Fonts** - Noto Nastaliq Urdu and Inter fonts

## Backend & Database
- **Express.js** - Web server framework
- **Drizzle ORM** - Type-safe SQL toolkit
- **Neon Database** - Serverless PostgreSQL (configured but not actively used)
- **Zod** - Schema validation library

## State & Data Management
- **TanStack React Query** - Server state management
- **Wouter** - Lightweight routing library

## Development Tools
- **ESBuild** - Fast JavaScript bundler for production builds
- **TSX** - TypeScript execution for development
- **Replit integrations** - Development environment optimizations