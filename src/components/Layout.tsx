
import React, { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container-custom">
          {children}
        </div>
      </main>
      <footer className="bg-gray-100 py-6">
        <div className="container-custom">
          <p className="text-center text-gray-600">© 2025 Blogi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
