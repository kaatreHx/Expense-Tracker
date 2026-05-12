# 💰 Expense Tracker - Real-time Personal Finance Manager

A modern, real-time expense tracking application built with React, Vite, and Supabase. Track your income and expenses with beautiful visualizations, custom categories, and instant synchronization across devices.

![Expense Tracker](https://img.shields.io/badge/React-19.2.5-blue)
![Vite](https://img.shields.io/badge/Vite-8.0.10-green)
![Supabase](https://img.shields.io/badge/Supabase-2.105.3-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🔐 **Authentication & Security**
- Secure user registration and login with Supabase Auth
- Row Level Security (RLS) for data isolation
- Auto-profile creation on signup
- Protected routes and session management

### 💸 **Transaction Management**
- **Income & Expense Tracking**: Full support for both incoming and outgoing transactions
- **Real-time Updates**: Instant synchronization across all devices and browser tabs
- **Custom Categories**: Create unlimited categories with custom colors
- **Smart Filtering**: Filter by transaction type (income/expense) and category
- **Advanced Sorting**: Sort by date, amount, or description

### 📊 **Analytics & Visualization**
- **Interactive Pie Chart**: Visual breakdown of expenses by category with hover details
- **Category Statistics**: Detailed breakdown with rankings and percentages
- **Financial Overview**: Real-time income, expenses, and net balance calculations
- **Top Spending Insights**: Identify your highest expense categories instantly

### 📈 **Excel Export Features**
- **Complete Data Export**: Export all transactions with full details
- **Multi-Sheet Workbooks**: Organized data across multiple Excel sheets
  - 📋 **Transactions Sheet**: Complete transaction history
  - 📊 **Summary Sheet**: Financial totals and key metrics
  - 🏷️ **Category Breakdown**: Detailed category analysis with percentages
  - 📅 **Monthly Summary**: Month-by-month financial trends
- **Professional Formatting**: Properly formatted columns and data types
- **Export Preview**: See exactly what your Excel file will contain before downloading

### 🎨 **User Experience**
- **Beautiful UI**: Modern, responsive design that works on all devices
- **Visual Indicators**: Clear distinction between income (green ↗) and expenses (red ↙)
- **Confirmation Dialogs**: User-friendly confirmations before deleting data
- **Real-time Notifications**: Visual feedback for all operations
- **Connection Status**: Live indicator showing real-time connection health

### 🛠️ **Developer Features**
- **Debug Tools**: Built-in database testing and debugging panel
- **Error Handling**: Comprehensive error messages and recovery options
- **Performance Optimized**: Efficient real-time subscriptions and state management
- **Chart Library**: Recharts integration for beautiful data visualization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kaatreHx/Expense-Tracker.git
   cd Expense-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Your `.env.local` file should contain:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   Your Supabase database should have these tables:
   - `profiles` - User profiles with auto-creation trigger
   - `categories` - Custom expense categories
   - `transactions` - Income and expense records
   
   ✅ **Already configured!** Your existing schema is perfect.

5. **Run the application**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Usage

### Getting Started
1. **Register** a new account or **login** with existing credentials
2. **Create Categories** using the "Manage Categories" button
3. **Add Transactions** - both income and expenses
4. **Filter & Sort** your transactions as needed
5. **Monitor Balance** with the real-time financial overview

### Real-time Features
- Open the app in multiple browser tabs to see real-time synchronization
- All changes (add, edit, delete) sync instantly across devices
- Connection status indicator shows real-time health

### Troubleshooting
- **🔧 Database Test**: Click the wrench icon to test database connectivity
- **🔄 Refresh**: Manual data refresh if needed
- **🐛 Debug Panel**: Click the bug icon to see real-time data counts
- **Console Logs**: Check browser developer tools for detailed error messages

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19, Vite 8
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: CSS3 with modern design patterns
- **Routing**: React Router DOM 7
- **State Management**: React Hooks + Context API
- **Charts**: Recharts for interactive data visualization
- **Export**: XLSX library for Excel file generation

### Database Schema
```sql
-- User profiles with auto-creation
profiles (id, full_name, avatar_url, created_at)

-- Custom categories with colors
categories (id, user_id, name, color, icon, created_at)

-- Income and expense transactions
transactions (id, user_id, category_id, amount, type, note, date, created_at)
```

### Real-time Architecture
- **Supabase Real-time**: WebSocket connections for instant updates
- **Event Handlers**: Separate handlers for INSERT, UPDATE, DELETE operations
- **State Synchronization**: Optimistic updates with real-time confirmation
- **Connection Management**: Automatic reconnection and status monitoring

## 🚀 Deployment

### Vercel (Recommended)
The project includes `vercel.json` configuration:

```bash
npm run build
vercel --prod
```

### Other Platforms
Build and deploy the `dist` folder:

```bash
npm run build
# Deploy the dist/ folder to your hosting platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the amazing backend-as-a-service
- [Vite](https://vitejs.dev/) for the lightning-fast build tool
- [React](https://reactjs.org/) for the powerful UI library

## 📞 Support

If you encounter any issues:

1. Check the [Setup Instructions](setup-instructions.md) for detailed troubleshooting
2. Use the built-in 🔧 database test tool
3. Check browser console for error messages
4. Open an issue on GitHub with detailed information

---

**Built with ❤️ for better personal finance management**