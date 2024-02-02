import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Container, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from '@apollo/client';
import { JwtPayload, jwtDecode } from "jwt-decode";

const GET_EXISTING_GAMES = gql`
  query GetExistingGames {
    getExistingGames {
      index
      gameId
      creatorName
      creatorSymbol
      yourSymbol
    }
  }
`;

const JOIN_GAME = gql`
  mutation JoinGame($userId: ID!, $gameId: ID!) {
    joinGame(userId: $userId, gameId: $gameId) {
      condition
      gameId
    }
  }
`;

interface GameListData {
  index: number,
  gameId: number,
  creatorName: string,
  creatorSymbol: string,
  yourSymbol: string
}

function GameList() {
  const navigate = useNavigate();
  const [data, setData] = useState<GameListData[]>([]);

  const { error, refetch } = useQuery(GET_EXISTING_GAMES, {
    skip: true
  });

  const jwt = localStorage.getItem('token') || null;
  let userId = -1;
  if (jwt){
      let decoded:JwtPayload = jwtDecode(jwt);
      if ('id' in decoded) userId = decoded.id as number;
  }

  const [joinGameMutation] = useMutation(JOIN_GAME);

  const getAllOngoingGames = useCallback(async () => {
    try {
      const result = await refetch();
      const data:GameListData[] = result.data.getExistingGames;

      if (error) {
        toast.error(`Error: ${error.message}`);
        console.error('Error while trying to fetch game data:', error);
        return;
      }
    
      setData(data);
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error while trying to fetch games data:', error);
    }
  }, [error, refetch]);

  useEffect(() => {
    getAllOngoingGames();

    return () => {};
  }, [getAllOngoingGames]);

  const handleJoinClick = async (id:number) => {
     try {
      const { data } = await joinGameMutation({
        variables: { userId, gameId: id }
      });

      if(data.joinGame.condition) {
        toast.success('Game joined successfully.');
        localStorage.setItem('gameId', data.joinGame.gameId.toString());
        setTimeout(() => navigate('/mp-game/game'), 500);
      } else {
        toast.error('Could not join game at the moment please try again later.')
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