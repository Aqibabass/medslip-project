import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ATM = () => {
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleNumberClick = (number) => {
    if (token.length < 10) {
      setToken(token + number);
    }
  };

  const handleClear = () => {
    setToken('');
  };

  const handleSubmit = () => {
    if (token.trim()) {
      navigate('/print-slip', { state: { token } });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && token.trim()) {
      handleSubmit();
    } else if (e.key === 'Backspace') {
      setToken(token.slice(0, -1));
    } else if (/^[0-9a-zA-Z-]$/i.test(e.key) && token.length < 10) {
      setToken(token + e.key);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        {/* ATM Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* ATM Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-4 sm:p-6 text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                />
              </svg>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider">MEDSLIP ATM</h1>
            </div>
            <p className="text-emerald-200 text-xs sm:text-sm">Prescription Slip Kiosk</p>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Instructions */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" 
                  />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Enter Your Token</h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Enter the token number from your registration
              </p>
            </div>

            {/* Token Display */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center border border-gray-200">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold tracking-widest text-gray-800 break-all">
                  {token || (
                    <span className="text-gray-300 tracking-[0.15em]">ENTER TOKEN</span>
                  )}
                </p>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">
                {token.length} character{token.length !== 1 ? 's' : ''} entered
              </p>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <button
                  key={number}
                  onClick={() => handleNumberClick(number.toString())}
                  className="h-14 sm:h-16 lg:h-20 rounded-xl text-xl sm:text-2xl lg:text-3xl font-bold bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 active:bg-emerald-50 active:border-emerald-300 active:scale-95 transition-all duration-150 shadow-sm"
                >
                  {number}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="h-14 sm:h-16 lg:h-20 rounded-xl text-sm sm:text-base lg:text-lg font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 active:scale-95 transition-all duration-150"
              >
                CLR
              </button>
              <button
                onClick={() => handleNumberClick('0')}
                className="h-14 sm:h-16 lg:h-20 rounded-xl text-xl sm:text-2xl lg:text-3xl font-bold bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 active:scale-95 transition-all duration-150"
              >
                0
              </button>
              <button
                onClick={() => handleNumberClick('-')}
                className="h-14 sm:h-16 lg:h-20 rounded-xl text-xl sm:text-2xl lg:text-3xl font-bold bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 active:scale-95 transition-all duration-150"
              >
                -
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!token.trim()}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white px-6 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-green-600 transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg min-h-[48px] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Print Slip
            </button>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 text-gray-400 text-center py-2 sm:py-3 text-[10px] sm:text-xs tracking-wider border-t border-gray-100">
            CITY CARE HOSPITAL • MEDSLIP ATM v2.0
          </div>
        </div>

        {/* Bottom Links */}
        <div className="flex justify-center mt-4 sm:mt-6 space-x-4 sm:space-x-6">
          <button
            onClick={() => navigate('/')}
            className="text-xs sm:text-sm text-gray-400 hover:text-emerald-600 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            New Registration
          </button>
          <button
            onClick={() => setToken('')}
            className="text-xs sm:text-sm text-gray-400 hover:text-emerald-600 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>

        {/* Hidden input for keyboard */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none w-0 h-0"
          onKeyDown={handleKeyDown}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default ATM;