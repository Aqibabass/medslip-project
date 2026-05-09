import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';

const PatientForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', phone: '', email: '', doctor: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.age || formData.age < 0 || formData.age > 120) newErrors.age = 'Valid age required (0-120)';
    if (!formData.gender) newErrors.gender = 'Please select gender';
    if (!formData.phone || formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) 
      newErrors.phone = 'Valid 10-digit phone number required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    try {
      // Store patient data locally - will be sent to backend on confirmation
      localStorage.setItem('patientData', JSON.stringify(formData));
      navigate('/service');
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-medical-green">
        <span className="inline-block mr-2">🏥</span> 
        Patient Details
      </h2>
      <p className="text-gray-500 text-center text-sm mb-6">Enter your details to get started</p>
      
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormInput 
          label="Full Name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          error={errors.name}
          placeholder="Enter your full name"
        />
        <FormInput 
          label="Age" 
          type="number" 
          name="age" 
          value={formData.age} 
          onChange={handleChange} 
          error={errors.age}
          placeholder="Enter age"
        />
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
          <select 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange} 
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-green ${
              errors.gender ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>
        <FormInput 
          label="Phone Number" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
          error={errors.phone}
          placeholder="10-digit mobile number"
          maxLength={10}
        />
        <FormInput 
          label="Email (Optional)" 
          name="email" 
          type="email"
          value={formData.email} 
          onChange={handleChange} 
          error={errors.email}
          placeholder="email@example.com"
        />
        <FormInput 
          label="Preferred Doctor (Optional)" 
          name="doctor" 
          value={formData.doctor} 
          onChange={handleChange}
          placeholder="Doctor name"
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="bg-medical-green text-white px-6 py-3 rounded-lg w-full mt-4 hover:bg-green-600 disabled:opacity-50 transition-colors font-semibold"
        >
          {loading ? 'Please wait...' : 'Next: Select Service →'}
        </button>
      </form>
    </div>
  );
};

export default PatientForm;