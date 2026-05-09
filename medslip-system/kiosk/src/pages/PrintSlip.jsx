import { useRef, useEffect } from 'react';
import { printSlip } from '../utils/print';

const PrintSlip = ({ slipData, onPrint }) => {
  const previewRef = useRef(null);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (!slipData) {
    return (
      <div className="text-center py-8">
        <div className="kiosk-glass rounded-2xl p-8 sm:p-10">
          <p className="text-red-400 text-xl sm:text-2xl mb-6">No slip data available</p>
          <button onClick={onPrint} 
            className="bg-gradient-to-r from-emerald-600 to-green-500 px-8 sm:px-12 py-4 rounded-2xl text-lg sm:text-xl font-bold transition-all active:scale-[0.98] shadow-lg min-h-[56px]"
          >
            Back to Entry
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    printSlip(slipData);
    setTimeout(() => {
      onPrint();
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full" ref={previewRef}>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-400 mb-2">Printing Prescription</h2>
      <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8">Preview and print the prescription slip</p>

      {/* Slip Preview - Thermal Paper Style */}
      <div className="kiosk-receipt p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6 shadow-xl" id="print-receipt-preview">
        {/* Header */}
        <div className="text-center border-b-2 border-emerald-600 pb-3 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{slipData.hospitalName || 'MedSlip Hospital'}</h1>
          <p className="text-[10px] sm:text-xs text-gray-500">Automated Prescription Slip</p>
        </div>

        {/* Token */}
        <div className="text-center mb-4">
          <p className="text-sm sm:text-base font-bold tracking-wider text-gray-800 break-all">Token: {slipData.tokenId}</p>
        </div>

        <div className="border-t border-dashed border-gray-400 my-2 sm:my-3"></div>

        {/* Patient Details */}
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
          <div className="flex">
            <span className="font-bold w-20 sm:w-24 flex-shrink-0">Patient:</span>
            <span className="flex-1 break-words uppercase">{slipData.patientName}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-20 sm:w-24 flex-shrink-0">Age/Gender:</span>
            <span>{slipData.age} / {slipData.gender}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-20 sm:w-24 flex-shrink-0">Department:</span>
            <span>{slipData.department}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-20 sm:w-24 flex-shrink-0">Doctor:</span>
            <span>{slipData.doctor || 'Assigned Doctor'}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-20 sm:w-24 flex-shrink-0">Phone:</span>
            <span>{slipData.phone || 'N/A'}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-400 my-2 sm:my-3"></div>

        {/* Date/Time */}
        <div className="text-center text-[10px] sm:text-xs text-gray-500">
          <p>Printed: {new Date(slipData.printedAt || Date.now()).toLocaleString()}</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-400 border-t border-gray-200 pt-2 sm:pt-3">
          <p>This is a computer-generated prescription slip</p>
          <p>Valid only with hospital stamp</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm">
        <button
          onClick={handlePrint}
          className="flex-1 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-xl sm:text-2xl lg:text-3xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20 min-h-[56px] flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          Print Slip
        </button>
        <button
          onClick={onPrint}
          className="flex-1 kiosk-glass text-gray-300 hover:text-white px-6 py-4 rounded-2xl text-lg sm:text-xl font-semibold transition-all active:scale-[0.98] min-h-[56px] border border-gray-600/30"
        >
          ← Cancel
        </button>
      </div>
    </div>
  );
};

export default PrintSlip;