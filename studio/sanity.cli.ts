import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: { projectId: "p0i7hr40", dataset: "production" },
  studioHost: "obriens-solicitors",
  deployment: { autoUpdates: true, appId: undefined },
});
