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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{error ? 'Error' : 'Invalid Token'}</h3>
            <p className="text-sm text-gray-500 mb-6">{error || 'No token provided. Please enter your token at the ATM.'}</p>
            <button onClick={() => navigate('/atm')} 
              className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] min-h-[48px]"
            >
              Go to ATM
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-3 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        {/* Print Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-4">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-4 sm:p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <h1 className="text-xl font-bold tracking-wider">MEDSLIP ATM</h1>
            </div>
            <p className="text-emerald-200 text-xs">Prescription Slip Printing</p>
          </div>

          {/* Printing Animation */}
          {printing && (
            <div className="p-8 sm:p-10 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto border-2 border-gray-200">
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                </div>
                <div className="w-48 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '100%' }} />
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Printing Your Slip</h2>
              <p className="text-sm text-gray-500 mb-4">Please wait while we process your request...</p>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full animate-pulse" 
                  style={{ 
                    animation: 'loadingBar 2s ease-in-out infinite',
                    width: '100%' 
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-3">Token #{token}</p>
            </div>
          )}

          {/* Slip Ready */}
          {showSlip && (
            <div className="p-4 sm:p-6">
              {/* Success notification */}
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 bg-green-50 text-green-700 rounded-xl py-3 px-4 border border-green-100">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-sm">Slip printed successfully!</span>
              </div>

              {/* Receipt - Thermal Printer Style */}
              {slipData && (
                <div className="receipt" id="print-receipt">
                  <div className="receipt-header">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                        />
                      </svg>
                      <h2 className="receipt-hospital-name text-sm sm:text-lg">CITY CARE HOSPITAL</h2>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Prescription Slip</p>
                    <p className="text-[8px] sm:text-[10px] text-gray-400 mt-1">123 Healthcare Avenue, Medical District</p>
                  </div>

                  <div className="text-center mb-3 pb-3 border-b-2 border-dashed border-gray-300">
                    <p className="text-[10px] text-gray-500 uppercase mb-1">Token Number</p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-widest text-emerald-700 font-mono break-all">
                      {slipData.token}
                    </p>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="receipt-detail">
                      <span className="receipt-label">Patient Name</span>
                      <span className="receipt-value uppercase break-words max-w-[60%] text-right">{slipData.name}</span>
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
                      <span className="receipt-value text-[10px] sm:text-xs">{slipData.date}</span>
                    </div>
                  </div>

                  <div className="text-center pt-3 border-t-2 border-dashed border-gray-300">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Thank you for choosing City Care Hospital</p>
                    <p className="text-[8px] sm:text-[10px] text-gray-400">Please wait for your turn. Token will be called.</p>
                    <div className="flex justify-center gap-1 mt-2 text-[8px] text-gray-300">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <span key={i}>_</span>
                      ))}
                    </div>
                    <p className="text-[8px] text-gray-300 mt-1">Cut along dotted line</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mt-4 sm:mt-6">
                <button
                  onClick={handlePrintAgain}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white px-6 py-3.5 rounded-xl font-bold text-base hover:from-emerald-700 hover:to-green-600 transition-all duration-200 active:scale-[0.98] shadow-md min-h-[48px]"
                >
                  Print Again
                </button>
                <button
                  onClick={() => navigate('/atm')}
                  className="w-full py-3.5 rounded-xl text-base font-semibold text-emerald-700 bg-green-50 border-2 border-green-200 hover:bg-green-100 transition-all duration-200 active:scale-[0.98] min-h-[48px]"
                >
                  Print Another Token
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 rounded-xl text-base font-semibold text-gray-400 hover:text-emerald-600 transition-all duration-200"
                >
                  New Registration
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-50 text-gray-400 text-center py-2 sm:py-3 text-[10px] sm:text-xs tracking-wider border-t border-gray-100">
            CITY CARE HOSPITAL • MEDSLIP ATM v2.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintSlip;