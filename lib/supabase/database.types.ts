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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          detail: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["activity_entity"]
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          detail: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["activity_entity"]
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          detail?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["activity_entity"]
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          ai_level: string
          application_number: string
          consent: boolean
          created_at: string
          current_role: string
          email: string
          experience: string
          full_name: string
          id: string
          industry: string
          investment_readiness: string
          linkedin_url: string
          location: string
          motivation: string
          notes: string
          phone: string
          reviewed_by: string | null
          schedule_commitment: string
          score: number | null
          source: Database["public"]["Enums"]["application_source"]
          status: Database["public"]["Enums"]["application_status"]
          track: string
          updated_at: string
          workflow_goal: string
        }
        Insert: {
          ai_level?: string
          application_number?: string
          consent?: boolean
          created_at?: string
          current_role: string
          email: string
          experience?: string
          full_name: string
          id?: string
          industry: string
          investment_readiness?: string
          linkedin_url?: string
          location: string
          motivation?: string
          notes?: string
          phone: string
          reviewed_by?: string | null
          schedule_commitment?: string
          score?: number | null
          source?: Database["public"]["Enums"]["application_source"]
          status?: Database["public"]["Enums"]["application_status"]
          track: string
          updated_at?: string
          workflow_goal?: string
        }
        Update: {
          ai_level?: string
          application_number?: string
          consent?: boolean
          created_at?: string
          current_role?: string
          email?: string
          experience?: string
          full_name?: string
          id?: string
          industry?: string
          investment_readiness?: string
          linkedin_url?: string
          location?: string
          motivation?: string
          notes?: string
          phone?: string
          reviewed_by?: string | null
          schedule_commitment?: string
          score?: number | null
          source?: Database["public"]["Enums"]["application_source"]
          status?: Database["public"]["Enums"]["application_status"]
          track?: string
          updated_at?: string
          workflow_goal?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cohorts: {
        Row: {
          capacity: number
          code: string
          created_at: string
          end_date: string
          id: string
          name: string
          program: string
          schedule: string
          start_date: string
          status: Database["public"]["Enums"]["cohort_status"]
        }
        Insert: {
          capacity: number
          code: string
          created_at?: string
          end_date: string
          id?: string
          name: string
          program?: string
          schedule: string
          start_date: string
          status?: Database["public"]["Enums"]["cohort_status"]
        }
        Update: {
          capacity?: number
          code?: string
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          program?: string
          schedule?: string
          start_date?: string
          status?: Database["public"]["Enums"]["cohort_status"]
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          application_id: string
          cohort_id: string
          created_at: string
          id: string
          progress: number
          status: Database["public"]["Enums"]["enrollment_status"]
        }
        Insert: {
          application_id: string
          cohort_id: string
          created_at?: string
          id?: string
          progress?: number
          status?: Database["public"]["Enums"]["enrollment_status"]
        }
        Update: {
          application_id?: string
          cohort_id?: string
          created_at?: string
          id?: string
          progress?: number
          status?: Database["public"]["Enums"]["enrollment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          application_id: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          last_login_at: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["account_status"]
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          last_login_at?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          last_login_at?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
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
      account_status: "active" | "invited" | "disabled"
      activity_entity:
        | "application"
        | "cohort"
        | "enrollment"
        | "session"
        | "user"
      app_role: "super_admin" | "academy_ops" | "assessor" | "candidate"
      application_source: "website" | "manual" | "referral"
      application_status:
        | "new"
        | "screening"
        | "interview"
        | "accepted"
        | "waitlisted"
        | "declined"
      cohort_status: "draft" | "enrolling" | "active" | "completed"
      enrollment_status:
        | "invited"
        | "enrolled"
        | "active"
        | "completed"
        | "withdrawn"
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
    Enums: {
      account_status: ["active", "invited", "disabled"],
      activity_entity: [
        "application",
        "cohort",
        "enrollment",
        "session",
        "user",
      ],
      app_role: ["super_admin", "academy_ops", "assessor", "candidate"],
      application_source: ["website", "manual", "referral"],
      application_status: [
        "new",
        "screening",
        "interview",
        "accepted",
        "waitlisted",
        "declined",
      ],
      cohort_status: ["draft", "enrolling", "active", "completed"],
      enrollment_status: [
        "invited",
        "enrolled",
        "active",
        "completed",
        "withdrawn",
      ],
    },
  },
} as const

