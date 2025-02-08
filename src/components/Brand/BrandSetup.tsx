"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setupBrandProfile } from "@/store/slices/brandSlice";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

interface BrandSetupProps {
  user_id: string;
}

export default function BrandSetup({ user_id }: BrandSetupProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error } = useSelector((state: RootState) => state.brand);

  const [data, setData] = useState({
    name: "",
    industry: "",
    website: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!data.name) newErrors.name = "Brand name is required";
    if (!data.industry) newErrors.industry = "Industry is required";
    if (!data.website) {
      newErrors.website = "Website URL is required";
    } else if (!/^https?:\/\/.+/.test(data.website)) {
      newErrors.website = "Valid website URL is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(
      setupBrandProfile({
        users: [user_id],
        name: data.name,
        industry: data.industry,
        website: data.website,
        description: data.description,
      }),
    );

    console.log("result", result);

    if (!result?.error) {
      setSuccessMessage("Brand profile setup successful! Redirecting...");
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
        Setup Your Brand Profile
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", maxWidth: 400, mx: "auto" }}
      >
        <TextField
          fullWidth
          label="Brand Name"
          name="name"
          value={data.name}
          onChange={handleChange}
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          fullWidth
          label="Industry"
          name="industry"
          value={data.industry}
          onChange={handleChange}
          margin="normal"
          error={!!errors.industry}
          helperText={errors.industry}
        />

        <TextField
          fullWidth
          label="Website"
          name="website"
          value={data.website}
          onChange={handleChange}
          margin="normal"
          error={!!errors.website}
          helperText={errors.website}
        />

        <TextField
          fullWidth
          label="Description (Optional)"
          name="description"
          value={data.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
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
            "Save Brand Profile"
          )}
        </Button>
      </Box>
    </Box>
  );
}
