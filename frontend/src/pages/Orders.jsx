import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/customer', {
          credentials: 'include'
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message);
        
        setOrders(data.orders);
        setTotalSpent(data.totalSpent);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Your Orders</h1>
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          >
            <ArrowBackIcon /> Back to Shopping
          </button>
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <MonetizationOnIcon />
          <span>Total Spent: ₹{totalSpent.toLocaleString()}</span>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-4">Start shopping to see your orders here</p>
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                    <p className="text-sm text-gray-500">
                      Placed on: {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className="text-xl font-bold text-indigo-600">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {order.products.map((item) => (
                  <div key={item._id} className="p-6 flex items-center gap-6">
                    <div className="w-20 h-20">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                          <InventoryIcon className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-gray-600">
                        Price per item: ₹{item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-indigo-600">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 