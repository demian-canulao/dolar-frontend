import { createContext, useContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
function fmtDate(input) {
  if (!input) return null;
  const d = new Date(input);
  if (isNaN(d.getTime())) return null;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const DolarContext = createContext();

export const useDolar = () => useContext(DolarContext);

export const DolarProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const today = new Date();
    const startDefault = new Date();
    startDefault.setDate(today.getDate() - 30);

    const [startDate, setStartDate] = useState(startDefault);
    const [endDate, setEndDate] = useState(today);

    const fetchDolar = async (fromDate, toDate) => {
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

        const res = await fetch(url, {
            headers: {
            Accept: "application/json",
            },
        });

        if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(body?.message || `HTTP ${res.status}`);
        }

        const json = await res.json();

        const normalized = Array.isArray(json)
            ? json.map((r) => ({
                date: fmtDate(r.date),
                value: Number(r.value),
            }))
            : [];

        setData(normalized);
        } catch (err) {
        setError(err.message || "Error al obtener datos");
        setData([]);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchDolar(startDate, endDate);
    }, [startDate, endDate]);

    const updateValue = (date, newValue) => {
        setData((prev) =>
        prev.map((item) =>
            item.date === date ? { ...item, value: Number(newValue) } : item
        )
        );
    };

    const deleteValue = (date) => {
        setData((prev) => prev.filter((item) => item.date !== date));
    };

    const setRange = (from, to) => {
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
