import { migrate, protect, seed } from "./infrastructure/SheetORM/setup";

declare global {
    var migrate: () => void;
    var seed: () => void;
    var protect: () => void;
}

globalThis.migrate = migrate;
globalThis.seed = seed;
globalThis.protect = protect;
