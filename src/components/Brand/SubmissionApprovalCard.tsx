/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Image from "next/image";

interface ContentPreview {
  title: string;
  imageUrl: string;
  description: string;
}

interface ApprovalCardProps {
  submission: any;
  contentPreview?: ContentPreview;
  onStatusChange: (submissionId: string, status: string) => void;
}

const SubmissionApprovalCard: React.FC<ApprovalCardProps> = ({
  submission,
  contentPreview,
  onStatusChange,
}) => {
  return (
    <Card sx={{ boxShadow: 2 }}>
      <CardContent>
        {/* Influencer Info */}
        <Box display="flex" alignItems="center">
          <Avatar sx={{ mr: 2 }}>
            {submission.influencer_name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6">{submission.influencer_name}</Typography>
            <Typography variant="caption">
              {submission.influencer_platform} |{" "}
              {submission.influencer_socialMediaHandle} |{" "}
              {submission.influencer_followersCount}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {submission.campaign_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {submission.campaign_description}
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
              <Image
                width={150}
                height={150}
                src={contentPreview.imageUrl}
                alt={contentPreview.title}
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
                {submission.engagement_likes}
              </Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title="Comments">
            <IconButton>
              <Comment color="primary" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {submission.engagement_comments}
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Action Buttons */}
        <Box mt={2} display="flex" gap={1}>
          <Button
            variant="contained"
            color="success"
            onClick={() => onStatusChange(submission._id, "approved")}
            disabled={submission.status !== "pending"}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => onStatusChange(submission._id, "rejected")}
            disabled={submission.status !== "pending"}
          >
            Reject
          </Button>

          {submission.status !== "pending" && (
            <Button
              variant="contained"
              color="warning"
              onClick={() => onStatusChange(submission._id, "pending")}
            >
              Pending
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SubmissionApprovalCard;
