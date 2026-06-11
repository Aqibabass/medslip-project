import { useState, useEffect } from 'react';
import ATM from './pages/ATM';
import PrintSlip from './pages/PrintSlip';
import api from './services/api';

function App() {
  const [view, setView] = useState('entry'); // entry, loading, print, error
  const [tokenInput, setTokenInput] = useState('');

  // Pre-fill token from URL query parameter ?token=XXXX
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      // Extract only the last 4 digits from the token
      const digits = tokenFromUrl.replace(/\D/g, '');
      setTokenInput(digits.slice(-4));
      // Optionally auto-submit after a short delay
      // setTimeout(() => handleValidate(), 500);
    }
  }, []);
  const [slipData, setSlipData] = useState(null);
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleValidate = async () => {
    if (!tokenInput.trim()) {
      setError('Please enter a token number');
      setView('error');
      return;
    }

    setView('loading');
    setLoadingMessage('Validating token...');
    setError('');

    try {
      const response = await api.post('/atm/validate', { tokenId: tokenInput.trim() });
      setSlipData(response.data.slipData);
      setView('print');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Validation failed. Please check your token and try again.';
      setError(errorMsg);
      setView('error');
    }
  };

  const handlePrintComplete = () => {
    setView('entry');
    setTokenInput('');
    setSlipData(null);
    setError('');
  };

  const reset = () => {
    setView('entry');
    setTokenInput('');
    setSlipData(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white kiosk-fullscreen">
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-block kiosk-glass rounded-2xl sm:rounded-3xl px-6 sm:px-10 lg:px-16 py-4 sm:py-6 lg:py-8 mb-4 sm:mb-6 kiosk-glow">
            <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 mb-2">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                />
              </svg>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl kiosk:text-6xl font-bold text-emerald-400 tracking-tight">
                MedSlip ATM
              </h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
              Enter your token to print your prescription slip
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full">
          {view === 'entry' && (
            <ATM 
              tokenInput={tokenInput} 
              setTokenInput={setTokenInput} 
              onValidate={handleValidate} 
            />
          )}

          {view === 'loading' && (
            <div className="text-center py-8 sm:py-12 lg:py-16">
              <div className="kiosk-glass rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16">
                <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 border-4 border-emerald-500 border-t-transparent mx-auto mb-6 sm:mb-8"></div>
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 font-medium">{loadingMessage}</p>
                <div className="mt-6 sm:mt-8 flex justify-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full animate-bounce bounce-delay-1"></div>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full animate-bounce bounce-delay-2"></div>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full animate-bounce bounce-delay-3"></div>
                </div>
              </div>
            </div>
          )}

          {view === 'print' && (
            <PrintSlip slipData={slipData} onPrint={handlePrintComplete} />
          )}

          {view === 'error' && (
            <div className="text-center py-8 sm:py-12">
              <div className="kiosk-glass rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-3xl sm:text-4xl mb-4">⚠️</p>
                <p className="text-red-400 text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 font-medium">{error}</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button 
                    onClick={reset} 
                    className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl lg:text-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20 min-h-[56px]"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => { reset(); setTokenInput(''); }} 
                    className="text-gray-400 hover:text-white transition-colors text-base sm:text-lg py-4 min-h-[56px]"
                  >
                    Reset System
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 lg:mt-16 text-center text-gray-600 text-xs sm:text-sm">
          <p className="tracking-wider">MedSlip ATM Kiosk v2.0 | Hospital Token System</p>
        </footer>
      </div>
    </div>
  );
}

export default App;