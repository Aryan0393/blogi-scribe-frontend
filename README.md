# Blogi - Modern Blogging Platform

![Blogi Logo](https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop)

## Overview

Blogi is a modern, responsive blogging platform that allows users to create, read, update, and delete blog posts. Built with React, TypeScript, and Tailwind CSS, it offers a clean, intuitive interface for both readers and content creators.

## Features

### Core Functionality
- **Blog Post Management**
  - View all blog posts with pagination
  - Create new blog posts with rich text content
  - Edit your own blog posts
  - Delete your own blog posts
  - View detailed post information
  
- **User Authentication**
  - Register new accounts
  - Log in to existing accounts
  - Protected routes for authenticated operations
  - Author-based authorization (only edit/delete your own posts)

### Enhanced Features
- **Media Support**
  - Upload and display images for blog posts
  - Responsive image handling
  
- **Search Functionality**
  - Search posts by title or content
  - Real-time search results with debounce

- **Modern UI/UX**
  - Responsive design for all screen sizes
  - Animated transitions and hover effects
  - Gradient styling and card-based layout
  - Loading states with skeleton components
  - Toast notifications for user feedback

## Technology Stack

- **Frontend**
  - React
  - TypeScript
  - Tailwind CSS
  - React Router for navigation
  - React Query for data fetching
  - shadcn/ui for UI components

- **UI Libraries**
  - Lucide React for icons
  - Date-fns for date formatting
  - Sonner for toast notifications

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd blogi

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`.

### Environment Setup

By default, the application runs with mock data for development. To connect to a real backend:

1. Create a `.env` file in the project root
2. Add the API URL variable:
```
VITE_API_URL=http://your-api-url.com/api
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts for state management
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries
├── pages/          # Page components
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Usage

### Reading Posts
- Browse the home page to see all posts
- Use the pagination to navigate through posts
- Use the search bar to find specific content

### Creating Content
1. Register or log in to your account
2. Click "Create Post" in the navigation bar
3. Fill in the title and content
4. Optionally upload an image
5. Submit your post

### Managing Your Posts
1. Navigate to your post's detail page
2. Use the edit button to modify your post
3. Use the delete button to remove your post

## API Integration

The application is designed to work with a RESTful API. In development mode, it uses mock data stored in `src/utils/api.ts`.

To connect to a real backend, implement the following endpoints:

- `POST /auth/login`: User authentication
- `POST /auth/register`: New user registration
- `GET /posts`: Retrieve paginated posts
- `GET /posts/:id`: Retrieve a specific post
- `POST /posts`: Create a new post
- `PUT /posts/:id`: Update an existing post
- `DELETE /posts/:id`: Delete a post

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from modern blogging platforms
- Images from Unsplash
