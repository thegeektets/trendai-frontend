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
  Alert,
} from "@mui/material";
import { Email as EmailIcon, Lock as PasswordIcon } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";

import { loginUser } from "@/store/slices/authSlice";

export default function Signin() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [success, setSuccess] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });

    // Clear error on change
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Form validation
  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!data.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!data.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await dispatch(
      loginUser({ email: data.email, password: data.password }),
    );

    if (loginUser.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%", maxWidth: 400, mx: "auto", mt: 4 }}
    >
      <Typography variant="h5" textAlign="center" mb={2}>
        Sign In
      </Typography>

      {success && (
        <Alert severity="success">Login successful! Redirecting...</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}

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
        error={!!errors.email}
        helperText={errors.email}
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
        error={!!errors.password}
        helperText={errors.password}
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

      {/* Sign-up Link */}
      <Typography variant="body2" mt={3} textAlign="center">
        Don’t have an account?{" "}
        <Link
          href="/auth/signup"
          style={{ color: "primary.main", textDecoration: "none" }}
        >
          Sign Up
        </Link>
      </Typography>
    </Box>
  );
}
