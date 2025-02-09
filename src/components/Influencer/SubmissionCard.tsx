/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Box,
  Typography,
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

interface SubmissionCardProps {
  submission: any;
  contentPreview?: ContentPreview;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  contentPreview,
}) => {
  return (
    <Card sx={{ boxShadow: 2 }}>
      <CardContent>
        {/* Influencer Info */}
        <Box display="flex" alignItems="center">
          <Avatar sx={{ mr: 2 }}>
            {submission.influencer.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6">{submission.influencer_name}</Typography>
            <Typography variant="caption">
              {submission.influencer.platform} |{" "}
              {submission.influencer.socialMediaHandle} |{" "}
              {submission.influencer.followersCount}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {submission.campaign.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {submission.campaign.description}
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
                {submission.engagement.likes}
              </Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title="Comments">
            <IconButton>
              <Comment color="primary" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {submission.engagement.comments}
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SubmissionCard;
