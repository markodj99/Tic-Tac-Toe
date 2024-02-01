import { AppBar, Toolbar, Stack, Button, Icon, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from '@apollo/client';
import { JwtPayload, jwtDecode } from "jwt-decode";

export interface MpGameList {
    index: number,
    gameId: number,
    winner: string,
    yourSymbol: string,
    opponentSymbol: string,
    opponent:string,
    updatedAt: string,
    moves:string[]
}

export interface SpGameList {
    index: number,
    gameId: number,
    winner: string,
    yourSymbol: string,
    computerSymbol: string,
    updatedAt: string,
    moves:string[]
}

const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
        SinglePlayerGames {
            index
            id
            winner
            yourSymbol
            computerSymbol
            updatedAt
            moves
        }
        MultiPlayerCreatedGames {
            index
            id
            winnerString
            yourSymbol
            opponentSymbol
            Joiner {
                username
            }
            moves
            updatedAt
        }
        MultiPlayerJoinedGames {
            index
            id
            winnerString
            yourSymbol
            opponentSymbol
            Creator {
                username
            }
            moves
            updatedAt
        }
    }
  }
`;

function History() {
    const navigate = useNavigate();
    const [showMultiPlayer, setShowMultiPlayer] = useState(true);

    const [mpGames, setMpGames] = useState<MpGameList[]>([]);
    const [spGames, setSpGames] = useState<SpGameList[]>([]);

    const jwt = localStorage.getItem('token') || 'a';
    let decoded:JwtPayload = jwtDecode(jwt);
    let userId = 0;
    if ('id' in decoded) userId = decoded.id as number;

    const { error, refetch } = useQuery(GET_USER, {
        variables: { userId }, skip: true
      });

    const getAllOngoingGames = useCallback(async () => {
        try {
          const result = await refetch();
          const data = result.data.getUser;

          if (error) {
            toast.error(`Error: ${error.message}`);
            console.error('Error while trying to fetch game data:', error);
            return;
          }

          const mpCreated:MpGameList[] =  data.MultiPlayerCreatedGames.map((game:any) => {
            return {
                index: game.index,
                gameId: game.id,
                winner: game.winnerString,
                yourSymbol: game.yourSymbol,
                opponentSymbol: game.opponentSymbol,
                opponent: game.Joiner.username,
                updatedAt: game.updatedAt,
                moves: game.moves
            };
          });

          const mpJoined:MpGameList[] =  data.MultiPlayerJoinedGames.map((game:any) => {
            return {
                index: game.index,
                gameId: game.id,
                winner: game.winnerString,
                yourSymbol: game.yourSymbol,
                opponentSymbol: game.opponentSymbol,
                opponent: game.Creator.username,
                updatedAt: game.updatedAt,
                moves: game.moves
            };
          });

          const allMpGames = [...mpJoined, ...mpCreated].sort((a, b) => b.gameId - a.gameId)
          .map((game, index) => {
            return {
                index: index,
                gameId: game.gameId,
                winner: game.winner,
                yourSymbol: game.yourSymbol,
                opponentSymbol: game.opponentSymbol,
                opponent: game.opponent,
                updatedAt: game.updatedAt,
                moves: game.moves
            };
          });

          setMpGames(allMpGames);

          const spGames:SpGameList[] =  data.SinglePlayerGames.map((game:any) => {
            return {
                index: game.index,
                gameId: game.id,
                winner: game.winner,
                yourSymbol: game.yourSymbol,
                computerSymbol: game.computerSymbol,
                updatedAt: game.updatedAt,
                moves: game.moves
            };
          });

          const allSpGames = [...spGames].sort((a, b) => b.gameId - a.gameId)
          .map((game, index) => {
            return {
                index: index,
                gameId: game.gameId,
                winner: game.winner,
                yourSymbol: game.yourSymbol,
                computerSymbol: game.computerSymbol,
                updatedAt: game.updatedAt,
                moves: game.moves
            };
          });

          setSpGames(allSpGames);
        } catch (error) {
          toast.error('Something went wrong. Please try again later.');
          console.error('Error while trying to fetch game history data:', error);
        }
      }, [error, refetch]);

    useEffect(() => {
        getAllOngoingGames();

        return () => {};
    },[getAllOngoingGames]);

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
                                    onClick={()=> setTimeout(() => navigate(`/history/mp/${row.gameId}`, {state: row}), 200)}>
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
                                        onClick={()=> setTimeout(() => navigate(`/history/sp/${row.gameId}`, {state: row}), 200)}>
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
