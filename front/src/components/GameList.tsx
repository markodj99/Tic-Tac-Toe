import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Container, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fetchWithIntercep } from "../FetchWithIntercep";

export interface GameListData {
  index: number,
  gameId: number,
  creatorName: string,
  creatorSymbol: string,
  yourSymbol: string
}

function GameList() {
  const navigate = useNavigate();
  const [data, setData] = useState<GameListData[]>([]);

  const getAllOngoingGames = useCallback(async () => {
    try {
      const {isOk, data} = await fetchWithIntercep<any>('api/mp-game/get-all-existing-games', 'GET', navigate); 

      if (isOk) {
        setData(data.data);
      } else {
        setData([]);
        toast.error('Something went wrong. Please try again later.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error while trying to fetch games data:', error);
    }
  }, [navigate]);

  useEffect(() => {
    getAllOngoingGames();

    return () => {};
  }, [getAllOngoingGames]);

  const handleJoinClick = async (id:number) => {
     try {
      const {isOk, data} = await fetchWithIntercep<any>('api/mp-game/join-game', 'POST', navigate, {gameId: id});

      if (isOk) {
        if(data.gameJoined) {
          toast.success('Game joined successfully.');
          localStorage.setItem('gameId', id.toString());
          setTimeout(() => navigate('/mp-game/game'), 500);
        } else {
          toast.error('Could not join game at the moment please try again later.')
        }
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error while trying to join game:', error);
    }
  }

  return (
    <>
      <Container component="main" maxWidth="lg" style={{ marginTop: 20 }}>
        <TableContainer component={Paper} style={{ maxHeight: 720 }}>
          <Table style={{ minWidth: 300, border: '2px solid blue' }}>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Creator</TableCell>
                <TableCell>Creator Symbol</TableCell>
                <TableCell>Your Symbol</TableCell>
                <TableCell align="center">Join Game</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.index}>
                  <TableCell>{row.index + 1}</TableCell>
                  <TableCell>{row.creatorName}</TableCell>
                  <TableCell>{row.creatorSymbol}</TableCell>
                  <TableCell>{row.yourSymbol}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" color="primary" onClick={()=> handleJoinClick(row.gameId)}>
                      Join Game
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}

export default GameList;