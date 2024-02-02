import { Box, Button, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from '@apollo/client';
import { JwtPayload, jwtDecode } from "jwt-decode";

const HAS_GAME = gql`
  query HasGame($userId: ID!) {
    hasGame(userId: $userId) {
      condition
      gameId
    }
  }
`;

const CREATE_NEW_GAME = gql`
  mutation CreateNewGame($userId: ID!, $creatorSymbol: String!) {
    createNewGame(userId: $userId, creatorSymbol: $creatorSymbol) {
      condition
      gameId
    }
  }
`;

function MultiPlayerTTT() {
  const navigate = useNavigate();

  const [renderChoicePrompt, setRenderChoicePrompt] = useState(false);
  const [renderNewGamePrompt, setRenderNewGamePrompt] = useState(false);

  const jwt = localStorage.getItem('token') || null;
  let userId = -1;
  if (jwt){
      let decoded:JwtPayload = jwtDecode(jwt);
      if ('id' in decoded) userId = decoded.id as number;
  }
  
  const { error, refetch } = useQuery(HAS_GAME, {
    variables: { userId }, skip: true
  });

  const [createNewGame] = useMutation(CREATE_NEW_GAME);

  const hasGame = useCallback(async () => {
    try {
      const result = await refetch();
      const data = result.data.hasGame;
      if (error) {
        toast.error(`Error: ${error.message}`);
        console.error('Error while trying to fetch game data:', error);
        return;
      }

      if (!data.condition) {
        setRenderChoicePrompt(true);
      } else {
        localStorage.setItem('gameId', data.gameId.toString());
        setTimeout(() => navigate('/mp-game/game'), 500);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error while trying to fetch game data:', error);
    }
  }, [error, refetch, navigate]);

  useEffect(() => {
		hasGame();

		return () => {};
  }, [hasGame]);

  const handleClickNewGame = () => {
    setRenderChoicePrompt(false);
    setRenderNewGamePrompt(true);
  };

  const handleClickShowExistingGames = () => setTimeout(() => navigate('/mp-game/existing-games'), 200);

  const handleChooseSymbolClick = async (symbol:string) => {
    try {
      const { data } = await createNewGame({
        variables: { userId, creatorSymbol: symbol }
      });
      
      if (data.createNewGame.condition) {
        localStorage.setItem('gameId', data.createNewGame.gameId.toString());
        toast.success('Game created successfully.');
        setTimeout(() => navigate('/mp-game/game'), 200);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error while trying to fetch game data:', error);
    }
  };

  const choicePrompt = 
    <>
      <Box textAlign="center" style={{ marginTop: '100px' }}>
      <Box display="flex" justifyContent="center" mb={1} style={{ visibility: 'visible'}}>
        <Button
          variant="outlined"
          style={{ fontSize: '24px', marginRight: '10px', color: '#0f4b8c', borderColor: '#0f4b8c' }}
          onClick={handleClickNewGame}
        >
          Create New Game
        </Button>
        <Box border={1} borderRadius={1} padding={2} textAlign="center">
          <Typography variant="h2" color="primary">
            OR
          </Typography>
        </Box>
        <Button
          variant="outlined"
          style={{ fontSize: '24px', marginLeft: '10px', color: '#44af16', borderColor: '#44af16' }}
          onClick={handleClickShowExistingGames}
        >
          Join Existing Game
        </Button>
        </Box>
      </Box>
    </>

  const newGamePrompt =
    <>
      <Box textAlign="center">
        <Typography variant="h2" color="primary" gutterBottom justifyContent="center">
          Please Choose Symbol
        </Typography>
        <Box display="flex" justifyContent="center" mb={1}>
          <Button
            variant="outlined"
            style={{ width: '100px', height: '100px', fontSize: '24px', marginRight: '5px', color: '#0f4b8c', borderColor: '#0f4b8c' }}
            onClick={() => {handleChooseSymbolClick('X');}}
          >
            <CloseIcon style={{ fontSize: '100px' }} />
          </Button>
          <Button
            variant="outlined"
            style={{ width: '100px', height: '100px', fontSize: '24px', marginLeft: '5px', color: '#44af16', borderColor: '#44af16' }}
            onClick={() => {handleChooseSymbolClick('O');}}
          >
            <RadioButtonUncheckedIcon style={{ fontSize: '100px' }} />
          </Button>
        </Box>
      </Box>
    </>
  
  return (
    renderChoicePrompt ? choicePrompt : renderNewGamePrompt ? newGamePrompt : <></>
                                                                              // <Box
                                                                              //   sx={{
                                                                              //     textAlign: "center",
                                                                              //     display: "flex",
                                                                              //     flexDirection: "column",
                                                                              //     alignItems: "center",
                                                                              //     justifyContent: "center",
                                                                              //     margin: "auto",
                                                                              //     marginTop: "30vh"
                                                                              //   }}
                                                                              // >
                                                                              //   <Typography variant="h2" color="error">
                                                                              //     Something Went Wrong. Please Try Again Later
                                                                              //   </Typography>
                                                                              // </Box>
  );
};

export default MultiPlayerTTT;
