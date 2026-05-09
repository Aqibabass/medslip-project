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
      <div className="max-w-md mx-auto p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
        </div>
        <p className="text-gray-500 mt-4">Loading Token...</p>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-6 rounded-lg mb-4">
          <p className="text-lg font-semibold mb-2">Token not found</p>
          <p className="text-sm">Your token may have expired or is invalid.</p>
        </div>
        <button 
          onClick={handleNewEntry}
          className="bg-medical-green text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Start New Entry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
        <p className="text-green-700 font-semibold">✓ Token Generated Successfully!</p>
      </div>

      {/* Token Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-medical-green mb-6">
        <h2 className="text-lg text-gray-600 mb-2">Your Token</h2>
        <div className="bg-medical-light p-6 rounded-xl mb-4">
          <p className="text-3xl sm:text-4xl font-bold text-medical-green tracking-wider font-mono">
            {tokenData.tokenId}
          </p>
        </div>
        
        <button
          onClick={handleCopy}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            copied 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {copied ? '✓ Copied!' : '📋 Copy Token'}
        </button>
        
        <p className="text-sm text-gray-500 mt-4">
          Take this token to the ATM Kiosk to print your slip
        </p>
      </div>

      {/* Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Patient Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Department</span>
            <span className="font-medium">{tokenData.patientId?.department || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Generated</span>
            <span className="font-medium">{new Date(tokenData.generatedAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Valid Until</span>
            <span className="font-medium">{new Date(tokenData.expiresAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className={`font-medium capitalize ${
              tokenData.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {tokenData.status}
            </span>
          </div>
          {tokenData.status === 'paid' && tokenData.paymentId?.razorpayPaymentId && (
            <div className="flex justify-between">
              <span className="text-gray-500">Payment ID</span>
              <span className="font-medium">{tokenData.paymentId.razorpayPaymentId}</span>
            </div>
          )}
          {tokenData.status === 'paid' && tokenData.paymentId?.razorpayPaymentId && (
            <div className="flex justify-between">
              <span className="text-gray-500">Payment ID</span>
              <span className="font-medium">{tokenData.paymentId.razorpayPaymentId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          Head to the ATM kiosk and enter your token to print your prescription slip
        </p>
        <button
          onClick={handleNewEntry}
          className="text-medical-green hover:text-green-700 text-sm font-medium"
        >
          Start a New Entry →
        </button>
      </div>
    </div>
  );
};

export default TokenDisplay;