import React, { useState } from 'react';

const RazorpayCheckoutButton = ({
  amount = 100,
  currency = 'INR',
  prefillName = '',
  prefillEmail = '',
  prefillContact = '',
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Create Order
      const orderResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, receipt: 'receipt_' + Math.random().toString(36).substring(7) }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Step 2: Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Easwari Startup Peravai',
        description: 'Event Registration',
        image: '/peravai_logo.png',
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            // Step 3: Verify Payment Signature
            const verifyResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              if (onSuccess) onSuccess(verifyData);
            } else {
              alert('Payment verification failed!');
              if (onError) onError(verifyData);
            }
          } catch (err) {
            console.error('Error verifying payment', err);
            alert('Error verifying payment');
            if (onError) onError(err);
          }
        },
        prefill: {
          name: prefillName,
          email: prefillEmail,
          contact: prefillContact,
        },
        notes: {
          address: 'Easwari Engineering College',
        },
        theme: {
          color: '#a80d11',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        console.error(response.error);
        alert(response.error.description);
        if (onError) onError(response.error);
      });
      rzp1.open();
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.message);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-8 py-4 bg-[#a80d11] text-white font-black uppercase tracking-[0.15em] text-sm border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Pay with Razorpay
        </>
      )}
    </button>
  );
};

export default RazorpayCheckoutButton;
