import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const Sales = () => {
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalOrders: 0,
    orders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const res = await fetch('/api/orders/seller-sales', {
          credentials: 'include'
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        toast.error('Failed to load sales data');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <MonetizationOnIcon className="text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-600">Total Sales</p>
              <h3 className="text-2xl font-bold">₹{salesData.totalSales.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingBagIcon className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-600">Total Orders</p>
              <h3 className="text-2xl font-bold">{salesData.totalOrders}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Order History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {salesData.orders.map((order) => (
            <div key={order._id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <PersonIcon className="text-gray-400" />
                    <div>
                      <p className="font-medium">{order.customer.fullName}</p>
                      <p className="text-sm text-gray-500">{order.customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <CalendarTodayIcon fontSize="small" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className="text-xl font-bold text-indigo-600">
                  ₹{order.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="space-y-2">
                {order.products.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-gray-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sales; 