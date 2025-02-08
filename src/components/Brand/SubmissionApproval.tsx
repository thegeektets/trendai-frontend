/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import ApprovalCard from "./ApprovalCard"; // Import the ApprovalCard component
import { fetchSocialMediaPreview } from "@/utils/preview";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
  fetchSubmissionsByBrand,
  updateSubmission,
} from "@/store/slices/submissionSlice";

export default function SubmissionApproval({
  brand,
  user,
}: {
  brand: string;
  user: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [tabValue, setTabValue] = useState(0);
  const [localSubmissions, setLocalSubmissions] = useState<any[]>([]);
  const [contentPreviews, setContentPreviews] = useState<{
    [key: string]: { title: string; imageUrl: string; description: string };
  }>({});
  const { loading, submissions } = useSelector(
    (state: any) => state.submission,
  );
  const [localError, setLocalError] = useState<string | null>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [localLoading, setLocalLoading] = useState<boolean>(false); // Local loading state

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStatusChange = async (submissionId: string, status: string) => {
    const result = await dispatch(
      updateSubmission({ id: submissionId, status: status, approver: user }),
    );
    console.log("result", result);

    if (result?.error) {
      setLocalError(result?.payload?.message);

      // Clear error message after 3 seconds
      const errorTimeout = setTimeout(() => {
        setLocalError(null);
      }, 10000);

      return () => clearTimeout(errorTimeout); // Cleanup on re-render
    } else {
      setSuccessMessage(
        `Submission has been updated to ${status} successfully`,
      );

      setLocalSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) =>
          submission.id === submissionId
            ? { ...submission, status }
            : submission,
        ),
      );

      // Clear success message after 3 seconds
      const successTimeout = setTimeout(() => {
        setSuccessMessage(null);
        getBrandSubmissions(brand);
      }, 3000);

      return () => clearTimeout(successTimeout); // Cleanup on re-render
    }
  };

  const filterSubmissions = (status: string) => {
    if (status === "all") return localSubmissions;
    return localSubmissions.filter(
      (submission) => submission.status === status,
    );
  };

  // Corrected async function
  const getBrandSubmissions = async (brand: string) => {
    setLocalLoading(true);
    const result = await dispatch(fetchSubmissionsByBrand(brand));
    console.log("result", result);
    if (result.payload) {
      setLocalSubmissions(result.payload);
    }
    setLocalLoading(false);
  };

  useEffect(() => {
    console.log("brand", brand);
    getBrandSubmissions(brand);
  }, [brand, dispatch]);

  useEffect(() => {
    const fetchAllPreviews = async () => {
      const previews: {
        [key: string]: { title: string; imageUrl: string; description: string };
      } = {};
      for (const submission of localSubmissions) {
        if (!contentPreviews[submission.contentLink]) {
          const preview = await fetchSocialMediaPreview(submission.contentLink);
          previews[submission.contentLink] = preview;
        }
      }
      setContentPreviews((prev) => ({ ...prev, ...previews }));
    };

    fetchAllPreviews();
  }, [localSubmissions]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Submissions
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
      ) : localSubmissions.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <Typography variant="h6" color="text.secondary">
            No submissions found for this brand.
          </Typography>
        </Box>
      ) : (
        <>
          {successMessage && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          {localError && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {localError}
            </Alert>
          )}
          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Submission Status"
          >
            <Tab label="All" />
            <Tab label="Approved" />
            <Tab label="Rejected" />
            <Tab label="Pending" />
          </Tabs>

          {/* Submissions */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {filterSubmissions(
              tabValue === 0
                ? "all"
                : ["approved", "rejected", "pending"][tabValue - 1],
            ).map((submission) => (
              <Grid item xs={12} md={4} key={submission._id}>
                <ApprovalCard
                  submission={submission}
                  contentPreview={contentPreviews[submission.contentLink]}
                  onStatusChange={handleStatusChange}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
