import SyncIcon from "@mui/icons-material/Sync";
import { IconButton, Tooltip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { taskScheduler } from "../../lib/TaskScheduler";
import { sync } from "../../usecase/sync";

export const SyncButton = () => {
    const [isSyncing, setIsSyncing] = useState(false);
    const handleSync = async () => {
        taskScheduler.push({
            id: Date.now().toString(),
            label: "データを同期する",
            execute: async () => {
                setIsSyncing(true);
                try {
                    await sync();
                } catch (error) {
                    console.error("同期に失敗しました", error);
                    throw error;
                } finally {
                    setIsSyncing(false);
                }
            },
        });
    };
    const query = useQuery({
        queryKey: ["sync"],
        queryFn: handleSync,
        refetchOnReconnect: false,
    });
    return (
        <>
            <Tooltip title="データを同期する">
                <IconButton
                    onClick={() => query.refetch()}
                    disabled={isSyncing}
                    loading={isSyncing}
                >
                    <SyncIcon />
                </IconButton>
            </Tooltip>
        </>
    );
};
