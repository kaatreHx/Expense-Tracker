import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'

const ExpenseList = ({ expenses, onDeleteExpense, categories }) => {
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const filteredExpenses = expenses.filter(expense => {
    const categoryMatch = filter === 'all' || expense.category_id === filter
    const typeMatch = typeFilter === 'all' || expense.type === typeFilter
    return categoryMatch && typeMatch
  })

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date)
      case 'amount':
        return b.amount - a.amount
      case 'note':
        return a.note.localeCompare(b.note)
      default:
        return 0
    }
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryInfo = (expense) => {
    if (expense.categories) {
      return {
        name: expense.categories.name,
        color: expense.categories.color || '#6366f1',
        icon: expense.categories.icon || 'tag'
      }
    }
    return {
      name: 'Uncategorized',
      color: '#6b7280',
      icon: 'tag'
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions yet. Add your first transaction above!</p>
      </div>
    )
  }

  return (
    <div className="expense-list">
      <div className="list-controls">
        <div className="filter-group">
          <label htmlFor="typeFilter">Filter by type:</label>
          <select
            id="typeFilter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter">Filter by category:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-group">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="note">Description</option>
          </select>
        </div>
      </div>

      <div className="expense-items">
        {sortedExpenses.map(expense => {
          const categoryInfo = getCategoryInfo(expense)
          return (
            <div key={expense.id} className={`expense-item ${expense.type}`}>
              <div className="expense-info">
                <div className="expense-header">
                  <h4 className="expense-title">{expense.note}</h4>
                  <div className="amount-container">
                    <span className={`expense-type ${expense.type}`}>
                      {expense.type === 'income' ? '↗' : '↙'} {expense.type}
                    </span>
                    <span className={`expense-amount ${expense.type}`}>
                      {expense.type === 'income' ? '+' : '-'}NPR {expense.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="expense-details">
                  <span 
                    className="expense-category"
                    style={{ backgroundColor: categoryInfo.color }}
                  >
                    {categoryInfo.name}
                  </span>
                  <span className="expense-date">{formatDate(expense.date)}</span>
                </div>
              </div>
              
              <button
                onClick={() => onDeleteExpense(expense.id)}
                className="delete-btn"
                title="Delete transaction"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>

      <div className="list-summary">
        <p>
          Showing {sortedExpenses.length} of {expenses.length} transactions
          {typeFilter !== 'all' && ` (${typeFilter} only)`}
          {filter !== 'all' && categories.find(c => c.id === filter) && 
            ` in ${categories.find(c => c.id === filter).name}`}
        </p>
      </div>
    </div>
  )
}

export default ExpenseList