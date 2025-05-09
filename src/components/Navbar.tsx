
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Pencil, LogOut, LogIn, UserPlus } from "lucide-react";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">Blogi</Link>
          
          <nav>
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
      </div>
    </header>
  );
};

export default Navbar;
