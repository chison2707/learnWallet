import { useRef, useEffect, useState } from 'react';

const LessonVideo = ({ lesson, onComplete }) => {
  const videoRef = useRef(null);
  const [completionTriggered, setCompletionTriggered] = useState(false);
  const [preventSeek, setPreventSeek] = useState(true);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    setCompletionTriggered(false);
    setPreventSeek(true);
    lastTimeRef.current = 0;
  }, [lesson]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !lesson || typeof onComplete !== 'function') return;

    const handleTimeUpdate = () => {
      const { currentTime, duration } = videoElement;

      if (preventSeek && currentTime > lastTimeRef.current + 1.5) {
        videoElement.currentTime = lastTimeRef.current;
      } else {
        lastTimeRef.current = currentTime;
      }

      if (currentTime >= 300 && preventSeek) {
        setPreventSeek(false);
      }

      const ratio = duration ? currentTime / duration : 0;
      if (ratio > 0.9 && !completionTriggered) {
        setCompletionTriggered(true);
        onComplete(lesson.id, currentTime);
      }
    };

    const handlePause = () => {
      const { currentTime } = videoElement;
      onComplete(lesson.id, currentTime);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [lesson, onComplete, completionTriggered, preventSeek]);

  return (
    <div className="flex-grow flex items-center justify-center bg-black">
      {lesson?.videoUrl ? (
        <video
          ref={videoRef}
          key={lesson.id}
          className="w-full max-w-full max-h-full"
          controls
          autoPlay
          src={lesson.videoUrl}
        >
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      ) : (
        <div className="text-gray-400 text-2xl">
          Vui lòng chọn một bài học để bắt đầu
        </div>
      )}
    </div>
  );
};

export default LessonVideo;
