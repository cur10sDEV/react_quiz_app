import { useQuiz } from "../contexts/QuizContext";

const Options = () => {
  const { questions, dispatch, answer, index } = useQuiz();
  const { correctOption, options } = questions[index];
  const hasAnswered = answer !== null;
  return (
    <div className="options">
      {options.map((option, i) => {
        return (
          <button
            className={`btn btn-option ${i === answer ? "answer" : ""} ${
              hasAnswered ? (correctOption === i ? "correct" : "wrong") : ""
            }`}
            key={option}
            onClick={() => dispatch({ type: "newAnswer", payload: i })}
            disabled={hasAnswered}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};
export default Options;
