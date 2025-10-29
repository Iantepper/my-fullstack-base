import { TextField, Button, Box, Typography } from "@mui/material";

export default function LoginPage() {
  return (
    <Box maxWidth={480} mx="auto">
      <Typography variant="h5" mb={2}>Iniciar sesión</Typography>
      <TextField label="Email" fullWidth margin="normal" />
      <TextField label="Contraseña" type="password" fullWidth margin="normal" />
      <Button variant="contained" sx={{ mt: 2 }}>Entrar</Button>
    </Box>
  );
}
