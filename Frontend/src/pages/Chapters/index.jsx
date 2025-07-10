import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getChapters } from '../../../services/courseService';
import { ToastContainer, toast } from 'react-toastify';
import { getCookie } from '../../helpers/cookie';

const Chapters = () => {
  const { id: courseId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getCookie('token');

  useEffect(() => {
    const fetchChapters = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const result = await getChapters(courseId, token);

        if (result.code === 200) {
          setChapters(result.chapters);
        } else {
          toast.error(result.message || 'Không thể tải danh sách chương.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Đang tải...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600 bg-red-50 p-4 rounded-lg">Lỗi: {error}</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/courses" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 inline-flex items-center group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Quay lại danh sách khóa học
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-800 mt-4">Nội dung khóa học</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          <ul className="space-y-4">
            {chapters.map((chapter) => (
              <Link to={`/courses/chapter/${chapter.id}`}>
                <li key={chapter.id} className="flex items-center p-4 bg-gray-50 hover:bg-indigo-50 rounded-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-indigo-200 hover:shadow-sm">
                  <span className="flex-shrink-0 bg-indigo-500 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg mr-5">{chapter.position}</span>
                  <span className="text-lg font-medium text-gray-800">{chapter.title}</span>
                </li>
              </Link>
            ))}
          </ul>
          {chapters.length === 0 && <p className="text-center text-gray-500 py-10">Khóa học này chưa có chương nào.</p>}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
      />
    </>
  );
};

export default Chapters;