/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Divider,
  Button,
  Alert,
} from "@mui/material";
import { getAllCampaigns } from "@/store/slices/campaignSlice";
import { AppDispatch } from "@/store";
import AddSubmission from "./AddSubmission";

interface Campaign {
  _id: string;
  name: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
}

export default function CampaignList() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, campaigns } = useSelector((state: any) => state.campaign);
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>([]);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [selectedInfluencer, setSelectedInfluencer] = useState<string>("");
  const [error, setError] = useState<any>(null);

  // Fetch all campaigns
  const getCampaigns = async () => {
    setLocalLoading(true);
    const result = await dispatch(getAllCampaigns());
    console.log("result", result);
    if (result.payload) {
      setLocalCampaigns(result.payload);
    }
    setLocalLoading(false);
  };

  useEffect(() => {
    getCampaigns();
  }, [dispatch]);

  const handleAddSubmission = (campaign: Campaign) => {
    setError(null);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.profile?._id) {
        setSelectedInfluencer(parsedUser.profile?._id);
        setSelectedCampaign(campaign);
      } else {
        setError("Profile ID is missing");
      }
    } else {
      console.error("Error: No user found in localStorage");
      setError("No user found in localStorage");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Campaign List
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
          {error}
        </Alert>
      )}

      {localLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : localCampaigns.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <Typography variant="h6" color="text.secondary">
            No campaigns available.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {localCampaigns.map((campaign: Campaign) => (
            <Grid item xs={12} key={campaign._id}>
              <Card sx={{ p: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {campaign.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {campaign.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                  >
                    Budget: KES {campaign.budget.toLocaleString()} |{" "}
                    {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Add Submission button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddSubmission(campaign)}
                    sx={{ mt: 2 }}
                  >
                    Add Submission
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedCampaign && (
        <AddSubmission
          campaign={selectedCampaign}
          influencerId={selectedInfluencer}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </Box>
  );
}
