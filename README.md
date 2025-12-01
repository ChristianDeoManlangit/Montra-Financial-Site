# Montra - Financial Clarity Dashboard

**Montra** – The mantra for financial clarity: monitor your cash flow, track investments, and understand your complete financial picture.

## About Montra

Montra is a comprehensive financial management dashboard built with React that helps you track your finances with ease. Monitor multiple accounts, visualize your spending patterns, and make informed financial decisions.

## Features

✨ **Dashboard**
- View total balance at a glance
- Quick summary of accounts, wallets, and savings
- Latest transactions feed
- Visual expense distribution with pie charts

💳 **Account Management**
- Add, edit, and delete multiple accounts
- Support for different account types (Wallet, Savings, Credit, Investments)
- Hide/show balance for security
- Quick account overview on dashboard

📊 **Analytics**
- Pie chart showing distribution of funds
- Bar graph displaying account hierarchy
- Detailed wallet breakdown with percentages
- Visual insights into your financial portfolio

📝 **Transaction History**
- Complete transaction log with timestamps
- Track all account activities (additions, deletions, balance adjustments)
- Clear all transaction history if needed
- Transaction filtering by account and type

📱 **Responsive Design**
- Fully responsive layout for mobile, tablet, and desktop
- Sticky header for easy navigation while scrolling
- Mobile-optimized sidebar navigation
- Touch-friendly interface elements

💾 **Data Management**
- Save and load wallet states
- Export financial data as JSON backup
- Import previously saved data
- Local storage for persistent data

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ChristianDeoManlangit/Montra-Financial-Site.git
cd Montra-Financial-Site
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Available Scripts

### `npm start`
Runs the app in development mode. The page will reload when you make changes.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

## Technology Stack

- **React** - UI framework
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization (pie charts, bar graphs)
- **Lucide React** - Icon library
- **LocalStorage** - Data persistence

## Project Structure

```
src/
├── App.js           # Main application component
├── App.css          # Application styles
├── index.js         # React entry point
└── index.css        # Global styles
public/
├── index.html       # HTML template
├── logo.png         # Montra logo
└── manifest.json    # PWA manifest
```

## Usage

### Adding an Account
1. Click the "Add Account" button
2. Enter account details (name, type, initial balance, icon)
3. Click "Add Account" to create it

### Viewing Analytics
- Go to the Analytics tab to see pie chart and bar graph distributions
- View detailed breakdown of each account's balance and percentage

### Managing Transactions
- View all transactions in the Transaction History tab
- Clear transaction history with the "Remove All Records" button

### Backing Up Data
- Use "Export Data" to download a JSON backup of your wallets
- Use "Import Data" to restore a previously saved backup
- Use "Manage States" to save and load wallet snapshots

## Features in Detail

### Dashboard
The main landing page shows:
- Total balance overview with visibility toggle
- Quick stats: Number of accounts, total wallets, total savings
- Your top 3 accounts with "View All" option
- Latest 4 transactions
- Expense distribution pie chart

### Responsive Breakpoints
- **Mobile (<768px)**: Full-screen sidebar, 2-column summary grid with menu card
- **Tablet (768px-1024px)**: Full-screen sidebar with menu toggle, responsive layouts
- **Desktop (>1024px)**: Fixed sidebar, full dashboard view with all features

## Data Storage

All data is stored locally in your browser using localStorage:
- `wallets` - Your account data
- `savedStates` - Saved wallet configurations

Your financial data never leaves your device!

## Browser Support

Montra works best on modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

## License

This project is open source and available under the MIT License.

## Feedback & Support

For feedback, bug reports, or feature requests, please open an issue on the [GitHub repository](https://github.com/ChristianDeoManlangit/Montra-Financial-Site).

---

**Start managing your finances with Montra today!** 💰
