import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { createRoot } from "react-dom/client";
import { SocketProvider } from "./components/socketIOCtx/socketIOCtx";
import { HostPage } from "./hostPage";
import './player.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

createRoot(document.getElementById("root")!).render(
    <ThemeProvider theme={darkTheme}>
    <SocketProvider namespace="host">
        <CssBaseline />
        <HostPage />
    </SocketProvider>
    </ThemeProvider>
);