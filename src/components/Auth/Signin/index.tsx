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
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as PasswordIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { loginUser } from "@/store/slices/authSlice";

export default function Signin() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    const result = await dispatch(
      loginUser({ email: data.email, password: data.password }),
    );
    if (loginUser.fulfilled.match(result)) {
      setSuccess(true);
      // setTimeout(() => router.push("/dashboard"), 1500);
      if (
        result.payload.user.role === "influencer" &&
        !result.payload.user.profile
      ) {
        //setup influencer account
        setTimeout(() => router.push("/new-influencer"), 1500);
      } else if (
        result.payload.user.role === "brand" &&
        !result.payload.user.profile
      ) {
        //setup brand account
        setTimeout(() => router.push("/new-brand"), 1500);
      } else {
        //access dashboard
        setTimeout(() => router.push("/dashboard"), 1500);
      }

      console.log("result", result);
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

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        name="password"
        value={data.password}
        onChange={handleChange}
        placeholder="Enter your password"
        margin="normal"
        error={!!errors.password}
        helperText={errors.password}
        InputProps={{
          startAdornment: <PasswordIcon color="disabled" />,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={data.remember}
            onChange={(e) => setData({ ...data, remember: e.target.checked })}
          />
        }
        label="Remember me"
      />

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
