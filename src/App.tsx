import { useState } from 'react'
import './App.css'

interface Investment {
  category: string
  amount: number
  change: number
  icon: string
}

interface Recommendation {
  title: string
  description: string
  risk: 'Low' | 'Medium' | 'High'
}

const investments: Investment[] = [
  { category: 'Stocks', amount: 45230, change: 3.2, icon: '📈' },
  { category: 'Bonds', amount: 18500, change: -0.5, icon: '📊' },
  { category: 'Crypto', amount: 8750, change: 12.4, icon: '₿' },
  { category: 'Real Estate', amount: 120000, change: 1.8, icon: '🏠' },
]

const recommendations: Recommendation[] = [
  {
    title: 'Diversify with Index Funds',
    description: 'Consider adding S&P 500 index funds to balance your portfolio risk.',
    risk: 'Low',
  },
  {
    title: 'Crypto Rebalancing',
    description: 'Your crypto allocation is above 5%. Consider taking some profits.',
    risk: 'High',
  },
  {
    title: 'Bond Ladder Strategy',
    description: 'Build a bond ladder to manage interest rate risk and ensure liquidity.',
    risk: 'Low',
  },
]

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recommendations'>('dashboard')

  const totalPortfolio = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalChange = ((investments.reduce((sum, inv) => sum + inv.amount * (inv.change / 100), 0) / totalPortfolio) * 100).toFixed(2)

  return (
    <div className="app">
      <header className="header">
        <h1>💼 Investment Assistant</h1>
        <p className="subtitle">Your smart financial companion</p>
      </header>

      <nav className="nav">
        <button
          className={activeTab === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'recommendations' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('recommendations')}
        >
          Recommendations
        </button>
      </nav>

      {activeTab === 'dashboard' && (
        <main className="main">
          <section className="portfolio-summary">
            <h2>Portfolio Summary</h2>
            <div className="total-value">
              <span className="label">Total Value</span>
              <span className="value">${totalPortfolio.toLocaleString()}</span>
              <span className={`change ${parseFloat(totalChange) >= 0 ? 'positive' : 'negative'}`}>
                {parseFloat(totalChange) >= 0 ? '+' : ''}{totalChange}% overall
              </span>
            </div>
          </section>

          <section className="investments">
            <h2>Investment Categories</h2>
            <div className="investment-grid">
              {investments.map((inv) => (
                <div className="investment-card" key={inv.category}>
                  <div className="card-header">
                    <span className="icon">{inv.icon}</span>
                    <span className="category">{inv.category}</span>
                  </div>
                  <div className="card-amount">${inv.amount.toLocaleString()}</div>
                  <div className={`card-change ${inv.change >= 0 ? 'positive' : 'negative'}`}>
                    {inv.change >= 0 ? '▲' : '▼'} {Math.abs(inv.change)}%
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {activeTab === 'recommendations' && (
        <main className="main">
          <section className="recommendations">
            <h2>AI Recommendations</h2>
            <div className="recommendation-list">
              {recommendations.map((rec) => (
                <div className="recommendation-card" key={rec.title}>
                  <div className="rec-header">
                    <h3>{rec.title}</h3>
                    <span className={`risk-badge risk-${rec.risk.toLowerCase()}`}>{rec.risk} Risk</span>
                  </div>
                  <p>{rec.description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      <footer className="footer">
        <p>Investment Assistant © 2024 — Not financial advice</p>
      </footer>
    </div>
  )
}

export default App
