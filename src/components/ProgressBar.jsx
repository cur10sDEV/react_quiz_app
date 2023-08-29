import { useQuiz } from "../contexts/QuizContext";

const ProgressBar = () => {
  const { index, points, answer, totalPoints, numQuestions } = useQuiz();

  return (
    <header className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {totalPoints} points
      </p>
    </header>
  );
};
export default ProgressBar;
