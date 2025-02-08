/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { UserInfo } from "./user-info";
import logo from "@/assets/logo.png";

export function Header() {
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const userData = {
        email: parsedUser.email,
        role: parsedUser.role,
        name: parsedUser.profile?.name || parsedUser.profile?.name,
        platform:
          parsedUser.role === "influencer"
            ? parsedUser.profile?.platform
            : undefined,
        followersCount:
          parsedUser.role === "influencer"
            ? parsedUser.profile?.followersCount
            : undefined,
        socialMediaHandle:
          parsedUser.role === "influencer"
            ? parsedUser.profile?.socialMediaHandle
            : undefined,
        createdAt: parsedUser.profile?.createdAt,
        companyName:
          parsedUser.role === "brand" ? parsedUser.profile?.name : undefined,
        companyIndustry:
          parsedUser.role === "brand"
            ? parsedUser.profile?.industry
            : undefined,
        companyWebsite:
          parsedUser.role === "brand" ? parsedUser.profile?.website : undefined,
        companyDescription:
          parsedUser.role === "brand"
            ? parsedUser.profile?.description
            : undefined,
      };
      setUserDetails(userData);
    }
  }, []);

  const isLoggedIn = userDetails !== null;

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "black", zIndex: 1201 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/" passHref>
            <Image src={logo} height={40} alt="TrendAI Logo" />
          </Link>
        </Box>

        {isLoggedIn && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <UserInfo userDetails={userDetails} />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
