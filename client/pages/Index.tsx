import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
  Recycle,
  Calendar,
  MapPin,
  BarChart3,
  Bell,
  Users,
  CheckCircle,
  ArrowRight,
  Leaf,
  Award,
  Zap
} from "lucide-react";

export default function Index() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Clear authentication data when visiting landing page to force re-login
    localStorage.removeItem('wasteWiseUser');

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          ></div>
          <div 
            className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          ></div>
          <div 
            className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-blue-300 to-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
        </div>
        
        {/* 3D Floating Elements with People Saying "Throw the waste in" */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Person 1 */}
          <div 
            className="absolute top-1/4 left-1/4 transform-gpu"
            style={{ 
              transform: `translate3d(${Math.sin(scrollY * 0.01) * 20}px, ${scrollY * 0.5}px, 0) rotateY(${scrollY * 0.1}deg)` 
            }}
          >
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-xl">👤</span>
              </div>
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs font-medium text-gray-800 whitespace-nowrap">Throw the waste in!</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90"></div>
              </div>
            </div>
          </div>

          {/* Person 2 */}
          <div 
            className="absolute top-1/3 right-1/4 transform-gpu"
            style={{ 
              transform: `translate3d(${Math.sin(scrollY * 0.008 + 2) * 25}px, ${scrollY * -0.3}px, 0) rotateY(${scrollY * -0.08}deg)` 
            }}
          >
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-500">
                <span className="text-lg">👥</span>
              </div>
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs font-medium text-gray-800 whitespace-nowrap">Recycle properly!</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90"></div>
              </div>
            </div>
          </div>

          {/* Person 3 */}
          <div 
            className="absolute bottom-1/4 left-1/3 transform-gpu"
            style={{ 
              transform: `translate3d(${Math.sin(scrollY * 0.012 + 4) * 15}px, ${scrollY * 0.2}px, 0) rotateX(${scrollY * 0.05}deg)` 
            }}
          >
            <div className="relative group">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl animate-bounce delay-1000">
                <span className="text-2xl">����</span>
              </div>
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs font-medium text-gray-800 whitespace-nowrap">Keep it green!</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90"></div>
              </div>
            </div>
          </div>

          {/* Person 4 */}
          <div 
            className="absolute top-1/2 right-1/3 transform-gpu"
            style={{ 
              transform: `translate3d(${Math.sin(scrollY * 0.009 + 1) * 30}px, ${scrollY * -0.4}px, 0) rotateZ(${scrollY * 0.03}deg)` 
            }}
          >
            <div className="relative group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-300">
                <span className="text-sm">♻️</span>
              </div>
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs font-medium text-gray-800 whitespace-nowrap">Sort your waste!</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90"></div>
              </div>
            </div>
          </div>

          {/* Additional floating elements */}
          <div 
            className="absolute top-3/4 left-1/4 w-3 h-3 bg-green-400 rounded-full animate-bounce delay-700"
            style={{ transform: `translateY(${scrollY * 0.6}px)` }}
          ></div>
          <div 
            className="absolute top-1/5 right-1/5 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-900"
            style={{ transform: `translateY(${scrollY * -0.4}px)` }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
                  <Recycle className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  EcoWasteConnect
                </span>
              </div>
              <div className="space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className="hover:bg-white/50">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 relative">
          <div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          >
            <div className="animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-6">
                <Leaf className="w-4 h-4 mr-2" />
                Eco-Friendly • Smart • Connected
              </div>
              
              <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Smart Waste Management for
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent block mt-2">
                  Connected Communities
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
                Connect your community's waste collection with intelligent scheduling, 
                real-time tracking, and comprehensive reporting. Join thousands of 
                communities making waste management effortless and sustainable.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/register">
                  <Button size="lg" className="px-10 py-4 text-lg bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                    Connect Your Community
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="px-10 py-4 text-lg border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                  <div className="text-gray-600">Connected Communities</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">2.5M</div>
                  <div className="text-gray-600">Tons Recycled</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                  <div className="text-gray-600">User Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
          <div 
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          >
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Powerful Features
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Everything You Need for Waste Management
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive tools designed to connect your community's waste collection efficiently, transparently, and sustainably
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Calendar,
                  title: "Smart Scheduling",
                  description: "AI-powered scheduling that connects to your community's needs and optimizes collection routes.",
                  color: "blue"
                },
                {
                  icon: MapPin,
                  title: "Location Tracking",
                  description: "Real-time GPS tracking for all pickups with precise location management and route optimization.",
                  color: "green"
                },
                {
                  icon: BarChart3,
                  title: "Detailed Analytics",
                  description: "Comprehensive reporting with insights on recycling rates, cost savings, and environmental impact.",
                  color: "purple"
                },
                {
                  icon: Bell,
                  title: "Smart Notifications",
                  description: "Intelligent alerts for pickup reminders, schedule changes, and important community updates.",
                  color: "orange"
                },
                {
                  icon: Users,
                  title: "Community Hub",
                  description: "Centralized platform for community coordination, member management, and collaboration tools.",
                  color: "teal"
                },
                {
                  icon: CheckCircle,
                  title: "Issue Resolution",
                  description: "Streamlined issue reporting and tracking system with automated workflow management.",
                  color: "red"
                }
              ].map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card 
                    key={index} 
                    className="group p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                    style={{ 
                      transform: `translateY(${scrollY * (-0.02 * (index + 1))}px) rotateY(${Math.sin(scrollY * 0.001 + index) * 2}deg)` 
                    }}
                  >
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r from-${feature.color}-100 to-${feature.color}-200 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-8 w-8 text-${feature.color}-600`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-green-600"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div 
            className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
            style={{ transform: `translateY(${scrollY * -0.03}px)` }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              Join the Connection
            </div>
            <h2 className="text-5xl font-bold mb-8">
              Ready to Connect Your Community's Waste Management?
            </h2>
            <p className="text-xl mb-10 opacity-90 leading-relaxed">
              Join thousands of communities already using EcoWasteConnect to create cleaner, 
              more sustainable neighborhoods. Start your connection today.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="px-12 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                Connect Free Today
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900/95 backdrop-blur-md text-white py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
                    <Recycle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">EcoWasteConnect</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Connecting communities for smarter, cleaner, and more sustainable waste management worldwide.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Features</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Smart Scheduling</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Location Tracking</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Notifications</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">
                © 2024 EcoWasteConnect. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
