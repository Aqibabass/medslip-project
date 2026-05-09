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
  const [selectedService, setSelectedService] = useState('');
  const [loading, setLoading] = useState(false);
  const patientData = JSON.parse(localStorage.getItem('patientData') || '{}');

  useEffect(() => {
    // Redirect if no patient data
    if (!patientData.name) {
      navigate('/');
    }
  }, [patientData, navigate]);

  const handleSelect = (service) => {
    if (selectedService === service.name) {
      setSelectedService(''); // deselect
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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-2 text-medical-green">Select Service</h2>
      <p className="text-gray-500 text-center text-sm mb-6">Choose the department you need</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard 
            key={service.name} 
            service={service} 
            onSelect={handleSelect} 
            selected={selectedService} 
          />
        ))}
      </div>
      
      <div className="text-center mt-8">
        <button 
          onClick={handleNext} 
          disabled={loading || !selectedService} 
          className="bg-medical-green text-white px-8 py-3 rounded-lg disabled:opacity-50 hover:bg-green-600 transition-colors font-semibold"
        >
          {loading ? 'Please wait...' : 'Next: Confirm Details →'}
        </button>
        <br />
        <button 
          onClick={() => navigate('/')} 
          className="text-gray-500 mt-3 hover:text-gray-700"
        >
          ← Edit Patient Details
        </button>
      </div>
    </div>
  );
};

export default ServiceSelection;