import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ATM = () => {
  const [token, setToken] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Auto-focus on mount for touchscreen keyboard
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleNumberClick = (number) => {
    if (token.length < 4) {
      setToken(token + number);
      setIsFocused(true);
    }
  };

  const handleClear = () => {
    setToken('');
    setIsFocused(false);
  };

  const handleSubmit = () => {
    if (token.length === 4) {
      navigate('/print-slip', { state: { token } });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && token.length === 4) {
      handleSubmit();
    } else if (e.key === 'Backspace') {
      setToken(token.slice(0, -1));
    } else if (/^[0-9]$/.test(e.key) && token.length < 4) {
      setToken(token + e.key);
    }
  };

  const displayDots = () => {
    return '●'.repeat(token.length) + '○'.repeat(4 - token.length);
  };

  return (
    <div className="kiosk-container">
      <div className="kiosk-screen">
        {/* ATM Header */}
        <div className="kiosk-header">
          <div className="flex items-center justify-center gap-3 mb-1">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
            <h1 className="text-2xl font-bold tracking-wider">MEDSLIP ATM</h1>
          </div>
          <p className="text-hospital-200 text-sm">Prescription Slip Kiosk</p>
        </div>

        {/* ATM Body */}
        <div className="kiosk-body">
          {/* Instructions */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-hospital-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-hospital-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" 
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Enter Your Token</h2>
            <p className="text-gray-500 text-sm">
              Please enter the 4-digit token number from your registration
            </p>
          </div>

          {/* Token Input Display */}
          <div className="mb-8">
            <div className="kiosk-input tracking-[0.3em] font-mono text-3xl">
              {token ? displayDots() : '○ ○ ○ ○'}
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
              {token.length}/4 digits entered
            </p>
          </div>

          {/* Numeric Keypad */}
          <div className="kiosk-keypad mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button
                key={number}
                onClick={() => handleNumberClick(number.toString())}
                className="kiosk-key-number"
              >
                {number}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="kiosk-key-clear text-lg"
            >
              CLR
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              className="kiosk-key-number"
            >
              0
            </button>
            <button
              onClick={handleSubmit}
              disabled={token.length !== 4}
              className="kiosk-key-number text-hospital-600"
            >
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={token.length !== 4}
            className="kiosk-key-submit"
          >
            SUBMIT
          </button>

          {/* Bottom Options */}
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-hospital-600 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              New Registration
            </button>
            <button
              onClick={() => setToken('')}
              className="text-sm text-gray-500 hover:text-hospital-600 transition-colors flex items-center gap-1"
            >
              Reset
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Hidden input for keyboard */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none"
          onKeyDown={handleKeyDown}
          aria-hidden="true"
        />

        {/* ATM Footer Branding */}
        <div className="bg-gray-800 text-gray-400 text-center py-3 text-xs tracking-wider">
          CITY CARE HOSPITAL • MEDSLIP ATM v2.0
        </div>
      </div>
    </div>
  );
};

export default ATM;