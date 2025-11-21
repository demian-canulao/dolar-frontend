import { Box, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useDolar } from "../context/DolarContext";

export default function DolarDateFilter() {
  const { startDate, endDate, setRange, resetLast30Days } = useDolar();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" gap={2} alignItems="center" mb={3}>
        
        <DatePicker
          format="DD/MM/YYYY"
          label="Fecha inicio"
          value={dayjs(startDate)}
          onChange={(value) => {
            if (!value) return;
            setRange(value.toDate(), endDate);
          }}
        />

        <DatePicker
          format="DD/MM/YYYY"
          label="Fecha fin"
          value={dayjs(endDate)}
          onChange={(value) => {
            if (!value) return;
            setRange(startDate, value.toDate());
          }}
        />

        <Button variant="contained" onClick={resetLast30Days}>
          Ultimos 30 dias
        </Button>
      </Box>
    </LocalizationProvider>
  );
}
