import React from "react";
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Lock,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle,
  Smartphone,
} from "lucide-react";

export default function LandingPage({ onGetStarted }) {
  const features = [
    {
      icon: DollarSign,
      title: "Multi-Account Support",
      description: "Manage wallets, savings accounts, credit cards, loans, and investments all in one place.",
      color: "indigo",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Track your net worth, visualize spending patterns, and get instant insights into your finances.",
      color: "purple",
    },
    {
      icon: BarChart3,
      title: "Beautiful Charts",
      description: "Interactive pie charts and bar graphs make understanding your finances easy and intuitive.",
      color: "blue",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Your financial data is encrypted and stored securely. Only you have access to your information.",
      color: "green",
    },
    {
      icon: Zap,
      title: "Fast & Responsive",
      description: "Lightning-fast performance with a beautiful, responsive design that works on all devices.",
      color: "orange",
    },
    {
      icon: Globe,
      title: "Data Backup",
      description: "Export and import your financial data anytime. Never lose your information with automatic backups.",
      color: "pink",
    },
  ];

  const benefits = [
    "Track unlimited accounts and wallets",
    "Visualize your wealth distribution",
    "Monitor investments and loans",
    "Transfer funds between accounts",
    "Freeze accounts temporarily",
    "Pin favorite accounts to dashboard",
    "Complete transaction history",
    "Export financial reports",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white bg-opacity-80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Montra" className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#1E1E1E]">Montra</h1>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeIn">
            <h2 className="text-5xl sm:text-6xl font-bold text-[#1E1E1E] mb-6 leading-tight">
              Take Control of Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Finances</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Montra is your personal wallet tracker that helps you manage multiple accounts, track investments, and visualize your financial health with beautiful charts and real-time insights. 100% Free. 100% Yours.
            </p>
            <div className="flex gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg flex items-center gap-2 active:scale-95 animate-slideIn"
              >
                Get Started Free <ArrowRight size={20} />
              </button>
              <button className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all active:scale-95 animate-slideIn" style={{animationDelay: "0.1s"}}>
                Learn More
              </button>
            </div>
          </div>
          <div className="animate-slideIn" style={{animationDelay: "0.2s"}}>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 flex items-center justify-center h-80">
                <div className="text-center">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <DollarSign size={48} className="text-white" />
                  </div>
                  <p className="text-gray-600 text-lg font-semibold">Smart Finance Management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fadeIn">
          <h3 className="text-4xl font-bold text-[#1E1E1E] mb-4">Powerful Features</h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Everything you need to take full control of your financial life</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const colorClasses = {
              indigo: "bg-indigo-100 text-indigo-600",
              purple: "bg-purple-100 text-purple-600",
              blue: "bg-blue-100 text-blue-600",
              green: "bg-green-100 text-green-600",
              orange: "bg-orange-100 text-orange-600",
              pink: "bg-pink-100 text-pink-600",
            };
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slideIn group"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`w-12 h-12 ${colorClasses[feature.color]} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <h4 className="text-xl font-bold text-[#1E1E1E] mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fadeIn">
          <h3 className="text-4xl font-bold text-[#1E1E1E] mb-4">Why Choose Montra?</h3>
          <p className="text-gray-600 text-lg">Completely free with features you actually need</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4 animate-slideIn">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-lg hover:bg-indigo-50 transition-all duration-300 group" style={{animationDelay: `${idx * 0.05}s`}}>
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <span className="text-lg text-gray-700 group-hover:text-indigo-600 transition-colors">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="animate-slideIn" style={{animationDelay: "0.2s"}}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl transform rotate-6"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 flex flex-col items-center justify-center h-96 text-white shadow-2xl">
                <Smartphone size={80} className="mb-4 opacity-80" />
                <h4 className="text-2xl font-bold text-center mb-2">Manage Anywhere</h4>
                <p className="text-indigo-100 text-center">Access your finances on desktop, tablet, or mobile</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl p-12 text-center text-white shadow-2xl animate-fadeIn border border-indigo-400">
          <h3 className="text-4xl font-bold mb-4">Start Managing Your Finances Today</h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who trust Montra to manage their financial goals. Completely free, no hidden fees.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center gap-2 mx-auto hover:shadow-lg active:scale-95"
          >
            Get Started Free <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E1E1E] text-gray-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <img src="/logo.png" alt="Montra" className="w-6 h-6" />
                Montra
              </h4>
              <p className="text-sm">Your personal wallet tracker for smarter financial management.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#security" className="hover:text-white transition">Security</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
                <li><a href="#privacy" className="hover:text-white transition">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p className="text-gray-400">© 2024 Montra Wallet Tracker. Made with ❤️ by Christian Deo Manlangit</p>
            <p className="text-gray-500 mt-2">100% Free • Open Source • No Ads</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
