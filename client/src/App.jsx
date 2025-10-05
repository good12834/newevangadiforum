import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import { UserProvider } from "./context/UserProvider";
import AskQuestion from "./pages/AskQuestion/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail/QuestionDetail";

function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/questions/:questionId" element={<QuestionDetail />} />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
