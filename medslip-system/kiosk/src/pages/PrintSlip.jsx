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
      <div className="text-center">
        <p className="text-red-500 text-xl mb-4">No slip data available</p>
        <button onClick={onPrint} className="bg-medical-green px-8 py-4 rounded text-xl">
          Back to Entry
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    printSlip(slipData);
    // After printing, go back to entry
    setTimeout(() => {
      onPrint();
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4" ref={previewRef}>
      <h2 className="text-3xl font-bold text-medical-green mb-2">Printing Prescription</h2>
      <p className="text-gray-400 mb-6">Preview and print the prescription slip</p>

      {/* Slip Preview - Thermal Style */}
      <div className="bg-white text-black p-6 rounded-lg shadow-lg mb-6 w-full max-w-sm font-mono">
        {/* Header */}
        <div className="text-center border-b-2 border-medical-green pb-3 mb-4">
          <h1 className="text-2xl font-bold">{slipData.hospitalName || 'MedSlip Hospital'}</h1>
          <p className="text-xs text-gray-500">Automated Prescription Slip</p>
        </div>

        {/* Token */}
        <div className="text-center mb-4">
          <p className="text-lg font-bold tracking-wider">Token: {slipData.tokenId}</p>
        </div>

        <div className="border-t border-dashed border-gray-400 my-3"></div>

        {/* Patient Details */}
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="font-bold w-24">Patient:</span>
            <span className="flex-1 break-words">{slipData.patientName}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-24">Age/Gender:</span>
            <span>{slipData.age} / {slipData.gender}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-24">Department:</span>
            <span>{slipData.department}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-24">Doctor:</span>
            <span>{slipData.doctor || 'Assigned Doctor'}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-24">Phone:</span>
            <span>{slipData.phone || 'N/A'}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-400 my-3"></div>

        {/* Date/Time */}
        <div className="text-center text-xs text-gray-500">
          <p>Printed: {new Date(slipData.printedAt || Date.now()).toLocaleString()}</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-400 border-t border-gray-200 pt-3">
          <p>This is a computer-generated prescription slip</p>
          <p>Valid only with hospital stamp</p>
        </div>
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="bg-medical-green hover:bg-green-600 text-white px-10 py-4 rounded-xl text-2xl font-bold transition-all active:scale-95"
      >
        🖨️ Print Slip
      </button>

      <button
        onClick={onPrint}
        className="text-gray-400 mt-4 hover:text-white transition-colors text-lg"
      >
        ← Cancel & Return
      </button>
    </div>
  );
};

export default PrintSlip;