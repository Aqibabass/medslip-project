import { useState } from 'react';
import ATM from './pages/ATM';
import PrintSlip from './pages/PrintSlip';
import api from './services/api';

function App() {
  const [view, setView] = useState('entry'); // entry, loading, print, error
  const [tokenInput, setTokenInput] = useState('');
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
      const fullToken = `MS-ATM-${tokenInput.trim()}`;
      const response = await api.post('/atm/validate', { tokenId: fullToken });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Header */}
      <header className="w-full text-center mb-8">
        <div className="inline-block bg-green-900/20 border border-medical-green/30 rounded-2xl px-8 py-4 mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-medical-green tracking-tight">
            🏥 MedSlip ATM
          </h1>
        </div>
        <p className="text-gray-400 text-lg">Enter your token to print your prescription slip</p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-lg">
        {view === 'entry' && (
          <ATM 
            tokenInput={tokenInput} 
            setTokenInput={setTokenInput} 
            onValidate={handleValidate} 
          />
        )}

        {view === 'loading' && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-medical-green border-t-transparent mx-auto mb-6"></div>
            <p className="text-2xl text-gray-300">{loadingMessage}</p>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-3 h-3 bg-medical-green rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-medical-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-medical-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {view === 'print' && (
          <PrintSlip slipData={slipData} onPrint={handlePrintComplete} />
        )}

        {view === 'error' && (
          <div className="text-center py-8">
            <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-8 mb-6">
              <p className="text-5xl mb-4">⚠️</p>
              <p className="text-red-400 text-xl mb-4">{error}</p>
            </div>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={reset} 
                className="bg-medical-green hover:bg-green-600 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Reset System
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600 text-sm">
        <p>MedSlip ATM Kiosk v1.0 | Hospital Token System</p>
      </footer>
    </div>
  );
}

export default App;