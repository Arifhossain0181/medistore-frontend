
# Medistore Frontend

This is the frontend for the Medistore application, built with Next.js and TypeScript. It provides a modern, responsive interface for users, sellers, and administrators to interact with the Medistore platform.

## Features
- User authentication (login, register, role-based access)
- Admin dashboard for managing users, medicines, orders, and categories
- Seller dashboard for managing medicines and orders
- Customer dashboard for browsing products, managing cart, and placing orders
- Product browsing by category and search
- Shopping cart and checkout flow
- Order history and order details for customers
- Responsive design for desktop and mobile
- Modular and reusable UI components

## Getting Started
1. Install dependencies:
	```bash
	npm install
	```
2. Start the development server:
	```bash
	npm run dev
	```
3. Open https://medistore-frontend-nu.vercel.app

## Folder Structure
- `src/app/` - Application routes and pages (organized by user roles and features)
  - `admin/` - Admin-specific pages (dashboard, users, medicines, orders, categories)
  - `seller/` - Seller-specific pages (dashboard, medicines, orders)
  - `customer/` - Customer-specific pages (dashboard, orders, checkout)
  - `auth/` - Authentication pages (login, register)
  - `home/`, `shop/`, `cart/`, `checkout/` - Main user flows
- `src/components/` - UI components and layouts
  - `features/` - Feature-specific components (auth forms, seller forms)
  - `layouts/` - Layout and navigation components
  - `ui/` - Reusable UI elements (buttons, cards, inputs, etc.)
- `src/lib/` - API utilities and helper functions
- `src/store/` - State management (auth, cart)
- `src/types/` - TypeScript type definitions

## Development Notes
- Uses Next.js App Router and TypeScript for type safety
- State management is handled with custom stores in `src/store/`
- API calls are organized in `src/lib/api/`
- UI is built with modular components for easy reuse and maintenance
- Follows best practices for folder structure and code organization

## Requirements
- Node.js 18+
- npm 9+

## License
This project is for educational purposes.
