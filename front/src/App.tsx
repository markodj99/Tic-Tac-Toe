import Greeting from "./components/Greeting";
import LoginForm from "./components/LoginForm";
import NavBar from "./components/NavBar";
import RegisterForm from "./components/RegisterForm";
import { Routes, Route, Navigate } from "react-router-dom";
import "./styles.css";
import NotFound from "./components/NotFound";
import { Toaster } from "react-hot-toast";

function App() {
  const isAuthenticated = ():boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  return (
    <>
      <div id="navbar-div">
        <NavBar/>
      </div>
      <div id="main-div" className="main-div">
        <Routes>
          <Route path="/" Component={Greeting}/>
          <Route path="/login" Component={() => !isAuthenticated() ? (<LoginForm />) : (<Navigate to="/" />)}/>
          <Route path="/register" Component={() => !isAuthenticated() ? (<RegisterForm />) : (<Navigate to="/" />)}/>
          <Route path="/*" element={<Navigate to="/not-found" />} />
          <Route path="/not-found" element={<NotFound/>} />
        </Routes>
      </div>
      <Toaster position="bottom-center" 
        toastOptions={{
          success: {
            style: {
              border: '2px solid black',
              background: 'green',
              width: '300px',
              height: '80px',
              fontSize: "20px",
              color: "black"
            },
              duration: 3000
          },
          error: {
            style: {
              border: '2px solid black',
              background: 'red',
              width: '300px',
              height: '80px',
              fontSize: "20px",
              color: "black"
            },
            duration: 6000
          }
        }}/>
    </>
  );
}

export default App;
