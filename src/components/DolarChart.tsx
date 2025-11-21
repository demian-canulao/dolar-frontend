import { Card, CardHeader, CardContent } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDolar } from "../context/DolarContext";

export default function DolarChart() {
  const { data, loading, error } = useDolar();

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data.length) return <p>No hay datos para mostrar</p>;

  const chartData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date)).map((item) => ({
    date: item.date,
    value: item.value,
  }));

  return (
    <Card sx={{ width: "100%", height: 400 }}>
      <CardHeader title="Fluctuación del dolar" />
      <CardContent sx={{ height: 330 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#1976d2"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
