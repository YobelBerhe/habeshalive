export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      online_users: {
        Row: {
          created_at: string
          current_session_id: string | null
          last_heartbeat: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_session_id?: string | null
          last_heartbeat?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_session_id?: string | null
          last_heartbeat?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "online_users_current_session_id_fkey"
            columns: ["current_session_id"]
            isOneToOne: false
            referencedRelation: "video_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "online_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean | null
          age: number | null
          ai_blur: boolean | null
          avatar_url: string | null
          average_call_duration: number | null
          ban_expires: string | null
          ban_reason: string | null
          banned: boolean | null
          bio: string | null
          birthday: Json | null
          city: string | null
          completed_calls: number | null
          compliments_received: number | null
          country: string | null
          created_at: string | null
          email: string | null
          email_verified: boolean | null
          ethnicity: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          id: string
          id_verified: boolean | null
          interests: string[] | null
          languages: string[] | null
          last_name: string | null
          last_seen: string | null
          matching_mode: string | null
          modesty_filter: boolean | null
          phone: string | null
          phone_verified: boolean | null
          purpose: string | null
          reports_confirmed: number | null
          reports_received: number | null
          respect_score: number | null
          respect_score_visible: boolean | null
          respect_tier: string | null
          screenshot_watermark: boolean | null
          skipped_calls: number | null
          total_calls: number | null
          updated_at: string | null
          username: string | null
          verified: boolean | null
        }
        Insert: {
          active?: boolean | null
          age?: number | null
          ai_blur?: boolean | null
          avatar_url?: string | null
          average_call_duration?: number | null
          ban_expires?: string | null
          ban_reason?: string | null
          banned?: boolean | null
          bio?: string | null
          birthday?: Json | null
          city?: string | null
          completed_calls?: number | null
          compliments_received?: number | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          ethnicity?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          id_verified?: boolean | null
          interests?: string[] | null
          languages?: string[] | null
          last_name?: string | null
          last_seen?: string | null
          matching_mode?: string | null
          modesty_filter?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          purpose?: string | null
          reports_confirmed?: number | null
          reports_received?: number | null
          respect_score?: number | null
          respect_score_visible?: boolean | null
          respect_tier?: string | null
          screenshot_watermark?: boolean | null
          skipped_calls?: number | null
          total_calls?: number | null
          updated_at?: string | null
          username?: string | null
          verified?: boolean | null
        }
        Update: {
          active?: boolean | null
          age?: number | null
          ai_blur?: boolean | null
          avatar_url?: string | null
          average_call_duration?: number | null
          ban_expires?: string | null
          ban_reason?: string | null
          banned?: boolean | null
          bio?: string | null
          birthday?: Json | null
          city?: string | null
          completed_calls?: number | null
          compliments_received?: number | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          ethnicity?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          id_verified?: boolean | null
          interests?: string[] | null
          languages?: string[] | null
          last_name?: string | null
          last_seen?: string | null
          matching_mode?: string | null
          modesty_filter?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          purpose?: string | null
          reports_confirmed?: number | null
          reports_received?: number | null
          respect_score?: number | null
          respect_score_visible?: boolean | null
          respect_tier?: string | null
          screenshot_watermark?: boolean | null
          skipped_calls?: number | null
          total_calls?: number | null
          updated_at?: string | null
          username?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          description: string
          evidence: string[] | null
          id: string
          moderator_id: string | null
          moderator_notes: string | null
          priority: string
          reason: string
          reported_user_id: string | null
          reporter_id: string | null
          resolution: string | null
          resolved_at: string | null
          session_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description: string
          evidence?: string[] | null
          id?: string
          moderator_id?: string | null
          moderator_notes?: string | null
          priority?: string
          reason: string
          reported_user_id?: string | null
          reporter_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          session_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string
          evidence?: string[] | null
          id?: string
          moderator_id?: string | null
          moderator_notes?: string | null
          priority?: string
          reason?: string
          reported_user_id?: string | null
          reporter_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          session_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_moderator_id_fkey"
            columns: ["moderator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "video_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      respect_score_history: {
        Row: {
          change: number
          created_at: string
          details: string | null
          from_user_id: string | null
          id: string
          reason: string
          user_id: string | null
        }
        Insert: {
          change: number
          created_at?: string
          details?: string | null
          from_user_id?: string | null
          id?: string
          reason: string
          user_id?: string | null
        }
        Update: {
          change?: number
          created_at?: string
          details?: string | null
          from_user_id?: string | null
          id?: string
          reason?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "respect_score_history_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respect_score_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      screenshot_attempts: {
        Row: {
          attempt_number: number
          created_at: string
          id: string
          method: string
          partner_id: string | null
          respect_score_change: number
          session_id: string | null
          user_id: string | null
          watermark_id: string | null
        }
        Insert: {
          attempt_number: number
          created_at?: string
          id?: string
          method: string
          partner_id?: string | null
          respect_score_change: number
          session_id?: string | null
          user_id?: string | null
          watermark_id?: string | null
        }
        Update: {
          attempt_number?: number
          created_at?: string
          id?: string
          method?: string
          partner_id?: string | null
          respect_score_change?: number
          session_id?: string | null
          user_id?: string | null
          watermark_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "screenshot_attempts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "screenshot_attempts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "video_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "screenshot_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      video_sessions: {
        Row: {
          created_at: string
          duration: number | null
          ended_at: string | null
          evidence_saved: boolean | null
          id: string
          purpose: string
          session_id: string
          started_at: string | null
          status: string
          updated_at: string
          user1_comment: string | null
          user1_id: string | null
          user1_joined_at: string | null
          user1_left_at: string | null
          user1_rating: string | null
          user2_comment: string | null
          user2_id: string | null
          user2_joined_at: string | null
          user2_left_at: string | null
          user2_rating: string | null
          watermark_ids: string[] | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          ended_at?: string | null
          evidence_saved?: boolean | null
          id?: string
          purpose: string
          session_id: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user1_comment?: string | null
          user1_id?: string | null
          user1_joined_at?: string | null
          user1_left_at?: string | null
          user1_rating?: string | null
          user2_comment?: string | null
          user2_id?: string | null
          user2_joined_at?: string | null
          user2_left_at?: string | null
          user2_rating?: string | null
          watermark_ids?: string[] | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          ended_at?: string | null
          evidence_saved?: boolean | null
          id?: string
          purpose?: string
          session_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user1_comment?: string | null
          user1_id?: string | null
          user1_joined_at?: string | null
          user1_left_at?: string | null
          user1_rating?: string | null
          user2_comment?: string | null
          user2_id?: string | null
          user2_joined_at?: string | null
          user2_left_at?: string | null
          user2_rating?: string | null
          watermark_ids?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "video_sessions_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_sessions_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      violations: {
        Row: {
          action_taken: string
          ai_model: string
          confidence: number
          created_at: string
          evidence: string[] | null
          id: string
          respect_score_change: number
          session_id: string | null
          severity: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_taken: string
          ai_model: string
          confidence: number
          created_at?: string
          evidence?: string[] | null
          id?: string
          respect_score_change: number
          session_id?: string | null
          severity: string
          type: string
          user_id?: string | null
        }
        Update: {
          action_taken?: string
          ai_model?: string
          confidence?: number
          created_at?: string
          evidence?: string[] | null
          id?: string
          respect_score_change?: number
          session_id?: string | null
          severity?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "violations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "video_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "violations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      platform_stats: {
        Row: {
          active_sessions: number | null
          active_users: number | null
          avg_respect_score: number | null
          avg_session_duration: number | null
          banned_users: number | null
          online_users: number | null
          pending_reports: number | null
          total_sessions: number | null
          total_users: number | null
          violations_today: number | null
        }
        Relationships: []
      }
      purpose_distribution: {
        Row: {
          percentage: number | null
          purpose: string | null
          user_count: number | null
        }
        Relationships: []
      }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
