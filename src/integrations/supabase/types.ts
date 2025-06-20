export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string
          attended_by: string
          cost_data: Json | null
          created_at: string
          id: string
          mobile: string
          name: string
          quotation_pdf_url: string | null
          room_data: Json | null
          status: string
          tile_data: Json | null
          updated_at: string
        }
        Insert: {
          address: string
          attended_by: string
          cost_data?: Json | null
          created_at?: string
          id?: string
          mobile: string
          name: string
          quotation_pdf_url?: string | null
          room_data?: Json | null
          status?: string
          tile_data?: Json | null
          updated_at?: string
        }
        Update: {
          address?: string
          attended_by?: string
          cost_data?: Json | null
          created_at?: string
          id?: string
          mobile?: string
          name?: string
          quotation_pdf_url?: string | null
          room_data?: Json | null
          status?: string
          tile_data?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      ledger: {
        Row: {
          address: string
          attended_by: string
          created_at: string
          id: string
          mobile: string
          name: string
          quotation_pdf_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address: string
          attended_by: string
          created_at?: string
          id?: string
          mobile: string
          name: string
          quotation_pdf_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string
          attended_by?: string
          created_at?: string
          id?: string
          mobile?: string
          name?: string
          quotation_pdf_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      tiles: {
        Row: {
          code: string
          coverage_per_box: number
          created_at: string
          discount_percent: number | null
          id: string
          length_feet: number
          name: string
          price_per_square_feet: number
          price_per_tile: number
          updated_at: string
          width_feet: number
        }
        Insert: {
          code: string
          coverage_per_box?: number
          created_at?: string
          discount_percent?: number | null
          id?: string
          length_feet: number
          name: string
          price_per_square_feet: number
          price_per_tile: number
          updated_at?: string
          width_feet: number
        }
        Update: {
          code?: string
          coverage_per_box?: number
          created_at?: string
          discount_percent?: number | null
          id?: string
          length_feet?: number
          name?: string
          price_per_square_feet?: number
          price_per_tile?: number
          updated_at?: string
          width_feet?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_customer_table: {
        Args: { customer_id: string }
        Returns: boolean
      }
      get_customer_quotations: {
        Args: { customer_id: string }
        Returns: {
          id: string
          quotation_pdf_url: string
          created_at: string
          attended_by: string
          room_data: Json
          tile_data: Json
          cost_data: Json
        }[]
      }
      insert_customer_quotation: {
        Args: {
          customer_id: string
          p_quotation_pdf_url: string
          p_attended_by: string
          p_room_data: Json
          p_tile_data: Json
          p_cost_data: Json
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
