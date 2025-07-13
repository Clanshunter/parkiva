'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Get theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Find Nearby',
      href: '/find-parking',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      name: 'Parking',
      href: '/parking',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      name: 'Sync Data',
      href: '/sync',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  ];

  return (
    <div className="navbar bg-base-100 shadow-lg px-2 sm:px-4">
      <div className="navbar-start">
        {/* Mobile menu dropdown */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm lg:hidden">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="flex items-center gap-2 text-sm">
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Logo */}
        <Link href="/" className="btn btn-ghost text-lg sm:text-xl font-bold">
          <span className="hidden sm:inline">🅿️ Parkiva</span>
          <span className="sm:hidden">🅿️ P</span>
        </Link>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="flex items-center gap-2">
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle btn-sm sm:btn-md"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            // Sun icon for light mode
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* User menu dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm sm:btn-md">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-base-300 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between text-sm">
                Profile
                <span className="badge badge-xs">New</span>
              </a>
            </li>
            <li><a className="text-sm">Settings</a></li>
            <li><a className="text-sm">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
