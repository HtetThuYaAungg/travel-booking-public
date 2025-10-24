# Travel Booking Public Website

This is a modern travel booking website built with Next.js, TypeScript, and Tailwind CSS. The website provides a user-friendly interface for booking hotels, flights, and buses.

## Features

- **Homepage**: Modern hero section with search functionality
- **Hotels**: Complete hotel listing with filters and search
- **Flights**: Flight booking interface (coming soon)
- **Buses**: Bus booking interface (coming soon)
- **My Bookings**: Manage your travel reservations
- **Responsive Design**: Works perfectly on all devices
- **Modern UI**: Clean and intuitive user interface

## Tech Stack

- **Framework**: Next.js 15.5.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **State Management**: React Query
- **Forms**: React Hook Form with Zod validation

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (root)/
│   │   ├── page.tsx          # Homepage
│   │   ├── hotels/
│   │   │   └── page.tsx      # Hotels listing
│   │   ├── flights/
│   │   │   └── page.tsx      # Flights page
│   │   ├── buses/
│   │   │   └── page.tsx      # Buses page
│   │   └── bookings/
│   │       └── page.tsx      # My bookings
│   └── layout.tsx           # Root layout
├── components/
│   ├── public-header.tsx    # Navigation header
│   ├── public-footer.tsx    # Footer
│   ├── hero-section.tsx     # Homepage hero
│   ├── search-section.tsx   # Search options
│   ├── featured-hotels.tsx  # Featured hotels
│   ├── why-choose-us.tsx    # Why choose us section
│   ├── hotel-filters.tsx    # Hotel filters
│   ├── hotel-list.tsx       # Hotel listings
│   └── search-bar.tsx       # Search functionality
└── lib/
    └── utils.ts             # Utility functions
```

## Features Overview

### Homepage
- Hero section with search functionality
- Featured hotels showcase
- Why choose us section
- Modern and responsive design

### Hotels Page
- Advanced filtering system
- Search functionality
- Hotel cards with booking options
- Responsive grid layout

### Navigation
- Clean header with navigation links
- Mobile-responsive menu
- User authentication options

### Booking Management
- View existing bookings
- Booking status tracking
- Easy booking modifications

## Development

The project uses modern development practices:

- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Component-based architecture**
- **Responsive design**
- **Accessibility features**

## Deployment

The website is ready for deployment on platforms like:
- Vercel
- Netlify
- AWS
- Any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.