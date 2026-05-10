import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientAPI, paymentAPI } from '../services/api';
import PaymentButton from '../components/PaymentButton';

const Confirmation = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [tokenId, setTokenId] = useState(null);

  useEffect(() => {
    const patientData = JSON.parse(localStorage.getItem('patientData') || '{}');
    const selectedService = localStorage.getItem('selectedService') || '';
    const requiresPayment = localStorage.getItem('requiresPayment') === 'true';
    const amount = parseInt(localStorage.getItem('serviceAmount') || '0');
    
    if (!patientData.name || !selectedService) {
      navigate('/');
      return;
    }
    setData({ ...patientData, department: selectedService, requiresPayment, amount });
  }, [navigate]);

  const handleConfirm = async () => {
    if (!data) return;

    setLoading(true);
    setPaymentError('');
    try {
      const response = await patientAPI.create(data);
      const newTokenId = response.data.tokenId;
      setTokenId(newTokenId);
      localStorage.setItem('tokenId', newTokenId);

      if (data.requiresPayment) {
        const orderResponse = await paymentAPI.createOrder({ amount: data.amount, tokenId: newTokenId });
        setOrderData(orderResponse.data);
      } else {
        navigate('/token');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Confirmation failed. Please try again.';
      setPaymentError(errorMsg);
    }
    setLoading(false);
  };

  const handlePaymentSuccess = async (response) => {
    setLoading(true);
    try {
      await paymentAPI.verify({
        razorpayOrderId: orderData.orderId,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
        tokenId: tokenId
      });
      navigate('/token');
    } catch (error) {
      setPaymentError('Payment verification failed. Please contact support.');
    }
    setLoading(false);
  };

  const handlePaymentError = (err) => {
    setPaymentError(err || 'Payment failed. Try again.');
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Confirm Details</h2>
          <p className="text-sm text-gray-500">Please verify your information before proceeding</p>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-4 sm:p-6 mb-6 border border-gray-100">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b border-gray-200/50">
              <span className="text-sm text-gray-500 font-medium">Patient Name</span>
              <span className="text-sm sm:text-base font-bold text-gray-800 break-words">{data.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b border-gray-200/50">
              <span className="text-sm text-gray-500 font-medium">Age / Gender</span>
              <span className="text-sm sm:text-base font-semibold text-gray-800">{data.age} / {data.gender}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b border-gray-200/50">
              <span className="text-sm text-gray-500 font-medium">Phone</span>
              <span className="text-sm sm:text-base font-semibold text-gray-800">{data.phone}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b border-gray-200/50">
              <span className="text-sm text-gray-500 font-medium">Department</span>
              <span className="text-sm sm:text-base font-bold text-emerald-600">{data.department}</span>
            </div>
            {data.doctor && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b border-gray-200/50">
                <span className="text-sm text-gray-500 font-medium">Doctor</span>
                <span className="text-sm sm:text-base font-semibold text-gray-800">{data.doctor}</span>
              </div>
            )}
            {data.requiresPayment && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <span className="text-sm text-gray-500 font-medium">Amount</span>
                <span className="text-lg font-bold text-orange-600">₹{data.amount}</span>
              </div>
            )}
          </div>
        </div>

        {paymentError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{paymentError}</span>
          </div>
        )}

        {orderData ? (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Amount to pay</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">₹{orderData.amount}</p>
            </div>
            <PaymentButton 
              orderData={orderData} 
              onSuccess={handlePaymentSuccess} 
              onError={handlePaymentError} 
            />
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
              <p className="font-medium mb-1">💳 Test Card Details:</p>
              <p>Card: <strong>4100 2800 0000 1007</strong> | Any future expiry | Any 3-digit CVV</p>
            </div>
            <button 
              onClick={() => navigate('/service')} 
              className="text-gray-400 hover:text-emerald-600 text-sm w-full text-center transition-colors py-2"
            >
              ← Change Service
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              onClick={handleConfirm} 
              disabled={loading} 
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-500 text-white px-6 py-3.5 rounded-xl hover:from-emerald-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-base shadow-md hover:shadow-lg active:scale-[0.98] min-h-[48px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : 'Confirm & Generate Token'}
            </button>
            <button 
              onClick={() => navigate('/service')} 
              className="sm:flex-1 bg-white border-2 border-gray-200 text-gray-600 px-6 py-3.5 rounded-xl hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200 font-semibold text-base shadow-sm hover:shadow-md active:scale-[0.98] min-h-[48px]"
            >
              ← Change Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Confirmation;