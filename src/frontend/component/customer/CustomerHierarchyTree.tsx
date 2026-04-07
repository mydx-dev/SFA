import BusinessIcon from "@mui/icons-material/Business";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import { useState } from "react";

export interface Customer {
    id: string;
    name: string;
    type: string;
    parentId?: string | null;
    children?: Customer[];
}

interface CustomerHierarchyTreeProps {
    customers: Customer[];
    onCustomerSelect?: (customerId: string) => void;
    selectedCustomerId?: string;
    expandedIds?: string[];
}

interface TreeNodeProps {
    customer: Customer;
    depth: number;
    selectedId?: string;
    expandedIds: string[];
    onToggle: (id: string) => void;
    onSelect?: (id: string) => void;
}

const TreeNode = ({
    customer,
    depth,
    selectedId,
    expandedIds,
    onToggle,
    onSelect,
}: TreeNodeProps) => {
    const hasChildren = customer.children && customer.children.length > 0;
    const isExpanded = expandedIds.includes(customer.id);
    const isSelected = selectedId === customer.id;

    return (
        <Box>
            <Box
                display="flex"
                alignItems="center"
                sx={{
                    pl: depth * 2,
                    py: 0.75,
                    pr: 1,
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "#d6e3ff" : "transparent",
                    "&:hover": {
                        backgroundColor: isSelected ? "#d6e3ff" : "#f1f4f6",
                    },
                    transition: "background-color 0.15s ease",
                }}
                onClick={() => onSelect?.(customer.id)}
            >
                {hasChildren ? (
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle(customer.id);
                        }}
                        sx={{ p: 0.25, mr: 0.5 }}
                    >
                        {isExpanded ? (
                            <ExpandMoreIcon fontSize="small" />
                        ) : (
                            <ChevronRightIcon fontSize="small" />
                        )}
                    </IconButton>
                ) : (
                    <Box sx={{ width: 28 }} />
                )}
                <BusinessIcon fontSize="small" sx={{ mr: 1, color: "#74777f" }} />
                <Box>
                    <Typography variant="body2" fontWeight={isSelected ? "bold" : "normal"}>
                        {customer.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {customer.type}
                    </Typography>
                </Box>
            </Box>

            {hasChildren && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    {customer.children!.map((child) => (
                        <TreeNode
                            key={child.id}
                            customer={child}
                            depth={depth + 1}
                            selectedId={selectedId}
                            expandedIds={expandedIds}
                            onToggle={onToggle}
                            onSelect={onSelect}
                        />
                    ))}
                </Collapse>
            )}
        </Box>
    );
};

export const CustomerHierarchyTree = ({
    customers,
    onCustomerSelect,
    selectedCustomerId,
    expandedIds: initialExpandedIds = [],
}: CustomerHierarchyTreeProps) => {
    const [expandedIds, setExpandedIds] = useState<string[]>(initialExpandedIds);

    const handleToggle = (id: string) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <Box sx={{ userSelect: "none" }}>
            {customers.map((customer) => (
                <TreeNode
                    key={customer.id}
                    customer={customer}
                    depth={0}
                    selectedId={selectedCustomerId}
                    expandedIds={expandedIds}
                    onToggle={handleToggle}
                    onSelect={onCustomerSelect}
                />
            ))}
        </Box>
    );
};
