/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import SubmissionCard from "./SubmissionCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
    const result: any = await dispatch(
      fetchSubmissionsByInfluencer(influencer),
    );

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
      { approved: 0, pending: 0, rejected: 0, total: 0 },
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
              Object.values(brand.campaigns).flatMap((c: any) => c.submissions),
            );

            return (
              <Grid item xs={12} key={brand._id}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {brand.brandName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Industry: KES {brand.industry || "N/A"} | Website:{" "}
                      {brand.website || "N/A"}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label={`Approved: ${brandStats.approved}`}
                        color="success"
                        variant="outlined"
                      />
                      <Chip
                        label={`Pending: ${brandStats.pending}`}
                        color="warning"
                        variant="outlined"
                      />
                      <Chip
                        label={`Rejected: ${brandStats.rejected}`}
                        color="error"
                        variant="outlined"
                      />
                      <Chip
                        label={`Total: ${brandStats.total}`}
                        color="primary"
                        variant="outlined"
                      />
                    </Stack>
                    <Divider sx={{ mb: 2 }} />

                    {Object.values(brand.campaigns).map((campaign: any) => {
                      const campaignStats = calculateStats(
                        campaign.submissions,
                      );
                      return (
                        <Accordion key={campaign._id} sx={{ mb: 2 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {campaign.campaignName}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                            >
                              Budget: KES{" "}
                              {campaign.budget?.toLocaleString() || "N/A"} |
                              Start: {campaign.startDate || "N/A"} | End:{" "}
                              {campaign.endDate || "N/A"} | Status:{" "}
                              {campaign.status || "N/A"}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                              <Chip
                                label={`Approved: ${campaignStats.approved}`}
                                color="success"
                                variant="outlined"
                              />
                              <Chip
                                label={`Pending: ${campaignStats.pending}`}
                                color="warning"
                                variant="outlined"
                              />
                              <Chip
                                label={`Rejected: ${campaignStats.rejected}`}
                                color="error"
                                variant="outlined"
                              />
                              <Chip
                                label={`Total: ${campaignStats.total}`}
                                color="primary"
                                variant="outlined"
                              />
                            </Stack>

                            <Grid container spacing={2}>
                              {campaign.submissions.map((submission: any) => (
                                <Grid item xs={12} md={4} key={submission._id}>
                                  <SubmissionCard submission={submission} />
                                </Grid>
                              ))}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
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
