import { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import toast from 'react-hot-toast';

interface Props {
  time: number;
}

function SinglePlayerTTT(time:Props) {
  const [userSymbol, setUserSymbol] = useState('X');
  const [moves, setMoves] = useState(Array(9).fill('null'));
  const [board, setBoard] = useState(Array(9).fill('null'));
  
  const [message, setMessage] = useState('Single Player');
  const [visibility, setVisibility] = useState(true);

  const getGame = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sp-game/create-or-get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        setBoard(data.boardState);

        if (data.computerSymbol === 'null') {
          setVisibility(true);
          setMessage('Please Choose Symbol');
        }
        else {
          setVisibility(false);
          setMessage('Single Player');
        }

        setMoves(data.moves);
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error while trying fetch game data:', error);
    }
  };

  const setSymbol = async (symbol:string) => {
    try {
      const response = await fetch('http://localhost:5000/api/sp-game/set-symbol', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({computerSymbol: symbol})
      });
      
      if (response.ok) {
        setVisibility(false);
        setMessage('Single Player');
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error while trying fetch game data:', error);
    }
  };

  const makeMove = async (updatedBoardState:string[], updatedMoves:string[]) => {
    try {
      const response = await fetch('http://localhost:5000/api/sp-game/make-move', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({boardState: updatedBoardState, moves: updatedMoves})
      });
      
      const data = await response.json();
      if (response.ok) {
        setMoves(data.moves);
        setTimeout(() => setBoard(data.boardState), 200);
        
        if (data.winner !== 'ongoing') {
          if (data.winner === 'user') toast.success(`You've won. Congratulations!`);
          else if (data.winner === 'computer') toast.error(`You've lost.`);
          else toast.success(`Game ended in a draw.`, {
            style: {
                    border: '2px solid black',
                    background: 'yellow'
                   },
            duration: 3000
          });

          setTimeout(async () => await getGame(), 1000);
        }
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error while trying fetch game data:', error);
    }
  };

	useEffect(() => {
		getGame();

		return () => {};
  }, [time]);

  const handleChooseSymbolClick = async (symbol:string) => {
    if (symbol === 'X') {
      setUserSymbol('X')
      await setSymbol('O');
    }
    else {
      setUserSymbol('O')
      await setSymbol('X');
    }
  };

  const handleClick = async (index: number) => {
    if (board[index] === 'X' || board[index] === 'O') return;
  
    const newBoard = board.slice();
    newBoard[index] = userSymbol;
    setBoard(newBoard);

    const newMoves = moves.slice();
    for(let i = 0; i < newMoves.length; i++)
    {
      if(newMoves[i] === 'null') {
        newMoves[i] = `${i + 1}P_${userSymbol}_${index}`;
        break;
      }
    }
    setMoves(newMoves);

    await makeMove(newBoard, newMoves);
  };

  const renderSquare = (index: number) => (
    <Button
      variant="outlined"
      style={{ width: '200px', height: '200px', fontSize: '24px',
      color: board[index] !== 'null' ? (board[index] === 'X' ? '#0f4b8c' : '#44af16') : '#e00b0e',
      borderColor: board[index] !== 'null' ? (board[index] === 'X' ? '#0f4b8c' : '#44af16') : '#e00b0e',
      background: board[index] === 'null' ? '#e00b0e' : undefined
    }}
      onClick={() => {handleClick(index)}}
    >
      {board[index] === 'X' ? <CloseIcon style={{ fontSize: '150px' }}/> :
       board[index] === 'O' ? <RadioButtonUncheckedIcon style={{ fontSize: '150px' }}/> : null}
    </Button>
  );

  return (
    <>
			<Box textAlign="center">
      <Typography variant="h2" color="primary" gutterBottom justifyContent="center">
        {message}
      </Typography>
      <Box display="flex" justifyContent="center" mb={1} style={{ visibility: !visibility ? 'hidden' : 'visible'}}>
        <Button
          disabled = {!visibility}
          variant="outlined"
          style={{ width: '100px', height: '100px', fontSize: '24px', marginRight: '5px', color: '#0f4b8c', borderColor: '#0f4b8c' }}
          onClick={() => {handleChooseSymbolClick('X');}}
        >
          <CloseIcon style={{ fontSize: '100px' }} />
        </Button>
        <Button
          disabled = {!visibility}
          variant="outlined"
          style={{ width: '100px', height: '100px', fontSize: '24px', marginLeft: '5px', color: '#44af16', borderColor: '#44af16' }}
          onClick={() => {handleChooseSymbolClick('O');}}
        >
          <RadioButtonUncheckedIcon style={{ fontSize: '100px' }} />
        </Button>
        </Box>
      </Box>
      <Grid container spacing={0.5} style={{ visibility: visibility ? 'hidden' : 'visible'}}>
        {[0, 1, 2].map((row) => (
          <Grid container item key={row} justifyContent="center" spacing={0.5}>
            {[0, 1, 2].map((col) => (
              <Grid item key={col}>
								{renderSquare(row * 3 + col)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default SinglePlayerTTT;
