import { Box, Button, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useNavigate } from "react-router-dom";
import { fetchWithIntercep } from "../FetchWithIntercep";

function MultiPlayerTTT() {
  const navigate = useNavigate();

  const [renderChoicePrompt, setRenderChoicePrompt] = useState(false);
  const [renderNewGamePrompt, setRenderNewGamePrompt] = useState(false); 

  const hasGame = useCallback(async () =>{
    try {
      const {isOk, data} = await fetchWithIntercep<any>('api/mp-game/has-game', 'GET', navigate);   

      if (isOk) {
        if (!data.condition) {
          setRenderChoicePrompt(true);
        } else {
          localStorage.setItem('gameId', data.gameId.toString());
          setTimeout(() => navigate('/mp-game/game'), 500);
        }
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error while trying to fetch game data:', error);
    }
  }, [navigate]);

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
      const {isOk, data} = await fetchWithIntercep<any>('api/mp-game/create-new', 'POST', navigate, { creatorSymbol: symbol });   

      if (isOk) {
        if (data.condition) {
          localStorage.setItem('gameId', data.gameId.toString());
          toast.success('Game created successfully.');
          setTimeout(() => navigate('/mp-game/game'), 200);
        }
      } else {
        toast.error('Something went wrong. Please try again later.');
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
  );
};

export default MultiPlayerTTT;
