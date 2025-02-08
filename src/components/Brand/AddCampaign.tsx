"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { createCampaign } from "@/store/slices/campaignSlice"; // Assuming you have a slice for campaigns
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Brand } from "@/types"; // Define type for Brand (optional)

interface AddCampaignProps {
  brand: string;
}

export default function AddCampaign({ brand }: AddCampaignProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error } = useSelector((state: RootState) => state.campaign); // Assuming you have a campaign slice

  const [data, setData] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
    status: "active",
    brand: brand,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const { name, value } = e.target;
    setData({ ...data, [name as string]: value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!data.name)
      newErrors.name = "Campaign name is required";
    if (!data.description) newErrors.description = "Description is required";
    if (!data.budget || isNaN(Number(data.budget)))
      newErrors.budget = "Valid budget is required";
    if (!data.startDate) newErrors.startDate = "Start date is required";
    if (!data.endDate) newErrors.endDate = "End date is required";
    if (!data.brand) newErrors.brand = "Brand selection is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(
      createCampaign({
        campaignName: data.name,
        description: data.description,
        budget: Number(data.budget),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status,
        brand: data.brand,
      }),
    );

    if (!result?.error) {
      setSuccessMessage("Campaign added successfully! Redirecting...");
      setTimeout(() => {
        router.push("/campaigns"); // Redirect to campaign listing page
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
        Add New Campaign
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", maxWidth: 400, mx: "auto" }}
      >
        <TextField
          fullWidth
          label="Campaign Name"
          name="name"
          value={data.name}
          onChange={handleChange}
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={data.description}
          onChange={handleChange}
          margin="normal"
          error={!!errors.description}
          helperText={errors.description}
        />

        <TextField
          fullWidth
          label="Budget"
          name="budget"
          type="number"
          value={data.budget}
          onChange={handleChange}
          margin="normal"
          error={!!errors.budget}
          helperText={errors.budget}
        />

        <TextField
          fullWidth
          label="Start Date"
          name="startDate"
          type="date"
          value={data.startDate}
          onChange={handleChange}
          margin="normal"
          error={!!errors.startDate}
          helperText={errors.startDate}
        />

        <TextField
          fullWidth
          label="End Date"
          name="endDate"
          type="date"
          value={data.endDate}
          onChange={handleChange}
          margin="normal"
          error={!!errors.endDate}
          helperText={errors.endDate}
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
            "Add Campaign"
          )}
        </Button>
      </Box>
    </Box>
  );
}
