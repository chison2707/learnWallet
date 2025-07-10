import FormatDuration from './FormatDuration';

const LessonSidebar = (props) => {
  const { lessons, currentLesson, setCurrentLesson } = props;
  return (
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
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'hover:bg-indigo-50'
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
  );
};

export default LessonSidebar;