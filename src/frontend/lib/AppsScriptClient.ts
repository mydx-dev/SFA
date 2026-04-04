import { createAppsScriptClient } from "@mydx-dev/gas-boost-react-apps-script";
import type { API } from "../../shared/api";

export const client = createAppsScriptClient<API>();
