import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const initialState = {
  questions: [],
  // loading, error, ready, active, finished
  currentStatus: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};
const SECS_PER_QUESTION = 30;
const reducer = (state, action) => {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, currentStatus: "ready" };
    case "dataFailed":
      return { ...state, currentStatus: "error" };
    case "start":
      return {
        ...state,
        currentStatus: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const { correctOption, points } = state.questions[state.index];
      const pointsToAdd = correctOption === action.payload ? points : 0;
      return {
        ...state,
        answer: action.payload,
        points: state.points + pointsToAdd,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finished":
      return {
        ...state,
        currentStatus: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        currentStatus: "ready",
        questions: state.questions,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        currentStatus:
          state.secondsRemaining <= 0 ? "finished" : state.currentStatus,
      };
    default:
      throw new Error("Action Unknown");
  }
};
const QuizProvider = ({ children }) => {
  const [
    {
      questions,
      currentStatus,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:3000/questions");
        const data = await res.json();
        dispatch({ type: "dataRecieved", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    };
    fetchQuestions();
  }, []);

  const totalPoints =
    questions.length > 0
      ? questions.reduce((total, i) => (total += i.points), 0)
      : 0;

  const numQuestions = questions.length;

  const question = questions[index];

  return (
    <QuizContext.Provider
      value={{
        questions,
        currentStatus,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        totalPoints,
        numQuestions,
        question,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("QuizContext was used outside of QuizProvider");
  }
  return context;
};

export { QuizProvider, useQuiz };
