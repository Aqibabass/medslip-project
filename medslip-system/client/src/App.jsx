import { Routes, Route } from 'react-router-dom';
import ProgressStepper from './components/ProgressStepper';
import PatientForm from './pages/PatientForm';
import ServiceSelection from './pages/ServiceSelection';
import Confirmation from './pages/Confirmation';
import TokenDisplay from './pages/TokenDisplay';
import ATM from './pages/ATM';
import PrintSlip from './pages/PrintSlip';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Responsive Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {/* Hospital Icon */}
            <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
            <div className="text-center">
              <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold tracking-tight">MedSlip Hospital</h1>
              <p className="text-[10px] sm:text-sm lg:text-base text-emerald-100 font-medium">Automated Token & Prescription System</p>
            </div>
          </div>
        </div>
      </header>
      
      <ProgressStepper />
      
      <main className="w-full max-w-screen-xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
        <Routes>
          <Route path="/" element={<PatientForm />} />
          <Route path="/service" element={<ServiceSelection />} />
          <Route path="/confirm" element={<Confirmation />} />
          <Route path="/token" element={<TokenDisplay />} />
          <Route path="/atm" element={<ATM />} />
          <Route path="/print-slip" element={<PrintSlip />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 sm:py-6 text-xs sm:text-sm text-gray-400 border-t border-gray-200/50">
        <p className="max-w-screen-xl mx-auto px-4">© 2026 City Care Hospital • MedSlip System v2.0</p>
      </footer>
    </div>
  );
}

export default App;