import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';

const services = [
  { 
    name: 'General Medicine', 
    desc: 'Routine checkups, fever, general illness', 
    requiresPayment: false, 
    amount: 0,
    icon: '🩺'
  },
  { 
    name: 'Cardiology', 
    desc: 'Heart care, blood pressure, ECG', 
    requiresPayment: true, 
    amount: 500,
    icon: '❤️'
  },
  { 
    name: 'Dentistry', 
    desc: 'Dental checkup, cleaning, extraction', 
    requiresPayment: true, 
    amount: 300,
    icon: '🦷'
  },
  { 
    name: 'Orthopedics', 
    desc: 'Bone, joint, and muscle care', 
    requiresPayment: true, 
    amount: 400,
    icon: '🦴'
  },
  { 
    name: 'Pediatrics', 
    desc: 'Child health and development', 
    requiresPayment: false, 
    amount: 0,
    icon: '👶'
  },
  { 
    name: 'Ophthalmology', 
    desc: 'Eye checkup and vision care', 
    requiresPayment: true, 
    amount: 250,
    icon: '👁️'
  },
  { 
    name: 'Dermatology', 
    desc: 'Skin care and treatment', 
    requiresPayment: true, 
    amount: 350,
    icon: '🧴'
  },
  { 
    name: 'ENT', 
    desc: 'Ear, Nose, and Throat care', 
    requiresPayment: false, 
    amount: 0,
    icon: '👂'
  }
];

const ServiceSelection = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('Cardiology');
  const [loading, setLoading] = useState(false);
  const patientData = JSON.parse(localStorage.getItem('patientData') || '{}');

  useEffect(() => {
    if (!patientData.name) {
      navigate('/');
    }
  }, [patientData, navigate]);

  const handleSelect = (service) => {
    if (selectedService === service.name) {
      setSelectedService('');
    } else {
      setSelectedService(service.name);
    }
  };

  const handleNext = () => {
    if (!selectedService) {
      alert('Please select a service to continue');
      return;
    }

    setLoading(true);
    try {
      const service = services.find(s => s.name === selectedService);
      localStorage.setItem('selectedService', selectedService);
      localStorage.setItem('requiresPayment', service.requiresPayment.toString());
      localStorage.setItem('serviceAmount', service.amount.toString());
      navigate('/confirm');
    } catch (error) {
      alert('Error selecting service. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 sm:pb-6">
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Select Service
          </h2>
          <p className="text-sm sm:text-base text-gray-500">Choose the department you need</p>
        </div>
        
        {/* Responsive Grid: 1 col mobile, 2 col tablet, 3 col laptop, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {services.map((service) => (
            <ServiceCard 
              key={service.name} 
              service={service} 
              onSelect={handleSelect} 
              selected={selectedService} 
            />
          ))}
        </div>
        
        {/* Mobile sticky bottom button + desktop inline */}
        <div className="mt-6 sm:mt-8 lg:mt-10 text-center hidden sm:block">
          <button 
            onClick={handleNext} 
            disabled={loading || !selectedService} 
            className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-10 py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-green-600 transition-all duration-200 font-semibold text-base shadow-md hover:shadow-lg active:scale-[0.98] min-h-[48px]"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Please wait...
              </span>
            ) : 'Next: Confirm Details →'}
          </button>
          <br />
          <button 
            onClick={() => navigate('/')} 
            className="text-gray-400 hover:text-emerald-600 mt-3 text-sm sm:text-base transition-colors"
          >
            ← Edit Patient Details
          </button>
        </div>
      </div>

      {/* Mobile Sticky Bottom */}
      <div className="sticky-bottom sm:hidden">
        <button 
          onClick={handleNext} 
          disabled={loading || !selectedService} 
          className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white px-6 py-3.5 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Please wait...
            </span>
          ) : 'Next: Confirm Details →'}
        </button>
      </div>
    </>
  );
};

export default ServiceSelection;