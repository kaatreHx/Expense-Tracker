import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const CategoryPieChart = ({ categoryStats, totalExpenses }) => {
  // Prepare data for pie chart
  const pieData = categoryStats
    .filter(category => category.expenseAmount > 0)
    .map(category => ({
      name: category.name,
      value: category.expenseAmount,
      color: category.color,
      percentage: ((category.expenseAmount / totalExpenses) * 100).toFixed(1)
    }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="pie-tooltip">
          <div className="tooltip-header">
            <span 
              className="tooltip-color-dot"
              style={{ backgroundColor: data.color }}
            ></span>
            <span className="tooltip-category">{data.name}</span>
          </div>
          <div className="tooltip-content">
            <p className="tooltip-amount">${data.value.toFixed(2)}</p>
            <p className="tooltip-percentage">{data.percentage}% of expenses</p>
          </div>
        </div>
      )
    }
    return null
  }

  // Custom label function
  const renderLabel = (entry) => {
    if (parseFloat(entry.percentage) < 5) return '' // Hide labels for small slices
    return `${entry.percentage}%`
  }

  if (pieData.length === 0) {
    return (
      <div className="pie-chart-empty">
        <p>No expense data available for chart</p>
      </div>
    )
  }

  return (
    <div className="pie-chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color, fontSize: '12px' }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryPieChart