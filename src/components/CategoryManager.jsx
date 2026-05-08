import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import ConfirmDialog from './ConfirmDialog'

const CategoryManager = ({ onClose, categories, onCategoryAdded, onCategoryUpdated, transactions }) => {
  const { user } = useAuth()
  const [newCategory, setNewCategory] = useState({ name: '', color: '#6366f1', icon: 'tag' })
  const [editingCategory, setEditingCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, category: null })

  const addCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.name.trim()) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          user_id: user.id,
          name: newCategory.name.trim(),
          color: newCategory.color,
          icon: newCategory.icon
        }])
        .select()
        .single()

      if (error) {
        setError(error.message)
      } else {
        // Real-time subscription will handle adding to the list
        setNewCategory({ name: '', color: '#6366f1', icon: 'tag' })
        setError('')
        // Show success message briefly
        setError('Category added successfully!')
        setTimeout(() => setError(''), 2000)
      }
    } catch (error) {
      setError('Failed to add category')
    } finally {
      setLoading(false)
    }
  }

  const updateCategory = async (e) => {
    e.preventDefault()
    if (!editingCategory.name.trim()) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: editingCategory.name.trim(),
          color: editingCategory.color,
          icon: editingCategory.icon
        })
        .eq('id', editingCategory.id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        setError(error.message)
      } else {
        // Real-time subscription will handle updating the list
        setEditingCategory(null)
        setError('')
        // Show success message briefly
        setError('Category updated successfully!')
        setTimeout(() => setError(''), 2000)
      }
    } catch (error) {
      setError('Failed to update category')
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (id) => {
    // Check if category is in use
    const isInUse = transactions.some(transaction => transaction.category_id === id)
    
    if (isInUse) {
      const usageCount = getCategoryUsageCount(id)
      setError(`Cannot delete category that is being used by ${usageCount} transaction${usageCount !== 1 ? 's' : ''}. Please update or delete those transactions first.`)
      return
    }

    // Find the category to show details in confirmation
    const category = categories.find(c => c.id === id)
    
    if (!category) {
      setError('Category not found')
      return
    }

    setConfirmDialog({ isOpen: true, category })
  }

  const confirmDeleteCategory = async () => {
    const { category } = confirmDialog
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id)
        .eq('user_id', user.id)

      if (error) {
        setError('Failed to delete category: ' + error.message)
      } else {
        // Real-time subscription will handle removing from the list
        setError('')
      }
    } catch (error) {
      setError('Failed to delete category')
    }
  }

  const startEditing = (category) => {
    setEditingCategory({ ...category })
    setError('')
  }

  const cancelEditing = () => {
    setEditingCategory(null)
    setError('')
  }

  const getCategoryUsageCount = (categoryId) => {
    return transactions.filter(transaction => transaction.category_id === categoryId).length
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manage Categories</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {error && (
          <div className={`message ${error.includes('successfully') ? 'success-message' : 'error-message'}`}>
            {error}
          </div>
        )}

        <div className="manager-sections">
          {/* Categories Section */}
          <div className="manager-section full-width">
            <h3>Categories</h3>
            
            {/* Add New Category Form */}
            <form onSubmit={addCategory} className="add-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Category name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  required
                />
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                />
                <button type="submit" disabled={loading}>Add Category</button>
              </div>
            </form>

            {/* Edit Category Form */}
            {editingCategory && (
              <form onSubmit={updateCategory} className="edit-form">
                <h4>Edit Category</h4>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Category name"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    required
                  />
                  <input
                    type="color"
                    value={editingCategory.color}
                    onChange={(e) => setEditingCategory({...editingCategory, color: e.target.value})}
                  />
                  <button type="submit" disabled={loading}>Update</button>
                  <button type="button" onClick={cancelEditing} className="cancel-btn">Cancel</button>
                </div>
              </form>
            )}

            <div className="items-list">
              {categories.map(category => {
                const usageCount = getCategoryUsageCount(category.id)
                const isInUse = usageCount > 0
                
                return (
                  <div key={category.id} className="item">
                    <div className="item-info">
                      <span 
                        className="color-indicator" 
                        style={{ backgroundColor: category.color }}
                      ></span>
                      <div className="category-details">
                        <span className="category-name">{category.name}</span>
                        {isInUse && (
                          <span className="usage-count">
                            Used in {usageCount} transaction{usageCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button 
                        onClick={() => startEditing(category)}
                        className="edit-btn"
                        title="Edit category"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => deleteCategory(category.id)}
                        className={`delete-btn-small ${isInUse ? 'disabled' : ''}`}
                        title={isInUse ? 'Cannot delete - category is in use' : 'Delete category'}
                        disabled={isInUse}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )
              })}
              {categories.length === 0 && (
                <p className="empty-message">No categories yet. Create your first category above!</p>
              )}
            </div>
          </div>
        </div>

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ isOpen: false, category: null })}
          onConfirm={confirmDeleteCategory}
          title="Delete Category"
          message={confirmDialog.category ? 
            `Are you sure you want to delete the category "${confirmDialog.category.name}"? This action cannot be undone.` : 
            'Are you sure you want to delete this category?'
          }
          confirmText="Delete"
          type="danger"
        />
      </div>
    </div>
  )
}

export default CategoryManager