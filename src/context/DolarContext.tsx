import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ---- Tipos ----
export interface DolarRow {
  date: string;
  value: number;
}

export interface DolarContextType {
  data: DolarRow[];
  loading: boolean;
  error: string | null;
  startDate: Date;
  endDate: Date;
  setRange: (from: Date | string, to: Date | string) => void;
  resetLast30Days: () => void;
  updateValue: (date: string, newValue: number | string) => void;
  deleteValue: (date: string) => void;
}

// ---- Contexto tipado ----
const DolarContext = createContext<DolarContextType | undefined>(undefined);

export const useDolar = () => {
  const ctx = useContext(DolarContext);
  if (!ctx) throw new Error("useDolar must be used inside DolarProvider");
  return ctx;
};

// ---- Helpers ----
function fmtDate(input: any): string | null {
  if (!input) return null;
  const d = new Date(input);
  if (isNaN(d.getTime())) return null;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

// ---- Provider ----
export const DolarProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<DolarRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const startDefault = new Date();
  startDefault.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState<Date>(startDefault);
  const [endDate, setEndDate] = useState<Date>(today);

  const fetchDolar = async (fromDate: Date, toDate: Date) => {
    const from = fmtDate(fromDate);
    const to = fmtDate(toDate);

    if (!from || !to) {
      setData([]);
      return;
    }

    if (fromDate > toDate) {
      setError("Rango invalido");
      setData([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = `${API_URL}/dollar?from=${from}&to=${to}`;

      const res = await fetch(url, { headers: { Accept: "application/json" } });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `HTTP ${res.status}`);
      }

      const json = await res.json();

      const normalized: DolarRow[] = Array.isArray(json)
        ? json.map((r: any) => ({
            date: fmtDate(r.date)!,
            value: Number(r.value),
          }))
        : [];

      setData(normalized);
    } catch (err: any) {
      setError(err.message || "Error al obtener datos");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDolar(startDate, endDate);
  }, [startDate, endDate]);

  const updateValue = (date: string, newValue: number | string) => {
    setData((prev) =>
      prev.map((item) =>
        item.date === date ? { ...item, value: Number(newValue) } : item
      )
    );
  };

  const deleteValue = (date: string) => {
    setData((prev) => prev.filter((item) => item.date !== date));
  };

  const setRange = (from: string | Date, to: string | Date) => {
    setStartDate(typeof from === "string" ? new Date(from) : from);
    setEndDate(typeof to === "string" ? new Date(to) : to);
  };

  const resetLast30Days = () => {
    const now = new Date();
    const s = new Date();
    s.setDate(now.getDate() - 30);
    setStartDate(s);
    setEndDate(now);
  };

  return (
    <DolarContext.Provider
      value={{
        data,
        loading,
        error,
        startDate,
        endDate,
        setRange,
        resetLast30Days,
        updateValue,
        deleteValue,
      }}
    >
      {children}
    </DolarContext.Provider>
  );
};
