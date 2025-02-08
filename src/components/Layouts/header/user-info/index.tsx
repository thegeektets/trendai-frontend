import { useState } from "react";
import { useRouter } from "next/navigation";

import { Menu, MenuItem, Avatar, IconButton, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

interface UserInfoProps {
  userDetails: {
    email: string;
    role: string;
    name: string;
    platform?: string;
    followersCount?: number;
    socialMediaHandle?: string;
    createdAt?: string;
    companyName?: string;
    companyIndustry?: string;
    companyWebsite?: string;
    companyDescription?: string;
  } | null;
}

export function UserInfo({ userDetails }: UserInfoProps) {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/signin");

    handleMenuClose();
    // Redirect or update auth state if needed
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen} size="small">
        <Avatar>{userDetails?.email?.charAt(0).toUpperCase()}</Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { minWidth: 200, p: 1 } }}
      >
        {userDetails ? (
          <>
            <Typography variant="body1" sx={{ px: 2, fontWeight: 500 }}>
              {userDetails.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
              {userDetails.email}
            </Typography>

            {/* Show additional details based on role */}
            {userDetails.role === "influencer" && (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 2 }}
                >
                  Platform: {userDetails.platform}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 2 }}
                >
                  Followers: {userDetails.followersCount}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 2 }}
                >
                  Handle: {userDetails.socialMediaHandle}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 2 }}
                >
                  Account Created:{" "}
                  {new Date(userDetails.createdAt!).toLocaleDateString()}
                </Typography>
              </>
            )}

            {userDetails.role === "brand" && (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 2 }}
                >
                  Industry: {userDetails.companyIndustry}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 2 }}
                >
                  {userDetails.companyWebsite}
                </Typography>
              </>
            )}

            <MenuItem onClick={handleLogout} sx={{ mt: 1 }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </>
        ) : (
          <Typography variant="body2" sx={{ px: 2 }}>
            Not logged in
          </Typography>
        )}
      </Menu>
    </>
  );
}
