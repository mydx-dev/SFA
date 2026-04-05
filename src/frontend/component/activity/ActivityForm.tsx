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

export interface ActivityFormValues {
    dealId: string;
    activityType: "面談" | "電話" | "メール" | "その他";
    activityDate: string;
    content: string;
}

interface ActivityFormProps {
    dealId: string;
    initialValues?: Partial<ActivityFormValues>;
    onSubmit: (values: ActivityFormValues) => void;
    onCancel: () => void;
}

export const ActivityForm = ({ dealId, initialValues, onSubmit, onCancel }: ActivityFormProps) => {
    const [values, setValues] = useState<ActivityFormValues>({
        dealId,
        activityType: initialValues?.activityType ?? "面談",
        activityDate: initialValues?.activityDate ?? "",
        content: initialValues?.content ?? "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!values.content.trim()) {
            newErrors.content = "内容は必須です";
        }

        if (!values.activityDate) {
            newErrors.activityDate = "活動日は必須です";
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
                <FormControl fullWidth>
                    <InputLabel id="activity-type-label">活動種別</InputLabel>
                    <Select
                        labelId="activity-type-label"
                        label="活動種別"
                        value={values.activityType}
                        onChange={(e) =>
                            setValues({
                                ...values,
                                activityType: e.target.value as ActivityFormValues["activityType"],
                            })
                        }
                    >
                        <MenuItem value="面談">面談</MenuItem>
                        <MenuItem value="電話">電話</MenuItem>
                        <MenuItem value="メール">メール</MenuItem>
                        <MenuItem value="その他">その他</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="活動日"
                    type="date"
                    value={values.activityDate}
                    onChange={(e) => setValues({ ...values, activityDate: e.target.value })}
                    error={!!errors.activityDate}
                    helperText={errors.activityDate}
                    required
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="内容"
                    multiline
                    rows={4}
                    value={values.content}
                    onChange={(e) => setValues({ ...values, content: e.target.value })}
                    error={!!errors.content}
                    helperText={errors.content}
                    required
                    fullWidth
                />
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
