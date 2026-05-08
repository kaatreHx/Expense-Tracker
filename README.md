# Expense Tracker App

A modern expense tracking application built with React, Vite, and Supabase.

## Features

- **User Authentication**: Secure login and registration with Supabase Auth
- **Income & Expense Tracking**: Track both incoming and outgoing transactions
- **Custom Categories**: Create unlimited categories with custom colors
- **Transaction Management**: Add, view, and delete transactions
- **Filtering & Sorting**: Filter by type (income/expense) and category, sort by date, amount, or description
- **Financial Overview**: View total income, expenses, and net balance
- **Real-time Updates**: Instant updates with Supabase real-time features
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: CSS3 with modern design
- **Routing**: React Router DOM

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd budget-app
npm install
```

### 2. Database Setup

**Your database schema is already set up!** Your Supabase project includes:

- ✅ `profiles` table with user profiles
- ✅ `categories` table for expense categorization  
- ✅ `budgets` table for budget management
- ✅ `transactions` table for income/expense tracking
- ✅ Row Level Security (RLS) policies
- ✅ Auto-profile creation trigger

**No additional SQL setup required** - your existing schema is perfect for this expense tracker!

### 3. Environment Variables

Your `.env.local` file is already configured with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### Authentication
1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Auto-redirect**: Authenticated users are redirected to dashboard

### Dashboard
1. **Add Transactions**: Add income or expenses with description, amount, and category
2. **Transaction Types**: Choose between income (incoming) and expense (outgoing)
3. **Manage Categories**: Create custom categories with colors
4. **View Transactions**: See all your transactions in a clean, organized list
5. **Filter by Type**: Filter to show only income or expenses
6. **Filter by Category**: Filter transactions by category
7. **Sort**: Sort by date, amount, or description
8. **Delete**: Remove transactions you no longer need
9. **Financial Overview**: View total income, expenses, and net balance

### Categories
- **Custom Categories**: Create your own transaction categories with custom colors
- **Visual Organization**: Color-coded categories for easy identification
- **Flexible Usage**: Use categories for both income and expenses

## Database Schema

Your existing schema includes:

### `profiles` table
- `id`: User ID (references auth.users)
- `full_name`: User's full name
- `avatar_url`: Profile picture URL
- `created_at`: Profile creation timestamp

### `categories` table  
- `id`: Unique identifier (UUID)
- `user_id`: Reference to user profile
- `name`: Category name
- `color`: Category color (hex)
- `icon`: Category icon identifier
- `created_at`: Creation timestamp

### `transactions` table
- `id`: Unique identifier (UUID)
- `user_id`: Reference to user profile  
- `category_id`: Optional reference to category
- `amount`: Transaction amount (decimal)
- `type`: Transaction type (income/expense)
- `note`: Transaction description
- `date`: Transaction date
- `created_at`: Creation timestamp

**Note**: The `budgets` table exists in your schema but is not used in this implementation. The app focuses on income/expense tracking with categories.

## Security

- **Row Level Security (RLS)**: Users can only access their own expenses
- **Authentication**: Supabase handles secure user authentication
- **Data Validation**: Client and server-side validation for all inputs

## Deployment

### Vercel (Recommended)
The project includes `vercel.json` configuration for easy deployment:

```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
Build the project and deploy the `dist` folder:

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.