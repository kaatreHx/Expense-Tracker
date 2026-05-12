import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const exportToExcel = (transactions, categories, userEmail) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Prepare transactions data
    const transactionsData = transactions.map(transaction => ({
      'Date': new Date(transaction.date).toLocaleDateString('en-US'),
      'Description': transaction.note,
      'Category': transaction.categories?.name || 'Uncategorized',
      'Type': transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
      'Amount': transaction.amount,
      'Created At': new Date(transaction.created_at).toLocaleString('en-US')
    }))

    // Create transactions worksheet
    const transactionsWS = XLSX.utils.json_to_sheet(transactionsData)

    // Set column widths for transactions sheet
    transactionsWS['!cols'] = [
      { width: 12 }, // Date
      { width: 30 }, // Description
      { width: 15 }, // Category
      { width: 10 }, // Type
      { width: 12 }, // Amount
      { width: 20 }  // Created At
    ]

    // Add transactions sheet to workbook
    XLSX.utils.book_append_sheet(workbook, transactionsWS, 'Transactions')

    // Prepare summary data
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const summaryData = [
      { 'Metric': 'Total Income', 'Amount': totalIncome },
      { 'Metric': 'Total Expenses', 'Amount': totalExpenses },
      { 'Metric': 'Net Balance', 'Amount': totalIncome - totalExpenses },
      { 'Metric': 'Total Transactions', 'Amount': transactions.length },
      { 'Metric': '', 'Amount': '' }, // Empty row
      { 'Metric': 'Export Date', 'Amount': new Date().toLocaleString('en-US') },
      { 'Metric': 'User', 'Amount': userEmail }
    ]

    // Create summary worksheet
    const summaryWS = XLSX.utils.json_to_sheet(summaryData)
    summaryWS['!cols'] = [{ width: 20 }, { width: 15 }]
    XLSX.utils.book_append_sheet(workbook, summaryWS, 'Summary')

    // Prepare category breakdown data
    const categoryStats = {}
    transactions.forEach(transaction => {
      const categoryName = transaction.categories?.name || 'Uncategorized'
      
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = {
          'Category': categoryName,
          'Total Income': 0,
          'Total Expenses': 0,
          'Net Amount': 0,
          'Transaction Count': 0,
          'Percentage of Expenses': 0
        }
      }
      
      if (transaction.type === 'income') {
        categoryStats[categoryName]['Total Income'] += transaction.amount
      } else {
        categoryStats[categoryName]['Total Expenses'] += transaction.amount
      }
      
      categoryStats[categoryName]['Net Amount'] = 
        categoryStats[categoryName]['Total Income'] - categoryStats[categoryName]['Total Expenses']
      categoryStats[categoryName]['Transaction Count'] += 1
    })

    // Calculate percentages
    Object.values(categoryStats).forEach(category => {
      if (totalExpenses > 0) {
        category['Percentage of Expenses'] = 
          ((category['Total Expenses'] / totalExpenses) * 100).toFixed(2) + '%'
      }
    })

    const categoryData = Object.values(categoryStats)
      .sort((a, b) => b['Total Expenses'] - a['Total Expenses'])

    // Create category breakdown worksheet
    const categoryWS = XLSX.utils.json_to_sheet(categoryData)
    categoryWS['!cols'] = [
      { width: 20 }, // Category
      { width: 15 }, // Total Income
      { width: 15 }, // Total Expenses
      { width: 15 }, // Net Amount
      { width: 18 }, // Transaction Count
      { width: 20 }  // Percentage
    ]
    XLSX.utils.book_append_sheet(workbook, categoryWS, 'Category Breakdown')

    // Prepare monthly summary data
    const monthlyStats = {}
    transactions.forEach(transaction => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          'Month': monthName,
          'Income': 0,
          'Expenses': 0,
          'Net': 0,
          'Transactions': 0
        }
      }
      
      if (transaction.type === 'income') {
        monthlyStats[monthKey]['Income'] += transaction.amount
      } else {
        monthlyStats[monthKey]['Expenses'] += transaction.amount
      }
      
      monthlyStats[monthKey]['Net'] = monthlyStats[monthKey]['Income'] - monthlyStats[monthKey]['Expenses']
      monthlyStats[monthKey]['Transactions'] += 1
    })

    const monthlyData = Object.values(monthlyStats)
      .sort((a, b) => new Date(a.Month) - new Date(b.Month))

    // Create monthly summary worksheet
    if (monthlyData.length > 0) {
      const monthlyWS = XLSX.utils.json_to_sheet(monthlyData)
      monthlyWS['!cols'] = [
        { width: 20 }, // Month
        { width: 12 }, // Income
        { width: 12 }, // Expenses
        { width: 12 }, // Net
        { width: 15 }  // Transactions
      ]
      XLSX.utils.book_append_sheet(workbook, monthlyWS, 'Monthly Summary')
    }

    // Generate filename with current date
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD format
    const filename = `expense-tracker-${dateStr}.xlsx`

    // Write and save the file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, filename)

    return { success: true, filename }
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    return { success: false, error: error.message }
  }
}

export const exportCategoryData = (categoryStats, totalExpenses, userEmail) => {
  try {
    const workbook = XLSX.utils.book_new()

    // Prepare category data for export
    const categoryData = categoryStats.map(category => ({
      'Category': category.name,
      'Color': category.color,
      'Total Expenses': category.expenseAmount,
      'Total Income': category.incomeAmount,
      'Net Amount': category.incomeAmount - category.expenseAmount,
      'Transaction Count': category.transactionCount,
      'Percentage of Total Expenses': totalExpenses > 0 ? 
        ((category.expenseAmount / totalExpenses) * 100).toFixed(2) + '%' : '0%'
    }))

    const categoryWS = XLSX.utils.json_to_sheet(categoryData)
    categoryWS['!cols'] = [
      { width: 20 }, // Category
      { width: 10 }, // Color
      { width: 15 }, // Total Expenses
      { width: 15 }, // Total Income
      { width: 15 }, // Net Amount
      { width: 18 }, // Transaction Count
      { width: 25 }  // Percentage
    ]

    XLSX.utils.book_append_sheet(workbook, categoryWS, 'Category Analysis')

    // Add metadata
    const metaData = [
      { 'Info': 'Export Date', 'Value': new Date().toLocaleString('en-US') },
      { 'Info': 'User', 'Value': userEmail },
      { 'Info': 'Total Categories', 'Value': categoryStats.length },
      { 'Info': 'Total Expenses', 'Value': totalExpenses }
    ]

    const metaWS = XLSX.utils.json_to_sheet(metaData)
    metaWS['!cols'] = [{ width: 15 }, { width: 25 }]
    XLSX.utils.book_append_sheet(workbook, metaWS, 'Export Info')

    const filename = `category-analysis-${new Date().toISOString().split('T')[0]}.xlsx`
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, filename)

    return { success: true, filename }
  } catch (error) {
    console.error('Error exporting category data:', error)
    return { success: false, error: error.message }
  }
}