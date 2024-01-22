import { Box, Typography } from "@mui/material";
import { JwtPayload, jwtDecode } from "jwt-decode";

function Greeting() {
	const jwt = localStorage.getItem('token');
	let msg:string = 'Welcome!';

	if(jwt != null) {
		let decoded:JwtPayload = jwtDecode(jwt);
		if ('username' in decoded) msg = `Welcome back ${decoded.username}!`;
	}

  	return (
		<Box
			sx={{
				textAlign: "center",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				margin: "auto",
				marginTop: "30vh"
			}}
		>
		<Typography variant="h1" color="primary">
				{msg}
		</Typography>
		</Box>
  );
}

export default Greeting;
