import { AppBar, Button, IconButton, Stack, Toolbar, Typography, Link as MuiLink } from "@mui/material";
import CasinoRoundedIcon from '@mui/icons-material/CasinoRounded';
import { Link as RouterLink, useNavigate } from "react-router-dom";

function NavBar()
{
	const navigate = useNavigate();
	let logedIn:boolean = localStorage.getItem('token') != null;
    return(
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="logo"
						component={RouterLink}
						to="/"
					>
						<CasinoRoundedIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{flexGrow: 1}}>
						TIC-TAC-TOE
					</Typography>
						<Stack direction="row" spacing={2}>
							<Button color="inherit">
								<MuiLink component={RouterLink} to="/mp-game" underline="none" color="inherit">
									Multi Player
								</MuiLink>
							</Button>
							<Button color="inherit">
								<MuiLink component={RouterLink} to="/sp-game" underline="none" color="inherit">
									Single Player
								</MuiLink>		
							</Button>
							{
								logedIn &&
								<Button color="inherit">
									My Games
								</Button>
							}
							{
								logedIn ?
								<Button color="inherit" onClick={() => {localStorage.removeItem('token'); setTimeout(() => navigate('/login'), 500);}}>
									Log Out
								</Button>
								: 
								<Button color="inherit">
									<MuiLink component={RouterLink} to="/login" underline="none" color="inherit">
										Login
									</MuiLink>
								</Button>
							}
						</Stack>
				</Toolbar>
			</AppBar>
    );
}

export default NavBar;
