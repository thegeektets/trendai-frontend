"use client";

import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5750F1",
    },
    secondary: {
      main: "#ff4081",
    },
  },
  typography: {
    fontFamily: '"Satoshi", Arial, sans-serif',
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
}
