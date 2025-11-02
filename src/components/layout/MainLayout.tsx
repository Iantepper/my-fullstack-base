import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Container from "@mui/material/Container";
import { Box } from "@mui/material";

export default function MainLayout() {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 100%)' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}