import { Box, Typography } from "@mui/material";

function NotFound() {
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
		<Typography variant="h1" color="error">
			Not Found
		</Typography>
		</Box>
  );
}

export default NotFound;