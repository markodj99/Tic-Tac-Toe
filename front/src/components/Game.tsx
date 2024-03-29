import { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import toast from 'react-hot-toast';
import { Socket, io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { JwtPayload, jwtDecode } from 'jwt-decode';


interface GameState {
  creatorId: number,
  joinerId: number,
  creatorSymbol: string,
  joinerSymbol: string,
  turnToMove: number,
  moves: string[],
  boardState: string[]
}

interface UpdatedGameStatus {
  boardState: string[],
  moves: string[],
  winner: number,
  turnToMove: number
}

function Game() {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(9).fill('null'));
  const [moves, setMoves] = useState(Array(9).fill('null'));
  const [canClick, setCanClick] = useState(false);
  const [userSymbol, setUserSymbol] = useState('X');
  const [playerId, setPlayerId] = useState(-1);
  const [message, setMessage] = useState('Multi Player');
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const jwt = localStorage.getItem('token') || null;
    let userId = -1;
    if (jwt) {
        let decoded:JwtPayload = jwtDecode(jwt);
        if ('id' in decoded) userId = decoded.id as number;
    }

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.connect();
    newSocket.on('connect', () => {
      const gameId = localStorage.getItem('gameId');
      const token = localStorage.getItem('token');

      newSocket.emit('joinGame', gameId);
      newSocket.emit('getState', gameId, token);
      newSocket.on('getStateResponse', (response:GameState) => {
        setBoard(response.boardState);
        setMoves(response.moves);

        if (userId === response.creatorId) {
          setUserSymbol(response.creatorSymbol);
          setPlayerId(response.creatorId);
          if (response.joinerId === -1) {
            setMessage('Waiting For An Opponent To Join'); 
            setCanClick(false);
          } else if (response.turnToMove === userId){
            setMessage('Your Turn To Move'); 
            setCanClick(true);
          } else {
            setMessage('Waiting For An Opponent To Make A Move'); 
            setCanClick(false);
          }
        } else {
          setUserSymbol(response.joinerSymbol);
          setPlayerId(response.joinerId);

          if (response.turnToMove === userId) {
            setMessage('Your Turn To Move'); 
            setCanClick(true);
          } else {
            setMessage('Waiting For An Opponent To Make A Move'); 
            setCanClick(false);
          }
        }
      });
    });

    newSocket.on('makeMoveResponse', (response:UpdatedGameStatus) => {
      setBoard(response.boardState);
      setMoves(response.moves);
      if (response.winner !== -1) {
        if (response.winner === userId) toast.success(`You've won. Congratulations!`);
        else if (response.winner === 0) toast.success(`Game ended in a draw.`, {
          style: {
                  border: '2px solid black',
                  background: 'yellow'
                 },
          duration: 1200
        });
        else toast.error(`You've lost.`);

        localStorage.removeItem('gameId');
        setTimeout(() => navigate('/mp-game'), 500);
      } else {
        if (response.turnToMove === userId) {
          setCanClick(true);
          setMessage('Your Turn To Move');
        }
        else {
          setCanClick(false);
          setMessage('Waiting For An Opponent To Make A Move');
        }
      }
    });

    return () => {
      if (newSocket) {
        newSocket.off('getStateResponse');
        newSocket.off('makeMoveResponse');
        newSocket.disconnect();
      }
    };
  }, [navigate]);

  const handleClick = async (index: number) => {
    if (board[index] === 'X' || board[index] === 'O') return;
    
    const newBoard = board.slice();
    newBoard[index] = userSymbol;
    setBoard(newBoard);

    const newMoves = moves.slice();
    for(let i = 0; i < newMoves.length; i++)
    {
      if(newMoves[i] === 'null') {
        newMoves[i] = `${i + 1}_${userSymbol}_${index}_${playerId}`;
        break;
      }
    }
    setMoves(newMoves);

    if (socket) {
      setCanClick(!canClick);
      setMessage('Waiting For An Opponent To Make A Move');
      const jwt = localStorage.getItem('token') || 'a';
      let decoded:JwtPayload = jwtDecode(jwt);
      let userId = 0;
      if ('id' in decoded) userId = decoded.id as number;

      const gameId = localStorage.getItem('gameId');
      socket.emit('makeMove', gameId, userId, newBoard, newMoves);
    }
  };

  const renderSquare = (index: number) => (
    <Button
      disabled={!canClick}
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
      </Box>
      <Grid container spacing={0.5}>
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
}

export default Game;
