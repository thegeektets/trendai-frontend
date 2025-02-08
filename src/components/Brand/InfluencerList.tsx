import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import { getCampaignsByBrand } from "@/store/slices/campaignSlice";
import { AppDispatch } from "@/store";

interface Campaign {
  id: string;
  name: string;
  description: string;
  budget: number;
  status: string;
  startDate: string;
  endDate: string;
  influencers: Influencer[];
}

interface Influencer {
  id: string;
  name: string;
  avatar: string;
  socialMediaHandle: string;
  platform: string;
  followersCount: number;
  submissions: Submission[];
}

interface Submission {
  id: string;
  date: string;
  status: string;
  engagement: number;
}

export default function InfluencerList({ brand }: { brand: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, campaigns } = useSelector((state: any) => state.campaign); // Extract campaigns from state
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>([]);
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  // Corrected async function
  const getCampaigns = async () => {
    setLocalLoading(true);
    const result = await dispatch(getCampaignsByBrand(brand));
    console.log("result", result);
    if (result.payload) {
      setLocalCampaigns(result.payload);
    }
    setLocalLoading(false);
  };

  useEffect(() => {
    getCampaigns();
  }, [brand, dispatch]);

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Active Campaigns
      </Typography>

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
            No campaigns found for this brand.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {localCampaigns.map((campaign: Campaign) => (
            <Grid item xs={12} key={campaign.id}>
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
                    {campaign.startDate} - {campaign.endDate}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Influencers
                  </Typography>

                  {campaign.influencers.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No submissions yet.
                    </Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {campaign.influencers.map((influencer) => {
                        const submissionCount = influencer.submissions.length;
                        // Count submissions by status
                        const statusCounts = influencer.submissions.reduce(
                          (acc, submission) => {
                            acc[submission.status] =
                              (acc[submission.status] || 0) + 1;
                            return acc;
                          },
                          { pending: 0, approved: 0, rejected: 0 },
                        );

                        const latestSubmission = influencer.submissions.reduce(
                          (latest, current) =>
                            new Date(current.date) > new Date(latest.date)
                              ? current
                              : latest,
                          influencer.submissions[0],
                        );

                        const statusColors: Record<string, string> = {
                          pending: "warning.main",
                          approved: "success.main",
                          rejected: "error.main",
                        };

                        return (
                          <Grid item xs={12} md={4} key={influencer.id}>
                            <Card sx={{ boxShadow: 2 }}>
                              <CardContent
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Avatar
                                  src={influencer.avatar}
                                  alt={influencer.name}
                                />
                                <Box>
                                  <Typography fontWeight="bold">
                                    {influencer.name}
                                  </Typography>
                                  <Typography fontWeight="bold">
                                    Platform: {influencer.platform}
                                  </Typography>
                                  <Typography fontWeight="bold">
                                    Handle: {influencer.socialMediaHandle}
                                  </Typography>
                                  <Typography fontWeight="bold">
                                    Followers: {influencer.followersCount}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Latest Submission:{" "}
                                    {latestSubmission.date.split("T")[0]}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color={
                                      statusColors[latestSubmission.status]
                                    }
                                  >
                                    Status: {latestSubmission.status}
                                  </Typography>
                                  <Typography variant="body2">
                                    Submissions: {submissionCount} (
                                    {statusCounts.pending} pending,{" "}
                                    {statusCounts.approved} approved,{" "}
                                    {statusCounts.rejected} rejected)
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
