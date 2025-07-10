import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessons } from '../../../services/courseService';
import { getCookie } from '../../helpers/cookie';
import FormatDuration from './FormatDuration';
import { ToastContainer, toast } from 'react-toastify';

const Lesson = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getCookie('token');

  useEffect(() => {
    const fetchLessons = async () => {
      if (!chapterId) return;

      try {
        setLoading(true);
        const result = await getLessons(chapterId, token);

        if (result.code === 200) {
          setLessons(result.lessons);
          if (result.lessons.length > 0) {
            setCurrentLesson(result.lessons[0]);
          }
        } else {
          toast.error(result.message || 'Không thể tải danh sách bài học.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [chapterId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Đang tải bài học...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 bg-red-50 p-4 rounded-lg">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <>
      <div className="my-10 flex flex-col lg:flex-row h-screen bg-gray-50">
        {/* Khu vực xem bài học */}
        <div className="flex-grow lg:w-3/4 bg-white flex flex-col border-r">
          <div className="bg-indigo-400 p-4 flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white hover:text-indigo-600 border border-white transition-colors 
                duration-300 flex items-center cursor-pointer py-2 px-4 rounded-md"
            >
              <i className="fa-solid fa-backward-step mr-2"></i>
              Quay lại
            </button>
            <h1 className="text-xl font-bold text-white text-center flex-grow truncate px-4">
              {currentLesson ? currentLesson.title : 'Chọn một bài học'}
            </h1>
            <div className="w-24"></div>
          </div>

          <div className="flex-grow flex items-center justify-center">
            {currentLesson && currentLesson.videoUrl ? (
              <video
                key={currentLesson.id}
                className="w-full max-w-full max-h-full"
                controls
                autoPlay
                src={currentLesson.videoUrl}
              >
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            ) : (
              <div className="text-gray-500 text-2xl">
                Vui lòng chọn một bài học để bắt đầu
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-100 text-gray-800">
            <h2 className="text-2xl font-bold mb-2">{currentLesson?.title}</h2>
            <div className="flex items-center text-gray-600">
              <i className="fa-solid fa-clock mr-2"></i>
              <span>Thời lượng: {FormatDuration(currentLesson?.duration)}</span>
              <span className="mx-4">|</span>
              <i className="fa-solid fa-dollar-sign mr-2"></i>
              <span>Phần thưởng: {currentLesson?.token} tokens</span>
            </div>
          </div>
        </div>

        <div className="lg:w-1/4 bg-white flex flex-col h-full shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Danh sách bài học</h2>
          </div>
          <ul className="flex-grow overflow-y-auto">
            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <li key={lesson.id}>
                  <button
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full text-left p-4 flex items-start transition-colors cursor-pointer duration-200
                      ${currentLesson?.id === lesson.id
                        ? ' text-indigo-800 hover:bg-gray-200'
                        : 'hover:bg-gray-200'
                      }`}
                  >
                    <span
                      className={`mr-4 text-lg font-bold ${currentLesson?.id === lesson.id
                        ? 'text-indigo-600'
                        : 'text-gray-400'
                        }`}
                    >
                      {lesson.position}
                    </span>
                    <div className="flex-grow">
                      <h3 className="font-semibold">{lesson.title}</h3>
                      <p className="text-sm text-gray-500">
                        {FormatDuration(lesson.duration)}
                      </p>
                    </div>
                  </button>
                </li>
              ))
            ) : (
              <p className="p-4 text-gray-500">Chương này chưa có bài học.</p>
            )}
          </ul>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default Lesson;
