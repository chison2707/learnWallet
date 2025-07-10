import FormatDuration from './FormatDuration';

const LessonInfo = (props) => {
  const { lesson } = props;
  return (
    <div className="p-6 bg-gray-100 text-gray-800">
      <h2 className="text-2xl font-bold mb-2">{lesson?.title}</h2>
      <div className="flex items-center text-gray-600">
        <i className="fa-solid fa-clock mr-2"></i>
        <span>Thời lượng: {FormatDuration(lesson?.duration)}</span>
        <span className="mx-4">|</span>
        <i className="fa-solid fa-dollar-sign mr-2"></i>
        <span>Phần thưởng: {lesson?.token} tokens</span>
      </div>
    </div>
  );
};

export default LessonInfo;