import { useState } from 'react';

const PaymentButton = ({ orderData, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        onError('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount * 100, // amount in paise
        currency: orderData.currency || 'INR',
        name: 'MedSlip Hospital',
        description: 'Token Payment',
        order_id: orderData.orderId,
        handler: function (response) {
          onSuccess(response);
          setLoading(false);
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        notes: {
          address: 'MedSlip Hospital'
        },
        theme: {
          color: '#10B981'
        },
        modal: {
          ondismiss: function () {
            onError('Payment cancelled by user');
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      onError(error.message || 'Payment failed to initialize');
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-medical-green text-white px-6 py-3 rounded-lg hover:bg-green-600 w-full disabled:opacity-50 transition-colors"
      >
        {loading ? 'Processing Payment...' : `Pay Now ₹${orderData.amount}`}
      </button>
    </div>
  );
};

export default PaymentButton;