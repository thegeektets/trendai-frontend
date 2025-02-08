import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Avatar,
  Tooltip,
  IconButton,
} from "@mui/material";
import { ThumbUp, Comment } from "@mui/icons-material";

interface Submission {
  id: string;
  contentLink: string;
  influencer: string;
  status: string;
  date: string;
  campaignName: string;
  likes: number;
  comments: number;
}

interface ContentPreview {
  title: string;
  imageUrl: string;
  description: string;
}

interface ApprovalCardProps {
  submission: Submission;
  contentPreview?: ContentPreview;
  onStatusChange: (submissionId: string, status: string) => void;
}

const ApprovalCard: React.FC<ApprovalCardProps> = ({
  submission,
  contentPreview,
  onStatusChange,
}) => {
  return (
    <Card sx={{ boxShadow: 2 }}>
      <CardContent>
        {/* Influencer Info */}
        <Box display="flex" alignItems="center">
          <Avatar sx={{ mr: 2 }}>JD</Avatar>
          <Box>
            <Typography variant="h6">{submission.influencer}</Typography>
            <Typography variant="body2" color="text.secondary">
              {submission.campaignName} -{" "}
              {new Date(submission.date).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Social Media Link */}
        <Typography variant="body2" color="text.secondary" noWrap>
          <Tooltip
            title={submission.contentLink || "No content link available"}
            placement="top"
          >
            <a
              href={submission.contentLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {submission.contentLink || "No content link"}
            </a>
          </Tooltip>
        </Typography>

        {/* Social Media Preview */}
        <Box mt={2} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {contentPreview && (
            <>
              <img
                src={contentPreview.imageUrl}
                alt={contentPreview.title}
                style={{ width: 50, height: 50, objectFit: "cover" }}
              />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {contentPreview.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {contentPreview.description}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {/* Engagement (Likes & Comments) */}
        <Box mt={2} display="flex" gap={2}>
          <Tooltip title="Likes">
            <IconButton>
              <ThumbUp color="primary" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {submission.likes}
              </Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title="Comments">
            <IconButton>
              <Comment color="primary" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {submission.comments}
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Action Buttons */}
        <Box mt={2} display="flex" gap={1}>
          <Button
            variant="contained"
            color="success"
            onClick={() => onStatusChange(submission.id, "approved")}
            disabled={submission.status !== "pending"}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => onStatusChange(submission.id, "rejected")}
            disabled={submission.status !== "pending"}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => onStatusChange(submission.id, "denied")}
            disabled={submission.status !== "pending"}
          >
            Deny
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ApprovalCard;