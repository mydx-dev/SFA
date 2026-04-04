import { db } from "../../di";

export function migrate() {
    // Migration logic here
    db.migrate();
}

export function protect() {
    // Protection logic here
}

export function seed() {
    // Seed logic here
}
