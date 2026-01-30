# Project Management System - Frontend

A modern, responsive React-based frontend application for a Role-Based Access Control (RBAC) project management system with a beautiful UI and dark mode support.

## 🚀 Features

### Core Functionality
- **Authentication**
  - Secure login with JWT
  - Invitation-based registration
  - Protected routes with role-based access
  - Persistent authentication state

- **User Management** (Admin Only)
  - Invite new users via email
  - Manage user roles (ADMIN, MANAGER, STAFF)
  - Update user status (ACTIVE, INACTIVE)
  - Search and pagination support

- **Project Management**
  - View all projects with pagination
  - Create new projects
  - Edit projects (Admin only)
  - Soft delete projects (Admin only)
  - Search and filter functionality

- **Dashboard**
  - Real-time statistics (Total Projects, Active Projects, Total Users)
  - Recent projects overview
  - Role-based data visualization

- **Profile Management**
  - Update personal information (name, email)
  - Change password securely
  - View account details

### UI/UX Features
- **Modern Design**
  - Clean and professional interface
  - Responsive layout for all devices
  - Smooth animations and transitions
  - Ant Design component library

- **Dark Mode**
  - System-wide theme toggle
  - Persistent theme preference
  - Optimized for both light and dark themes
  - Seamless switching

- **Accessibility**
  - Semantic HTML
  - Keyboard navigation support
  - ARIA labels and roles
  - High contrast text for readability

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Backend API** running (see backend README)

## 🛠️ Installation

1. **Navigate to frontend directory**
   ```bash
   cd project-management-system-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Application runs on `http://localhost:5173`

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```
Starts the Vite dev server with hot module replacement (HMR)

### Build for Production
```bash
npm run build
```
Creates optimized production build in the `dist` folder

### Preview Production Build
```bash
npm run preview
```
Preview the production build locally

### Lint Code
```bash
npm run lint
```
Run ESLint to check code quality

## 📁 Project Structure

```
src/
├── api/                    # API integration layer
│   ├── client.ts          # Axios instance with interceptors
│   └── services.ts        # API service methods (auth, user, project, dashboard)
├── components/            # Reusable components
│   ├── AdminLayout.tsx    # Main layout with sidebar and header
│   └── ProtectedRoute.tsx # Route protection wrapper
├── pages/                 # Page components
│   ├── DashboardPage.tsx         # Dashboard with statistics
│   ├── LoginPage.tsx             # Login page
│   ├── ProfilePage.tsx           # User profile management
│   ├── ProjectManagementPage.tsx # Project CRUD operations
│   ├── RegisterPage.tsx          # Invitation-based registration
│   └── UserManagementPage.tsx    # User management (Admin only)
├── routes/                # Routing configuration
│   └── index.tsx          # Main routes with protection
├── store/                 # Redux state management
│   ├── index.ts           # Store configuration
│   ├── authSlice.ts       # Authentication state
│   └── uiSlice.ts         # UI state (dark mode)
├── App.tsx                # Root component
├── main.tsx               # Application entry point
└── index.css              # Global styles and Tailwind directives
```

## 🎨 Design System

### Color Palette
- **Primary**: `#1677ff` (Blue) - Buttons, links, accents
- **Success**: `#52c41a` (Green) - Success messages, active status
- **Warning**: `#faad14` (Orange) - Warnings, pending status
- **Error**: `#ff4d4f` (Red) - Errors, delete actions
- **Text (Light)**: `#000000` / `#4a5568`
- **Text (Dark)**: `#ffffff` / `#e2e8f0`

### Typography
- **Font Family**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Font Sizes**: Responsive scale from 12px to 32px
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Components
- Built with **Ant Design v5**
- Custom **Tailwind CSS** utilities
- Glass-morphism effects for headers
- Smooth transitions and hover effects

## 🔐 User Roles & Permissions

| Role    | Dashboard | Projects (View) | Projects (Edit) | User Management | Profile |
|---------|-----------|-----------------|-----------------|-----------------|---------|
| ADMIN   | ✅        | ✅              | ✅              | ✅              | ✅      |
| MANAGER | ✅        | ✅              | ❌              | ❌              | ✅      |
| STAFF   | ✅        | ✅              | ❌              | ❌              | ✅      |

## 📱 Pages Overview

### Public Pages
- **Login** (`/login`)
  - Email and password authentication
  - Remember me functionality
  - Error handling with user feedback
  - Redirect to dashboard after login

- **Register** (`/register`)
  - Invitation token validation
  - User registration form
  - Password confirmation with validation
  - Auto-fill email and role from invite

### Protected Pages
- **Dashboard** (`/dashboard`)
  - Statistics cards (Total Projects, Active Projects, Total Users)
  - Recent projects table
  - Quick navigation

- **Projects** (`/projects`)
  - Project listing with search
  - Create/Edit/Delete (role-based)
  - Status management (ACTIVE, COMPLETED, ON_HOLD)
  - Pagination support

- **User Management** (`/users`) - **Admin Only**
  - User listing with search
  - Invite new users (generates unique link)
  - Role management (ADMIN, MANAGER, STAFF)
  - Status management (ACTIVE, INACTIVE)
  - Pagination support

- **Profile** (`/profile`)
  - Update personal information (name, email)
  - Change password with confirmation
  - View account details (role, status)

## 🔌 API Integration

The frontend communicates with the backend API using Axios with automatic JWT token injection:

```typescript
// Example API call
import { projectApi } from './api/services';

const { data } = await projectApi.getProjects(1, 'search-term');
```

### API Services
- **authApi** - Login, invite, register, validate invite
- **userApi** - Get users, update role/status, profile management
- **projectApi** - CRUD operations for projects
- **dashboardApi** - Dashboard statistics

### Axios Interceptors
- Automatically adds JWT token to requests
- Handles 401 errors (logout on unauthorized)
- Centralized error handling

## 🎯 State Management

Using **Redux Toolkit** for global state:

### Auth Slice (`authSlice.ts`)
- User information (name, email, role, status)
- Authentication token
- Login/Logout actions
- Persistent state (localStorage)

### UI Slice (`uiSlice.ts`)
- Dark mode preference
- Theme toggle action
- Persistent theme (localStorage)

## 🔒 Security Features

- **JWT Authentication** - Token stored in localStorage
- **Protected Routes** - Role-based access control
- **Automatic Token Injection** - Axios interceptors
- **XSS Prevention** - React's built-in protection
- **Input Validation** - Form validation with Ant Design
- **Secure Password Handling** - Never stored in state

## 📦 Technologies Used

### Core
- **React** 18.3.1 - UI library
- **TypeScript** 5.6.2 - Type safety
- **Vite** 6.0.11 - Build tool and dev server

### UI Framework
- **Ant Design** 5.23.6 - Component library
- **Tailwind CSS** 3.4.17 - Utility-first CSS
- **@ant-design/icons** 5.5.2 - Icon library

### State Management
- **Redux Toolkit** 2.5.0 - State management
- **React Redux** 9.2.0 - React bindings

### Routing
- **React Router DOM** 7.1.3 - Client-side routing

### HTTP Client
- **Axios** 1.7.9 - API requests with interceptors

## 🎨 Styling

### Tailwind Configuration
```javascript
{
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1677ff'
      }
    }
  }
}
```

### Global Styles
- Custom CSS variables for theming
- Glass-morphism utilities
- Dark mode support with `.dark` class
- Responsive breakpoints

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 📱 Responsive Design

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

All pages are fully responsive and tested on multiple devices.

## 🔧 Build Configuration

### Vite Config (`vite.config.ts`)
- React plugin with Fast Refresh
- Path aliases (if configured)
- Dependency optimization
- Build optimizations

### TypeScript Config
- **Strict mode** enabled
- **ES2020** target
- Path mapping support
- Type checking for all files

## 📊 Performance Optimizations

- ✅ Code splitting by route
- ✅ Lazy loading for heavy components
- ✅ Memoized components with React.memo
- ✅ Optimized bundle size
- ✅ Tree shaking
- ✅ Vite's fast HMR

## 🐛 Debugging

### Development Tools
- **React DevTools** - Component inspection
- **Redux DevTools** - State debugging
- **Vite HMR** - Hot Module Replacement

### Common Issues
1. **API Connection Error**: 
   - Check `VITE_API_URL` in `.env`
   - Ensure backend is running on correct port

2. **Authentication Issues**: 
   - Clear localStorage and re-login
   - Check JWT token expiration

3. **Dark Mode Not Working**: 
   - Check localStorage for `darkMode` key
   - Verify Tailwind dark mode configuration

## 📝 Environment Variables

| Variable        | Description              | Default                    | Required |
|-----------------|--------------------------|----------------------------|----------|
| VITE_API_URL    | Backend API base URL     | http://localhost:5000/api  | Yes      |

## 🚀 Deployment

### Build for Production
```bash
npm run build
```
The `dist` folder contains production-ready files.

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Environment Variables for Production
Set `VITE_API_URL` to your production backend URL.

## 🎯 Best Practices Implemented

- ✅ Component-based architecture
- ✅ Reusable utility functions
- ✅ Consistent naming conventions
- ✅ Type-safe code with TypeScript
- ✅ Responsive design patterns
- ✅ Accessibility standards (WCAG 2.1)
- ✅ Clean code principles
- ✅ DRY (Don't Repeat Yourself)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.



## 🙏 Acknowledgments

- React team for the amazing library
- Ant Design team for the beautiful components
- Tailwind CSS team for the utility-first framework
- Redux Toolkit team for simplified state management
- Vite team for the blazing-fast build tool


## 🔄 Version History

### v1.0.0 (2026-01-31)
- ✅ Authentication system (Login, Registration)
- ✅ User management (Admin only)
- ✅ Project management (CRUD operations)
- ✅ Dashboard with real-time statistics
- ✅ Dark mode support
- ✅ Profile management
- ✅ Role-based access control
- ✅ Responsive design
- ✅ Search and pagination

---