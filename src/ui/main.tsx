import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "./Login.tsx";
import { Container } from "./Container.tsx";
import { Signup } from "./signup.tsx";
import { Home } from "./Home.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <Container>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="home" element={<Home />} />
        </Routes>
      </Container>
    </StrictMode>
  </BrowserRouter>
);
