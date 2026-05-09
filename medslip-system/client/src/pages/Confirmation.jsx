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

      // For services that require payment, create order
      if (data.requiresPayment) {
        const orderResponse = await paymentAPI.createOrder({ amount: data.amount, tokenId: newTokenId });
        setOrderData(orderResponse.data);
      } else {
        // For free services, navigate directly to token display
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
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-medical-green">Confirm Details</h2>
      <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between">
          <span className="text-gray-600">Name:</span>
          <span className="font-semibold">{data.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Age / Gender:</span>
          <span className="font-semibold">{data.age} / {data.gender}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Phone:</span>
          <span className="font-semibold">{data.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Department:</span>
          <span className="font-semibold text-medical-green">{data.department}</span>
        </div>
        {data.doctor && (
          <div className="flex justify-between">
            <span className="text-gray-600">Doctor:</span>
            <span className="font-semibold">{data.doctor}</span>
          </div>
        )}
      </div>

      {paymentError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {paymentError}
        </div>
      )}

      {orderData ? (
        <div>
          <p className="text-center text-gray-600 mb-4">
            Amount to pay: <span className="font-bold text-lg">₹{orderData.amount}</span>
          </p>
          <PaymentButton 
            orderData={orderData} 
            onSuccess={handlePaymentSuccess} 
            onError={handlePaymentError} 
          />
          <button 
            onClick={() => navigate('/service')} 
            className="text-gray-500 mt-4 w-full text-center hover:text-gray-700"
          >
            ← Change Service
          </button>
        </div>
      ) : (
        <div>
          <button 
            onClick={handleConfirm} 
            disabled={loading} 
            className="bg-medical-green text-white px-6 py-3 rounded-lg w-full hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing...' : 'Confirm & Generate Token'}
          </button>
          <button 
            onClick={() => navigate('/service')} 
            className="text-gray-500 mt-4 w-full text-center hover:text-gray-700"
          >
            ← Change Service
          </button>
        </div>
      )}
    </div>
  );
};

export default Confirmation;