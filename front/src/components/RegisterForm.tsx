import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FormControl, FormHelperText, Link as  MuiLink } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink, useNavigate} from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from 'react-hot-toast';

function RegisterForm() {
  const navigate = useNavigate();

  const registrationValidationSchema = Yup.object({
    username: Yup.string().min(7, 'Username must be at least 7 characters').required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    repeatpassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Password is required')
  });
  
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      repeatpassword: "",
    },
    validationSchema: registrationValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
        
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message);
          setTimeout(() => navigate('/login'), 500);
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
      <Box
        sx={{  marginTop: 8, display: "flex",flexDirection: "column",alignItems: "center"}}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal" error={formik.touched.username && Boolean(formik.errors.username)}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              type="username"
              autoComplete="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
          />
          <FormHelperText>{formik.touched.username && formik.errors.username}</FormHelperText>
          </FormControl>
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
          <FormControl fullWidth margin="normal" error={formik.touched.repeatpassword && Boolean(formik.errors.repeatpassword)}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="repeatpassword"
              label="Repeat Password"
              type="password"
              id="repeatpassword"
              autoComplete="current-repeatpassword"
              value={formik.values.repeatpassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormHelperText>{formik.touched.repeatpassword && formik.errors.repeatpassword}</FormHelperText>
          </FormControl>
          <Button disabled={!formik.isValid} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item>
              <MuiLink component={RouterLink} to="/login" variant="body2">
                {"Already have an account? Sign In"}
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterForm;
