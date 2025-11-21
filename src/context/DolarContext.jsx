import { createContext, useContext, useEffect, useState } from "react";

function fmtDate(input) {
  if (!input) return null;
  const d = new Date(input);
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

        try {
            setLoading(true);
            setError(null);

            const url = `http://localhost:8000/api/dollar?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

            const res = await fetch(url, {
                headers: {
                "Accept": "application/json",
                },
            });

            if (!res.ok) {
                let msg = `HTTP ${res.status}`;
                try {
                const body = await res.json();
                msg = body.message || JSON.stringify(body);
                } catch (_) {}
                throw new Error(msg);
            }

            const json = await res.json();
            
            const normalized = Array.isArray(json)
                ? json.map((r) => ({ date: (r.date), value: Number(r.value) }))
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
            item.date === (date) ? { ...item, value: Number(newValue) } : item
        )
        );
    };

    const deleteValue = (date) => {
        setData((prev) => prev.filter((item) => item.date !== (date)));
    };

    const setRange = (from, to) => {
        const fromDate = typeof from === "string" ? new Date(from) : from;
        const toDate = typeof to === "string" ? new Date(to) : to;
        setStartDate(fromDate);
        setEndDate(toDate);
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
