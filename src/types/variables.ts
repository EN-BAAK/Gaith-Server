import { Request } from "express";
import { Dialect } from "sequelize";

export type ID = string
export enum ROLE {
  ADMIN = "admin",
  WHOLESALE = "wholesale",
  RETAIL = "retail"
}

export interface IConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
}

export type BlacklistedToken = {
  token: string;
  expiresAt: number;
};

export interface AuthenticatedRequest extends Request {
  id?: ID,
  role?: ROLE
}
export enum OrderStatus {
  PENDING = "pending",
  PREPARED = "prepared",
  RECEIVED = "received"
}