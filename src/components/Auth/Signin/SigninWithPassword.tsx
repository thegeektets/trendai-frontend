"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Email as EmailIcon, Lock as PasswordIcon } from "@mui/icons-material";
import Link from "next/link";

export default function SigninWithPassword() {
  const [data, setData] = useState({
    email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%", maxWidth: 400, mx: "auto" }}
    >
      {/* Email Input */}
      <TextField
        fullWidth
        label="Email"
        type="email"
        name="email"
        value={data.email}
        onChange={handleChange}
        placeholder="Enter your email"
        margin="normal"
        InputProps={{ startAdornment: <EmailIcon color="disabled" /> }}
      />

      {/* Password Input */}
      <TextField
        fullWidth
        label="Password"
        type="password"
        name="password"
        value={data.password}
        onChange={handleChange}
        placeholder="Enter your password"
        margin="normal"
        InputProps={{ startAdornment: <PasswordIcon color="disabled" /> }}
      />

      {/* Remember Me & Forgot Password */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={data.remember}
              onChange={(e) => setData({ ...data, remember: e.target.checked })}
            />
          }
          label="Remember me"
        />
        <Typography
          component={Link}
          href="/auth/forgot-password"
          sx={{ color: "primary.main", textDecoration: "none" }}
        >
          Forgot Password?
        </Typography>
      </Box>

      {/* Sign In Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, py: 1.5 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
      </Button>
    </Box>
  );
}
