import { AppBar, Toolbar, Stack, Button, Icon, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fetchWithIntercep } from "../FetchWithIntercep";

export interface MpGameList {
    index: number,
    gameId: number,
    winner: string,
    yourSymbol: string,
    opponentSymbol: string,
    opponent:string,
    updatedAt: string
}

export interface SpGameList {
    index: number,
    gameId: number,
    winner: string,
    yourSymbol: string,
    computerSymbol: string,
    updatedAt: string
}

function History() {
    const navigate = useNavigate();
    const [showMultiPlayer, setShowMultiPlayer] = useState(true);
    const [mpGames, setMpGames] = useState<MpGameList[]>([]);
    const [spGames, setSpGames] = useState<SpGameList[]>([]);

    const getAllFinished = useCallback(async () => {
        try {
            const {isOk, data} = await fetchWithIntercep<any>('api/mp-game/get-all-finished', 'GET', navigate);
            
            if (isOk) {
                setMpGames(data.data);
            } else {
                setMpGames([]);
                toast.error('Something went wrong. Please try again later.');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again later.');
            console.error('Error while trying to fetch games data:', error);
        }

        try {
            const {isOk, data} = await fetchWithIntercep<any>('api/sp-game/get-all-finished', 'GET', navigate);
            
            if (isOk) {
                setSpGames(data.data);
            } else {
                setSpGames([]);
                toast.error('Something went wrong. Please try again later.');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again later.');
            console.error('Error while trying to fetch games data:', error);
        }
    }, [navigate]);

    useEffect(() => {
        getAllFinished()

        return () => {};
    },[getAllFinished]);

    const getFormatedDate = (dateString:string):string => {
        let date = new Date(dateString);
        let day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
        let month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
        let hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
        let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;

        return `${day}.${month}.${date.getFullYear()}. ${hour}.${minutes} h`;
    };

  	return (
        <>
            <AppBar position="static" style={{ marginTop: 20, maxWidth: 400, margin: '20px auto 0', backgroundColor: 'green' }}>
                <Toolbar >
                    <Icon>
                        <HistoryIcon />
                    </Icon>
                    <Stack direction="row" spacing={2} sx={{ marginLeft: 7 }}>
                        <Button color="inherit" onClick={() => setShowMultiPlayer(true)}>
                            Multi Player
                        </Button>
                        <Button color="inherit" onClick={() => setShowMultiPlayer(false)}>
                            Single Player
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>
            {
            showMultiPlayer ? 
            <Container component="main" maxWidth="lg" style={{ marginTop: 20 }}>
                <TableContainer component={Paper} style={{ maxHeight: 720 }}>
                    <Table style={{ minWidth: 300, border: '2px solid blue' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Your Symbol</TableCell>
                                <TableCell>Opponent Symbol</TableCell>
                                <TableCell>Opponent</TableCell>
                                <TableCell>Winner</TableCell>
                                <TableCell>Ended</TableCell>
                                <TableCell align="center">Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {mpGames.map((row) => (
                            <TableRow key={row.index}>
                                <TableCell>{row.index + 1}</TableCell>
                                <TableCell>{row.yourSymbol}</TableCell>
                                <TableCell>{row.opponentSymbol}</TableCell>
                                <TableCell>{row.opponent}</TableCell>
                                <TableCell>{row.winner}</TableCell>
                                <TableCell>{getFormatedDate(row.updatedAt)}</TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" color="primary"
                                    onClick={()=> setTimeout(() => navigate(`/history/mp/${row.gameId}`, {state: row.gameId}), 200)}>
                                        Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            :
            <Container component="main" maxWidth="lg" style={{ marginTop: 20 }}>
                <TableContainer component={Paper} style={{ maxHeight: 720 }}>
                    <Table style={{ minWidth: 300, border: '2px solid blue' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Your Symbol</TableCell>
                                <TableCell>Computer Symbol</TableCell>
                                <TableCell>Winner</TableCell>
                                <TableCell>Ended</TableCell>
                                <TableCell align="center">Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {spGames.map((row) => (
                                <TableRow key={row.index}>
                                    <TableCell>{row.index + 1}</TableCell>
                                    <TableCell>{row.yourSymbol}</TableCell>
                                    <TableCell>{row.computerSymbol}</TableCell>
                                    <TableCell>{row.winner === 'user' ? 'You' : 
                                    row.winner.charAt(0).toUpperCase() + row.winner.slice(1)}</TableCell>
                                    <TableCell>{getFormatedDate(row.updatedAt)}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="contained" color="primary" 
                                        onClick={()=> setTimeout(() => navigate(`/history/sp/${row.gameId}`, {state: row.gameId}), 200)}>
                                            Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            }
        </>
    );
}

export default History;
