import fs from "fs";
import path from "path";
import ErrorHandler from "../middlewares/error";
import { ISettings } from "../types/variables";

const filePath = path.join(process.cwd(), "contents", "settings.json");

const readSettingsFromFile = (): ISettings => {
  if (!fs.existsSync(filePath)) {
    throw new ErrorHandler("Settings configuration file not found", 500);
  }
  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData);
};

export const getSettingsData = async (): Promise<ISettings> => {
  const data = readSettingsFromFile();
  return data;
};

export const updateSettingsData = async (incomingData: Partial<ISettings>): Promise<ISettings> => {
  const currentData = readSettingsFromFile();

  const updatedData: ISettings = {
    ...currentData,
    ...incomingData,
  };

  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf-8");

  return updatedData;
};