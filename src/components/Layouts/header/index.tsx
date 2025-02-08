import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { UserInfo } from "./user-info";
import logo from "@/assets/logo.png";

interface HeaderProps {
  isLoggedIn: boolean;
}

export function Header({ isLoggedIn }: HeaderProps) {
  const { toggleSidebar } = useSidebarContext();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "black", zIndex: 1201 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isLoggedIn && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleSidebar}
              sx={{ display: { lg: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Always Show Logo */}
          <Link href="/" passHref>
            <Image src={logo} height={40} alt="TrendAI Logo" />
          </Link>
        </Box>

        {isLoggedIn && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <UserInfo />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
