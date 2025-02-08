"use client";

import { useState, useEffect } from "react";
import { Menu, MenuItem, Avatar, IconButton, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export function UserInfo() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<{ email: string; role: string } | null>(
    null,
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    handleMenuClose();
    // Redirect or update auth state if needed
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen} size="small">
        <Avatar>{user?.email?.charAt(0).toUpperCase()}</Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { minWidth: 200, p: 1 } }}
      >
        {user ? (
          <>
            <Typography variant="body1" sx={{ px: 2, fontWeight: 500 }}>
              {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
              {user.role}
            </Typography>
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
