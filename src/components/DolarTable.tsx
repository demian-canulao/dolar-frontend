import { useState } from "react";
import { useDolar } from "../context/DolarContext.tsx";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DolarTable() {
    const { data, loading, error, updateValue, deleteValue } = useDolar();
    const [editingDate, setEditingDate] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState("");

    if (loading) return <p>Cargando tabla...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data.length) return <p>No hay datos para mostrar</p>;

    const startEditing = (date: string, value: number) => {
        setEditingDate(date);
        setTempValue(String(value));
    };

    const saveEditing = () => {
        updateValue(editingDate!, tempValue);
        setEditingDate(null);
    };

    const cancelEditing = () => {
        setEditingDate(null);
        setTempValue("");
    };

    return (
        <TableContainer
            component={Paper}
            sx={{ marginTop: 4, borderRadius: 2, overflow: "hidden" }}
        >
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ backgroundColor: "grey.100" }}>
                        <TableCell>
                            <strong>Fecha</strong>
                        </TableCell>
                        <TableCell>
                            <strong>Valor</strong>
                        </TableCell>
                        <TableCell width={120}>
                            <strong>Acciones</strong>
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.date}>
                            <TableCell sx={{ width: 130 }}>{row.date}</TableCell>

                            <TableCell sx={{ width: 150 }}>
                                {editingDate === row.date ? (
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        sx={{ width: 110 }}
                                    />
                                ) : (
                                    row.value
                                )}
                            </TableCell>

                            <TableCell sx={{ display: "flex", gap: 1 }}>
                                {editingDate === row.date ? (
                                    <>
                                        <IconButton
                                            color="success"
                                            onClick={saveEditing}
                                            size="small"
                                        >
                                            <CheckIcon />
                                        </IconButton>

                                        <IconButton
                                            color="error"
                                            onClick={cancelEditing}
                                            size="small"
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <IconButton
                                        color="primary"
                                        onClick={() => startEditing(row.date, row.value)}
                                        size="small"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                )}

                                <IconButton
                                    color="error"
                                    onClick={() => deleteValue(row.date)}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
