import type { Deal } from "../../backend/domain/entity/Deal";

export interface Customer {
    id: string;
    name: string;
    parentId: string | null;
    children?: Customer[];
}

export async function getCustomerHierarchy(): Promise<Customer[]> {
    return [];
}

export async function getCustomerDetail(id: string): Promise<Customer | null> {
    return null;
}

export async function getCustomerDeals(_customerId: string): Promise<Deal[]> {
    return [];
}
