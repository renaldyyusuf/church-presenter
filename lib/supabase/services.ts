import { getSupabase } from "./client"
import type { Service, ServiceItem } from "@/types"

export async function fetchOrCreateTodayService(): Promise<Service> {
  const sb = getSupabase()
  const today = new Date().toISOString().split("T")[0]
  const dayName = new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  try {
    // Try to find today's service
    const { data: existing } = await sb
      .from("services")
      .select("*")
      .eq("date", today)
      .single()

    if (existing) return existing as Service

    // Create today's service
    const { data: created, error } = await sb
      .from("services")
      .insert({ name: `Ibadah ${dayName}`, date: today })
      .select()
      .single()

    if (error) throw error
    return created as Service
  } catch {
    return { id: "local", name: `Ibadah ${dayName}`, date: today, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  }
}

export async function fetchServiceItems(serviceId: string): Promise<ServiceItem[]> {
  try {
    const sb = getSupabase()
    const { data, error } = await sb
      .from("service_items")
      .select("*")
      .eq("service_id", serviceId)
      .order("item_order")
    if (error) throw error
    return (data ?? []) as ServiceItem[]
  } catch { return [] }
}

export async function upsertServiceItems(items: ServiceItem[]): Promise<void> {
  try {
    const sb = getSupabase()
    await sb.from("service_items").upsert(
      items.map(i => ({ ...i, metadata: i.metadata ?? {} })),
      { onConflict: "id" }
    )
  } catch {}
}

export async function deleteServiceItem(id: string): Promise<void> {
  try {
    const sb = getSupabase()
    await sb.from("service_items").delete().eq("id", id)
  } catch {}
}
