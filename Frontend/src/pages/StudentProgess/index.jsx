import { useEffect, useState } from 'react';
import { getCookie } from '../../helpers/cookie';
import { StudentProgress } from '../../../services/userService';
import { useParams } from 'react-router-dom';
import InfoCard from './InfoCard';
import FormatDuration from './FormatDuration';
import FormatDate from './FormatDate';

const StudentProgess = () => {
  const { id } = useParams();
  const token = getCookie("token");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await StudentProgress(id, token);

        if (result.code === 200) {
          setData(result);
        } else {
          setError("Không tìm thấy dữ liệu.");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) return <div className="text-center mt-10 text-gray-600">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!data) return null;

  const { student, wallet, transactions, progress } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin học viên</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoCard title="Họ và tên" value={student?.fullName} />
              <InfoCard title="Email" value={student?.email} />
              <InfoCard title="Số điện thoại" value={student?.phone} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium mb-2">Số dư ví</h3>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              <p className="text-4xl font-bold">{wallet?.balance || 0}</p>
            </div>
            <p className="mt-1 text-indigo-200">tokens</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tiến độ học tập</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="p-3">Khóa học</th>
                  <th className="p-3">Bài học</th>
                  <th className="p-3 text-center">Trạng thái</th>
                  <th className="p-3 text-center">Thời lượng</th>
                  <th className="p-3 text-center">Ngày hoàn thành</th>
                  <th className="p-3 text-right">Token thưởng</th>
                </tr>
              </thead>
              <tbody>
                {progress.length > 0 ? progress.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">{item.coursetitle}</td>
                    <td className="p-3">
                      <p className="font-medium">{item.lessontitle}</p>
                      <p className="text-sm text-gray-500">{item.chaptertitle}</p>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.completed ? 'Hoàn thành' : 'Đang học'}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono text-gray-600">
                      {FormatDuration(item.watchedduration)} / {FormatDuration(item.videoduration)}
                    </td>
                    <td className="p-3 text-center text-gray-600">{FormatDate(item.completedat)}</td>
                    <td className="p-3 text-right font-semibold text-green-600">{item.tokenrewarded || 0}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center p-4 text-gray-500">Chưa có tiến độ học tập.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lịch sử giao dịch</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="p-3">Ngày</th>
                  <th className="p-3">Mô tả</th>
                  <th className="p-3 text-center">Loại</th>
                  <th className="p-3 text-right">Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? transactions.map(tx => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">{FormatDate(tx.createdAt)}</td>
                    <td className="p-3">{tx.description}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tx.type === 'reward' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {tx.type === 'reward' ? 'Thưởng' : 'Hoàn tiền'}
                      </span>
                    </td>
                    <td className={`p-3 text-right font-bold ${tx.type === 'reward' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'reward' ? '+' : '-'} {tx.amount}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center p-4 text-gray-500">Chưa có giao dịch nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProgess;
