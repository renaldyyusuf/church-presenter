// Auto-generated types for ChurchPresent database
// Re-generate with: npx supabase gen types typescript --local

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      songs: {
        Row: {
          id: string
          title: string
          artist: string | null
          lyrics_raw: string
          tags: string[]
          category: string | null
          favorite: boolean
          theme_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["songs"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["songs"]["Insert"]>
      }
      services: {
        Row: {
          id: string
          name: string
          date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["services"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string
        }
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>
      }
      service_items: {
        Row: {
          id: string
          service_id: string
          type: "song" | "bible" | "video" | "image" | "announcement"
          ref_id: string | null
          label: string
          notes: string | null
          item_order: number
          metadata: Json
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["service_items"]["Row"], "id" | "created_at"> & {
          id?: string
        }
        Update: Partial<Database["public"]["Tables"]["service_items"]["Insert"]>
      }
      themes: {
        Row: {
          id: string
          name: string
          font_family: string
          font_size: number
          font_weight: number
          text_align: string
          text_color: string
          shadow: boolean
          shadow_blur: number
          stroke: boolean
          stroke_color: string
          stroke_width: number
          bg_opacity: number
          position: string
          is_default: boolean
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["themes"]["Row"], "id" | "created_at"> & {
          id?: string
        }
        Update: Partial<Database["public"]["Tables"]["themes"]["Insert"]>
      }
      media: {
        Row: {
          id: string
          name: string
          type: "image" | "video" | "loop" | "countdown"
          path: string
          url: string | null
          size_bytes: number | null
          tags: string[]
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["media"]["Row"], "id" | "created_at"> & {
          id?: string
        }
        Update: Partial<Database["public"]["Tables"]["media"]["Insert"]>
      }
      // Realtime presence table for live sync
      live_sessions: {
        Row: {
          id: string
          session_key: string
          current_slide_id: string | null
          current_slide_content: string | null
          current_slide_section: string | null
          next_slide_content: string | null
          next_slide_section: string | null
          mode: string
          theme: Json | null
          stage_message: string | null
          timer_seconds: number
          timer_running: boolean
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["live_sessions"]["Row"]> & {
          session_key: string
        }
        Update: Partial<Database["public"]["Tables"]["live_sessions"]["Row"]>
      }
    }
  }
}
