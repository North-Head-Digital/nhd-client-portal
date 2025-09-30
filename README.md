# North Head Digital - Client Portal

A modern, professional client portal built with React, TypeScript, and Tailwind CSS for North Head Digital's clients to manage their projects, communicate with the team, and track progress.

## Features

### 🔐 Authentication
- Secure login system with demo credentials
- Session management with localStorage
- Protected routes and authentication context

### 📊 Dashboard
- Overview of active projects and milestones
- Recent activity feed
- Quick stats and metrics
- Upcoming deadlines and tasks

### 📁 Project Management
- Detailed project views with progress tracking
- Deliverable tracking and status updates
- Team member assignments
- Budget and timeline information
- Interactive project cards with modal details

### 💬 Communication
- Real-time messaging interface
- Team member contact information
- Message history and conversation threads
- File sharing capabilities (UI ready)
- Online status indicators

### 👤 Profile Management
- Personal information editing
- Company details and contact information
- Notification preferences
- Security settings and two-factor authentication
- Timezone and localization settings

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Development**: ESLint + TypeScript strict mode

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd /home/darkr/Desktop/DarkR.Dev/Websites/NHD-Client_Portal
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Demo Credentials
- **Email**: `client@example.com`
- **Password**: `password`

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── Login.tsx
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   ├── layout/
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── messages/
│   │   └── Messages.tsx
│   ├── projects/
│   │   └── Projects.tsx
│   └── profile/
│       └── Profile.tsx
├── contexts/
│   └── AuthContext.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Key Features Explained

### Authentication System
- Mock authentication with localStorage persistence
- Context-based state management for user data
- Protected route implementation
- Automatic redirects for unauthorized access

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Collapsible sidebar for mobile devices
- Responsive grid layouts
- Touch-friendly interface elements

### Component Architecture
- Reusable UI components with consistent styling
- Context providers for global state management
- Custom hooks for authentication logic
- Modular component structure for easy maintenance

### Data Management
- Mock data for demonstration purposes
- Structured data models for projects, messages, and users
- State management with React hooks
- Form handling with controlled components

## Customization

### Branding
- Update colors in `tailwind.config.js`
- Modify company information in components
- Replace logo and favicon in `index.html`

### Features
- Add real API integration
- Implement file upload functionality
- Add real-time notifications
- Integrate with project management tools

### Styling
- Customize the design system in `index.css`
- Modify component styles in individual files
- Update color scheme and typography

## Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The built files will be in the `dist/` directory and can be deployed to any static hosting service.

## Integration with Main Website

This client portal is designed to be integrated with your main North Head Digital website:

1. **Navigation Link**: Add a "Client Portal" button to your main website's navigation
2. **Domain Setup**: Deploy to a subdomain like `clients.northheaddigital.com`
3. **Authentication**: Implement SSO with your main website's user system
4. **Branding**: Ensure consistent branding across both sites

## Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] File upload and sharing capabilities
- [ ] Advanced project analytics and reporting
- [ ] Mobile app development
- [ ] Integration with external project management tools
- [ ] Advanced security features (2FA, audit logs)
- [ ] Multi-language support
- [ ] Dark mode theme

## Support

For technical support or questions about this client portal, please contact the North Head Digital development team.

---

**North Head Digital Client Portal** - Professional project management for our valued clients.
