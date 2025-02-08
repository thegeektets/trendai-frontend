/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { submitSubmission } from "@/store/slices/submissionSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
} from "@mui/material";
import { AppDispatch } from "@/store";

interface AddSubmissionProps {
  campaign: {
    _id: string;
    name: string;
  };
  influencerId: string;
  onClose: () => void;
}

export default function AddSubmission({
  campaign,
  influencerId,
  onClose,
}: AddSubmissionProps) {
  const dispatch = useDispatch<AppDispatch>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, submission, error } = useSelector(
    (state: any) => state.submission,
  );
  const [localError, setLocalError] = useState<any>(null);
  const [localSuccess, setLocalSuccess] = useState<any>(null);

  const [submissionData, setSubmissionData] = useState({
    contentLink: "",
    likes: 0,
    comments: 0,
    campaignId: campaign._id.toString(),
    influencer: influencerId,
  });

  const [errors, setErrors] = useState({
    contentLink: "",
    likes: "",
    comments: "",
  });

  const handleSubmissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionData({
      ...submissionData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors: any = {};

    if (!submissionData.contentLink) {
      newErrors.contentLink = "Content link is required.";
    }

    if (submissionData.likes <= 0) {
      newErrors.likes = "Likes must be greater than 0.";
    }

    if (submissionData.comments < 0) {
      newErrors.comments = "Comments cannot be negative.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    console.log("Submission Data:", submissionData);
    try {
      const response = await dispatch(
        submitSubmission(submissionData),
      ).unwrap();
      console.log("response", response);
      if (response?.error) {
        setLocalError(response?.error || "An error occured");
      } else {
        setLocalSuccess("Submission successful");
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      // Handle any error from the async action
      console.error("Submission failed:", err);
      setLocalError(err.message);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "400px", // Side overlay width
          position: "absolute",
          top: 0,
          right: 0,
          height: "100vh",
          borderRadius: 0,
        },
      }}
    >
      <DialogTitle>Add Submission</DialogTitle>
      <DialogContent>
        <Box>
          {localSuccess && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {localSuccess}
            </Alert>
          )}
          {localError && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {localError}
            </Alert>
          )}

          <Typography variant="h6">Campaign: {campaign.name}</Typography>

          <TextField
            label="Content Link"
            variant="outlined"
            fullWidth
            value={submissionData.contentLink}
            onChange={handleSubmissionChange}
            name="contentLink"
            margin="normal"
            error={!!errors.contentLink}
            helperText={errors.contentLink}
          />

          <TextField
            label="Likes"
            variant="outlined"
            fullWidth
            type="number"
            value={submissionData.likes}
            onChange={handleSubmissionChange}
            name="likes"
            margin="normal"
            error={!!errors.likes}
            helperText={errors.likes}
          />

          <TextField
            label="Comments"
            variant="outlined"
            fullWidth
            type="number"
            value={submissionData.comments}
            onChange={handleSubmissionChange}
            name="comments"
            margin="normal"
            error={!!errors.comments}
            helperText={errors.comments}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
