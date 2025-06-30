# Pharmaceutical Consultation System

## Overview

This is a full-stack web application designed to assist pharmacists with clinical decision support. The system provides medication recommendations, safety alerts, and drug interaction checking based on patient profiles. Built with React frontend and Express backend, it uses PostgreSQL for data persistence and Drizzle ORM for database operations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom medical theme colors
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL session store
- **API Pattern**: RESTful API with JSON responses

### Database Schema
- **Patients**: Store patient demographics, medical history, and current medications
- **Medications**: Comprehensive drug database with indications, contraindications, and interactions
- **Consultations**: Track pharmacist consultations with recommendations and safety alerts

## Key Components

### Clinical Decision Support Engine
- **Location**: `client/src/lib/clinical-rules.ts`
- **Purpose**: Evaluates patient safety against medications using clinical rules
- **Features**: 
  - Allergy checking
  - Drug interaction detection
  - Contraindication assessment
  - Pregnancy category evaluation
  - Age-based dosing considerations

### Storage Layer
- **Interface**: `server/storage.ts` defines IStorage interface
- **Implementation**: MemStorage class for in-memory operations (development)
- **Future**: Can be extended with PostgreSQL implementation
- **Features**: CRUD operations for patients, medications, and consultations

### UI Components
- **Patient Profile Form**: Comprehensive patient data collection
- **Drug Search**: Medication database search functionality
- **Recommendations Panel**: Display clinical recommendations and safety alerts
- **Patient History**: Track consultation history

## Data Flow

1. **Patient Creation**: Pharmacist enters patient demographics and medical history
2. **Recommendation Generation**: System analyzes patient profile against medication database
3. **Clinical Rules Evaluation**: Safety checks performed using clinical decision rules
4. **Results Display**: Recommendations and alerts presented to pharmacist
5. **Consultation Logging**: Session details stored for future reference

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type safety and development experience
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Production bundling

## Deployment Strategy

### Development
- **Server**: `npm run dev` - Development server with hot reload
- **Database**: `npm run db:push` - Push schema changes to database
- **Type Checking**: `npm run check` - TypeScript compilation check

### Production
- **Build**: `npm run build` - Creates optimized client bundle and server bundle
- **Start**: `npm start` - Runs production server
- **Database**: Requires DATABASE_URL environment variable for PostgreSQL connection

### Architecture Decisions

**Database Choice**: PostgreSQL chosen for ACID compliance and complex querying needs in medical applications. Drizzle ORM provides type safety while maintaining SQL flexibility.

**Frontend Framework**: React selected for component reusability and extensive ecosystem. Vite chosen over Create React App for superior development experience and build performance.

**UI Library**: Shadcn/ui chosen for consistency, accessibility, and customization. Built on Radix UI for robust accessibility features required in medical applications.

**State Management**: TanStack Query chosen over Redux for server state management, reducing boilerplate and providing automatic caching/synchronization.

**Validation**: Zod chosen for runtime validation to ensure data integrity between client and server, critical for medical data accuracy.

## Changelog

- June 30, 2025. Initial setup - Created pharmaceutical consultation system with in-memory storage
- June 30, 2025. Database integration - Added PostgreSQL database with authentic pharmaceutical data from user's CSV file
- June 30, 2025. Real medication data - Integrated authentic medication information including Ibuprofen, Diclofenac, and Paracetamol with real contraindications, dosage limits, and safety warnings

## User Preferences

Preferred communication style: Simple, everyday language.
Data preference: Use only authentic pharmaceutical data from authorized sources - user will provide more real medication data over time.