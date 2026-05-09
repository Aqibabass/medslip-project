import { Routes, Route } from 'react-router-dom';
import ProgressStepper from './components/ProgressStepper';
import PatientForm from './pages/PatientForm';
import ServiceSelection from './pages/ServiceSelection';
import Confirmation from './pages/Confirmation';
import TokenDisplay from './pages/TokenDisplay';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-medical-green text-white p-4 text-center">
        <h1 className="text-2xl font-bold">MedSlip Hospital</h1>
        <p className="text-sm">Automated Token System</p>
      </header>
      <ProgressStepper />
      <Routes>
        <Route path="/" element={<PatientForm />} />
        <Route path="/service" element={<ServiceSelection />} />
        <Route path="/confirm" element={<Confirmation />} />
        <Route path="/token" element={<TokenDisplay />} />
      </Routes>
    </div>
  );
}

export default App;