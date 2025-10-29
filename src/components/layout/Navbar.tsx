import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";

export default function Navbar() {
    return (
        <Box sx={{ flexGrow: 1, mb: 3 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Mentores Pro
                    </Typography>
                    <Button color="inherit" component={RouterLink} to="/">
                        Inicio
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/mentors">
                        Mentores
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/sessions">
                        Agenda
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/profile">
                        Perfil
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}