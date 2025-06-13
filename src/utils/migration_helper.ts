import { TableColumnOptions } from "typeorm";

export const IdColumnConfig: TableColumnOptions = {
  name: "id",
  type: "bigint",
  isPrimary: true,
  isGenerated: true,
  generationStrategy: "increment",
};

export const CreatedAtColumnConfig: TableColumnOptions = {
  name: "created_at",
  type: "timestamp",
  default: "CURRENT_TIMESTAMP",
};