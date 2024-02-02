import Greeting from "./components/Greeting";
import LoginForm from "./components/LoginForm";
import NavBar from "./components/NavBar";
import RegisterForm from "./components/RegisterForm";
import NotFound from "./components/NotFound";
import SinglePlayerTTT from "./components/SinglePlayerTTT";
import MultiPlayerTTT from "./components/MultiPlayerTTT";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./styles.css";
import GameList from "./components/GameList";
import Game from "./components/Game";
import History from "./components/History";
import SpGameDisplay from "./components/SpGameDisplay";
import MpGameDisplay from "./components/MpGameDisplay";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

function App() {
  const navigate = useNavigate();
  const isAuthenticated = ():boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_API_ENDPOINT}/graphql`
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.extensions && err.extensions.code === 'UNAUTHENTICATED') {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });
  
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
  
    return {
      headers: {
        ...headers,
        authorization: token ? `${token}` : '',
      },
    };
  });
  
  const client = new ApolloClient({
    link: errorLink.concat(authLink).concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
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
          <Route path="/history">
            <Route index Component={ () => isAuthenticated() ? <History/> : <Navigate to="/login"/>}/>
            <Route path="sp/:id" Component={ () => isAuthenticated() ? <SpGameDisplay/> : <Navigate to="/login"/>}/>
            <Route path="mp/:id" Component={ () => isAuthenticated() ? <MpGameDisplay/> : <Navigate to="/login"/>}/>
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
    </ApolloProvider>
  );
}

export default App;
