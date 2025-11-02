import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../modules/home/HomePage";
import LoginPage from "../modules/auth/LoginPage";
import RegisterPage from "../modules/auth/RegisterPage";
import MentorsPage from "../modules/mentors/MentorPage";
import SessionsPage from "../modules/sessions/SessionsPage";
import ProfilePage from "../modules/profile/ProfilePage";
import MainLayout from "../components/layout/MainLayout";
import MentorDetailPage from '../modules/mentors/MentorDetailPage';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas que usan el layout principal */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="mentors" element={<MentorsPage />} />
                    <Route path="sessions" element={<SessionsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="/mentors/:id" element={<MentorDetailPage />} />
                </Route>
                {/* Rutas públicas (sin layout) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    );
}