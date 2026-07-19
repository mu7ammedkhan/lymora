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
      assessment_components: {
        Row: {
          code: string
          created_at: string
          description: string
          id: string
          pass_threshold: number
          program_code: string
          responsible_ai_gate: boolean
          sort_order: number
          title: string
          weight: number
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          id?: string
          pass_threshold?: number
          program_code?: string
          responsible_ai_gate?: boolean
          sort_order?: number
          title: string
          weight: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          id?: string
          pass_threshold?: number
          program_code?: string
          responsible_ai_gate?: boolean
          sort_order?: number
          title?: string
          weight?: number
        }
        Relationships: []
      }
      assessment_results: {
        Row: {
          feedback: string
          graded_at: string
          graded_by: string | null
          id: string
          outcome: Database["public"]["Enums"]["assessment_outcome"]
          score: number
          submission_id: string
        }
        Insert: {
          feedback?: string
          graded_at?: string
          graded_by?: string | null
          id?: string
          outcome: Database["public"]["Enums"]["assessment_outcome"]
          score: number
          submission_id: string
        }
        Update: {
          feedback?: string
          graded_at?: string
          graded_by?: string | null
          id?: string
          outcome?: Database["public"]["Enums"]["assessment_outcome"]
          score?: number
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_results_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "assessment_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_submissions: {
        Row: {
          component_id: string
          created_at: string
          enrollment_id: string
          evidence_url: string
          id: string
          status: Database["public"]["Enums"]["submission_status"]
          submission_notes: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          component_id: string
          created_at?: string
          enrollment_id: string
          evidence_url?: string
          id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          submission_notes?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          component_id?: string
          created_at?: string
          enrollment_id?: string
          evidence_url?: string
          id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          submission_notes?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_submissions_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "assessment_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_submissions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          enrollment_id: string
          id: string
          marked_at: string
          marked_by: string | null
          minutes_attended: number
          notes: string
          session_id: string
          status: Database["public"]["Enums"]["attendance_status"]
        }
        Insert: {
          enrollment_id: string
          id?: string
          marked_at?: string
          marked_by?: string | null
          minutes_attended?: number
          notes?: string
          session_id: string
          status: Database["public"]["Enums"]["attendance_status"]
        }
        Update: {
          enrollment_id?: string
          id?: string
          marked_at?: string
          marked_by?: string | null
          minutes_attended?: number
          notes?: string
          session_id?: string
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "cohort_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      cohort_modules: {
        Row: {
          cohort_id: string
          due_at: string
          id: string
          module_id: string
          opens_at: string
          status: Database["public"]["Enums"]["cohort_module_status"]
        }
        Insert: {
          cohort_id: string
          due_at: string
          id?: string
          module_id: string
          opens_at: string
          status?: Database["public"]["Enums"]["cohort_module_status"]
        }
        Update: {
          cohort_id?: string
          due_at?: string
          id?: string
          module_id?: string
          opens_at?: string
          status?: Database["public"]["Enums"]["cohort_module_status"]
        }
        Relationships: [
          {
            foreignKeyName: "cohort_modules_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohort_modules_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      cohort_sessions: {
        Row: {
          cohort_id: string
          created_at: string
          created_by: string | null
          delivery_mode: Database["public"]["Enums"]["session_delivery_mode"]
          ends_at: string
          id: string
          join_url: string
          module_id: string | null
          starts_at: string
          status: Database["public"]["Enums"]["session_status"]
          title: string
        }
        Insert: {
          cohort_id: string
          created_at?: string
          created_by?: string | null
          delivery_mode?: Database["public"]["Enums"]["session_delivery_mode"]
          ends_at: string
          id?: string
          join_url?: string
          module_id?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["session_status"]
          title: string
        }
        Update: {
          cohort_id?: string
          created_at?: string
          created_by?: string | null
          delivery_mode?: Database["public"]["Enums"]["session_delivery_mode"]
          ends_at?: string
          id?: string
          join_url?: string
          module_id?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["session_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohort_sessions_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohort_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohort_sessions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
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
      credentials: {
        Row: {
          classification: Database["public"]["Enums"]["credential_classification"]
          created_at: string
          credential_number: string
          enrollment_id: string
          expires_at: string | null
          id: string
          issued_at: string | null
          issued_by: string | null
          overall_score: number
          status: Database["public"]["Enums"]["credential_status"]
          verification_code: string
        }
        Insert: {
          classification: Database["public"]["Enums"]["credential_classification"]
          created_at?: string
          credential_number: string
          enrollment_id: string
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          overall_score: number
          status?: Database["public"]["Enums"]["credential_status"]
          verification_code?: string
        }
        Update: {
          classification?: Database["public"]["Enums"]["credential_classification"]
          created_at?: string
          credential_number?: string
          enrollment_id?: string
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          overall_score?: number
          status?: Database["public"]["Enums"]["credential_status"]
          verification_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentials_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credentials_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      learning_modules: {
        Row: {
          code: string
          competency_domain: string
          created_at: string
          id: string
          live_hours: number
          program_code: string
          sort_order: number
          status: Database["public"]["Enums"]["learning_module_status"]
          summary: string
          title: string
          week_number: number
        }
        Insert: {
          code: string
          competency_domain: string
          created_at?: string
          id?: string
          live_hours?: number
          program_code?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["learning_module_status"]
          summary: string
          title: string
          week_number: number
        }
        Update: {
          code?: string
          competency_domain?: string
          created_at?: string
          id?: string
          live_hours?: number
          program_code?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["learning_module_status"]
          summary?: string
          title?: string
          week_number?: number
        }
        Relationships: []
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
        | "assessment"
        | "credential"
      app_role: "super_admin" | "academy_ops" | "assessor" | "candidate"
      application_source: "website" | "manual" | "referral"
      application_status:
        | "new"
        | "screening"
        | "interview"
        | "accepted"
        | "waitlisted"
        | "declined"
      assessment_outcome: "pass" | "resubmit" | "fail"
      attendance_status: "present" | "late" | "excused" | "absent"
      cohort_module_status: "locked" | "open" | "completed"
      cohort_status: "draft" | "enrolling" | "active" | "completed"
      credential_classification: "pass" | "distinction"
      credential_status: "eligible" | "issued" | "revoked" | "expired"
      enrollment_status:
        | "invited"
        | "enrolled"
        | "active"
        | "completed"
        | "withdrawn"
      learning_module_status: "draft" | "published" | "archived"
      session_delivery_mode: "live_online" | "in_person" | "hybrid"
      session_status: "scheduled" | "live" | "completed" | "cancelled"
      submission_status:
        | "not_started"
        | "submitted"
        | "under_review"
        | "revision_requested"
        | "accepted"
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
        "assessment",
        "credential",
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
      assessment_outcome: ["pass", "resubmit", "fail"],
      attendance_status: ["present", "late", "excused", "absent"],
      cohort_module_status: ["locked", "open", "completed"],
      cohort_status: ["draft", "enrolling", "active", "completed"],
      credential_classification: ["pass", "distinction"],
      credential_status: ["eligible", "issued", "revoked", "expired"],
      enrollment_status: [
        "invited",
        "enrolled",
        "active",
        "completed",
        "withdrawn",
      ],
      learning_module_status: ["draft", "published", "archived"],
      session_delivery_mode: ["live_online", "in_person", "hybrid"],
      session_status: ["scheduled", "live", "completed", "cancelled"],
      submission_status: [
        "not_started",
        "submitted",
        "under_review",
        "revision_requested",
        "accepted",
      ],
    },
  },
} as const

