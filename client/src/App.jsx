import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import HowItWorks from "./pages/HowItWorks/HowItWorks";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
<Route path="/howitworks" element={<HowItWorks />}/>
      </Routes>
    </>
  );
}

export default App;
