import { useState, useEffect } from 'react';
import { getWallet } from '../../../services/walletService';
import { getCookie } from '../../helpers/cookie';
import { ToastContainer, toast } from 'react-toastify';

const Wallet = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = getCookie('token');

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await getWallet(token);

        if (result.code === 200) {
          setBalance(result.balance.balance);
        } else {
          toast.error(result.message || 'Không thể tải thông tin ví.');
        }
      } catch (err) {
        console.error("Error fetching wallet:", err);
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' 🪙';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-md mx-auto" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Ví thưởng</h1>

        <div className="max-w-2xl mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium opacity-80">Số dư hiện tại</h2>
            <i class="fa-solid fa-money-bills text-xl"></i>
          </div>
          <p className="text-5xl font-bold tracking-tight">
            {balance !== null ? formatCurrency(balance) : '...'}
          </p>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default Wallet;