"use client";

import Image from "next/image";
import {
  Button,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Link as MuiLink,
} from "@mui/material";
import { Providers } from "@/app/providers";
import { UserIcon, EmailIcon } from "@/assets/icons";
import logo from "@/assets/logo.png";

export default function Home() {
  return (
    <Providers>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        {/* Main Content */}
        <Box
          flex="1"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          p={4}
        >
          <Image
            src={logo}
            alt="TrendAI Logo"
            width={180}
            height={60}
            priority
          />
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to TrendAI
          </Typography>
          <Typography variant="body1" paragraph>
            Your AI-powered platform for analyzing trends and making data-driven
            decisions.
          </Typography>
          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="contained"
              color="primary"
              href="/auth/signin"
              startIcon={<UserIcon />}
              sx={{ padding: "0.75rem 2rem" }}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              href="/auth/signup"
              startIcon={<EmailIcon />}
              sx={{ padding: "0.75rem 2rem" }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>

        {/* Sticky Footer */}
        <AppBar
          position="static"
          sx={{ backgroundColor: "#5750F1", mt: "auto", fontFamily: "Satoshi" }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
            <MuiLink
              href="https://www.trendai.app/about"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
            >
              About Us
            </MuiLink>
            <MuiLink
              href="https://www.trendai.app/features"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
            >
              Features
            </MuiLink>
            <MuiLink
              href="https://www.trendai.app/contact"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
            >
              Contact Us
            </MuiLink>
          </Toolbar>
        </AppBar>
      </Box>
    </Providers>
  );
}
