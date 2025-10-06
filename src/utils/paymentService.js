// PayPal Payment Service
export const createPayPalOrder = async (amount, currency = 'USD') => {
  try {
    const response = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency
      })
    });
    
    const order = await response.json();
    return order;
  } catch (error) {
    console.error('PayPal order creation failed:', error);
    throw error;
  }
};

export const capturePayPalOrder = async (orderID) => {
  try {
    const response = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderID })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('PayPal order capture failed:', error);
    throw error;
  }
};

// InterSend Payment Service (Kenya)
export const createInterSendPayment = async (amount, phoneNumber, description) => {
  try {
    const response = await fetch('/api/intersend/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_INTERSEND_API_KEY}`
      },
      body: JSON.stringify({
        amount,
        phoneNumber,
        description,
        merchantId: process.env.REACT_APP_INTERSEND_MERCHANT_ID
      })
    });
    
    const payment = await response.json();
    return payment;
  } catch (error) {
    console.error('InterSend payment creation failed:', error);
    throw error;
  }
};

export const checkInterSendPaymentStatus = async (transactionId) => {
  try {
    const response = await fetch(`/api/intersend/payment-status/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_INTERSEND_API_KEY}`
      }
    });
    
    const status = await response.json();
    return status;
  } catch (error) {
    console.error('InterSend payment status check failed:', error);
    throw error;
  }
};