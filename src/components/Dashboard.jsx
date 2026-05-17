import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import CategoryManager from './CategoryManager'
import RealtimeIndicator from './RealtimeIndicator'
import DebugPanel from './DebugPanel'
import ConfirmDialog from './ConfirmDialog'
import DatabaseTest from './DatabaseTest'
import CategoryPieChart from './CategoryPieChart'
import ExportPreview from './ExportPreview'
import { exportToExcel, exportCategoryData } from '../utils/excelExport'

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [realtimeUpdate, setRealtimeUpdate] = useState({ show: false, message: '' })
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, transaction: null })
  const [showDatabaseTest, setShowDatabaseTest] = useState(false)
  const [showCategoryStats, setShowCategoryStats] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [showExportPreview, setShowExportPreview] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference or default to false
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    if (!user?.id) {
      console.error('No user ID available')
      setRealtimeUpdate({ show: true, message: 'Authentication error - please refresh' })
      return
    }

    fetchTransactions()
    fetchCategories()
    
    // Set up real-time subscriptions
    const transactionsSubscription = supabase
      .channel('transactions_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Transaction change received!', payload)
          handleTransactionChange(payload)
        }
      )
      .subscribe((status) => {
        console.log('Transactions subscription status:', status)
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected')
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('error')
        }
      })

    const categoriesSubscription = supabase
      .channel('categories_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'categories',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Category change received!', payload)
          handleCategoryChange(payload)
        }
      )
      .subscribe((status) => {
        console.log('Categories subscription status:', status)
      })

    return () => {
      supabase.removeChannel(transactionsSubscription)
      supabase.removeChannel(categoriesSubscription)
    }
  }, [user])

  useEffect(() => {
    // Calculate totals
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    setTotalIncome(income)
    setTotalExpenses(expenses)
  }, [transactions])

  // Calculate category-wise statistics
  const getCategoryStats = () => {
    const categoryStats = {}
    
    transactions.forEach(transaction => {
      const categoryName = transaction.categories?.name || 'Uncategorized'
      const categoryColor = transaction.categories?.color || '#6b7280'
      
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = {
          name: categoryName,
          color: categoryColor,
          totalAmount: 0,
          incomeAmount: 0,
          expenseAmount: 0,
          transactionCount: 0
        }
      }
      
      categoryStats[categoryName].totalAmount += transaction.type === 'expense' ? transaction.amount : 0
      categoryStats[categoryName].incomeAmount += transaction.type === 'income' ? transaction.amount : 0
      categoryStats[categoryName].expenseAmount += transaction.type === 'expense' ? transaction.amount : 0
      categoryStats[categoryName].transactionCount += 1
    })
    
    // Convert to array and sort by total expense amount
    return Object.values(categoryStats)
      .sort((a, b) => b.expenseAmount - a.expenseAmount)
      .slice(0, 6) // Show top 6 categories
  }

  // Get top spending category for quick insight
  const getTopSpendingCategory = () => {
    const stats = getCategoryStats()
    return stats.length > 0 ? stats[0] : null
  }

  // Handle Excel export
  const handleExportToExcel = async () => {
    setExportLoading(true)
    try {
      const result = await exportToExcel(transactions, categories, user?.email)
      if (result.success) {
        setRealtimeUpdate({ show: true, message: `Exported to ${result.filename}` })
      } else {
        alert('Export failed: ' + result.error)
      }
    } catch (error) {
      alert('Export failed: ' + error.message)
    } finally {
      setExportLoading(false)
    }
  }

  // Handle category data export
  const handleExportCategoryData = async () => {
    setExportLoading(true)
    try {
      const categoryStats = getCategoryStats()
      const result = await exportCategoryData(categoryStats, totalExpenses, user?.email)
      if (result.success) {
        setRealtimeUpdate({ show: true, message: `Category data exported to ${result.filename}` })
      } else {
        alert('Export failed: ' + result.error)
      }
    } catch (error) {
      alert('Export failed: ' + error.message)
    } finally {
      setExportLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      console.log('Fetching transactions for user:', user?.id)
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            name,
            color,
            icon
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      console.log('Transactions query result:', { data, error })

      if (error) {
        console.error('Error fetching transactions:', error)
        setRealtimeUpdate({ show: true, message: 'Error loading transactions: ' + error.message })
      } else {
        setTransactions(data || [])
        console.log('Loaded transactions:', data?.length || 0)
      }
    } catch (error) {
      console.error('Error:', error)
      setRealtimeUpdate({ show: true, message: 'Failed to load transactions' })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories for user:', user?.id)
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      console.log('Categories query result:', { data, error })

      if (error) {
        console.error('Error fetching categories:', error)
        setRealtimeUpdate({ show: true, message: 'Error loading categories: ' + error.message })
      } else {
        setCategories(data || [])
        console.log('Loaded categories:', data?.length || 0)
      }
    } catch (error) {
      console.error('Error:', error)
      setRealtimeUpdate({ show: true, message: 'Failed to load categories' })
    }
  }

  const handleTransactionChange = async (payload) => {
    setRealtimeUpdate({ show: true, message: 'Transactions updated!' })
    
    if (payload.eventType === 'INSERT') {
      // Fetch the new transaction with category data
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            name,
            color,
            icon
          )
        `)
        .eq('id', payload.new.id)
        .single()

      if (!error && data) {
        setTransactions(prev => [data, ...prev.filter(t => t.id !== data.id)])
      }
    } else if (payload.eventType === 'UPDATE') {
      // Fetch the updated transaction with category data
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            name,
            color,
            icon
          )
        `)
        .eq('id', payload.new.id)
        .single()

      if (!error && data) {
        setTransactions(prev => prev.map(t => t.id === data.id ? data : t))
      }
    } else if (payload.eventType === 'DELETE') {
      setTransactions(prev => prev.filter(t => t.id !== payload.old.id))
    }
  }

  const handleCategoryChange = (payload) => {
    setRealtimeUpdate({ show: true, message: 'Categories updated!' })
    
    if (payload.eventType === 'INSERT') {
      setCategories(prev => [...prev, payload.new].sort((a, b) => a.name.localeCompare(b.name)))
    } else if (payload.eventType === 'UPDATE') {
      setCategories(prev => prev.map(c => c.id === payload.new.id ? payload.new : c).sort((a, b) => a.name.localeCompare(b.name)))
      // Also update transactions that reference this category
      setTransactions(prev => prev.map(t => {
        if (t.category_id === payload.new.id) {
          return {
            ...t,
            categories: {
              name: payload.new.name,
              color: payload.new.color,
              icon: payload.new.icon
            }
          }
        }
        return t
      }))
    } else if (payload.eventType === 'DELETE') {
      setCategories(prev => prev.filter(c => c.id !== payload.old.id))
      // Update transactions that referenced this category
      setTransactions(prev => prev.map(t => {
        if (t.category_id === payload.old.id) {
          return {
            ...t,
            categories: null
          }
        }
        return t
      }))
    }
  }

  const addTransaction = (newTransaction) => {
    // Real-time subscription will handle adding to the list
    // This is just for immediate feedback if needed
    console.log('Transaction added:', newTransaction)
  }

  const addCategory = (newCategory) => {
    // Real-time subscription will handle adding to the list
    console.log('Category added:', newCategory)
  }

  const updateCategory = (updatedCategory) => {
    // Real-time subscription will handle updating the list
    console.log('Category updated:', updatedCategory)
  }

  const deleteTransaction = async (id) => {
    // Find the transaction to show details in confirmation
    const transaction = transactions.find(t => t.id === id)
    
    if (!transaction) {
      alert('Transaction not found')
      return
    }

    setConfirmDialog({ isOpen: true, transaction })
  }

  const confirmDeleteTransaction = async () => {
    const { transaction } = confirmDialog
    
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transaction.id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting transaction:', error)
        alert('Failed to delete transaction: ' + error.message)
      } else {
        setRealtimeUpdate({ show: true, message: 'Transaction deleted!' })
      }
      // Real-time subscription will handle removing from the list
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to delete transaction')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Expense Tracker</h1>
          <div className="user-info">
            <div className="connection-status">
              <span className={`status-indicator ${connectionStatus}`}></span>
              <span className="status-text">
                {connectionStatus === 'connected' ? 'Live' : 
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
              </span>
            </div>
            <button 
              onClick={toggleDarkMode}
              className="dark-mode-toggle"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="icon">
                {isDarkMode ? '☀️' : '🌙'}
              </span>
            </button>
            <button 
              onClick={() => setShowDatabaseTest(true)}
              className="test-btn"
              title="Test database connection"
            >
              🔧
            </button>
            <button 
              onClick={() => {
                fetchTransactions()
                fetchCategories()
              }}
              className="refresh-btn"
              title="Refresh data"
            >
              🔄
            </button>
            <button 
              onClick={handleExportToExcel}
              disabled={exportLoading || transactions.length === 0}
              className="export-btn"
              title="Export all data to Excel"
            >
              {exportLoading ? '⏳' : '📊'} Excel
            </button>
            <button 
              onClick={() => setShowExportPreview(true)}
              className="preview-btn"
              title="Preview Excel export format"
            >
              👁️ Preview
            </button>
            <button 
              onClick={() => setShowCategoryManager(true)}
              className="manage-btn"
            >
              Manage Categories
            </button>
            <span>Welcome, {user?.email}</span>
            <button onClick={handleSignOut} className="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-stats">
          <div className="stat-card income">
            <h3>Total Income</h3>
            <p className="stat-amount income">NPR {totalIncome.toFixed(2)}</p>
          </div>
          <div className="stat-card expense">
            <h3>Total Expenses</h3>
            <p className="stat-amount expense">NPR {totalExpenses.toFixed(2)}</p>
          </div>
          <div className="stat-card balance">
            <h3>Net Balance</h3>
            <p className={`stat-amount ${totalIncome - totalExpenses >= 0 ? 'positive' : 'negative'}`}>
              NPR {(totalIncome - totalExpenses).toFixed(2)}
            </p>
          </div>
          <div className="stat-card">
            <h3>Total Transactions</h3>
            <p className="stat-count">{transactions.length}</p>
          </div>
          {getTopSpendingCategory() && (
            <div className="stat-card top-category">
              <h3>Top Spending</h3>
              <div className="top-category-info">
                <div className="category-name-with-dot">
                  <span 
                    className="category-color-dot"
                    style={{ backgroundColor: getTopSpendingCategory().color }}
                  ></span>
                  <span className="category-name">{getTopSpendingCategory().name}</span>
                </div>
                <p className="stat-amount expense">NPR {getTopSpendingCategory().expenseAmount.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Category Statistics */}
        {transactions.length > 0 && (
          <div className="category-stats-section">
            <div className="category-stats-header">
              <h2>Spending by Category</h2>
              <div className="stats-controls">
                <button 
                  onClick={handleExportCategoryData}
                  disabled={exportLoading}
                  className="export-category-btn"
                  title="Export category analysis to Excel"
                >
                  {exportLoading ? '⏳' : '📈'} Export
                </button>
                <button 
                  onClick={() => setShowCategoryStats(!showCategoryStats)}
                  className="toggle-stats-btn"
                  title={showCategoryStats ? 'Hide category stats' : 'Show category stats'}
                >
                  {showCategoryStats ? '📊 Hide' : '📊 Show'}
                </button>
              </div>
            </div>
            
            {showCategoryStats && (
              <div className="category-stats-content">
                {/* Pie Chart Section */}
                <div className="pie-chart-section">
                  <h3>Expense Distribution</h3>
                  <CategoryPieChart 
                    categoryStats={getCategoryStats()} 
                    totalExpenses={totalExpenses}
                  />
                </div>

                {/* Category Cards Grid */}
                <div className="category-stats-grid">
                  {getCategoryStats().map((category, index) => (
                    <div key={category.name} className="category-stat-card">
                      <div className="category-stat-header">
                        <div className="category-info">
                          <span 
                            className="category-color-dot"
                            style={{ backgroundColor: category.color }}
                          ></span>
                          <span className="category-name">{category.name}</span>
                        </div>
                        <span className="category-rank">#{index + 1}</span>
                      </div>
                      
                      <div className="category-amounts">
                        {category.expenseAmount > 0 && (
                          <div className="amount-row expense">
                            <span className="amount-label">Expenses:</span>
                            <span className="amount-value">NPR {category.expenseAmount.toFixed(2)}</span>
                          </div>
                        )}
                        {category.incomeAmount > 0 && (
                          <div className="amount-row income">
                            <span className="amount-label">Income:</span>
                            <span className="amount-value">NPR {category.incomeAmount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="category-meta">
                        <span className="transaction-count">
                          {category.transactionCount} transaction{category.transactionCount !== 1 ? 's' : ''}
                        </span>
                        {totalExpenses > 0 && category.expenseAmount > 0 && (
                          <span className="expense-percentage">
                            {((category.expenseAmount / totalExpenses) * 100).toFixed(1)}% of expenses
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {getCategoryStats().length === 0 && (
              <div className="empty-category-stats">
                <p>No category data available. Add some transactions to see category breakdown!</p>
              </div>
            )}
          </div>
        )}

        <div className="dashboard-content">
          <div className="expense-form-section">
            <h2>Add New Transaction</h2>
            <ExpenseForm 
              onExpenseAdded={addTransaction} 
              categories={categories}
              onCategoriesUpdate={addCategory}
            />
          </div>

          <div className="expense-list-section">
            <h2>Recent Transactions</h2>
            {loading ? (
              <div className="loading">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="empty-state">
                <h3>No transactions yet</h3>
                <p>Add your first transaction using the form on the left!</p>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                  <p>If you're expecting to see transactions:</p>
                  <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                    <li>Check the 🔧 database test button in the header</li>
                    <li>Try the 🔄 refresh button</li>
                    <li>Check browser console for errors</li>
                  </ul>
                </div>
              </div>
            ) : (
              <ExpenseList 
                expenses={transactions} 
                onDeleteExpense={deleteTransaction}
                categories={categories}
              />
            )}
          </div>
        </div>
      </main>

      {showCategoryManager && (
        <CategoryManager 
          onClose={() => setShowCategoryManager(false)}
          categories={categories}
          onCategoryAdded={addCategory}
          onCategoryUpdated={updateCategory}
          transactions={transactions}
        />
      )}

      <RealtimeIndicator 
        message={realtimeUpdate.message}
        show={realtimeUpdate.show}
      />

      <DebugPanel 
        transactions={transactions}
        categories={categories}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, transaction: null })}
        onConfirm={confirmDeleteTransaction}
        title="Delete Transaction"
        message={confirmDialog.transaction ? 
          `Are you sure you want to delete "${confirmDialog.transaction.note}" - $${confirmDialog.transaction.amount} (${confirmDialog.transaction.type})?` : 
          'Are you sure you want to delete this transaction?'
        }
        confirmText="Delete"
        type="danger"
      />

      {showDatabaseTest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1999
        }} onClick={() => setShowDatabaseTest(false)}>
          <DatabaseTest />
        </div>
      )}

      <ExportPreview 
        isOpen={showExportPreview}
        onClose={() => setShowExportPreview(false)}
      />
    </div>
  )
}

export default Dashboard