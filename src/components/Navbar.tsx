
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Pencil, LogOut, LogIn, UserPlus, Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="bg-white shadow backdrop-blur-md bg-opacity-80 sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold gradient-heading">Blogi</Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <li>
                    <span className="text-gray-600">Hello, {user?.username}</span>
                  </li>
                  <li>
                    <Link to="/create">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Pencil className="mr-2 h-4 w-4" /> New Post
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={logout}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <LogIn className="mr-2 h-4 w-4" /> Login
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/register">
                      <Button variant="default" size="sm" className="flex items-center">
                        <UserPlus className="mr-2 h-4 w-4" /> Register
                      </Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t mt-4">
            <ul className="space-y-4">
              {isAuthenticated ? (
                <>
                  <li className="text-center">
                    <span className="text-gray-600">Hello, {user?.username}</span>
                  </li>
                  <li>
                    <Link to="/create" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="flex items-center w-full justify-center">
                        <Pencil className="mr-2 h-4 w-4" /> New Post
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full justify-center text-gray-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="flex items-center w-full justify-center">
                        <LogIn className="mr-2 h-4 w-4" /> Login
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="default" className="flex items-center w-full justify-center">
                        <UserPlus className="mr-2 h-4 w-4" /> Register
                      </Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
