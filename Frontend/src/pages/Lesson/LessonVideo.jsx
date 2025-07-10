const LessonVideo = (props) => {
  const { lesson } = props;
  return (
    <div className="flex-grow flex items-center justify-center">
      {lesson?.videoUrl ? (
        <video
          key={lesson.id}
          className="w-full max-w-full max-h-full"
          controls
          autoPlay
          src={lesson.videoUrl}
        >
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      ) : (
        <div className="text-gray-500 text-2xl">
          Vui lòng chọn một bài học để bắt đầu
        </div>
      )}
    </div>
  );
};

export default LessonVideo;
