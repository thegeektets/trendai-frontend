"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Toolbar,
  AppBar,
  CssBaseline,
  Divider,
  Paper,
  CircularProgress,
} from "@mui/material";
import CampaignList from "@/components/Influencer/CampaignList";
import PerformanceSnapshot from "@/components/Influencer/PerformanceSnapshot";
import InfluencerList from "@/components/Brand/InfluencerList";
import SubmissionApproval from "@/components/Brand/SubmissionApproval";
import AddCampaign from "@/components/Brand/AddCampaign";
import {
  Campaign,
  Info,
  Assessment,
  People,
  CheckCircle,
  BarChart,
  AddCircle,
} from "@mui/icons-material";

const drawerWidth = 240;

export default function Dashboard() {
  const [role, setRole] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>("Campaign");

  const [userDetails, setUserDetails] = useState<any>(null); // Add state for user profile
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/signin");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser.role) {
      router.push("/auth/signin");
      return;
    }

    setRole(parsedUser.role);
    setUserDetails(parsedUser.profile);

    // Check if query is available and contains 'page' before using it
    if (router.query && router.query.page) {
      const { page } = router.query;
      const formattedPage = page.replace(/-/g, " "); // Convert hyphenated URL to space
      setSelectedPage(formattedPage);
    } else {
      const defaultPage =
        parsedUser.role === "influencer" ? "Campaign List" : "Influencer List";
      const formattedDefaultPage = defaultPage
        .replace(/\s+/g, "-")
        .toLowerCase(); // Convert to hyphenated URL
      router.push(`/dashboard?page=${formattedDefaultPage}`);
    }
  }, [router.query]);

  const influencerMenu = [
    { text: "Campaigns", icon: <Campaign /> },
    { text: "Performance", icon: <Assessment /> },
  ];

  const brandMenu = [
    { text: "Influencers", icon: <People /> },
    { text: "Submissions", icon: <CheckCircle /> },
    { text: "New Campaign", icon: <AddCircle /> },
  ];

  const menuItems = role === "influencer" ? influencerMenu : brandMenu;

  const handleMenuClick = (text: string) => {
    setSelectedPage(text);

    // Convert the page text to hyphenated URL
    const hyphenatedText = text.replace(/\s+/g, "-").toLowerCase();
    router.push(`/dashboard?page=${hyphenatedText}`);
  };

  const renderPage = () => {
    const formattedPage = selectedPage.replace(/\s+/g, "-").toLowerCase();
    switch (formattedPage) {
      case "campaigns":
        return <CampaignList />;
      case "performance":
        return <PerformanceSnapshot />;
      case "influencers":
        return <InfluencerList brand={userDetails._id} />;
      case "submissions":
        return <SubmissionApproval />;
      case "new-campaign":
        return <AddCampaign brand={userDetails._id} />;
      default:
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <Typography variant="h6" color="text.secondary">
              Page not found.
            </Typography>
          </Box>
        );
    }
  };
  const renderUserProfile = () => {
    if (role === "influencer" && userDetails) {
      return (
        <Box
          sx={{
            padding: 2,
            borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Typography variant="h6">{userDetails.name}</Typography>
          <Typography variant="body2">
            Platform: {userDetails.platform}
          </Typography>
          <Typography variant="body2">
            Handle: @{userDetails.socialMediaHandle}
          </Typography>
          <Typography variant="body2">
            Followers: {userDetails.followersCount}
          </Typography>
          <Typography variant="body2">
            Account Created:{" "}
            {new Date(userDetails.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      );
    }
    if (role === "brand" && userDetails) {
      return (
        <Box
          sx={{
            padding: 2,
            borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Typography variant="h6">{userDetails.name}</Typography>
          <Typography variant="body2">
            Industry: {userDetails.industry}
          </Typography>
          <Typography variant="body2">{userDetails.website}</Typography>
          <Typography variant="body2">
            Created: {new Date(userDetails.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "#5750F1",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap color="white">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#5750F1",
            color: "white",
            boxShadow: "4px 0px 10px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <Toolbar />
        <Paper elevation={4} sx={{ margin: 2, padding: 2 }}>
          {renderUserProfile()}
        </Paper>
        <List>
          {menuItems.map(({ text, icon }) => (
            <>
              <ListItem
                button
                key={text}
                onClick={() => handleMenuClick(text)}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>{icon}</ListItemIcon>
                <ListItemText primary={text} sx={{ color: "white" }} />
              </ListItem>
              <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }} />
            </>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {renderPage()}
      </Box>
    </Box>
  );
}
