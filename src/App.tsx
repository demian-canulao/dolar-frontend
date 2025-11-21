import { ThemeProvider, CssBaseline, Container, Box } from "@mui/material";
import { DolarProvider } from "./context/DolarContext";
import DolarChart from "./components/DolarChart";
import DolarTable from "./components/DolarTable";
import DolarDateFilter from "./components/DolarDateFilter"
import theme from "./theme"; // este lo creamos abajo

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <DolarProvider>
        <Container maxWidth="md">
          <Box mt={4} mb={4}>
            <DolarDateFilter />
            <DolarChart />
          </Box>

          <Box mt={4} mb={4}>
            <DolarTable />
          </Box>
        </Container>
      </DolarProvider>
    </ThemeProvider>
  );
}
