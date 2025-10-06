import React, { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { X, CreditCard, Smartphone } from 'lucide-react';
import { createInterSendPayment } from '../../utils/paymentService';
import toast from 'react-hot-toast';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  item, 
  amount, 
  onSuccess 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayPalSuccess = async (details) => {
    try {
      await onSuccess(details);
      toast.success('Payment successful!');
      onClose();
    } catch (error) {
      toast.error('Payment processing failed');
    }
  };

  const handleInterSendPayment = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      const payment = await createInterSendPayment(
        amount,
        phoneNumber,
        `Purchase: ${item.title}`
      );
      
      if (payment.success) {
        await onSuccess(payment);
        toast.success('Payment initiated! Please complete on your phone.');
        onClose();
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Complete Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-900">{item.title}</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">${amount}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Payment Method
          </label>
          
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              <span>PayPal (Global)</span>
            </label>
            
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="intersend"
                checked={paymentMethod === 'intersend'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <Smartphone className="h-5 w-5 mr-2 text-green-600" />
              <span>InterSend (Kenya Mobile Money)</span>
            </label>
          </div>
        </div>

        {paymentMethod === 'paypal' && (
          <PayPalScriptProvider
            options={{
              "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
              currency: "USD"
            }}
          >
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: amount.toString()
                    },
                    description: item.title
                  }]
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                handlePayPalSuccess(details);
              }}
              onError={(err) => {
                toast.error('PayPal payment failed');
                console.error('PayPal error:', err);
              }}
              style={{
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'paypal'
              }}
            />
          </PayPalScriptProvider>
        )}

        {paymentMethod === 'intersend' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Kenya)
              </label>
              <input
                type="tel"
                placeholder="254XXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your Safaricom, Airtel, or Telkom number
              </p>
            </div>
            
            <button
              onClick={handleInterSendPayment}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Processing...' : `Pay KES ${(amount * 120).toFixed(0)}`}
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Secure payment powered by PayPal and InterSend
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;