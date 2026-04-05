import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import { useState } from "react";

export interface DealFormValues {
    dealName: string;
    leadId: string;
    status: "提案" | "交渉" | "クローズ(成功)" | "クローズ(失敗)";
    amount: number | null;
    expectedCloseDate: Date | null;
    assigneeId: string;
}

interface DealFormProps {
    initialValues?: Partial<DealFormValues>;
    onSubmit: (values: DealFormValues) => void;
    onCancel: () => void;
}

export const DealForm = ({ initialValues, onSubmit, onCancel }: DealFormProps) => {
    const [values, setValues] = useState<DealFormValues>({
        dealName: initialValues?.dealName ?? "",
        leadId: initialValues?.leadId ?? "",
        status: initialValues?.status ?? "提案",
        amount: initialValues?.amount ?? null,
        expectedCloseDate: initialValues?.expectedCloseDate ?? null,
        assigneeId: initialValues?.assigneeId ?? "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!values.dealName.trim()) {
            newErrors.dealName = "案件名は必須です";
        }

        if (!values.leadId.trim()) {
            newErrors.leadId = "リードIDは必須です";
        }

        if (!values.assigneeId.trim()) {
            newErrors.assigneeId = "担当者IDは必須です";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(values);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
                <TextField
                    label="案件名"
                    value={values.dealName}
                    onChange={(e) => setValues({ ...values, dealName: e.target.value })}
                    error={!!errors.dealName}
                    helperText={errors.dealName}
                    required
                    fullWidth
                />
                <TextField
                    label="リードID"
                    value={values.leadId}
                    onChange={(e) => setValues({ ...values, leadId: e.target.value })}
                    error={!!errors.leadId}
                    helperText={errors.leadId}
                    required
                    fullWidth
                />
                <TextField
                    label="担当者ID"
                    value={values.assigneeId}
                    onChange={(e) => setValues({ ...values, assigneeId: e.target.value })}
                    error={!!errors.assigneeId}
                    helperText={errors.assigneeId}
                    required
                    fullWidth
                />
                <TextField
                    label="金額"
                    type="number"
                    value={values.amount ?? ""}
                    onChange={(e) =>
                        setValues({
                            ...values,
                            amount: e.target.value ? Number(e.target.value) : null,
                        })
                    }
                    fullWidth
                />
                <TextField
                    label="予定クローズ日"
                    type="date"
                    value={
                        values.expectedCloseDate
                            ? values.expectedCloseDate.toISOString().split("T")[0]
                            : ""
                    }
                    onChange={(e) =>
                        setValues({
                            ...values,
                            expectedCloseDate: e.target.value ? new Date(e.target.value) : null,
                        })
                    }
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                />
                <FormControl fullWidth>
                    <InputLabel id="status-label">ステータス</InputLabel>
                    <Select
                        labelId="status-label"
                        label="ステータス"
                        value={values.status}
                        onChange={(e) =>
                            setValues({
                                ...values,
                                status: e.target.value as DealFormValues["status"],
                            })
                        }
                    >
                        <MenuItem value="提案">提案</MenuItem>
                        <MenuItem value="交渉">交渉</MenuItem>
                        <MenuItem value="クローズ(成功)">クローズ(成功)</MenuItem>
                        <MenuItem value="クローズ(失敗)">クローズ(失敗)</MenuItem>
                    </Select>
                </FormControl>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={onCancel}>
                        キャンセル
                    </Button>
                    <Button type="submit" variant="contained">
                        送信
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};
