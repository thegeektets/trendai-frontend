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
} from "@mui/material";
import CampaignList from "@/components/Influencer/CampaignList";
import CampaignDetails from "@/components/Influencer/CampaignDetails";
import PerformanceSnapshot from "@/components/Influencer/PerformanceSnapshot";
import InfluencerList from "@/components/Brand/InfluencerList";
import SubmissionApproval from "@/components/Brand/SubmissionApproval";
import SnapshotPage from "@/components/Brand/SnapshotPage";
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
  const [userDetails, setUserDetails] = useState<any>(null); // Add state for user profile
  const [selectedPage, setSelectedPage] = useState<string>("Campaign List");
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
  }, [router]);

  const influencerMenu = [
    { text: "Campaign List", icon: <Campaign /> },
    { text: "Campaign Details", icon: <Info /> },
    { text: "Performance Snapshot", icon: <Assessment /> },
  ];

  const brandMenu = [
    { text: "Influencer List", icon: <People /> },
    { text: "Submission Approval", icon: <CheckCircle /> },
    { text: "Campaign Snapshot", icon: <BarChart /> },
    { text: "Add Campaign", icon: <AddCircle /> },
  ];

  const menuItems = role === "influencer" ? influencerMenu : brandMenu;

  const renderPage = () => {
    switch (selectedPage) {
      case "Campaign List":
        return <CampaignList />;
      case "Campaign Details":
        return <CampaignDetails />;
      case "Performance Snapshot":
        return <PerformanceSnapshot />;
      case "Influencer List":
        return <InfluencerList />;
      case "Submission Approval":
        return <SubmissionApproval />;
      case "Campaign Snapshot":
        return <SnapshotPage />;
      case "Add Campaign":
        return <AddCampaign />;
      default:
        return <Typography variant="h6">Select a page</Typography>;
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
            Company: {userDetails.companyName}
          </Typography>
          <Typography variant="body2">
            Industry: {userDetails.industry}
          </Typography>
          <Typography variant="body2">
            Founded: {new Date(userDetails.foundedAt).toLocaleDateString()}
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
                onClick={() => setSelectedPage(text)}
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
