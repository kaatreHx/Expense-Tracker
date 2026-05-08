# Quick Setup Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup ✅ ALREADY DONE!

**Great news!** Your Supabase database is already perfectly set up with:

- ✅ `profiles` table with auto-creation trigger
- ✅ `categories` table for custom expense categories
- ✅ `budgets` table for budget management  
- ✅ `transactions` table for expense/income tracking
- ✅ Row Level Security (RLS) policies
- ✅ Proper foreign key relationships

**No additional database setup required!**

### 3. Run the App
```bash
npm run dev
```

### 4. Test the Real-time Features

1. **Register**: Go to `/register` and create a new account
2. **Login**: Sign in with your credentials  
3. **Check Connection**: Look for the green "Live" indicator in the header
4. **Troubleshoot if needed**: If you don't see data, click the 🔧 button to run database tests
5. **Add Categories**: Click "Manage Categories" to create categories
6. **Test Real-time**: Open the app in two browser tabs and see changes sync instantly!
7. **Edit Categories**: Click the ✏️ button to edit category names and colors
8. **Add Transactions**: Add both income and expenses
9. **Test Filtering**: Try filtering by type and category - updates are instant!
10. **Debug Panel**: Click the 🐛 button (bottom right) to see real-time data updates

## 🔧 Troubleshooting

### Can't See Any Data (Transactions/Categories)
1. **Run Database Test**: Click the 🔧 button in the header to test your database connection
2. **Check Console**: Open browser developer tools (F12) and check the Console tab for errors
3. **Refresh Data**: Click the 🔄 button in the header to manually refresh
4. **Check Authentication**: Make sure you're logged in (should see your email in header)
5. **Verify Database Setup**: Ensure your Supabase tables exist and RLS policies are correct

### Authentication Issues
- Check that your `.env.local` file has the correct Supabase credentials
- Verify the Supabase URL and anon key are correct
- Try logging out and logging back in

### Real-time Not Working
- **Check Connection Status**: Look for the status indicator in the header:
  - 🟢 **Live**: Real-time is working perfectly
  - 🟡 **Connecting...**: Still establishing connection
  - 🔴 **Offline**: Connection failed
- **Debug Panel**: Click the 🐛 button to see current data counts
- **Database Test**: Click the 🔧 button to test all database connections
- **Browser Console**: Check for any connection errors
- **Supabase Settings**: Ensure real-time is enabled in your project settings
- **Network**: Try refreshing the page to re-establish the connection

### Category Issues
- **Can't delete category**: This is normal if the category is being used by transactions
- **Category not showing**: Check the debug panel to see if categories are loaded
- **Edit not working**: Make sure you're clicking the ✏️ (edit) button, not the × (delete) button

### Transaction Issues
- **Transactions not updating**: Check the connection status indicator
- **Missing transactions**: Use the debug panel to verify transaction count
- **Slow updates**: Real-time should be instant - check your internet connection
- **Can't delete transaction**: Make sure you confirm the deletion in the dialog that appears

### User Experience
- **Confirmation Dialogs**: All delete operations now show detailed confirmation dialogs
- **Success Messages**: Green messages appear when operations complete successfully
- **Error Messages**: Red messages appear when operations fail with details
- **Category not showing**: Wait a moment for real-time sync, or refresh if needed
- **Edit not working**: Make sure you're clicking the ✏️ (edit) button, not the × (delete) button

### Build Issues
```bash
npm run build
```
Should complete without errors (already tested ✅)

## 📱 Features to Test

- [x] User registration and login with auto-profile creation
- [x] **Real-time category management** with instant updates
- [x] **Category editing** - update name and color of existing categories
- [x] **Smart category deletion** - prevents deletion of categories in use
- [x] **Confirmation dialogs** - user-friendly confirmations before deleting
- [x] Add income transactions (incoming money)
- [x] Add expense transactions (outgoing money)
- [x] **Real-time transaction updates** - see changes instantly
- [x] **Transaction deletion** with detailed confirmation dialogs
- [x] View transactions with type indicators (↗ income, ↙ expense)
- [x] Filter by transaction type (income/expense/all)
- [x] Filter by category (updates in real-time)
- [x] Sort by date/amount/description
- [x] Financial overview (income, expenses, net balance)
- [x] **Real-time notifications** when data updates
- [x] **Success/error messages** for all operations
- [x] Responsive design (mobile/desktop)
- [x] User data isolation (RLS)

## 🎯 Advanced Features

Your expense tracker includes:
- **Real-time Everything**: All changes sync instantly across the app
- **Smart Category Management**: Edit categories, prevent deletion of categories in use
- **Usage Tracking**: See how many transactions use each category
- **Income & Expense Tracking**: Full financial overview with net balance calculation
- **Custom Categories**: Create unlimited categories with custom colors for both income and expenses
- **Visual Indicators**: Clear visual distinction between income (green, ↗) and expenses (red, ↙)
- **Flexible Filtering**: Filter by transaction type and category
- **Profile Management**: Auto-created user profiles
- **Relational Data**: Proper foreign key relationships between tables

## 🚀 Next Steps

Your expense tracker is ready! You can now:
- Deploy to Vercel using the included `vercel.json`
- Add transaction editing functionality
- Implement recurring transactions
- Add charts and analytics for income vs expenses
- Create monthly/yearly financial reports
- Add expense categories with icons
- Implement budget tracking (schema already supports it!)
- Add data export functionality