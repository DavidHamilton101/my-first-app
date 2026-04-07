export default function Home() {
  const kpis = [
    { label: "Total Revenue", value: "£2,847,320", change: +12.4, period: "vs last month" },
    { label: "Orders", value: "18,492", change: +8.1, period: "vs last month" },
    { label: "Avg. Order Value", value: "£154", change: -2.3, period: "vs last month" },
    { label: "Conversion Rate", value: "3.8%", change: +0.4, period: "vs last month" },
    { label: "New Customers", value: "4,201", change: +15.2, period: "vs last month" },
    { label: "Return Rate", value: "6.2%", change: -1.1, period: "vs last month" },
  ];

  const topProducts = [
    { name: "Luxury Soy Candle — Vanilla & Amber", sku: "CSC-001", sales: 3842, revenue: "£192,100", stock: 412, status: "healthy" },
    { name: "Reed Diffuser Set — Bergamot", sku: "RDS-014", sales: 2910, revenue: "£145,500", stock: 88, status: "low" },
    { name: "Beeswax Pillar Candle — Twin Pack", sku: "BWP-007", sales: 2540, revenue: "£127,000", stock: 0, status: "out" },
    { name: "Gift Set — Relaxation Collection", sku: "GS-022", sales: 2101, revenue: "£210,100", stock: 203, status: "healthy" },
    { name: "Scented Candle — Rose & Oud", sku: "CSC-019", sales: 1876, revenue: "£93,800", stock: 34, status: "low" },
  ];

  const channels = [
    { name: "Direct / Website", orders: 8420, revenue: "£1,284,720", share: 45 },
    { name: "Amazon", orders: 5210, revenue: "£796,330", share: 28 },
    { name: "Etsy", orders: 2840, revenue: "£341,880", share: 12 },
    { name: "Wholesale", orders: 1420, revenue: "£341,880", share: 12 },
    { name: "Other", orders: 602, revenue: "£82,510", share: 3 },
  ];

  const monthlyRevenue = [
    { month: "Oct", value: 2100000 },
    { month: "Nov", value: 2680000 },
    { month: "Dec", value: 3920000 },
    { month: "Jan", value: 1840000 },
    { month: "Feb", value: 2210000 },
    { month: "Mar", value: 2847320 },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value));

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Candle Shack</h1>
          <p className="text-sm text-gray-500">Performance Scorecard — March 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Last updated: today at 09:14</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block"></span>
            Live
          </span>
        </div>
      </header>

      <main className="px-8 py-6 max-w-screen-xl mx-auto space-y-6">

        {/* KPI Grid */}
        <section>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Key Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{kpi.value}</p>
                <p className={`text-xs mt-1 font-medium ${kpi.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {kpi.change >= 0 ? "▲" : "▼"} {Math.abs(kpi.change)}% {kpi.period}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Chart + Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Revenue Trend */}
          <section className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Monthly Revenue</h2>
            <div className="flex items-end gap-3 h-40">
              {monthlyRevenue.map((m) => {
                const height = Math.round((m.value / maxRevenue) * 100);
                return (
                  <div key={m.month} className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-xs text-gray-500">£{(m.value / 1000000).toFixed(1)}m</span>
                    <div
                      className="w-full rounded-t-md bg-indigo-500"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Channel Breakdown */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Sales by Channel</h2>
            <div className="space-y-3">
              {channels.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{c.name}</span>
                    <span className="font-medium">{c.share}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{ width: `${c.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Top Products */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Top Products</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium">SKU</th>
                <th className="pb-2 font-medium text-right">Units Sold</th>
                <th className="pb-2 font-medium text-right">Revenue</th>
                <th className="pb-2 font-medium text-right">Stock</th>
                <th className="pb-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topProducts.map((p) => (
                <tr key={p.sku} className="hover:bg-gray-50">
                  <td className="py-3 text-gray-900 font-medium">{p.name}</td>
                  <td className="py-3 text-gray-400 font-mono text-xs">{p.sku}</td>
                  <td className="py-3 text-right text-gray-700">{p.sales.toLocaleString()}</td>
                  <td className="py-3 text-right text-gray-700">{p.revenue}</td>
                  <td className="py-3 text-right text-gray-700">{p.stock.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    {p.status === "healthy" && (
                      <span className="inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">Healthy</span>
                    )}
                    {p.status === "low" && (
                      <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Low Stock</span>
                    )}
                    {p.status === "out" && (
                      <span className="inline-block rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">Out of Stock</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-4">Placeholder data — connect to Supabase to show live figures</p>

      </main>
    </div>
  );
}
