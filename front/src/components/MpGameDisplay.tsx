import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import toast from "react-hot-toast";

export interface MpGame {
    index: number,
    gameId: number,
    winner: string,
    yourSymbol: string,
    opponentSymbol: string,
    opponent:string,
    updatedAt: string,
    moves: string[]
}

function SpGameDisplay() {
    const navigate = useNavigate();
    const game = useLocation().state as MpGame;
    const [board, setBoard] = useState<string[]>([]);
    const [moves, setMoves] = useState<string[]>([]);
    const [iterate, setIterate] = useState(-1);
    const [maxIterate, setMaxIterate] = useState(-1); 
    const [userSymbol, setUserSymbol] = useState('X');
    const [opponentSymbol, setOpponentSymbol] = useState('O');
    const [winner, setWinner] = useState('user');
    const [opponent, setOpponent] = useState('Opponent');

    useEffect(() => {
        if (!game) {
            setTimeout(() => navigate(`/history`), 200);
            return;
        };

        setBoard(Array(9).fill('null'));
        try {
            setMoves(game.moves);
            setIterate(0);
            let maxIt = 0;
            for (let i = 0; i < game.moves.length; i++) {
                if (game.moves[i] === 'null') break;
                maxIt++;
            }
            setMaxIterate(maxIt)
            setWinner(game.winner);
            setOpponentSymbol(game.opponentSymbol);
            if (game.opponentSymbol === 'X') setUserSymbol('O');
            else setUserSymbol('X');
            setOpponent(game.opponent);
        } catch (error) {
            toast.error('Something went wrong. Please try again later.');
            console.error('Error while trying to get game data:', error);
        }

        return () => {};
    }, [game, navigate]);

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
