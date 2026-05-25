const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <div className="w-20 h-20 border-4 border-transparent border-t-blue-400 rounded-full animate-spin flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-transparent border-t-red-400 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;
