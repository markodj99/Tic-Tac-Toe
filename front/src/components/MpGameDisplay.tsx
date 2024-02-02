import { Box, Button, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import toast from "react-hot-toast";
import { fetchWithIntercep } from "../FetchWithIntercep";

interface MpGameDisplayData {
  moves: string[],
  winner: string,
  yourSymbol: string,
  opponentSymbol: string,
  opponent:string,
}

function SpGameDisplay() {
    const navigate = useNavigate();
    const id = useLocation().state as string;
    const [board, setBoard] = useState<string[]>([]);
    const [moves, setMoves] = useState<string[]>([]);
    const [iterate, setIterate] = useState(-1);
    const [maxIterate, setMaxIterate] = useState(-1); 
    const [userSymbol, setUserSymbol] = useState('X');
    const [opponentSymbol, setOpponentSymbol] = useState('O');
    const [winner, setWinner] = useState('user');
    const [opponent, setOpponent] = useState('Opponent');

    const getGame = useCallback(async (id:string) => {
        try {
            const {isOk, data} = await fetchWithIntercep<MpGameDisplayData>(`api/mp-game/get-one-finished/${id}`, 'GET', navigate);
            
 
            if (isOk) {
                if (data) {
                    setMoves(data.moves);
                    setIterate(0);
                    let maxIt = 0;
                    for (let i = 0; i < data.moves.length; i++) {
                        if (data.moves[i] === 'null') break;
                        maxIt++;
                    }
                    setMaxIterate(maxIt)
                    setWinner(data.winner);
                    setOpponentSymbol(data.opponentSymbol);
                    if (data.opponentSymbol === 'X') setUserSymbol('O');
                    else setUserSymbol('X');
                    setOpponent(data.opponent);
                } else {
                    toast.error('Something went wrong. Please try again later.');
                }
            } else {
              toast.error('Something went wrong. Please try again later.');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again later.');
            console.error('Error while trying to get game data:', error);
        }
    }, [navigate]);

    useEffect(() => {
        setBoard(Array(9).fill('null'));
        getGame(id === undefined ? '0' : id);

        return () => {};
    }, [id, getGame]);

    const goBack = () => {
        const index = parseInt(moves[iterate - 1][4], 10);

        const newBoard = board.slice();
        newBoard[index] = 'null';
        setBoard(newBoard);

        setIterate(iterate - 1);
    };

    const goForward = () => {
        const symbol = moves[iterate][2];
        const index = parseInt(moves[iterate][4], 10);

        const newBoard = board.slice();
        newBoard[index] = symbol;
        setBoard(newBoard);

        setIterate(iterate + 1);

        if (iterate + 1 >= maxIterate) {
            if (winner === 'you') toast.success(`You've won.`, { duration: 500 });
            else if (winner === opponent) toast.error(`You've lost.`, { duration: 500});
            else toast.success(`Game ended in a draw.`, {
                style: {
                        border: '2px solid black',
                        background: 'yellow'
                       },
                duration: 500
              });
        }
    };

    const renderSquare = (index: number) => (
        <Button
          disabled={true}
          variant="outlined"
          style={{ width: '150px', height: '150px', fontSize: '24px',
          color: board[index] !== 'null' ? (board[index] === 'X' ? '#0f4b8c' : '#44af16') : '#e00b0e',
          borderColor: board[index] !== 'null' ? (board[index] === 'X' ? '#0f4b8c' : '#44af16') : '#e00b0e',
          background: board[index] === 'null' ? '#e00b0e' : undefined
        }}
        >
          {board[index] === 'X' ? <CloseIcon style={{ fontSize: '150px' }}/> :
           board[index] === 'O' ? <RadioButtonUncheckedIcon style={{ fontSize: '150px' }}/> : null}
        </Button>
    );

  	return (
        <>
            <Box textAlign="center">
                <Typography variant="h2" color="primary" gutterBottom justifyContent="center">
                    You: {userSymbol} {opponent}: {opponentSymbol}
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
            <Grid container spacing={2} justifyContent="center" style={{ marginTop: 20 }}>
                <Grid item>
                    <Button 
                    variant="contained"
                    color="primary"
                    disabled={iterate <= 0}
                    onClick={goBack}
                    >
                        <ArrowBackIosIcon style={{ fontSize: '50px' }}/>
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                    variant="contained"
                    color="secondary"
                    disabled={iterate >= maxIterate}
                    onClick={goForward}
                    >
                        <ArrowForwardIosIcon style={{ fontSize: '50px' }}/>
                    </Button>
                </Grid>
            </Grid> 
        </>
    );
}

export default SpGameDisplay;
