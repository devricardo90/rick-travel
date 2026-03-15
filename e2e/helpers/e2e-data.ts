import fs from "node:fs";
import path from "node:path";
import { E2E_DATA_FILE } from "./constants";

type E2EData = {
  tripId: string;
  adminEmail: string;
  userEmail: string;
};

export function readE2EData() {
  const filePath = path.join(process.cwd(), E2E_DATA_FILE);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as E2EData;
}
