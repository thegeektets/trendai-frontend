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
  CardHeader,
  Chip,
  Stack,
  Tooltip,
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
        Campaigns
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
                  <Stack direction="row" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {campaign.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {campaign.description}
                      </Typography>
                    </Box>
                    <Chip
                      label={`Budget : KES ${campaign.budget.toLocaleString()}`}
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Stack>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                  >
                    {campaign.startDate} - {campaign.endDate}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    marginBottom={"15px"}
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
                        const { submissions } = influencer;
                        const statusCounts = submissions.reduce(
                          (acc, submission) => {
                            acc[submission.status] =
                              (acc[submission.status] || 0) + 1;
                            return acc;
                          },
                          { pending: 0, approved: 0, rejected: 0 },
                        );

                        const latestSubmission = submissions.reduce(
                          (latest, current) =>
                            new Date(current.date) > new Date(latest.date)
                              ? current
                              : latest,
                          submissions[0],
                        );

                        return (
                          <Grid item xs={12} md={4} key={influencer.id}>
                            <Card sx={{ boxShadow: 2 }}>
                              <CardHeader
                                avatar={
                                  <Avatar
                                    src={influencer.avatar}
                                    alt={influencer.name}
                                  />
                                }
                                title={influencer.name}
                                subheader={
                                  <>
                                    <Typography variant="caption">
                                      {influencer.platform} | @
                                      {influencer.socialMediaHandle}
                                    </Typography>
                                  </>
                                }
                              />
                              <CardContent>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Typography variant="body2" fontWeight="bold">
                                    Followers:
                                  </Typography>
                                  <Chip
                                    label={influencer.followersCount.toLocaleString()}
                                    size="small"
                                  />
                                </Stack>

                                <Stack direction="row" spacing={1} mt={1}>
                                  <Tooltip title="Pending">
                                    <Chip
                                      label={"pending :" + statusCounts.pending}
                                      color="warning"
                                      size="small"
                                    />
                                  </Tooltip>
                                  <Tooltip title="Approved">
                                    <Chip
                                      label={
                                        "approved :" + statusCounts.approved
                                      }
                                      color="success"
                                      size="small"
                                    />
                                  </Tooltip>
                                  <Tooltip title="Rejected">
                                    <Chip
                                      label={
                                        "rejected :" + statusCounts.approved
                                      }
                                      color="error"
                                      size="small"
                                    />
                                  </Tooltip>
                                </Stack>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  mt={1}
                                >
                                  Latest Submission:{" "}
                                  {latestSubmission.date.split("T")[0]}
                                </Typography>
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
