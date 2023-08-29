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
import { useQuiz } from "./contexts/QuizContext";

function App() {
  const { currentStatus } = useQuiz();

  return (
    <div className="app">
      <Header />
      <Main>
        {currentStatus === "loading" && <Loader />}
        {currentStatus === "error" && <Error />}
        {currentStatus === "ready" && <StartScreen />}
        {currentStatus === "active" && (
          <>
            <ProgressBar />
            <Question />
            <Footer>
              <Timer />
              <NextButton />
            </Footer>
          </>
        )}
        {currentStatus === "finished" && <FinishScreen />}
      </Main>
    </div>
  );
}

export default App;
