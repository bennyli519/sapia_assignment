import React, { useState } from 'react';
import apiClient from '../api/client'; // 路徑視你的實際文件結構而定
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),
  password: Yup.string().required('Password is required'),
});

const initialValues = {
  email: '',
  password: '',
};

const Login: React.FC = () => {
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [dialogMessage, setdialogMessage] = useState('');

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await apiClient.post('/auth/login', values);
        if (response.data) {
          localStorage.setItem('accessToken', response.data.access_token);
          setdialogMessage(response.data.message);
          setOpenErrorDialog(true);
        }
      } catch (error: any) {
        console.error('Login failed', error.message);
        setdialogMessage(error.response.data.message);
        setOpenErrorDialog(true);
      }
    },
  });

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="default email: dev@gmail.com"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email ? formik.errors.email : ''}
          />
          <TextField
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            placeholder="pwd: dev"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password ? formik.errors.password : ''}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
      <Dialog fullWidth open={openErrorDialog} onClose={handleCloseErrorDialog}>
        <DialogTitle>Title</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;
