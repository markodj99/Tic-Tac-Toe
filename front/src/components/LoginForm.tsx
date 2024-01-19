import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FormControl, FormHelperText, Link as  MuiLink} from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from 'react-hot-toast';

function LoginForm() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
        
        const data = await response.json();
        if (response.ok) {
          const jwt = data.message;
          localStorage.setItem('token', jwt);

          toast.success('Successful login!');
          setTimeout(() => navigate('/'), 3500);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Something went wrong. Please try again later.');
        console.error('Error while trying to login:', error);
      }
    },
  });

  
  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center"}}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal" error={formik.touched.email && Boolean(formik.errors.email)}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormHelperText>{formik.touched.email && formik.errors.email}</FormHelperText>
          </FormControl>
          <FormControl fullWidth margin="normal" error={formik.touched.password && Boolean(formik.errors.password)}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormHelperText>{formik.touched.password && formik.errors.password}</FormHelperText>
          </FormControl>
          <Button disabled={!formik.isValid} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item>
              <MuiLink component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginForm;
