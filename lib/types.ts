export type KpiMetric = {
  id: string
  label: string
  value: string
  change_pct: number
  period_label: string
  sort_order: number
}

export type Product = {
  id: string
  name: string
  sku: string
  units_sold: number
  revenue: string
  stock: number
  status: 'healthy' | 'low' | 'out'
}

export type SalesChannel = {
  id: string
  name: string
  orders: number
  revenue: string
  share_pct: number
  sort_order: number
}

export type MonthlyRevenue = {
  id: string
  month_label: string
  value: number
  sort_order: number
}
