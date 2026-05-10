import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientAPI } from '../services/api';

const TokenDisplay = () => {
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const tokenId = localStorage.getItem('tokenId');
      if (tokenId) {
        try {
          const response = await patientAPI.getTokenDetails({ tokenId });
          setTokenData(response.data.token);
        } catch (error) {
          console.error('Token fetch failed:', error);
        }
      }
      setLoading(false);
    };
    fetchToken();
  }, []);

  const handleCopy = () => {
    if (tokenData?.tokenId) {
      navigator.clipboard.writeText(tokenData.tokenId);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleNewEntry = () => {
    localStorage.removeItem('patientData');
    localStorage.removeItem('tokenId');
    localStorage.removeItem('selectedService');
    localStorage.removeItem('requiresPayment');
    localStorage.removeItem('serviceAmount');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
            <div className="h-32 bg-gray-200 rounded-xl w-64 mx-auto"></div>
          </div>
          <p className="text-gray-400 mt-6 text-sm">Loading your token...</p>
        </div>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 sm:px-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-amber-800 mb-2">Token not found</p>
          <p className="text-sm text-amber-600 mb-6">Your token may have expired or is invalid.</p>
          <button 
            onClick={handleNewEntry}
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-[0.98] min-h-[48px]"
          >
            Start New Entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-center">
        <p className="text-green-700 font-semibold text-sm sm:text-base flex items-center justify-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Token Generated Successfully!
        </p>
      </div>

      {/* Token Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center border-2 border-emerald-500 mb-4 sm:mb-6">
        <h2 className="text-sm sm:text-base text-gray-500 font-medium mb-3">Your Token Number</h2>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 mb-4 border border-green-100">
          <p className="text-2xl sm:text-3xl lg:text-5xl font-bold text-emerald-700 tracking-wider font-mono break-all overflow-hidden">
            {tokenData.tokenId}
          </p>
        </div>
        
        <button
          onClick={handleCopy}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition-all duration-200 min-h-[44px] flex items-center justify-center gap-2 mx-auto ${
            copied 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 active:scale-[0.98]'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Token
            </>
          )}
        </button>
        
        <p className="text-xs sm:text-sm text-gray-400 mt-4">
          Take this token to the ATM Kiosk to print your slip
        </p>
      </div>

      {/* Patient Details Card */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm sm:text-base">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Token Details
        </h3>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Department</span>
            <span className="font-semibold text-gray-800">{tokenData.patientId?.department || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Generated</span>
            <span className="font-semibold text-gray-800 text-right">{new Date(tokenData.generatedAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Valid Until</span>
            <span className="font-semibold text-gray-800 text-right">{new Date(tokenData.expiresAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Status</span>
            <span className={`font-semibold capitalize px-2 py-0.5 rounded-full text-xs ${
              tokenData.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {tokenData.status}
            </span>
          </div>
          {tokenData.status === 'paid' && tokenData.paymentId?.razorpayPaymentId && (
            <div className="flex justify-between py-2 border-t border-gray-50">
              <span className="text-gray-500">Payment ID</span>
              <span className="font-mono text-xs text-gray-800 truncate max-w-[150px] text-right">{tokenData.paymentId.razorpayPaymentId}</span>
            </div>
          )}
        </div>
      </div>

      {/* ATM Kiosk Navigation Card - Always stacked vertically */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1">Print Your Slip at ATM Kiosk</h3>
            <p className="text-sm text-gray-500">Head to the nearest ATM kiosk to print your prescription slip</p>
          </div>
          <a
            href={`https://medslip-kiosk.vercel.app/?token=${encodeURIComponent(tokenData.tokenId)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:from-emerald-700 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] min-h-[48px] flex items-center justify-center gap-2 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Go to ATM Kiosk
          </a>
        </div>
      </div>

      {/* New Entry */}
      <div className="text-center">
        <button
          onClick={handleNewEntry}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
        >
          Start a New Entry 
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TokenDisplay;