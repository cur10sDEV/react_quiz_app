import { useEffect, useReducer } from "react";
import "./App.css";
import {
  Header,
  Main,
  Loader,
  Error,
  Question,
  StartScreen,
  ProgressBar,
  FinishScreen,
  Footer,
  NextButton,
  Timer,
} from "./components";

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

function App() {
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

  const numQuestions = questions.length;
  const totalPoints =
    questions.length > 0
      ? questions.reduce((total, i) => (total += i.points), 0)
      : 0;

  return (
    <div className="app">
      <Header />
      <Main>
        {currentStatus === "loading" && <Loader />}
        {currentStatus === "error" && <Error />}
        {currentStatus === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            onBtnClick={() => dispatch({ type: "start" })}
          />
        )}
        {currentStatus === "active" && (
          <>
            <ProgressBar
              numQuestions={numQuestions}
              index={index}
              points={points}
              totalPoints={totalPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {currentStatus === "finished" && (
          <FinishScreen
            points={points}
            totalPoints={totalPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
