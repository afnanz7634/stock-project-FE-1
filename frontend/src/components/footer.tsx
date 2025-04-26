import * as React from 'react';
import { useState, useEffect } from 'react';


function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} StockTracker. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Made with Love By <span className="font-medium">Usama</span>
            </p>
          </div>
        </div>
      </footer>
    );
}

export default Footer;