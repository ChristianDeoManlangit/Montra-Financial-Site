import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Eye,
  EyeOff,
  Plus,
  X,
  Edit2,
  Trash2,
  Save,
  TrendingUp,
  DollarSign,
  CreditCard,
  Download,
  Upload,
  Menu,
  ReceiptText,
  Settings,
  User,
  ArrowRight,
  Trash,
  AlertCircle,
} from "lucide-react";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
  "#f97316",
];

const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
  
  .animate-slideIn {
    animation: slideIn 0.4s ease-out;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.3s ease-out;
  }
`;
document.head.appendChild(style);

const WalletTracker = () => {
  // Initialize state with data from localStorage immediately (before render)
  const [wallets, setWallets] = useState(() => {
    try {
      const saved = localStorage.getItem("montra_wallets");
      console.log("🔄 Initial wallet load from localStorage:", saved);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("❌ Failed to load wallets:", e);
      return [];
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("montra_transactions");
      console.log("🔄 Initial transaction load from localStorage:", saved);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("❌ Failed to load transactions:", e);
      return [];
    }
  });

  const [savedStates, setSavedStates] = useState(() => {
    try {
      const saved = localStorage.getItem("montra_savedStates");
      console.log("🔄 Initial states load from localStorage:", saved);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("❌ Failed to load states:", e);
      return [];
    }
  });

  const [showBalances, setShowBalances] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSaveLoadModal, setShowSaveLoadModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [analyticsFilter, setAnalyticsFilter] = useState("All");
  const [accountsFilter, setAccountsFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stateName, setStateName] = useState("");
  const [newWallet, setNewWallet] = useState({
    name: "",
    type: "Wallet",
    balance: "",
    icon: "💳",
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [confirmModal, setConfirmModal] = useState({ show: false, action: null, targetId: null, message: "", title: "" });

  const icons = ["💳", "🏦", "💵", "💰", "📱", "🎯", "💎", "🏪", "🎨", "⭐"];

  // Save to localStorage IMMEDIATELY whenever wallets change
  useEffect(() => {
    try {
      localStorage.setItem("montra_wallets", JSON.stringify(wallets));
      console.log("✅ Wallets saved to localStorage:", wallets.length, "items");
    } catch (e) {
      console.error("❌ Failed to save wallets:", e);
    }
  }, [wallets]);

  // Save to localStorage IMMEDIATELY whenever transactions change
  useEffect(() => {
    try {
      localStorage.setItem("montra_transactions", JSON.stringify(transactions));
      console.log("✅ Transactions saved to localStorage:", transactions.length, "items");
    } catch (e) {
      console.error("❌ Failed to save transactions:", e);
    }
  }, [transactions]);

  // Save to localStorage IMMEDIATELY whenever states change
  useEffect(() => {
    try {
      localStorage.setItem("montra_savedStates", JSON.stringify(savedStates));
      console.log("✅ States saved to localStorage:", savedStates.length, "items");
    } catch (e) {
      console.error("❌ Failed to save states:", e);
    }
  }, [savedStates]);

  // Debug function
  const debugStorage = () => {
    const walletsData = localStorage.getItem("montra_wallets");
    const transactionsData = localStorage.getItem("montra_transactions");
    const statesData = localStorage.getItem("montra_savedStates");
    
    console.log("📊 === STORAGE DEBUG ===");
    console.log("📊 Raw wallets in localStorage:", walletsData);
    console.log("📊 Raw transactions in localStorage:", transactionsData);
    console.log("📊 Raw states in localStorage:", statesData);
    console.log("📊 Current state wallets:", wallets);
    console.log("📊 Current state transactions:", transactions);
    console.log("📊 Current state savedStates:", savedStates);
    
    alert(`📊 STORAGE DEBUG:\n\nWallets: ${wallets.length} items\nTransactions: ${transactions.length} items\nStates: ${savedStates.length} items\n\n✅ Check console (F12) for detailed info`);
  };

  const totalNetWorth = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  
  const getFilteredWallets = () => {
    if (analyticsFilter === "All") return wallets;
    if (analyticsFilter === "Wallets") return wallets.filter(w => w.type === "Wallet");
    if (analyticsFilter === "Loans") return wallets.filter(w => w.type === "Loan");
    if (analyticsFilter === "Credit") return wallets.filter(w => w.type === "Credit");
    if (analyticsFilter === "Investments") return wallets.filter(w => w.type === "Investments");
    return wallets;
  };

  const filteredWalletsForAnalytics = getFilteredWallets();
  const pieData = filteredWalletsForAnalytics.map((wallet) => ({
    name: wallet.name,
    value: wallet.balance,
    color: wallet.color,
  }));

  const handleAddWallet = () => {
    if (newWallet.name && newWallet.balance) {
      const wallet = {
        id: Date.now(),
        name: newWallet.name,
        type: newWallet.type,
        balance: parseFloat(newWallet.balance),
        icon: newWallet.icon,
        color: COLORS[wallets.length % COLORS.length],
      };
      setWallets([...wallets, wallet]);
      setNewWallet({ name: "", type: "Wallet", balance: "", icon: "💳" });
      setShowAddModal(false);
      setTransactions([...transactions, {
        id: Date.now(),
        type: "Added",
        walletName: wallet.name,
        icon: wallet.icon,
        amount: wallet.balance,
        date: new Date().toISOString(),
      }]);
    }
  };

  const handleDeleteWallet = (id) => {
    const walletToDelete = wallets.find((w) => w.id === id);
    if (walletToDelete) {
      setTransactions([...transactions, {
        id: Date.now(),
        type: "Deleted",
        walletName: walletToDelete.name,
        icon: walletToDelete.icon,
        amount: -walletToDelete.balance,
        date: new Date().toISOString(),
      }]);
    }
    setWallets(wallets.filter((w) => w.id !== id));
    setConfirmModal({ show: false, action: null, targetId: null, message: "", title: "" });
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    setConfirmModal({ show: false, action: null, targetId: null, message: "", title: "" });
  };

  const handleRemoveAllTransactions = () => {
    setTransactions([]);
    setConfirmModal({ show: false, action: null, targetId: null, message: "", title: "" });
  };

  const handleUpdateBalance = (id, newBalance) => {
    const walletToUpdate = wallets.find((w) => w.id === id);
    if (walletToUpdate) {
      const balanceDifference = parseFloat(newBalance) - walletToUpdate.balance;
      setTransactions([...transactions, {
        id: Date.now(),
        type: "Balance Adjustment",
        walletName: walletToUpdate.name,
        icon: walletToUpdate.icon,
        amount: balanceDifference,
        date: new Date().toISOString(),
      }]);
    }
    setWallets(wallets.map((w) => w.id === id ? { ...w, balance: parseFloat(newBalance) || 0 } : w));
    setEditingWallet(null);
  };

  const handleSaveState = () => {
    if (stateName.trim()) {
      const newState = {
        id: Date.now(),
        name: stateName,
        wallets: wallets,
        transactions: transactions,
        date: new Date().toISOString(),
      };
      const updatedStates = [...savedStates, newState];
      setSavedStates(updatedStates);
      setStateName("");
    }
  };

  const handleLoadState = (state) => {
    setWallets(state.wallets);
    if (state.transactions) {
      setTransactions(state.transactions);
    }
    setShowSaveLoadModal(false);
  };

  const handleDeleteState = (id) => {
    const updatedStates = savedStates.filter((s) => s.id !== id);
    setSavedStates(updatedStates);
  };

  const handleExportData = () => {
    const data = { wallets, transactions, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `montra-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.wallets) {
            setWallets(data.wallets);
          }
          if (data.transactions) {
            setTransactions(data.transactions);
          }
        } catch (error) {
          alert("Invalid file format");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmAction = () => {
    if (confirmModal.action === "deleteWallet") {
      handleDeleteWallet(confirmModal.targetId);
    } else if (confirmModal.action === "deleteTransaction") {
      handleDeleteTransaction(confirmModal.targetId);
    } else if (confirmModal.action === "removeAllTransactions") {
      handleRemoveAllTransactions();
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F3FF] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white flex-col border-r border-gray-200 p-6 fixed h-screen z-50">
        <div className="flex items-center gap-3 mb-10">
          <img src="/logo.png" alt="Montra" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-[#1E1E1E]">Montra</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab("dashboard")} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full text-left transition-all ${activeTab === "dashboard" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <DollarSign size={20} /> <span>Dashboard</span>
          </button>
          <button onClick={() => setActiveTab("accounts")} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full text-left transition-all ${activeTab === "accounts" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <CreditCard size={20} /> <span>Accounts</span>
          </button>
          <button onClick={() => setActiveTab("analytics")} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full text-left transition-all ${activeTab === "analytics" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <TrendingUp size={20} /> <span>Analytics</span>
          </button>
          <button onClick={() => setActiveTab("transaction")} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full text-left transition-all ${activeTab === "transaction" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <ReceiptText size={20} /> <span>Transaction History</span>
          </button>
        </nav>
        <div className="mt-8 pt-8 border-t border-gray-200 space-y-2">
          <button onClick={() => setShowSaveLoadModal(true)} className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full">
            <Save size={18} /> <span className="text-sm">Manage States</span>
          </button>
          <button onClick={handleExportData} className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full">
            <Download size={18} /> <span className="text-sm">Export Data</span>
          </button>
          <label className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full cursor-pointer">
            <Upload size={18} /> <span className="text-sm">Import Data</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed top-0 left-0 right-0 bottom-0 bg-white z-40 lg:hidden transition-transform overflow-y-auto flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Montra" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-[#1E1E1E]">Montra</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="p-6 space-y-2 flex-1">
          <button onClick={() => {setActiveTab("dashboard"); setSidebarOpen(false);}} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full text-left transition-all ${activeTab === "dashboard" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <DollarSign size={20} /> <span>Dashboard</span>
          </button>
          <button onClick={() => {setActiveTab("accounts"); setSidebarOpen(false);}} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full text-left transition-all ${activeTab === "accounts" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <CreditCard size={20} /> <span>Accounts</span>
          </button>
          <button onClick={() => {setActiveTab("analytics"); setSidebarOpen(false);}} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full text-left transition-all ${activeTab === "analytics" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <TrendingUp size={20} /> <span>Analytics</span>
          </button>
          <button onClick={() => {setActiveTab("transaction"); setSidebarOpen(false);}} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full text-left transition-all ${activeTab === "transaction" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <ReceiptText size={20} /> <span>Transaction History</span>
          </button>
        </nav>
        <div className="mt-auto pt-8 px-6 border-t border-gray-200 space-y-2">
          <button onClick={() => setShowSaveLoadModal(true)} className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full">
            <Save size={18} /> <span className="text-sm">Manage States</span>
          </button>
          <button onClick={handleExportData} className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full">
            <Download size={18} /> <span className="text-sm">Export Data</span>
          </button>
          <label className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full cursor-pointer">
            <Upload size={18} /> <span className="text-sm">Import Data</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 p-3 sm:p-6 flex justify-between items-center animate-fadeIn">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-[#1E1E1E]">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "accounts" && "Accounts"}
                {activeTab === "analytics" && "Analytics"}
                {activeTab === "transaction" && "Transaction History"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                {activeTab === "dashboard" && "Manage your finances"}
                {activeTab === "accounts" && "View and manage all your accounts"}
                {activeTab === "analytics" && "Visualize your financial data"}
                {activeTab === "transaction" && "See your transaction history"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><Settings size={20} className="text-[#1E1E1E]" /></button>
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
                <User size={24} className="text-white" />
              </div>
            </button>
            <button className="hidden lg:flex p-2 hover:bg-gray-100 rounded-full">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-3 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === "dashboard" && (
              <div className="space-y-3 sm:space-y-6 animate-fadeIn">
                <div className="space-y-3 sm:space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 lg:col-span-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                          <DollarSign className="text-indigo-600" size={32} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-1">Total Balance</p>
                          <h3 className="text-3xl font-bold text-[#1E1E1E]">{showBalances ? `₱${totalNetWorth.toLocaleString("en-US", {minimumFractionDigits: 2})}` : "₱••••••"}</h3>
                        </div>
                      </div>
                      <button onClick={() => setShowBalances(!showBalances)} className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                        {showBalances ? <Eye size={24} /> : <EyeOff size={24} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-3 lg:gap-6">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
                      <div className="p-1 sm:p-2 lg:p-3 bg-green-100 rounded-lg w-fit mb-1 sm:mb-3 lg:mb-3">
                        <TrendingUp className="text-green-600" size={14} />
                      </div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Accounts</p>
                      <h3 className="text-sm sm:text-lg lg:text-2xl font-bold text-[#1E1E1E]">{wallets.length}</h3>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
                      <div className="p-1 sm:p-2 lg:p-3 bg-purple-100 rounded-lg w-fit mb-1 sm:mb-3 lg:mb-3">
                        <CreditCard className="text-purple-600" size={14} />
                      </div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Wallets</p>
                      <h3 className="text-sm sm:text-lg lg:text-2xl font-bold text-[#1E1E1E] truncate">{showBalances ? `₱${wallets.filter(w => w.type === "Wallet").reduce((sum, w) => sum + w.balance, 0).toLocaleString("en-US", {minimumFractionDigits: 2})}` : "₱••••••"}</h3>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
                      <div className="p-1 sm:p-2 lg:p-3 bg-orange-100 rounded-lg w-fit mb-1 sm:mb-3 lg:mb-3">
                        <CreditCard className="text-orange-600" size={14} />
                      </div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Loans</p>
                      <h3 className="text-sm sm:text-lg lg:text-2xl font-bold text-[#1E1E1E] truncate">{showBalances ? `₱${wallets.filter(w => w.type === "Loan").reduce((sum, w) => sum + w.balance, 0).toLocaleString("en-US", {minimumFractionDigits: 2})}` : "₱••••••"}</h3>
                    </div>
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 hover:bg-indigo-50 transition-all bg-white shadow-sm">
                      <span className="text-lg sm:text-2xl lg:text-3xl text-indigo-500 mb-0.5">☰</span>
                      <span className="text-indigo-600 font-semibold text-center text-xs">More</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-[#1E1E1E]">Your Accounts</h3>
                      <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                        <Plus size={18} /> Add
                      </button>
                    </div>
                    {wallets.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">No accounts yet</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {wallets.slice(0, 3).map((wallet) => (
                          <div key={wallet.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{wallet.icon}</span>
                              <span className="font-semibold text-[#1E1E1E] text-sm">{wallet.name}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">{wallet.type}</p>
                            <p className="text-lg font-bold text-[#1E1E1E]">{showBalances ? `₱${wallet.balance.toLocaleString("en-US", {minimumFractionDigits: 2})}` : "₱••••"}</p>
                          </div>
                        ))}
                        {wallets.length > 3 && (
                          <button onClick={() => setActiveTab("accounts")} className="flex items-center justify-center gap-2 border-2 border-dashed border-indigo-300 rounded-xl p-4 hover:bg-indigo-50">
                            <span className="text-indigo-600 font-semibold">View All</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-[#1E1E1E]">Latest Transactions</h3>
                      <button onClick={() => setActiveTab("transaction")} className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all">
                        <ArrowRight size={18} />
                      </button>
                    </div>
                    {transactions.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">No transactions yet</p>
                    ) : (
                      <div className="space-y-3">
                        {transactions.slice(-4).reverse().map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{tx.icon}</span>
                              <div>
                                <p className="font-semibold text-[#1E1E1E] text-sm">{tx.type}</p>
                                <p className="text-xs text-gray-500">{tx.walletName}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>{tx.amount > 0 ? "+" : "-"}₱{Math.abs(tx.amount).toLocaleString("en-US", {minimumFractionDigits: 2})}</p>
                              <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#1E1E1E]">All Expenses</h3>
                    <button onClick={() => setActiveTab("analytics")} className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                  {wallets.length === 0 ? (
                    <p className="text-center text-gray-400 py-12">No wallets added</p>
                  ) : (
                    <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                      <div className="flex-1 flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart tabIndex={-1}>
                            <Pie data={wallets.map(w => ({ name: w.name, value: w.balance, color: w.color }))} cx="50%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" dataKey="value" paddingAngle={2}>
                              {wallets.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip formatter={(value) => `₱${value.toLocaleString("en-US", {minimumFractionDigits: 2})}`} />
                          </PieChart>
                        </ResponsiveContainer>
                        <p className="text-sm text-gray-500 font-medium mt-2">Distribution of Funds</p>
                      </div>
                      <div className="flex-1 space-y-2 max-h-64 overflow-y-auto">
                        {wallets.map((wallet) => (
                          <div key={wallet.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{backgroundColor: wallet.color}} />
                              <span className="text-[#1E1E1E] font-medium">{wallet.name}</span>
                            </div>
                            <span className="text-gray-600">₱{wallet.balance.toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
                            <span className="text-gray-400">{totalNetWorth > 0 ? ((wallet.balance / totalNetWorth) * 100).toFixed(1) : 0}%</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-[#1E1E1E]">
                          <span>Total Funds</span>
                          <span>₱{totalNetWorth.toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "accounts" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-fadeIn">
                <div className="flex flex-row justify-between items-center gap-4 mb-6">
                  <h3 className="text-xl font-bold text-[#1E1E1E]">All Accounts</h3>
                  <button onClick={() => setShowAddModal(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <Plus size={20} /> Add Account
                  </button>
                  <button onClick={() => setShowAddModal(true)} className="sm:hidden flex items-center justify-center p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <Plus size={20} />
                  </button>
                </div>

                {wallets.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["All", "Wallet", "Loan", "Credit", "Investments"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setAccountsFilter(type)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                          accountsFilter === type
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}

                {wallets.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">No accounts yet</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(accountsFilter === "All" ? wallets : wallets.filter(w => w.type === accountsFilter)).map((wallet, index) => (
                      <div key={wallet.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all" style={{animationDelay: `${index * 50}ms`}}>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-3xl">{wallet.icon}</span>
                          <div className="flex gap-1">
                            <button onClick={() => setEditingWallet(wallet.id)} className="p-1 bg-white hover:bg-gray-100 rounded"><Edit2 size={14} /></button>
                            <button onClick={() => setConfirmModal({ show: true, action: "deleteWallet", targetId: wallet.id, message: `Are you sure you want to delete "${wallet.name}"? This action cannot be undone.`, title: "Delete Account" })} className="p-1 bg-white hover:bg-red-50 text-red-600 rounded"><Trash2 size={14} /></button>
                          </div>
                        </div>
                        <h4 className="font-semibold text-[#1E1E1E] mb-1">{wallet.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{wallet.type}</p>
                        {editingWallet === wallet.id ? (
                          <div className="flex gap-2">
                            <input type="number" defaultValue={wallet.balance} className="flex-1 px-2 py-1 text-sm border rounded" onKeyDown={(e) => { if (e.key === "Enter") handleUpdateBalance(wallet.id, e.target.value); }} id={`balance-${wallet.id}`} />
                            <button onClick={() => { const input = document.getElementById(`balance-${wallet.id}`); handleUpdateBalance(wallet.id, input.value); }} className="px-2 py-1 bg-green-500 text-white rounded text-sm"><Save size={14} /></button>
                          </div>
                        ) : (
                          <p className="text-lg font-bold text-[#1E1E1E]">{showBalances ? `₱${wallet.balance.toLocaleString("en-US", {minimumFractionDigits: 2})}` : "₱••••"}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-wrap gap-2 mb-6">
                  {["All", "Wallets", "Loans", "Credit", "Investments"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setAnalyticsFilter(type)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        analyticsFilter === type
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-[#1E1E1E] mb-4">Pie Distribution</h3>
                  {filteredWalletsForAnalytics.length === 0 ? (
                    <p className="text-center text-gray-400 py-12">No data for selected filter</p>
                  ) : (
                    <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                      <div className="flex-1 flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart tabIndex={-1}>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={2}>
                              {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip formatter={(value) => `₱${value.toLocaleString("en-US", {minimumFractionDigits: 2})}`} />
                          </PieChart>
                        </ResponsiveContainer>
                        <p className="text-sm text-gray-500 font-medium mt-2">Distribution of Funds</p>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {filteredWalletsForAnalytics.map((wallet) => (
                            <div key={wallet.id} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: wallet.color}} />
                                <span className="text-[#1E1E1E] font-medium">{wallet.name}</span>
                              </div>
                              <div className="flex gap-4 items-center">
                                <span className="text-gray-600">₱{wallet.balance.toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
                                <span className="text-gray-400 w-12 text-right">{filteredWalletsForAnalytics.reduce((sum, w) => sum + w.balance, 0) > 0 ? ((wallet.balance / filteredWalletsForAnalytics.reduce((sum, w) => sum + w.balance, 0)) * 100).toFixed(1) : 0}%</span>
                              </div>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-[#1E1E1E] p-2">
                            <span>Total</span>
                            <span>₱{filteredWalletsForAnalytics.reduce((sum, w) => sum + w.balance, 0).toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-[#1E1E1E] mb-4">Bar Graph Distribution</h3>
                  {filteredWalletsForAnalytics.length === 0 ? (
                    <p className="text-center text-gray-400 py-12">No data for selected filter</p>
                  ) : (
                    <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                      <div className="flex-1 flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={filteredWalletsForAnalytics} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value) => `₱${value.toLocaleString("en-US", {minimumFractionDigits: 2})}`} />
                            <Bar dataKey="balance" radius={[8, 8, 0, 0]} fill="#6366f1">
                              {filteredWalletsForAnalytics.map((wallet, index) => (
                                <Cell key={`cell-${index}`} fill={wallet.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                        <p className="text-sm text-gray-500 font-medium mt-2">Hierarchy of Funds</p>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {filteredWalletsForAnalytics.map((wallet) => (
                            <div key={wallet.id} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: wallet.color}} />
                                <span className="text-[#1E1E1E] font-medium">{wallet.name}</span>
                              </div>
                              <span className="text-gray-600">₱{wallet.balance.toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-[#1E1E1E] p-2">
                            <span>Total</span>
                            <span>₱{filteredWalletsForAnalytics.reduce((sum, w) => sum + w.balance, 0).toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "transaction" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-fadeIn">
                <h3 className="text-xl font-bold text-[#1E1E1E] mb-4">Transaction History</h3>
                {transactions.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">No transactions</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {transactions.slice().reverse().map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 border-b border-gray-100 group">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{tx.icon}</span>
                            <div>
                              <p className="font-semibold text-[#1E1E1E]">{tx.type} ({tx.walletName})</p>
                              <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className={`font-bold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>{tx.amount > 0 ? "+" : "-"}₱{Math.abs(tx.amount).toLocaleString("en-US", {minimumFractionDigits: 2})}</p>
                            <button onClick={() => setConfirmModal({ show: true, action: "deleteTransaction", targetId: tx.id, message: "Are you sure you want to remove this transaction?", title: "Delete Transaction" })} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-red-600 rounded">
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setConfirmModal({ show: true, action: "removeAllTransactions", targetId: null, message: "Are you sure you want to remove all transaction history? This action cannot be undone.", title: "Clear All Transactions" })} className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-all">
                      Remove All Records
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-[#1E1E1E]">{confirmModal.title}</h3>
            </div>
            <p className="text-gray-600 mb-8">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal({ show: false, action: null, targetId: null, message: "", title: "" })} className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all">
                Cancel
              </button>
              <button onClick={handleConfirmAction} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#1E1E1E]">Add New Account</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Account Name</label>
                <input type="text" value={newWallet.name} onChange={(e) => setNewWallet({...newWallet, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g., My Wallet" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Account Type</label>
                <select value={newWallet.type} onChange={(e) => setNewWallet({...newWallet, type: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                  <option>Wallet</option>
                  <option>Loan</option>
                  <option>Credit</option>
                  <option>Investments</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Current Balance</label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-gray-500">₱</span>
                  <input type="number" value={newWallet.balance} onChange={(e) => setNewWallet({...newWallet, balance: e.target.value})} className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="0.00" step="0.01" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Icon</label>
                <div className="grid grid-cols-5 gap-2">
                  {icons.map((icon) => (
                    <button key={icon} onClick={() => setNewWallet({...newWallet, icon})} className={`text-2xl p-3 rounded-lg border-2 ${newWallet.icon === icon ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleAddWallet} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 mt-6">Add Account</button>
            </div>
          </div>
        </div>
      )}

      {/* Save/Load Modal */}
      {showSaveLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#1E1E1E]">Manage States</h3>
              <button onClick={() => setShowSaveLoadModal(false)} className="p-2 hover:bg-gray-100 rounded"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Save Current State</label>
                <div className="flex gap-2">
                  <input type="text" value={stateName} onChange={(e) => setStateName(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" placeholder="State name" />
                  <button onClick={handleSaveState} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#1E1E1E] mb-3">Saved States</h4>
                {savedStates.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">No saved states</p>
                ) : (
                  <div className="space-y-2">
                    {savedStates.map((state) => (
                      <div key={state.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-[#1E1E1E] text-sm">{state.name}</p>
                          <p className="text-xs text-gray-500">{new Date(state.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleLoadState(state)} className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">Load</button>
                          <button onClick={() => handleDeleteState(state.id)} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletTracker;
