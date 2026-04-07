'use client'

import { useState } from 'react'
import { createProduct, updateProduct, deleteProduct } from '@/app/actions'
import type { Product } from '@/lib/types'

const empty = { name: '', sku: '', units_sold: '', revenue: '', stock: '', status: 'healthy' }

export default function ProductsSection({ products }: { products: Product[] }) {
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(empty)

  function startEdit(p: Product) {
    setForm({ name: p.name, sku: p.sku, units_sold: String(p.units_sold), revenue: p.revenue, stock: String(p.stock), status: p.status })
    setEditing(p.id)
  }

  async function save(id: string) {
    await updateProduct(id, { name: form.name, sku: form.sku, units_sold: parseInt(form.units_sold), revenue: form.revenue, stock: parseInt(form.stock), status: form.status })
    setEditing(null)
  }

  async function add() {
    await createProduct({ name: form.name, sku: form.sku, units_sold: parseInt(form.units_sold), revenue: form.revenue, stock: parseInt(form.stock), status: form.status })
    setAdding(false)
    setForm(empty)
  }

  const statusBadge = (status: string) => {
    if (status === 'healthy') return <span className="inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">Healthy</span>
    if (status === 'low') return <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Low Stock</span>
    return <span className="inline-block rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">Out of Stock</span>
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-900">Top Products</h2>
        <button onClick={() => { setAdding(true); setForm(empty) }} className="text-xs text-indigo-600 hover:text-indigo-800">+ Add Product</button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
            <th className="pb-2 font-medium">Product</th>
            <th className="pb-2 font-medium">SKU</th>
            <th className="pb-2 font-medium text-right">Units Sold</th>
            <th className="pb-2 font-medium text-right">Revenue</th>
            <th className="pb-2 font-medium text-right">Stock</th>
            <th className="pb-2 font-medium text-right">Status</th>
            <th className="pb-2 font-medium text-right w-16"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 group">
              {editing === p.id ? (
                <td colSpan={7} className="py-2">
                  <div className="grid grid-cols-6 gap-2 items-center">
                    <input className="col-span-2 border border-gray-300 rounded px-2 py-1 text-xs" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
                    <input className="border border-gray-300 rounded px-2 py-1 text-xs font-mono" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SKU" />
                    <input className="border border-gray-300 rounded px-2 py-1 text-xs" value={form.units_sold} onChange={(e) => setForm({ ...form, units_sold: e.target.value })} placeholder="Units" type="number" />
                    <input className="border border-gray-300 rounded px-2 py-1 text-xs" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })} placeholder="Revenue" />
                    <input className="border border-gray-300 rounded px-2 py-1 text-xs" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" type="number" />
                    <select className="border border-gray-300 rounded px-2 py-1 text-xs" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="healthy">Healthy</option>
                      <option value="low">Low Stock</option>
                      <option value="out">Out of Stock</option>
                    </select>
                    <div className="flex gap-1">
                      <button onClick={() => save(p.id)} className="bg-indigo-600 text-white text-xs rounded px-2 py-1">Save</button>
                      <button onClick={() => setEditing(null)} className="bg-gray-100 text-xs rounded px-2 py-1">Cancel</button>
                    </div>
                  </div>
                </td>
              ) : (
                <>
                  <td className="py-3 text-gray-900 font-medium">{p.name}</td>
                  <td className="py-3 text-gray-400 font-mono text-xs">{p.sku}</td>
                  <td className="py-3 text-right text-gray-700">{p.units_sold.toLocaleString()}</td>
                  <td className="py-3 text-right text-gray-700">{p.revenue}</td>
                  <td className="py-3 text-right text-gray-700">{p.stock.toLocaleString()}</td>
                  <td className="py-3 text-right">{statusBadge(p.status)}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(p)} className="text-gray-400 hover:text-gray-600 text-xs">✏️</button>
                      <button onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}

          {adding && (
            <tr>
              <td colSpan={7} className="py-2">
                <div className="grid grid-cols-6 gap-2 items-center">
                  <input className="col-span-2 border border-gray-300 rounded px-2 py-1 text-xs" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
                  <input className="border border-gray-300 rounded px-2 py-1 text-xs font-mono" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SKU" />
                  <input className="border border-gray-300 rounded px-2 py-1 text-xs" value={form.units_sold} onChange={(e) => setForm({ ...form, units_sold: e.target.value })} placeholder="Units" type="number" />
                  <input className="border border-gray-300 rounded px-2 py-1 text-xs" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })} placeholder="Revenue" />
                  <input className="border border-gray-300 rounded px-2 py-1 text-xs" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" type="number" />
                  <select className="border border-gray-300 rounded px-2 py-1 text-xs" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="healthy">Healthy</option>
                    <option value="low">Low Stock</option>
                    <option value="out">Out of Stock</option>
                  </select>
                  <div className="flex gap-1">
                    <button onClick={add} className="bg-indigo-600 text-white text-xs rounded px-2 py-1">Add</button>
                    <button onClick={() => setAdding(false)} className="bg-gray-100 text-xs rounded px-2 py-1">Cancel</button>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  )
}
