// 0 <= currentProgress <= 100
const ProgressBar = ({ currentProgress }) => {
  return (
    <div>
      <div className="progress" role="progressbar" aria-label="progress">
        <div
          className="progress-bar"
          style={{ width: `${currentProgress}%` }}
        ></div>
      </div>
      <p className="mt-3">Progress: {currentProgress}%</p>
    </div>
  );
};

export default ProgressBar;
