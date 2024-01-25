import Greeting from "./components/Greeting";
import LoginForm from "./components/LoginForm";
import NavBar from "./components/NavBar";
import RegisterForm from "./components/RegisterForm";
import NotFound from "./components/NotFound";
import SinglePlayerTTT from "./components/SinglePlayerTTT";
import MultiPlayerTTT from "./components/MultiPlayerTTT";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./styles.css";
import GameList from "./components/GameList";
import Game from "./components/Game";

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
          <Route path="/login" Component={() => !isAuthenticated() ? <LoginForm /> : <Navigate to="/"/>}/>
          <Route path="/register" Component={() => !isAuthenticated() ? <RegisterForm /> : <Navigate to="/"/>}/>
          <Route path="/sp-game" Component={() => isAuthenticated() ? <SinglePlayerTTT/>  : <Navigate to="/login"/>}/>
          <Route path="/mp-game">
            <Route index Component={() => isAuthenticated() ? <MultiPlayerTTT/> : <Navigate to="/login"/>}/>
            <Route path="existing-games" Component={ () => isAuthenticated() ? <GameList/>  : <Navigate to="/login"/>}/>
            <Route path="game" Component={() => isAuthenticated() ? <Game/> : <Navigate to="/login"/>}/>
          </Route>
          <Route path="/*" Component={ () => <Navigate to="/not-found"/>} />
          <Route path="/not-found" Component={NotFound}/>
        </Routes>
      </div>
      <Toaster position="top-left" 
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
              duration: 1500
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
            duration: 1500
          }
        }}/>
    </>
  );
}

export default App;
