const StartScreen = ({ numQuestions, onBtnClick }) => {
  return (
    <div className="start">
      <h2>Welcome To React Quiz!</h2>
      <h2>{numQuestions} questions to test your react mastery</h2>
      <button className="btn btn-ui" onClick={onBtnClick}>
        Let's Start
      </button>
    </div>
  );
};
export default StartScreen;
