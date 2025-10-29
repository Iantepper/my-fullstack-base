import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Container from "@mui/material/Container";

export default function MainLayout() {
    return (
        <>
            <Navbar />
            <Container maxWidth="lg">
                <Outlet />
            </Container>
        </>
    );
}