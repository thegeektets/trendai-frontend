"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
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
import {
  Campaign,
  Assessment,
  People,
  CheckCircle,
  AddCircle,
} from "@mui/icons-material";

const drawerWidth = 240;

// Lazy load components
const CampaignList = dynamic(
  () => import("@/components/Influencer/CampaignList"),
  {
    ssr: false,
  },
);
const PerformanceSnapshot = dynamic(
  () => import("@/components/Influencer/PerformanceSnapshot"),
  {
    ssr: false,
  },
);
const InfluencerList = dynamic(
  () => import("@/components/Brand/InfluencerList"),
  {
    ssr: false,
  },
);
const SubmissionApproval = dynamic(
  () => import("@/components/Brand/SubmissionApproval"),
  {
    ssr: false,
  },
);
const AddCampaign = dynamic(() => import("@/components/Brand/AddCampaign"));

export default function Dashboard() {
  const [role, setRole] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>("Campaign");
  const [userDetails, setUserDetails] = useState<any>(null);
  const router = useRouter();

  // Fetch user details and set role
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
    setUserDetails({ userId: parsedUser._id, ...parsedUser.profile });

    // Set the selected page based on the query or default
    const queryPage = router.query?.page;
    if (queryPage) {
      const formattedPage = queryPage.replace(/-/g, " ");
      setSelectedPage(formattedPage);
    } else {
      const defaultPage =
        parsedUser.role === "influencer" ? "Campaigns" : "Influencers";
      const formattedDefaultPage = defaultPage
        .replace(/\s+/g, "-")
        .toLowerCase();
      router.push(`/dashboard?page=${formattedDefaultPage}`);
    }
  }, [router.query]);

  // Memoize menu items based on role
  const menuItems = useMemo(() => {
    if (role === "influencer") {
      return [
        { text: "Campaigns", icon: <Campaign /> },
        { text: "Performance", icon: <Assessment /> },
      ];
    } else if (role === "brand") {
      return [
        { text: "Influencers", icon: <People /> },
        { text: "Submissions", icon: <CheckCircle /> },
        { text: "New Campaign", icon: <AddCircle /> },
      ];
    }
    return [];
  }, [role]);

  // Handle menu item clicks
  const handleMenuClick = useCallback(
    (text: string) => {
      setSelectedPage(text);
      const hyphenatedText = text.replace(/\s+/g, "-").toLowerCase();
      router.push(`/dashboard?page=${hyphenatedText}`);
    },
    [router],
  );

  // Render the selected page
  const renderPage = useMemo(() => {
    const formattedPage = selectedPage.replace(/\s+/g, "-").toLowerCase();
    switch (formattedPage) {
      case "campaigns":
        return <CampaignList />;
      case "performance":
        return <PerformanceSnapshot influencer={userDetails?._id} />;
      case "influencers":
        return <InfluencerList brand={userDetails?._id} />;
      case "submissions":
        return (
          <SubmissionApproval
            user={userDetails?._id}
            brand={userDetails?._id}
          />
        );
      case "new-campaign":
        return <AddCampaign brand={userDetails?._id} />;
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
  }, [selectedPage, userDetails]);

  // Render user profile
  const renderUserProfile = useMemo(() => {
    if (!userDetails) return null;

    if (role === "influencer") {
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
    } else if (role === "brand") {
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
  }, [userDetails, role]);

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
          {renderUserProfile}
        </Paper>
        <List>
          {menuItems.flatMap(({ text, icon }) => [
            <ListItem
              key={text}
              button
              onClick={() => handleMenuClick(text)}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{icon}</ListItemIcon>
              <ListItemText primary={text} sx={{ color: "white" }} />
            </ListItem>,
            <Divider
              key={`${text}-divider`}
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            />,
          ])}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {renderPage}
      </Box>
    </Box>
  );
}
