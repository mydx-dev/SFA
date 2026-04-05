import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import { useState } from "react";

export interface LeadFormValues {
    name: string;
    companyName: string;
    email: string;
    phoneNumber: string;
    status: "未対応" | "対応中" | "商談化" | "失注" | "顧客化";
}

interface LeadFormProps {
    initialValues?: Partial<LeadFormValues>;
    onSubmit: (values: LeadFormValues) => void;
    onCancel: () => void;
}

export const LeadForm = ({ initialValues, onSubmit, onCancel }: LeadFormProps) => {
    const [values, setValues] = useState<LeadFormValues>({
        name: initialValues?.name ?? "",
        companyName: initialValues?.companyName ?? "",
        email: initialValues?.email ?? "",
        phoneNumber: initialValues?.phoneNumber ?? "",
        status: initialValues?.status ?? "未対応",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!values.name.trim()) {
            newErrors.name = "氏名は必須です";
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
                    label="氏名"
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                    fullWidth
                />
                <TextField
                    label="会社名"
                    value={values.companyName}
                    onChange={(e) => setValues({ ...values, companyName: e.target.value })}
                    fullWidth
                />
                <TextField
                    label="メールアドレス"
                    type="email"
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                    fullWidth
                />
                <TextField
                    label="電話番号"
                    value={values.phoneNumber}
                    onChange={(e) => setValues({ ...values, phoneNumber: e.target.value })}
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
                                status: e.target.value as LeadFormValues["status"],
                            })
                        }
                    >
                        <MenuItem value="未対応">未対応</MenuItem>
                        <MenuItem value="対応中">対応中</MenuItem>
                        <MenuItem value="商談化">商談化</MenuItem>
                        <MenuItem value="失注">失注</MenuItem>
                        <MenuItem value="顧客化">顧客化</MenuItem>
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
