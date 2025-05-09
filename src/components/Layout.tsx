
import React, { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-50 via-blue-50 to-white">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container-custom">
          {children}
        </div>
      </main>
      <footer className="py-10 border-t border-gray-100">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-center md:text-left text-gray-600">© 2025 Blogi. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">About</a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
