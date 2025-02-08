"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { signupUser } from "@/store/slices/authSlice";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  CircularProgress,
  Link as MuiLink,
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

export default function Signup() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [userType, setUserType] = useState<"influencer" | "brand" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Handle input changes and validate in real time
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData({ ...data, [name]: value });

    validateField(name, value);
  };

  // Validate a single field
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    if (name === "email") {
      if (!value) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value))
        newErrors.email = "Enter a valid email";
      else delete newErrors.email;
    }

    if (name === "password") {
      if (!value) newErrors.password = "Password is required";
      else if (value.length < 6)
        newErrors.password = "Password must be at least 6 characters";
      else delete newErrors.password;
    }

    if (name === "confirmPassword") {
      if (!value) newErrors.confirmPassword = "Please confirm your password";
      else if (value !== data.password)
        newErrors.confirmPassword = "Passwords do not match";
      else delete newErrors.confirmPassword;
    }

    setErrors(newErrors);
  };

  // Validate all fields before submission
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    validateField("email", data.email);
    validateField("password", data.password);
    validateField("confirmPassword", data.confirmPassword);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userType) return;

    if (!validate()) return; // Stop submission if validation fails

    setLoading(true);

    const payload = {
      ...data,
      role: userType,
    };

    console.log("Submitting:", payload);

    setTimeout(() => {
      setLoading(false);
      alert("Sign-up successful!");
    }, 1000);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {!userType ? (
        <Box textAlign="center">
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Join TrendAI as:
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{ mb: 2 }}
            onClick={() => setUserType("influencer")}
          >
            Influencer
          </Button>
          <Button
            variant="contained"
            fullWidth
            color="secondary"
            onClick={() => setUserType("brand")}
          >
            Brand
          </Button>
        </Box>
      ) : (
        <>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ mb: 2, alignSelf: "flex-start" }}
            onClick={() => setUserType(null)}
          >
            ← Back
          </Button>

          <Typography variant="h6" fontWeight="medium" mb={2}>
            Sign up as a {userType}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%", maxWidth: 400, mx: "auto" }}
          >
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
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: <PasswordIcon color="disabled" />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box display="flex" alignItems="center" mt={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.remember}
                    onChange={(e) =>
                      setData({ ...data, remember: e.target.checked })
                    }
                  />
                }
                label="Remember me"
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, py: 1.5 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>

            <Typography variant="body2" mt={3}>
              Already have an account?{" "}
              <MuiLink
                component={Link}
                href="/auth/signin"
                color="primary"
                fontWeight="medium"
                underline="hover"
              >
                Sign In
              </MuiLink>
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}
