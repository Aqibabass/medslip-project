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
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      localStorage.setItem('patientData', JSON.stringify(formData));
      navigate('/service');
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <>
      {/* Form Content - has padding bottom on mobile for sticky button */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 sm:pb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Patient Details
            </h2>
            <p className="text-sm sm:text-base text-gray-500">Enter your details to get started</p>
          </div>
          
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-1">
              <FormInput 
                label="Full Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                error={errors.name}
                placeholder="Enter your full name"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white text-sm ${
                      errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1.5">{errors.gender}</p>}
                </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>
            </div>

            {/* Desktop Button - hidden on mobile, shown on sm+ */}
            <button 
              type="submit" 
              disabled={loading} 
              className="hidden sm:flex bg-gradient-to-r from-emerald-600 to-green-500 text-white px-8 py-3.5 rounded-xl w-full mt-6 hover:from-emerald-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-base items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Please wait...
                </span>
              ) : 'Next: Select Service →'}
            </button>
          </form>
        </div>
      </div>

      {/* Sticky Bottom Button - Mobile Only */}
      <div className="sticky-bottom sm:hidden">
        <button 
          onClick={handleSubmit}
          disabled={loading} 
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
          ) : 'Next: Select Service →'}
        </button>
      </div>
    </>
  );
};

export default PatientForm;