import { List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Lead } from "../../../backend/domain/entity/Lead";

interface LeadListProps {
    leads: Lead[];
    onLeadClick: (leadId: string) => void;
}

export const LeadList = ({ leads, onLeadClick }: LeadListProps) => {
    if (leads.length === 0) {
        return (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
                リードがありません
            </Typography>
        );
    }

    return (
        <List>
            {leads.map((lead) => (
                <ListItem key={lead.id} disablePadding>
                    <ListItemButton onClick={() => onLeadClick(lead.id)}>
                        <ListItemText
                            primary={lead.name}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="text.primary">
                                        {lead.companyName}
                                    </Typography>
                                    {" — "}
                                    {lead.status}
                                </>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};
