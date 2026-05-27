"use client"

import { AppShell } from "@/components/layout/AppShell"
import { usePresentationStore } from "@/stores/presentationStore"
import { upsertTheme } from "@/lib/supabase/media"
import {
  Settings, Monitor, Type, Sun, Info, Eye,
  Tv2, Keyboard, AlignCenter, AlignLeft, AlignRight, Loader2,
} from "lucide-react"
import { useState } from "react"
import type { Theme } from "@/types"

const DEFAULT_THEME: Theme = {
  id: "default", name: "Default",
  font_family: "DM Sans", font_size: 56, font_weight: 700,
  text_align: "center", text_color: "#FFFFFF",
  shadow: true, shadow_blur: 24,
  stroke: false, stroke_color: "#000000", stroke_width: 2,
  bg_opacity: 0.3, position: "center",
  is_default: true, created_at: new Date().toISOString(),
}

const hasSupabase = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxx")

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-all flex items-center px-0.5 shrink-0"
      style={{ background: value ? "var(--color-brand)" : "var(--color-surface-5)" }}>
      <span className="w-5 h-5 rounded-full bg-white shadow transition-transform"
        style={{ transform: value ? "translateX(20px)" : "translateX(0)" }} />
    </button>
  )
}

function Card({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-1)" }}>
        <Icon className="w-4 h-4" style={{ color: "var(--color-brand)" }} />
        <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{title}</span>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>{children}</div>
    </div>
  )
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{label}</p>
        {desc && <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const { setTheme } = usePresentationStore()
  const [theme, setLocalTheme] = useState<Theme>(DEFAULT_THEME)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = (key: keyof Theme, value: Theme[keyof Theme]) => {
    const updated = { ...theme, [key]: value }
    setLocalTheme(updated)
    setTheme(updated)
  }

  const handleSaveTheme = async () => {
    setSaving(true)
    if (hasSupabase()) {
      await upsertTheme({ ...theme })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const previewStyle: React.CSSProperties = {
    fontFamily: theme.font_family,
    fontSize: Math.round(theme.font_size * 0.38),
    fontWeight: theme.font_weight,
    color: theme.text_color,
    textAlign: theme.text_align as "left" | "center" | "right",
    textShadow: theme.shadow ? `0 2px ${Math.round(theme.shadow_blur * 0.5)}px rgba(0,0,0,0.9)` : "none",
    WebkitTextStroke: theme.stroke ? `${theme.stroke_width * 0.5}px ${theme.stroke_color}` : undefined,
    whiteSpace: "pre-line",
    lineHeight: 1.35,
  }

  return (
    <AppShell>
      <div className="p-6 max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>Pengaturan</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>Konfigurasi tampilan dan preferensi</p>
          </div>
          <button onClick={handleSaveTheme} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all"
            style={{ background: saved ? "var(--color-live)" : "var(--color-brand)", color: "white" }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? "Menyimpan..." : saved ? "Tersimpan ✓" : "Simpan Tema"}
          </button>
        </div>

        {/* Live preview */}
        <div className="rounded-xl border overflow-hidden" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            <Eye className="w-4 h-4" style={{ color: "var(--color-brand)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Pratinjau Langsung</span>
          </div>
          <div className="relative overflow-hidden flex items-center justify-center" style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #0d0620, #05050f, #051005)" }}>
            <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${theme.bg_opacity})` }} />
            <div style={{
              position: "relative", zIndex: 1, width: "100%", padding: "0 10%",
              display: "flex", flexDirection: "column",
              alignItems: theme.text_align === "left" ? "flex-start" : theme.text_align === "right" ? "flex-end" : "center",
              justifyContent: theme.position === "top" ? "flex-start" : theme.position === "bottom" ? "flex-end" : "center",
            }}>
              <p style={previewStyle}>{"Kasih yang ajaib\nSungguh luar biasa"}</p>
            </div>
          </div>
        </div>

        <Card title="Layar" icon={Tv2}>
          <Row label="Layar Output" desc="Tampilan layar jemaat — buka di monitor proyektor">
            <a href="/output" target="_blank"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium border"
              style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              <Tv2 className="w-3.5 h-3.5" /> Buka ↗
            </a>
          </Row>
          <Row label="Stage Display" desc="Monitor kepercayaan diri untuk worship team">
            <a href="/stage" target="_blank"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium border"
              style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              <Monitor className="w-3.5 h-3.5" /> Buka ↗
            </a>
          </Row>
        </Card>

        <Card title="Tipografi" icon={Type}>
          <Row label="Jenis Font">
            <select value={theme.font_family} onChange={e => update("font_family", e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs border outline-none"
              style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}>
              {["DM Sans","Space Grotesk","Georgia","Arial","Times New Roman","Cinzel","Playfair Display"].map(f => <option key={f}>{f}</option>)}
            </select>
          </Row>
          <Row label={`Ukuran Font — ${theme.font_size}px`} desc="Ukuran teks lirik di layar output">
            <div className="flex items-center gap-3">
              <input type="range" min={24} max={96} step={2} value={theme.font_size}
                onChange={e => update("font_size", parseInt(e.target.value))}
                className="w-28" style={{ accentColor: "var(--color-brand)" }} />
              <span className="text-xs w-8 text-right font-mono" style={{ color: "var(--color-text-muted)" }}>{theme.font_size}</span>
            </div>
          </Row>
          <Row label="Ketebalan Font">
            <select value={theme.font_weight} onChange={e => update("font_weight", parseInt(e.target.value))}
              className="px-3 py-1.5 rounded-lg text-xs border outline-none"
              style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}>
              {[{v:400,l:"Reguler"},{v:500,l:"Medium"},{v:600,l:"SemiBold"},{v:700,l:"Bold"},{v:800,l:"ExtraBold"}]
                .map(({v,l}) => <option key={v} value={v}>{l} ({v})</option>)}
            </select>
          </Row>
          <Row label="Perataan Teks">
            <div className="flex items-center gap-1 rounded-lg p-0.5" style={{ background: "var(--color-surface-3)" }}>
              {[{v:"left",icon:AlignLeft},{v:"center",icon:AlignCenter},{v:"right",icon:AlignRight}].map(({v,icon:Icon}) => (
                <button key={v} onClick={() => update("text_align", v)}
                  className="w-8 h-7 rounded-md flex items-center justify-center transition-all"
                  style={{ background: theme.text_align === v ? "var(--color-brand)" : "transparent", color: theme.text_align === v ? "#fff" : "var(--color-text-muted)" }}>
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </Row>
          <Row label="Warna Teks">
            <div className="flex items-center gap-2">
              <input type="color" value={theme.text_color} onChange={e => update("text_color", e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0.5"
                style={{ background: "var(--color-surface-3)" }} />
              <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>{theme.text_color}</span>
            </div>
          </Row>
          <Row label="Posisi Vertikal" desc="Posisi teks di layar">
            <select value={theme.position} onChange={e => update("position", e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs border outline-none"
              style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}>
              {[{v:"top",l:"Atas"},{v:"center",l:"Tengah"},{v:"bottom",l:"Bawah"}].map(({v,l}) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Row>
        </Card>

        <Card title="Efek Teks" icon={Sun}>
          <Row label="Bayangan Teks" desc="Bayangan di belakang lirik">
            <div className="flex items-center gap-3">
              <Toggle value={theme.shadow} onChange={v => update("shadow", v)} />
              {theme.shadow && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Blur</span>
                  <input type="range" min={4} max={48} value={theme.shadow_blur}
                    onChange={e => update("shadow_blur", parseInt(e.target.value))}
                    className="w-20" style={{ accentColor: "var(--color-brand)" }} />
                  <span className="text-[10px] w-5 font-mono" style={{ color: "var(--color-text-muted)" }}>{theme.shadow_blur}</span>
                </div>
              )}
            </div>
          </Row>
          <Row label="Stroke / Garis Tepi" desc="Garis tepi di sekitar teks">
            <div className="flex items-center gap-3">
              <Toggle value={theme.stroke} onChange={v => update("stroke", v)} />
              {theme.stroke && (
                <div className="flex items-center gap-2">
                  <input type="color" value={theme.stroke_color} onChange={e => update("stroke_color", e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border-0" style={{ background: "var(--color-surface-3)" }} />
                  <input type="range" min={1} max={8} value={theme.stroke_width}
                    onChange={e => update("stroke_width", parseInt(e.target.value))}
                    className="w-20" style={{ accentColor: "var(--color-brand)" }} />
                  <span className="text-[10px] font-mono" style={{ color: "var(--color-text-muted)" }}>{theme.stroke_width}px</span>
                </div>
              )}
            </div>
          </Row>
          <Row label={`Overlay Latar — ${Math.round(theme.bg_opacity * 100)}%`} desc="Layer gelap di atas gambar/video latar">
            <div className="flex items-center gap-2">
              <input type="range" min={0} max={0.95} step={0.05} value={theme.bg_opacity}
                onChange={e => update("bg_opacity", parseFloat(e.target.value))}
                className="w-28" style={{ accentColor: "var(--color-brand)" }} />
              <span className="text-xs font-mono w-8" style={{ color: "var(--color-text-muted)" }}>
                {Math.round(theme.bg_opacity * 100)}%
              </span>
            </div>
          </Row>
        </Card>

        <Card title="Pintasan Keyboard" icon={Keyboard}>
          <div className="px-5 py-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {[
              ["Spasi / →","Slide berikutnya"],
              ["←","Slide sebelumnya"],
              ["B","Layar hitam"],
              ["L","Tampilkan logo"],
              ["Esc","Bersihkan layar"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-2">
                <kbd className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                  style={{ background: "var(--color-surface-4)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
                  {key}
                </kbd>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{desc}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Tentang" icon={Info}>
          <Row label="ChurchPresent" desc="Perangkat lunak presentasi ibadah gereja yang ringan">
            <span className="text-xs px-2 py-1 rounded" style={{ background: "var(--color-surface-4)", color: "var(--color-text-muted)" }}>v1.0.0</span>
          </Row>
          <Row label="Status Database" desc={hasSupabase() ? "Terhubung ke Supabase" : "Mode lokal — data tidak tersimpan permanen"}>
            <span className="text-xs px-2 py-1 rounded font-medium"
              style={{
                background: hasSupabase() ? "var(--color-live-dim)" : "var(--color-warn-dim)",
                color: hasSupabase() ? "var(--color-live)" : "var(--color-warn)",
              }}>
              {hasSupabase() ? "● Terhubung" : "○ Lokal"}
            </span>
          </Row>
        </Card>
      </div>
    </AppShell>
  )
}
