import { migrate, protect, seed } from "./infrastructure/SheetORM/setup";
import { sync } from "./presentation/controller/sync";
const ServerFunctions = {
    migrate,
    seed,
    protect,
    sync,
};

Object.entries(ServerFunctions).forEach(([name, fn]) => {
    (globalThis as any)[name] = fn;
});
