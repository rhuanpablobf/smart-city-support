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
      agent_performance: {
        Row: {
          agent_id: string
          agent_name: string
          avg_handling_time: number
          avg_response_time: number
          created_at: string | null
          id: string
          period: string
          satisfaction_rate: number
          total_conversations: number
          transfer_rate: number
        }
        Insert: {
          agent_id: string
          agent_name: string
          avg_handling_time: number
          avg_response_time: number
          created_at?: string | null
          id?: string
          period?: string
          satisfaction_rate: number
          total_conversations: number
          transfer_rate: number
        }
        Update: {
          agent_id?: string
          agent_name?: string
          avg_handling_time?: number
          avg_response_time?: number
          created_at?: string | null
          id?: string
          period?: string
          satisfaction_rate?: number
          total_conversations?: number
          transfer_rate?: number
        }
        Relationships: []
      }
      conversations: {
        Row: {
          agent_id: string | null
          department_id: string | null
          id: string
          inactivity_warnings: number
          is_bot: boolean
          last_message_at: string
          service_id: string | null
          started_at: string
          status: string
          user_cpf: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          agent_id?: string | null
          department_id?: string | null
          id?: string
          inactivity_warnings?: number
          is_bot?: boolean
          last_message_at?: string
          service_id?: string | null
          started_at?: string
          status: string
          user_cpf?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          agent_id?: string | null
          department_id?: string | null
          id?: string
          inactivity_warnings?: number
          is_bot?: boolean
          last_message_at?: string
          service_id?: string | null
          started_at?: string
          status?: string
          user_cpf?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_attendance: {
        Row: {
          bot: number
          created_at: string | null
          day_name: string
          human: number
          id: string
          period: string
          total: number
        }
        Insert: {
          bot: number
          created_at?: string | null
          day_name: string
          human: number
          id?: string
          period?: string
          total: number
        }
        Update: {
          bot?: number
          created_at?: string | null
          day_name?: string
          human?: number
          id?: string
          period?: string
          total?: number
        }
        Relationships: []
      }
      daily_response_time: {
        Row: {
          avg_time: number
          created_at: string | null
          day_name: string
          id: string
          period: string
        }
        Insert: {
          avg_time: number
          created_at?: string | null
          day_name: string
          id?: string
          period?: string
        }
        Update: {
          avg_time?: number
          created_at?: string | null
          day_name?: string
          id?: string
          period?: string
        }
        Relationships: []
      }
      department_stats: {
        Row: {
          avg_wait_time: number
          bot_resolution_rate: number
          created_at: string | null
          department_id: string | null
          department_name: string
          id: string
          period: string
          satisfaction_rate: number
          total_conversations: number
        }
        Insert: {
          avg_wait_time: number
          bot_resolution_rate: number
          created_at?: string | null
          department_id?: string | null
          department_name: string
          id?: string
          period?: string
          satisfaction_rate: number
          total_conversations: number
        }
        Update: {
          avg_wait_time?: number
          bot_resolution_rate?: number
          created_at?: string | null
          department_id?: string | null
          department_name?: string
          id?: string
          period?: string
          satisfaction_rate?: number
          total_conversations?: number
        }
        Relationships: [
          {
            foreignKeyName: "department_stats_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      kpi_data: {
        Row: {
          created_at: string | null
          id: string
          period: string
          response_time: string
          response_time_change: string
          satisfaction: number
          satisfaction_change: string
          total_attendances: number
          total_growth: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          period?: string
          response_time: string
          response_time_change: string
          satisfaction: number
          satisfaction_change: string
          total_attendances: number
          total_growth: string
        }
        Update: {
          created_at?: string | null
          id?: string
          period?: string
          response_time?: string
          response_time_change?: string
          satisfaction?: number
          satisfaction_change?: string
          total_attendances?: number
          total_growth?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          file_name: string | null
          file_url: string | null
          id: string
          sender_id: string
          sender_name: string
          sender_role: string
          status: string
          timestamp: string
          type: string
        }
        Insert: {
          content: string
          conversation_id: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          sender_id: string
          sender_name: string
          sender_role: string
          status: string
          timestamp?: string
          type: string
        }
        Update: {
          content?: string
          conversation_id?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          sender_id?: string
          sender_name?: string
          sender_role?: string
          status?: string
          timestamp?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      resolution_distribution: {
        Row: {
          created_at: string | null
          id: string
          percentage: number
          period: string
          resolution_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          percentage: number
          period?: string
          resolution_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          percentage?: number
          period?: string
          resolution_type?: string
        }
        Relationships: []
      }
      satisfaction_distribution: {
        Row: {
          count: number
          created_at: string | null
          id: string
          period: string
          rating: number
        }
        Insert: {
          count: number
          created_at?: string | null
          id?: string
          period?: string
          rating: number
        }
        Update: {
          count?: number
          created_at?: string | null
          id?: string
          period?: string
          rating?: number
        }
        Relationships: []
      }
      service_stats: {
        Row: {
          avg_handling_time: number
          bot_resolution_rate: number
          created_at: string | null
          department_id: string | null
          department_name: string
          id: string
          period: string
          satisfaction_rate: number
          service_id: string | null
          service_name: string
          total_conversations: number
        }
        Insert: {
          avg_handling_time: number
          bot_resolution_rate: number
          created_at?: string | null
          department_id?: string | null
          department_name: string
          id?: string
          period?: string
          satisfaction_rate: number
          service_id?: string | null
          service_name: string
          total_conversations: number
        }
        Update: {
          avg_handling_time?: number
          bot_resolution_rate?: number
          created_at?: string | null
          department_id?: string | null
          department_name?: string
          id?: string
          period?: string
          satisfaction_rate?: number
          service_id?: string | null
          service_name?: string
          total_conversations?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_stats_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_stats_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          department_id: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          department_id: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          department_id?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
