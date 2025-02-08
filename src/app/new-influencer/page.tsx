"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Box, Typography, Link as MuiLink, Alert } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import InfluencerSetup from "@/components/Influencer/Setup";
import logo from "@/assets/logo.png";
import gridImage from "@/assets/grids/grid-02.svg";
import { AppDispatch } from "@/store";

export default function NewInfluencer() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken || storedToken == 'undefined') {
        setError("Token not found. Redirecting...");
        setTimeout(() => router.push("/auth/signin"), 2000);
        return;
      }
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setError("User not found. Redirecting...");
        setTimeout(() => router.push("/auth/signin"), 2000);
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser.id || !parsedUser.email) {
        setError("Invalid user data. Redirecting...");
        setTimeout(() => router.push("/auth/signin"), 2000);
        return;
      }

      setUserId(parsedUser.id);
      setEmail(parsedUser.email);
    } catch (err) {
      setError("Failed to parse user data. Redirecting...");
      setTimeout(() => router.push("/auth/signin"), 2000);
    }
  }, [dispatch, router]);

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!userId || !email) {
    return null; // Avoid rendering until we have the user data
  }

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      minHeight="100vh"
    >
      {/* Left Section: Setup Form */}
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={6}
        sx={{ backgroundColor: "#fff", fontFamily: "Satoshi" }}
      >
        <Box width="100%" maxWidth={400} paddingTop={"60px"}>
          <InfluencerSetup user_id={userId} email={email} />
        </Box>
      </Box>

      {/* Right Section: Influencer Welcome Message */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        sx={{
          fontFamily: "Satoshi, sans-serif",
          background: "linear-gradient(135deg, #5750F1 0%, #ff4081 100%)",
          color: "white",
          p: { xs: 4, md: 6 },
        }}
      >
        {/* Logo */}
        <MuiLink
          component={Link}
          href="/"
          sx={{ display: "block", mb: 2 }}
          marginTop={"60px"}
        >
          <Image src={logo} alt="Logo" width={176} />
        </MuiLink>

        <Typography variant="h5" fontWeight="medium">
          Become an Influencer
        </Typography>

        <Typography variant="h4" fontWeight="bold" mt={1}>
          Join the Community!
        </Typography>

        <Typography variant="body1" maxWidth={375} mt={2}>
          Set up your influencer profile by completing the fields below. Start
          collaborating today!
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
