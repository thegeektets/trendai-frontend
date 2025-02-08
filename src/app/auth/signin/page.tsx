"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearAuthError } from "@/store/slices/authSlice";

import { Box, Typography, Link as MuiLink } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Signin from "@/components/Auth/Signin";
import logo from "@/assets/logo.png";
import gridImage from "@/assets/grids/grid-02.svg";
import { AppDispatch } from "@/store";

export default function SignIn() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }} // Row on desktop, column on mobile
      minHeight="100vh"
    >
      {/* Left Section: Sign-In Form */}
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={6}
        sx={{ backgroundColor: "#fff" }}
      >
        <Box width="100%" maxWidth={400}>
          <Signin />
        </Box>
      </Box>

      {/* Right Section: Welcome Message */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        sx={{
          fontFamily: "Satoshi, sans-serif",
          background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
          color: "white",
          p: { xs: 4, md: 6 }, // Smaller padding on mobile
        }}
      >
        {/* Logo */}
        <MuiLink
          component={Link}
          href="/"
          sx={{ display: "block", mb: 2, margin: "30px auto" }}
        >
          <Image src={logo} alt="Logo" width={176} />
        </MuiLink>

        <Typography variant="h5" fontWeight="medium">
          Sign in to your account
        </Typography>

        <Typography variant="h4" fontWeight="bold" mt={1}>
          Welcome Back!
        </Typography>

        <Typography variant="body1" maxWidth={375} mt={2}>
          Please sign in to your account by completing the necessary fields
          below.
        </Typography>

        {/* Grid Image */}
        <Box mt={4}>
          <Image
            src={gridImage}
            alt="Background Illustration"
            width={405}
            height={325}
          />
        </Box>
      </Box>
    </Box>
  );
}
