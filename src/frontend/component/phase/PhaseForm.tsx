import {
    Box,
    Button,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";

export interface PhaseFormValues {
    name: string;
    probability: number;
    description: string;
}

interface PhaseFormProps {
    initialPhase?: Partial<PhaseFormValues>;
    onSubmit: (values: PhaseFormValues) => void;
    onCancel: () => void;
    mode?: "create" | "edit";
}

export const PhaseForm = ({
    initialPhase,
    onSubmit,
    onCancel,
    mode = "create",
}: PhaseFormProps) => {
    const [values, setValues] = useState<PhaseFormValues>({
        name: initialPhase?.name ?? "",
        probability: initialPhase?.probability ?? 0,
        description: initialPhase?.description ?? "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof PhaseFormValues, string>>>({});

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof PhaseFormValues, string>> = {};

        if (!values.name.trim()) {
            newErrors.name = "フェーズ名は必須です";
        }

        if (values.probability < 0 || values.probability > 100) {
            newErrors.probability = "成約確率は0〜100の範囲で入力してください";
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
                <Box>
                    <InputLabel htmlFor="phase-name" required>
                        フェーズ名
                    </InputLabel>
                    <OutlinedInput
                        id="phase-name"
                        fullWidth
                        value={values.name}
                        onChange={(e) => setValues({ ...values, name: e.target.value })}
                        error={!!errors.name}
                        size="small"
                    />
                    {errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                </Box>

                <Box>
                    <InputLabel htmlFor="phase-probability">成約確率 (%)</InputLabel>
                    <OutlinedInput
                        id="phase-probability"
                        type="number"
                        fullWidth
                        value={values.probability}
                        onChange={(e) =>
                            setValues({ ...values, probability: Number(e.target.value) })
                        }
                        error={!!errors.probability}
                        inputProps={{ min: 0, max: 100 }}
                        size="small"
                    />
                    {errors.probability && (
                        <FormHelperText error>{errors.probability}</FormHelperText>
                    )}
                </Box>

                <TextField
                    label="説明"
                    multiline
                    rows={3}
                    value={values.description}
                    onChange={(e) => setValues({ ...values, description: e.target.value })}
                    fullWidth
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={onCancel}>
                        キャンセル
                    </Button>
                    <Button type="submit" variant="contained">
                        {mode === "create" ? "追加" : "更新"}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};
