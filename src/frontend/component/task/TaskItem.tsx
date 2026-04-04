import { Button, MenuItem } from "@mui/material";
import { Task } from "@mydx-dev/gas-boost-react-apps-script";

type TaskStatus = Task["status"];
export const TaskItem = ({
    label,
    status,
    onRetry,
}: {
    label: string;
    status: TaskStatus;
    onRetry: () => void;
}) => {
    console.log("TaskItem rendered", { label, status });

    return (
        <MenuItem
            key={label}
            disabled={status === "queued" || status === "running"}
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "12px",
            }}
        >
            {label}

            {status === "queued" && (
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    disabled
                >
                    実行待ち
                </Button>
            )}
            {status === "running" && (
                <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    disabled
                    loading
                    loadingPosition="end"
                >
                    実行中
                </Button>
            )}
            {status === "failed" && (
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={onRetry}
                >
                    リトライ
                </Button>
            )}
        </MenuItem>
    );
};
