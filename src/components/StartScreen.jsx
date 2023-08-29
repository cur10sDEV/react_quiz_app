import { useQuiz } from "../contexts/QuizContext";

const StartScreen = () => {
  const { numQuestions, dispatch } = useQuiz();

  return (
    <div className="start">
      <h2>Welcome To React Quiz!</h2>
      <h2>{numQuestions} questions to test your react mastery</h2>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's Start
      </button>
    </div>
  );
};
export default StartScreen;
