import { useEffect, useState } from "react";
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

interface Campaign {
  id: string;
  name: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  influencers: Influencer[];
}

interface Influencer {
  id: string;
  name: string;
  avatar: string;
  submissionDate: string;
  postCount: number;
}

export default function BrandCampaigns({ brand }: { brand: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCampaigns([
        {
          id: "1",
          name: "Summer Blast",
          description: "A summer campaign",
          budget: 5000,
          startDate: "2024-06-01",
          endDate: "2024-07-01",
          influencers: [
            {
              id: "101",
              name: "John Doe",
              avatar: "https://via.placeholder.com/50",
              submissionDate: "2024-06-05",
              postCount: 12,
            },
            {
              id: "102",
              name: "Jane Smith",
              avatar: "https://via.placeholder.com/50",
              submissionDate: "2024-06-06",
              postCount: 8,
            },
          ],
        },
        {
          id: "2",
          name: "Winter Trends",
          description: "Winter collection promo",
          budget: 7000,
          startDate: "2024-12-01",
          endDate: "2025-01-01",
          influencers: [
            {
              id: "103",
              name: "Emily Davis",
              avatar: "https://via.placeholder.com/50",
              submissionDate: "2024-12-05",
              postCount: 15,
            },
          ],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [brand]);

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Active Campaigns
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {campaigns.map((campaign) => (
            <Grid item xs={12} key={campaign.id}>
              <Card sx={{ p: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {campaign.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {campaign.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Budget: ${campaign.budget.toLocaleString()} | {campaign.startDate} - {campaign.endDate}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Influencers
                  </Typography>
                  <Grid container spacing={2}>
                    {campaign.influencers.map((influencer) => (
                      <Grid item xs={12} md={4} key={influencer.id}>
                        <Card sx={{ boxShadow: 2 }}>
                          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar src={influencer.avatar} alt={influencer.name} />
                            <Box>
                              <Typography fontWeight="bold">{influencer.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Submission: {influencer.submissionDate}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                Posts: {influencer.postCount}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
