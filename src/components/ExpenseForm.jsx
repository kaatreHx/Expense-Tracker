import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'

const ExpenseForm = ({ onExpenseAdded, categories, onCategoriesUpdate }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    note: '',
    amount: '',
    category_id: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const createDefaultCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          user_id: user.id,
          name: 'General',
          color: '#6366f1',
          icon: 'tag'
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating default category:', error)
        return null
      }
      
      // Real-time subscription will handle adding to the list
      return data
    } catch (error) {
      console.error('Error:', error)
      return null
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.note || !formData.amount) {
      setError('Please fill in description and amount')
      return
    }

    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      setError('')
      setLoading(true)

      // If no categories exist, create a default one
      let categoryId = formData.category_id
      if (!categoryId && categories.length === 0) {
        const defaultCategory = await createDefaultCategory()
        if (defaultCategory) {
          categoryId = defaultCategory.id
        }
      }

      const transactionData = {
        user_id: user.id,
        note: formData.note,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category_id: categoryId || null,
        date: formData.date,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select(`
          *,
          categories (
            name,
            color,
            icon
          )
        `)
        .single()

      if (error) {
        setError(error.message)
      } else {
        // Reset form
        setFormData({
          note: '',
          amount: '',
          category_id: '',
          type: 'expense',
          date: new Date().toISOString().split('T')[0]
        })
        
        // Real-time subscription will handle adding to the list
        // Just notify parent for any immediate UI feedback
        onExpenseAdded(data)
      }
    } catch (error) {
      setError('Failed to add transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="expense-form">
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="note">Description *</label>
            <input
              type="text"
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="e.g., Lunch at restaurant"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Amount *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="expense">Expense (Outgoing)</option>
              <option value="income">Income (Incoming)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="category_id">Category</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <small style={{ color: '#666', fontSize: '0.8rem' }}>
                No categories yet. A default category will be created.
              </small>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Adding...' : `Add ${formData.type === 'income' ? 'Income' : 'Expense'}`}
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm