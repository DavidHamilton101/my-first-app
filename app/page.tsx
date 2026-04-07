import { createClient } from '@/lib/supabase/server'
import KpiSection from '@/app/components/KpiSection'
import RevenueSection from '@/app/components/RevenueSection'
import ChannelsSection from '@/app/components/ChannelsSection'
import ProductsSection from '@/app/components/ProductsSection'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  const [
    { data: kpis },
    { data: products },
    { data: channels },
    { data: revenue },
  ] = await Promise.all([
    supabase.from('kpi_metrics').select('*').order('sort_order'),
    supabase.from('products').select('*').order('units_sold', { ascending: false }),
    supabase.from('sales_channels').select('*').order('sort_order'),
    supabase.from('monthly_revenue').select('*').order('sort_order'),
  ])

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Candle Shack</h1>
          <p className="text-sm text-gray-500">Performance Scorecard — March 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Hover any section to edit</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block"></span>
            Live
          </span>
        </div>
      </header>

      <main className="px-8 py-6 max-w-screen-xl mx-auto space-y-6">
        <KpiSection kpis={kpis ?? []} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RevenueSection data={revenue ?? []} />
          <ChannelsSection channels={channels ?? []} />
        </div>

        <ProductsSection products={products ?? []} />

        <p className="text-center text-xs text-gray-400 pb-4">
          Data stored in Supabase — hover rows and cards to edit inline
        </p>
      </main>
    </div>
  )
}
