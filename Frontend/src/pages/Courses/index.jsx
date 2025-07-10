import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../../helpers/cookie';
import { getCourses } from '../../../services/courseService';
import { ToastContainer, toast } from 'react-toastify';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getCookie('token');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getCourses(token);

        if (result.code === 200) {
          setCourses(result.courses);
        } else {
          toast.error(result.message || 'Không thể tải danh sách khóa học.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  if (loading) {
    return <div className="text-center p-10">Đang tải danh sách khóa học...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Lỗi: {error}</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-left text-gray-800">Khám phá các khóa học</h1>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {courses.map((course) => (
              <Link to={`/courses/${course.id}`} key={course.id} className="group bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 block">
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover"
                    src={course.thumbnail}
                    alt={course.title}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 h-14 overflow-hidden text-gray-900">{course.title}</h2>
                  <p className="text-gray-600 text-sm h-20 overflow-hidden text-ellipsis">{course.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(course.createdat).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="text-indigo-600 group-hover:text-indigo-800 font-medium">
                      Xem chi tiết →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 text-gray-500">Không có khóa học nào để hiển thị.</div>
        )}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
      />
    </>
  );
};

export default Courses;