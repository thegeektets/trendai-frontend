"use client";

import { Box, Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import SigninWithPassword from "./SigninWithPassword";

export default function Signin() {
  return (
    <Box
      display="flex"
      flexDirection={"column"}
      alignItems={"center"}
    >
      {/* Sign-in Form */}
      <SigninWithPassword />

      {/* Sign-up Link */}
      <Typography variant="body2" mt={3}>
        Don’t have an account?{" "}
        <MuiLink
          component={Link}
          href="/auth/signup"
          color="primary"
          fontWeight="medium"
          underline="hover"
        >
          Sign Up
        </MuiLink>
      </Typography>
    </Box>
  );
}
