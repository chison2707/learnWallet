import { useNavigate } from "react-router-dom";

const LessonHeader = (props) => {
  const { title } = props;
  const navigate = useNavigate();

  return (
    <div className="bg-indigo-600 p-4 flex justify-between items-center">
      <button
        onClick={() => navigate(-1)}
        className="text-white hover:bg-white hover:text-indigo-600 border border-white transition-colors 
          duration-300 flex items-center cursor-pointer py-2 px-4 rounded-md"
      >
        <i className="fa-solid fa-backward-step mr-2"></i>
        Quay lại
      </button>
      <h1 className="text-xl font-bold text-white text-center flex-grow truncate px-4">
        {title || "Chọn một bài học"}
      </h1>
      <div className="w-24"></div>
    </div>
  );
};

export default LessonHeader;