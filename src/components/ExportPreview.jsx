import { useState } from 'react'

const ExportPreview = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content export-preview-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📊 Excel Export Preview</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="export-preview-content">
          <p>Your Excel file will contain the following sheets:</p>
          
          <div className="preview-sheets">
            <div className="preview-sheet">
              <h4>📋 Transactions Sheet</h4>
              <div className="sheet-preview">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>12/15/2024</td>
                      <td>Lunch at restaurant</td>
                      <td>Food & Dining</td>
                      <td>Expense</td>
                      <td>25.50</td>
                      <td>12/15/2024 2:30 PM</td>
                    </tr>
                    <tr>
                      <td>12/14/2024</td>
                      <td>Salary payment</td>
                      <td>Income</td>
                      <td>Income</td>
                      <td>3000.00</td>
                      <td>12/14/2024 9:00 AM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="preview-sheet">
              <h4>📊 Summary Sheet</h4>
              <div className="sheet-preview">
                <table>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Income</td>
                      <td>5000.00</td>
                    </tr>
                    <tr>
                      <td>Total Expenses</td>
                      <td>1250.75</td>
                    </tr>
                    <tr>
                      <td>Net Balance</td>
                      <td>3749.25</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="preview-sheet">
              <h4>🏷️ Category Breakdown Sheet</h4>
              <div className="sheet-preview">
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Total Expenses</th>
                      <th>Transaction Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Food & Dining</td>
                      <td>450.00</td>
                      <td>12</td>
                      <td>36.0%</td>
                    </tr>
                    <tr>
                      <td>Transportation</td>
                      <td>280.00</td>
                      <td>8</td>
                      <td>22.4%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="preview-sheet">
              <h4>📅 Monthly Summary Sheet</h4>
              <div className="sheet-preview">
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Income</th>
                      <th>Expenses</th>
                      <th>Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>December 2024</td>
                      <td>5000.00</td>
                      <td>1250.75</td>
                      <td>3749.25</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="export-features">
            <h4>✨ Export Features:</h4>
            <ul>
              <li>📊 Complete transaction history with all details</li>
              <li>📈 Financial summary with totals and balances</li>
              <li>🏷️ Category-wise breakdown with percentages</li>
              <li>📅 Monthly summary for trend analysis</li>
              <li>🎨 Formatted columns with proper widths</li>
              <li>📱 Compatible with Excel, Google Sheets, and other spreadsheet apps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportPreview