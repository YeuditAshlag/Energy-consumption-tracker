import { ObjectId } from "mongodb";

// src/types/device.ts
export interface Device {
    _id?: ObjectId | string;
    name: string;
    power: number;
    dailyUsageHours: number;
    dailyCost: number;
    weeklyCost: number;
    monthlyCost: number;
}
  

  