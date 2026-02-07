# NHD Client Portal

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5+-green.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-blue.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Modern React client portal for North Head Digital with role-based authentication, project management, and team communication.

## ✨ Features

- **🎨 Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- **🔐 Role-Based Authentication** - Admin and Client user roles
- **📊 Project Dashboard** - Real-time project status and updates
- **💬 Team Messaging** - Internal communication system
- **👤 User Profiles** - Personal account management
- **🛡️ TypeScript** - Type-safe development
- **⚡ Vite** - Lightning-fast development and builds
- **🎯 NHD Branding** - Custom design system and components

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **NHD API Server** running (see [nhd-api](https://github.com/North-Head-Digital/nhd-api))

### 1. Clone the Repository

```bash
git clone https://github.com/North-Head-Digital/nhd-client-portal.git
cd nhd-client-portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create environment files:

#### `.env.development`
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ENV=development
```

#### `.env.production`
```env
VITE_API_BASE_URL=https://api.northheaddigital.com
VITE_ENV=production
```

### 4. Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

### 5. Build for Production

```bash
# Development build (for testing with local API)
npm run build:dev

# Production build
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── admin/
│   │   └── AdminDashboard.tsx     # Admin management interface
│   ├── auth/
│   │   └── Login.tsx              # Authentication component
│   ├── common/
│   │   ├── NHDLogo.tsx           # Brand logo component
│   │   └── RoleBasedRedirect.tsx # Role-based routing
│   ├── dashboard/
│   │   └── Dashboard.tsx         # Client dashboard
│   ├── layout/
│   │   ├── Header.tsx            # App header
│   │   ├── Layout.tsx            # Main layout wrapper
│   │   └── Sidebar.tsx           # Navigation sidebar
│   ├── messages/
│   │   └── Messages.tsx          # Messaging interface
│   ├── profile/
│   │   └── Profile.tsx           # User profile management
│   └── projects/
│       └── Projects.tsx          # Project management
├── contexts/
│   └── AuthContext.tsx           # Authentication state management
├── services/
│   └── api.ts                    # API service layer
├── styles/
│   ├── brand.css                 # NHD brand-specific styles
│   └── index.css                 # Global styles
├── utils/
│   └── apiConfig.ts              # Environment-aware API configuration
├── App.tsx                       # Main application component
├── main.tsx                      # Application entry point
└── vite-env.d.ts                 # Vite environment types
```

## 🎨 Design System

### Brand Colors

The portal uses North Head Digital's brand colors:

```css
/* Primary Colors */
--primary-500: #667eea    /* Main brand color */
--secondary-500: #764ba2  /* Secondary brand color */
--accent-500: #f64f59     /* Accent color */

/* Gradients */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--gradient-vibrant: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%)
```

### Components

- **NHDLogo** - Custom logo component with multiple variants
- **Brand Buttons** - Styled buttons with brand gradients
- **Navigation** - Role-based navigation system
- **Cards** - Consistent card layouts with hover effects

## 🔐 Authentication & Authorization

### User Roles

- **Admin Users:**
  - Access to Admin Dashboard
  - User management capabilities
  - Project oversight
  - System administration

- **Client Users:**
  - Personal dashboard
  - Project status viewing
  - Team messaging
  - Profile management

### Authentication Flow

1. **Login** - JWT token authentication
2. **Role Detection** - Automatic role-based routing
3. **Protected Routes** - Authentication-required pages
4. **Token Management** - Automatic token refresh and storage

## 📱 Responsive Design

The portal is fully responsive with breakpoints:

- **Mobile:** `< 640px`
- **Tablet:** `640px - 1024px`
- **Desktop:** `> 1024px`

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run build:dev    # Development build (for local API testing)
npm run preview      # Preview production build
npm run lint         # ESLint code checking
```

### Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code linting and formatting
- **Tailwind CSS** - Utility-first styling
- **Component Architecture** - Reusable, modular components

## 🚀 Deployment

### Development Deployment

```bash
npm run build:dev
```

This creates a build optimized for local development with the local API.

### Production Deployment

```bash
npm run build
```

This creates a production build that connects to the live API.

### Integration with Website

The built portal is typically deployed to the main website:

```
NHD-Website/public/portal/app/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── favicon.ico
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `VITE_API_BASE_URL` | API server URL | `http://localhost:5000` | `https://api.northheaddigital.com` |
| `VITE_ENV` | Environment mode | `development` | `production` |

### API Configuration

The app uses environment-aware API configuration:

```typescript
// Automatically detects environment and sets appropriate API URL
export const API_BASE_URL = getApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;
```

## 🧪 Testing

### Test Accounts

Use these accounts for testing:

- **Admin:** `admin@northheaddigital.com` / `password123`
- **Client:** `sarah@boldcoffee.com` / `password123`

### Manual Testing Checklist

- [ ] Login with admin account → redirects to admin dashboard
- [ ] Login with client account → redirects to client dashboard
- [ ] Navigation shows appropriate menu items for each role
- [ ] API calls work with correct endpoints
- [ ] Responsive design works on all screen sizes
- [ ] Brand colors and styling are consistent

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new components
- Follow the existing component structure
- Maintain brand consistency in styling
- Test on multiple screen sizes
- Ensure accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email hello@northheaddigital.com or visit our [website](https://northheaddigital.com).

---

**North Head Digital** - Transforming complex AI technology into simple, powerful business solutions.