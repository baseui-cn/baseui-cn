export type TextOperator =
  | "contains"
  | "notContains"
  | "equals"
  | "notEquals"
  | "startsWith"
  | "endsWith"
  | "blank"
  | "notBlank"

export type NumericOperator = "=" | ">" | "<" | ">=" | "<="

export type DateOperator = "before" | "after" | "on" | "between"

export type ColumnFilterState =
  | { type: "text"; operator: TextOperator; value: string }
  | { type: "number"; operator: NumericOperator; value: string }
  | { type: "date"; operator: DateOperator; value: string; secondValue?: string }

export type ExcelFilterType = ColumnFilterState["type"]
