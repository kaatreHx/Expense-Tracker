import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'

const DatabaseTest = () => {
  const { user } = useAuth()
  const [testResults, setTestResults] = useState({})
  const [testing, setTesting] = useState(false)

  const runTests = async () => {
    setTesting(true)
    const results = {}

    try {
      // Test 1: Check user authentication
      results.auth = user ? '✅ User authenticated' : '❌ No user found'
      results.userId = user?.id || 'No user ID'

      // Test 2: Test categories table access
      try {
        const { data: categories, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id)
          .limit(1)

        results.categories = catError 
          ? `❌ Categories error: ${catError.message}` 
          : `✅ Categories accessible (${categories?.length || 0} found)`
      } catch (error) {
        results.categories = `❌ Categories exception: ${error.message}`
      }

      // Test 3: Test transactions table access
      try {
        const { data: transactions, error: transError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .limit(1)

        results.transactions = transError 
          ? `❌ Transactions error: ${transError.message}` 
          : `✅ Transactions accessible (${transactions?.length || 0} found)`
      } catch (error) {
        results.transactions = `❌ Transactions exception: ${error.message}`
      }

      // Test 4: Test profiles table access
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        results.profile = profileError 
          ? `❌ Profile error: ${profileError.message}` 
          : `✅ Profile accessible: ${profile?.full_name || 'No name'}`
      } catch (error) {
        results.profile = `❌ Profile exception: ${error.message}`
      }

      // Test 5: Test real-time connection
      try {
        const channel = supabase.channel('test_channel')
        results.realtime = '🔄 Testing real-time...'
        
        channel.subscribe((status) => {
          results.realtime = status === 'SUBSCRIBED' 
            ? '✅ Real-time working' 
            : `❌ Real-time status: ${status}`
          setTestResults({...results})
        })

        setTimeout(() => {
          supabase.removeChannel(channel)
        }, 3000)
      } catch (error) {
        results.realtime = `❌ Real-time exception: ${error.message}`
      }

    } catch (error) {
      results.general = `❌ General error: ${error.message}`
    }

    setTestResults(results)
    setTesting(false)
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      border: '2px solid #dee2e6',
      borderRadius: '8px',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
      zIndex: 2000,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h3>Database Connection Test</h3>
      
      <button 
        onClick={runTests} 
        disabled={testing}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: testing ? 'not-allowed' : 'pointer',
          marginBottom: '1rem'
        }}
      >
        {testing ? 'Testing...' : 'Run Database Tests'}
      </button>

      <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>
        {Object.entries(testResults).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '0.5rem' }}>
            <strong>{key}:</strong> {value}
          </div>
        ))}
      </div>

      {Object.keys(testResults).length > 0 && (
        <div style={{ marginTop: '1rem', fontSize: '12px', color: '#666' }}>
          <strong>Next Steps:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
            <li>If you see ❌ errors, check your Supabase configuration</li>
            <li>If tables don't exist, run the database schema setup</li>
            <li>If RLS errors, check your Row Level Security policies</li>
            <li>Check browser console for more detailed error messages</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default DatabaseTest