import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { patientAPI } from '../services/api';

const PrintSlip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = location.state || {};
  const [printing, setPrinting] = useState(true);
  const [showSlip, setShowSlip] = useState(false);
  const [slipData, setSlipData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!token) return;
      
      try {
        const response = await patientAPI.getTokenDetails({ tokenId: token });
        const data = response.data.token;
        
        setSlipData({
          token: data.tokenId,
          name: data.patientId?.name || 'N/A',
          ageGender: `${data.patientId?.age || '--'} / ${data.patientId?.gender || '--'}`,
          department: data.patientId?.department || 'General OPD',
          doctor: data.patientId?.doctor || 'Dr. On Duty',
          date: new Date(data.generatedAt).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        });

        // Show printing animation for 3 seconds
        const printTimer = setTimeout(() => {
          setPrinting(false);
          setShowSlip(true);
        }, 3000);

        return () => clearTimeout(printTimer);
      } catch (err) {
        setError(err.response?.data?.error || 'Token not found or expired.');
        setPrinting(false);
      }
    };

    fetchTokenDetails();
  }, [token]);

  useEffect(() => {
    if (showSlip) {
      const autoPrintTimer = setTimeout(() => {
        window.print();
      }, 500);

      return () => clearTimeout(autoPrintTimer);
    }
  }, [showSlip]);

  const handlePrintAgain = () => {
    setPrinting(true);
    setShowSlip(false);
    setTimeout(() => {
      setPrinting(false);
      setShowSlip(true);
      window.print();
    }, 3000);
  };

  if (!token || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="hospital-card max-w-md w-full">
          <div className="error-card">
            <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{error ? 'Error' : 'Invalid Token'}</h3>
            <p className="text-gray-500 mb-6">{error || 'No token provided. Please enter your token at the ATM.'}</p>
            <button onClick={() => navigate('/atm')} className="medical-btn-primary">
              Go to ATM
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kiosk-container">
      <div className="kiosk-screen">
        {/* Kiosk Header */}
        <div className="kiosk-header">
          <div className="flex items-center justify-center gap-3 mb-1">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            <h1 className="text-2xl font-bold tracking-wider">MEDSLIP ATM</h1>
          </div>
          <p className="text-hospital-200 text-sm">Prescription Slip Printing</p>
        </div>

        {/* Printing Animation State */}
        {printing && (
          <div className="kiosk-body">
            <div className="flex flex-col items-center justify-center py-12">
              {/* Printer Animation */}
              <div className="relative mb-8">
                {/* Printer Icon */}
                <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center border-2 border-gray-300">
                  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                </div>
                {/* Paper coming out animation */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 overflow-hidden">
                  <div className="h-1 bg-hospital-500 rounded-full animate-loading-bar mb-1" />
                  <div className="h-1 bg-hospital-400 rounded-full animate-loading-bar" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-2">Printing Your Slip</h2>
              <p className="text-gray-500 text-sm mb-6">Please wait while we process your request...</p>
              
              {/* Progress Bar */}
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-hospital-500 rounded-full animate-pulse"
                  style={{ 
                    animation: 'loadingBar 2s ease-in-out infinite',
                    width: '100%' 
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Token #{token}</p>
            </div>
          </div>
        )}

        {/* Slip Ready State */}
        {showSlip && (
          <div className="kiosk-body">
            {/* Success notification */}
            <div className="flex items-center justify-center gap-2 mb-6 bg-green-50 text-green-700 rounded-xl py-3 px-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium text-sm">Slip printed successfully!</span>
            </div>

            {/* Prescription Slip / Receipt - Thermal Printer Style */}
            {slipData && (
              <div className="receipt" id="print-receipt">
              {/* Hospital Header */}
              <div className="receipt-header">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-hospital-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                    />
                  </svg>
                  <h2 className="receipt-hospital-name">CITY CARE HOSPITAL</h2>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Prescription Slip</p>
                <p className="text-[10px] text-gray-400 mt-1">123 Healthcare Avenue, Medical District</p>
              </div>

              {/* Token Number - Large */}
              <div className="text-center mb-3 pb-3 border-b-2 border-dashed border-gray-300">
                <p className="text-[10px] text-gray-500 uppercase mb-1">Token Number</p>
                <p className="text-3xl font-bold tracking-widest text-hospital-700 font-mono">
                  {slipData.token}
                </p>
              </div>

              {/* Patient Details */}
              <div className="space-y-1.5 mb-3">
                <div className="receipt-detail">
                  <span className="receipt-label">Patient Name</span>
                  <span className="receipt-value uppercase">{slipData.name}</span>
                </div>
                <div className="receipt-detail">
                  <span className="receipt-label">Age / Gender</span>
                  <span className="receipt-value">{slipData.ageGender}</span>
                </div>
                <div className="receipt-detail">
                  <span className="receipt-label">Department</span>
                  <span className="receipt-value">{slipData.department}</span>
                </div>
                <div className="receipt-detail">
                  <span className="receipt-label">Doctor</span>
                  <span className="receipt-value">{slipData.doctor}</span>
                </div>
                <div className="receipt-detail">
                  <span className="receipt-label">Date & Time</span>
                  <span className="receipt-value text-xs">{slipData.date}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-3 border-t-2 border-dashed border-gray-300">
                <p className="text-xs text-gray-500 mb-1">Thank you for choosing City Care Hospital</p>
                <p className="text-[10px] text-gray-400">Please wait for your turn. Token will be called.</p>
                <div className="flex justify-center gap-1 mt-2 text-[8px] text-gray-300">
                  <span>_</span>
                  <span>_</span>
                  <span>_</span>
                  <span>_</span>
                  <span>_</span>
                  <span>_</span>
                  <span>_</span>
                  <span>_</span>
                  <span>_</span>
                  <span>_</span>
                  <span>_</span>
                  <span>_</span>
                  <span>_</span>
                  <span>_</span>
                  <span>_</span>
                </div>
                <p className="text-[8px] text-gray-300 mt-1">Cut along dotted line</p>
              </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <button
                onClick={handlePrintAgain}
                className="kiosk-key-submit"
              >
                Print Again
              </button>
              <button
                onClick={() => navigate('/atm')}
                className="w-full py-3 rounded-2xl text-base font-semibold text-hospital-700 
                         bg-hospital-50 border-2 border-hospital-200
                         hover:bg-hospital-100 transition-all duration-150"
              >
                Print Another Token
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 rounded-2xl text-base font-semibold text-gray-500 
                         hover:text-gray-700 transition-all duration-150"
              >
                New Registration
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-800 text-gray-400 text-center py-3 text-xs tracking-wider">
          CITY CARE HOSPITAL • MEDSLIP ATM v2.0
        </div>
      </div>
    </div>
  );
};

export default PrintSlip;