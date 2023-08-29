import { useQuiz } from "../contexts/QuizContext";
import { Options } from "./";

const Question = () => {
  const { question } = useQuiz();

  return (
    <div className="">
      <h4>{question.question}</h4>
      <Options />
    </div>
  );
};
export default Question;
