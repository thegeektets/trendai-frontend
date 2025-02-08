/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setupInfluencerProfile } from "@/store/slices/influencerSlice";
import { useRouter } from "next/navigation";
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

interface InfluencerSetupProps {
  user_id: string;
  email: string;
}

export default function InfluencerSetup({
  user_id,
  email,
}: InfluencerSetupProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, error } = useSelector(
    (state: RootState) => state.influencer,
  );

  const [data, setData] = useState({
    name: "",
    socialMediaHandle: "",
    platform: "",
    followersCount: "",
    remember: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!data.name) newErrors.name = "Name is required";
    if (!data.socialMediaHandle)
      newErrors.socialMediaHandle = "Handle is required";
    if (!data.platform) newErrors.platform = "Platform is required";
    if (!data.followersCount || isNaN(Number(data.followersCount))) {
      newErrors.followersCount = "Valid followers count is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const result: any = await dispatch(
      setupInfluencerProfile({
        user: user_id,
        name: data.name,
        socialMediaHandle: data.socialMediaHandle,
        platform: data.platform,
        followersCount: Number(data.followersCount),
        email,
      }),
    );

    if (!result?.error) {
      setSuccessMessage("Profile setup successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {successMessage && (
        <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h5" fontWeight="bold" mb={2}>
        Setup Your Influencer Profile
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", maxWidth: 400, mx: "auto" }}
      >
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={data.name}
          onChange={handleChange}
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          fullWidth
          label="Social Media Handle"
          name="socialMediaHandle"
          value={data.socialMediaHandle}
          onChange={handleChange}
          margin="normal"
          error={!!errors.socialMediaHandle}
          helperText={errors.socialMediaHandle}
        />

        <TextField
          fullWidth
          label="Platform (e.g., Instagram, YouTube)"
          name="platform"
          value={data.platform}
          onChange={handleChange}
          margin="normal"
          error={!!errors.platform}
          helperText={errors.platform}
        />

        <TextField
          fullWidth
          label="Followers Count"
          name="followersCount"
          type="number"
          value={data.followersCount}
          onChange={handleChange}
          margin="normal"
          error={!!errors.followersCount}
          helperText={errors.followersCount}
        />

        {/* Prefilled Email (Read-only) */}
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={email}
          margin="normal"
          InputProps={{ readOnly: true }}
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
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Save Profile"
          )}
        </Button>
      </Box>
    </Box>
  );
}
