import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLessons, completeLesson } from '../../../services/courseService';
import { getCookie } from '../../helpers/cookie';
import { ToastContainer, toast } from 'react-toastify';
import LessonHeader from './LessonHeader';
import LessonVideo from './LessonVideo';
import LessonInfo from './LessonInfo';
import LessonSidebar from './LessonSidebar';

const Lesson = () => {
  const { chapterId } = useParams();
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

  const handleCompleteLesson = async (lessonId, watchedDuration) => {
    if (!lessonId) return;

    try {
      const result = await completeLesson(lessonId, { watchedDuration }, token);
      console.log(result);


      if (result.code === 200) {
        toast.success(result.message);
        const lessonsResult = await getLessons(chapterId, token);
        if (lessonsResult.code === 200) {
          setLessons(lessonsResult.lessons);
        }
      } else {
        toast.error(result.message || 'Không thể hoàn thành bài học.');
      }
    } catch (err) {
      toast.error(err.response.data.message || err.message || 'Có lỗi xảy ra khi hoàn thành bài học.');
    }
  };

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
        <div className="flex-grow lg:w-3/4 bg-white flex flex-col border-r">
          <LessonHeader title={currentLesson?.title} />
          <LessonVideo lesson={currentLesson} onComplete={handleCompleteLesson} />
          <LessonInfo lesson={currentLesson} />
        </div>
        <LessonSidebar
          lessons={lessons}
          currentLesson={currentLesson}
          setCurrentLesson={setCurrentLesson}
        />
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default Lesson;
