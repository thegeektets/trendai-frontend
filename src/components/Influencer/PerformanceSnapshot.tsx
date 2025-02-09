import { AppDispatch } from "@/store";
import { fetchSubmissionsByInfluencer } from "@/store/slices/submissionSlice";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import SubmissionCard from "./SubmissionCard";

export default function PerformanceSnapshot({
  influencer,
}: {
  influencer: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [localSubmissions, setLocalSubmissions] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>("");

  const getBrandSubmissions = async (influencer: string) => {
    setLocalLoading(true);
    const result = await dispatch(fetchSubmissionsByInfluencer(influencer));

    if (result.payload) {
      setLocalSubmissions(result.payload);
    } else {
      setLocalError(result?.error || "Could not fetch submissions");
    }
    setLocalLoading(false);
  };

  useEffect(() => {
    getBrandSubmissions(influencer);
  }, [influencer, dispatch]);

  const calculateStats = (submissions: any[]) => {
    return submissions.reduce(
      (acc, submission) => {
        acc[submission.status] = (acc[submission.status] || 0) + 1;
        acc.total += 1;
        return acc;
      },
      { approved: 0, pending: 0, rejected: 0, total: 0 }
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Performance Snapshot
      </Typography>
      {localError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {localError}
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
      ) : localSubmissions.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">
          No submissions found for this influencer.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {Object.values(localSubmissions).map((brand: any) => {
            const brandStats = calculateStats(
              Object.values(brand.campaigns).flatMap((c: any) => c.submissions)
            );

            return (
              <Grid item xs={12} key={brand._id}>
                <Card sx={{ p: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {brand.brandName}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1} mb={2}>
                      <Chip
                        label={`Approved: ${brandStats.approved}`}
                        color="success"
                        size="small"
                      />
                      <Chip
                        label={`Pending: ${brandStats.pending}`}
                        color="warning"
                        size="small"
                      />
                      <Chip
                        label={`Rejected: ${brandStats.rejected}`}
                        color="error"
                        size="small"
                      />
                      <Chip
                        label={`Total: ${brandStats.total}`}
                        color="primary"
                        size="small"
                      />
                    </Stack>
                    <Divider sx={{ my: 2 }} />

                    {Object.values(brand.campaigns).map((campaign: any) => {
                      const campaignStats = calculateStats(
                        campaign.submissions
                      );
                      return (
                        <Box key={campaign._id} sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {campaign.campaignName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Budget: KES {campaign.budget?.toLocaleString() || "N/A"} | 
                            Start: {campaign.startDate || "N/A"} | 
                            End: {campaign.endDate || "N/A"} | 
                            Status: {campaign.status || "N/A"}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Chip
                              label={`Approved: ${campaignStats.approved}`}
                              color="success"
                              size="small"
                            />
                            <Chip
                              label={`Pending: ${campaignStats.pending}`}
                              color="warning"
                              size="small"
                            />
                            <Chip
                              label={`Rejected: ${campaignStats.rejected}`}
                              color="error"
                              size="small"
                            />
                            <Chip
                              label={`Total: ${campaignStats.total}`}
                              color="primary"
                              size="small"
                            />
                          </Stack>

                          <Grid container spacing={2}>
                            {campaign.submissions.map((submission: any) => (
                              <Grid item xs={12} md={4} key={submission._id}>
                                <SubmissionCard submission={submission} />
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      );
                    })}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}