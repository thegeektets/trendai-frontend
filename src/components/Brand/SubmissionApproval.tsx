import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Tab, Tabs, Card, CardContent, Divider, Avatar, Tooltip, Grid, IconButton } from '@mui/material';
import { ThumbUp, Comment } from '@mui/icons-material';

// Sample Data
const sampleSubmissions = [
  {
    id: '1',
    contentLink: 'https://example.com/content1',
    influencer: 'John Doe',
    status: 'pending',
    date: '2025-02-08',
    campaignName: 'Campaign A',
    likes: 120,
    comments: 30,
  },
  {
    id: '2',
    contentLink: 'https://example.com/content2',
    influencer: 'Jane Smith',
    status: 'approved',
    date: '2025-02-07',
    campaignName: 'Campaign A',
    likes: 250,
    comments: 50,
  },
  {
    id: '3',
    contentLink: 'https://example.com/content3',
    influencer: 'Emily Clark',
    status: 'rejected',
    date: '2025-02-06',
    campaignName: 'Campaign B',
    likes: 90,
    comments: 10,
  },
];

const SubmissionApproval = () => {
  const [tabValue, setTabValue] = useState(0);
  const [submissions, setSubmissions] = useState(sampleSubmissions);
  const [contentPreviews, setContentPreviews] = useState<{ [key: string]: { title: string, imageUrl: string } }>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStatusChange = (submissionId: string, status: string) => {
    setSubmissions((prevSubmissions) =>
      prevSubmissions.map((submission) =>
        submission.id === submissionId ? { ...submission, status } : submission
      )
    );
  };

  const filterSubmissions = (status: string) => {
    if (status === 'all') return submissions;
    return submissions.filter((submission) => submission.status === status);
  };

  // Fetch content preview (title and image) from contentLink
  const fetchContentPreview = async (contentLink: string) => {
    try {
      const response = await fetch(`https://api.linkpreview.net?key=YOUR_API_KEY&q=${contentLink}`);
      const data = await response.json();
      return { title: data.title, imageUrl: data.image || 'https://via.placeholder.com/100' };
    } catch (error) {
      console.error('Error fetching content preview:', error);
      return { title: 'No title available', imageUrl: 'https://via.placeholder.com/100' };
    }
  };

  useEffect(() => {
    const fetchAllPreviews = async () => {
      const previews: { [key: string]: { title: string, imageUrl: string } } = {};
      for (const submission of submissions) {
        if (!contentPreviews[submission.contentLink]) {
          const preview = await fetchContentPreview(submission.contentLink);
          previews[submission.contentLink] = preview;
        }
      }
      setContentPreviews((prev) => ({ ...prev, ...previews }));
    };

    fetchAllPreviews();
  }, [submissions, contentPreviews]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Submissions
      </Typography>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="Submission Status">
        <Tab label="All" />
        <Tab label="Approved" />
        <Tab label="Rejected" />
        <Tab label="Pending" />
      </Tabs>

      {/* Submissions */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {filterSubmissions(tabValue === 0 ? 'all' : ['approved', 'rejected', 'pending'][tabValue - 1]).map((submission) => (
          <Grid item xs={12} md={4} key={submission.id}>
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ mr: 2 }}>JD</Avatar>
                  <Box>
                    <Typography variant="h6">{submission.influencer}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {submission.campaignName} - {new Date(submission.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" noWrap>
                  <Tooltip title={submission.contentLink} placement="top">
                    <a href={submission.contentLink} target="_blank" rel="noopener noreferrer">
                      {submission.contentLink}
                    </a>
                  </Tooltip>
                </Typography>

                {/* Content Link Preview */}
                <Box mt={2} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {contentPreviews[submission.contentLink] && (
                    <>
                      <img
                        src={contentPreviews[submission.contentLink].imageUrl}
                        alt={contentPreviews[submission.contentLink].title}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {contentPreviews[submission.contentLink].title}
                      </Typography>
                    </>
                  )}
                </Box>

                {/* Engagement (Likes & Comments) */}
                <Box mt={2} display="flex" gap={2}>
                  <Tooltip title="Likes">
                    <IconButton>
                      <ThumbUp color="primary" />
                      <Typography variant="body2">{submission.likes}</Typography>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Comments">
                    <IconButton>
                      <Comment color="primary" />
                      <Typography variant="body2">{submission.comments}</Typography>
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Action Buttons */}
                <Box mt={2} display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleStatusChange(submission.id, 'approved')}
                    disabled={submission.status !== 'pending'}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleStatusChange(submission.id, 'rejected')}
                    disabled={submission.status !== 'pending'}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleStatusChange(submission.id, 'denied')}
                    disabled={submission.status !== 'pending'}
                  >
                    Deny
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SubmissionApproval;
