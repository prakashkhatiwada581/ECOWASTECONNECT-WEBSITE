import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Recycle, UserPlus } from "lucide-react";

export default function Register() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-r from-green-300/20 to-blue-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-60 right-10 w-80 h-80 bg-gradient-to-r from-blue-300/20 to-green-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-10 left-60 w-80 h-80 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310B981' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h40V20H20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg mb-6">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Join EcoWasteConnect
          </h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Register Card */}
        <Card className="p-8 bg-white/80 backdrop-blur-md border-0 shadow-2xl">
          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className="h-11 bg-white/70 border-gray-200 focus:bg-white focus:border-green-400 transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactNumber" className="text-sm font-semibold text-gray-700">
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="Enter your contact number"
                className="h-11 bg-white/70 border-gray-200 focus:bg-white focus:border-green-400 transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-11 bg-white/70 border-gray-200 focus:bg-white focus:border-green-400 transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="communityName" className="text-sm font-semibold text-gray-700">
                Community Name
              </Label>
              <Input
                id="communityName"
                type="text"
                placeholder="Enter your community name"
                className="h-11 bg-white/70 border-gray-200 focus:bg-white focus:border-green-400 transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                Residential Address
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Enter your residential address"
                className="h-11 bg-white/70 border-gray-200 focus:bg-white focus:border-green-400 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                className="h-11 bg-white/70 border-gray-200 focus:bg-white focus:border-green-400 transition-all duration-200"
              />
            </div>

            <div className="flex items-start space-x-2">
              <input 
                type="checkbox" 
                id="terms"
                className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500" 
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-green-600 hover:text-green-700 transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-green-600 hover:text-green-700 transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              Create Account
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                Sign In
              </Link>
            </div>
          </form>
        </Card>

        {/* Additional Links */}
        <div className="text-center mt-8">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
