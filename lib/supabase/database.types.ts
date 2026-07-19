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
      client_sops: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          approved_tools: string[]
          created_at: string
          data_controls: string
          department: string
          deployment_id: string
          human_approver: string
          id: string
          inputs: string
          procedure: string
          purpose: string
          review_criteria: string
          risk_level: Database["public"]["Enums"]["ai_risk_level"]
          status: Database["public"]["Enums"]["client_sop_status"]
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          approved_tools?: string[]
          created_at?: string
          data_controls: string
          department: string
          deployment_id: string
          human_approver: string
          id?: string
          inputs?: string
          procedure: string
          purpose: string
          review_criteria: string
          risk_level?: Database["public"]["Enums"]["ai_risk_level"]
          status?: Database["public"]["Enums"]["client_sop_status"]
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          approved_tools?: string[]
          created_at?: string
          data_controls?: string
          department?: string
          deployment_id?: string
          human_approver?: string
          id?: string
          inputs?: string
          procedure?: string
          purpose?: string
          review_criteria?: string
          risk_level?: Database["public"]["Enums"]["ai_risk_level"]
          status?: Database["public"]["Enums"]["client_sop_status"]
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_sops_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_sops_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "workforce_deployments"
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
      corporate_accounts: {
        Row: {
          company_name: string
          created_at: string
          employee_band: string
          id: string
          industry: string
          location: string
          notes: string
          owner_id: string | null
          primary_contact_email: string
          primary_contact_name: string
          primary_contact_phone: string
          primary_contact_title: string
          source: string
          status: Database["public"]["Enums"]["corporate_account_status"]
          updated_at: string
          website: string
        }
        Insert: {
          company_name: string
          created_at?: string
          employee_band: string
          id?: string
          industry: string
          location?: string
          notes?: string
          owner_id?: string | null
          primary_contact_email: string
          primary_contact_name: string
          primary_contact_phone?: string
          primary_contact_title?: string
          source?: string
          status?: Database["public"]["Enums"]["corporate_account_status"]
          updated_at?: string
          website?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          employee_band?: string
          id?: string
          industry?: string
          location?: string
          notes?: string
          owner_id?: string | null
          primary_contact_email?: string
          primary_contact_name?: string
          primary_contact_phone?: string
          primary_contact_title?: string
          source?: string
          status?: Database["public"]["Enums"]["corporate_account_status"]
          updated_at?: string
          website?: string
        }
        Relationships: [
          {
            foreignKeyName: "corporate_accounts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_opportunities: {
        Row: {
          account_id: string
          created_at: string
          expected_close_date: string | null
          id: string
          lost_reason: string
          next_step: string
          next_step_due_at: string | null
          owner_id: string | null
          package: Database["public"]["Enums"]["corporate_package"]
          participant_count: number
          probability: number
          stage: Database["public"]["Enums"]["opportunity_stage"]
          title: string
          updated_at: string
          value_aed: number
        }
        Insert: {
          account_id: string
          created_at?: string
          expected_close_date?: string | null
          id?: string
          lost_reason?: string
          next_step?: string
          next_step_due_at?: string | null
          owner_id?: string | null
          package?: Database["public"]["Enums"]["corporate_package"]
          participant_count?: number
          probability?: number
          stage?: Database["public"]["Enums"]["opportunity_stage"]
          title: string
          updated_at?: string
          value_aed?: number
        }
        Update: {
          account_id?: string
          created_at?: string
          expected_close_date?: string | null
          id?: string
          lost_reason?: string
          next_step?: string
          next_step_due_at?: string | null
          owner_id?: string | null
          package?: Database["public"]["Enums"]["corporate_package"]
          participant_count?: number
          probability?: number
          stage?: Database["public"]["Enums"]["opportunity_stage"]
          title?: string
          updated_at?: string
          value_aed?: number
        }
        Relationships: [
          {
            foreignKeyName: "corporate_opportunities_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corporate_opportunities_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_proposals: {
        Row: {
          accepted_at: string | null
          assumptions: string
          created_at: string
          created_by: string | null
          id: string
          opportunity_id: string
          package: Database["public"]["Enums"]["corporate_package"]
          participant_count: number
          proposal_number: string
          scope: string
          sent_at: string | null
          status: Database["public"]["Enums"]["proposal_status"]
          subtotal_aed: number
          timeline: string
          total_aed: number
          updated_at: string
          valid_until: string
          vat_aed: number
          vat_rate: number
        }
        Insert: {
          accepted_at?: string | null
          assumptions?: string
          created_at?: string
          created_by?: string | null
          id?: string
          opportunity_id: string
          package: Database["public"]["Enums"]["corporate_package"]
          participant_count: number
          proposal_number: string
          scope: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          subtotal_aed: number
          timeline: string
          total_aed: number
          updated_at?: string
          valid_until: string
          vat_aed?: number
          vat_rate?: number
        }
        Update: {
          accepted_at?: string | null
          assumptions?: string
          created_at?: string
          created_by?: string | null
          id?: string
          opportunity_id?: string
          package?: Database["public"]["Enums"]["corporate_package"]
          participant_count?: number
          proposal_number?: string
          scope?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          subtotal_aed?: number
          timeline?: string
          total_aed?: number
          updated_at?: string
          valid_until?: string
          vat_aed?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "corporate_proposals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corporate_proposals_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "corporate_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_workshops: {
        Row: {
          created_at: string
          delivery_mode: Database["public"]["Enums"]["session_delivery_mode"]
          ends_at: string
          facilitator: string
          id: string
          join_url: string
          location: string
          notes: string
          opportunity_id: string
          outcomes: string
          participant_target: number
          proposal_id: string | null
          starts_at: string
          status: Database["public"]["Enums"]["workshop_status"]
          title: string
          updated_at: string
          workshop_type: Database["public"]["Enums"]["corporate_workshop_type"]
        }
        Insert: {
          created_at?: string
          delivery_mode?: Database["public"]["Enums"]["session_delivery_mode"]
          ends_at: string
          facilitator?: string
          id?: string
          join_url?: string
          location?: string
          notes?: string
          opportunity_id: string
          outcomes?: string
          participant_target?: number
          proposal_id?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["workshop_status"]
          title: string
          updated_at?: string
          workshop_type: Database["public"]["Enums"]["corporate_workshop_type"]
        }
        Update: {
          created_at?: string
          delivery_mode?: Database["public"]["Enums"]["session_delivery_mode"]
          ends_at?: string
          facilitator?: string
          id?: string
          join_url?: string
          location?: string
          notes?: string
          opportunity_id?: string
          outcomes?: string
          participant_target?: number
          proposal_id?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["workshop_status"]
          title?: string
          updated_at?: string
          workshop_type?: Database["public"]["Enums"]["corporate_workshop_type"]
        }
        Relationships: [
          {
            foreignKeyName: "corporate_workshops_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "corporate_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corporate_workshops_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "corporate_proposals"
            referencedColumns: ["id"]
          },
        ]
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
      operator_onboarding_items: {
        Row: {
          category: string
          completed_at: string | null
          completed_by: string | null
          created_at: string
          due_date: string | null
          id: string
          label: string
          notes: string
          operator_id: string
          sort_order: number
          status: Database["public"]["Enums"]["onboarding_task_status"]
          task_key: string
          updated_at: string
        }
        Insert: {
          category: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          label: string
          notes?: string
          operator_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["onboarding_task_status"]
          task_key: string
          updated_at?: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          label?: string
          notes?: string
          operator_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["onboarding_task_status"]
          task_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_onboarding_items_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_onboarding_items_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "workforce_operators"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_quality_reviews: {
        Row: {
          actions: string
          client_feedback: string
          client_satisfaction_score: number
          created_at: string
          deployment_id: string
          hours_saved: number
          hours_worked: number
          id: string
          operator_id: string
          outcome: Database["public"]["Enums"]["quality_review_outcome"]
          period_end: string
          period_start: string
          quality_score: number
          reliability_score: number
          responsible_ai_score: number
          review_date: string
          reviewer_id: string | null
          risk_incidents: number
          strengths: string
          utilisation_percent: number
        }
        Insert: {
          actions?: string
          client_feedback?: string
          client_satisfaction_score: number
          created_at?: string
          deployment_id: string
          hours_saved?: number
          hours_worked?: number
          id?: string
          operator_id: string
          outcome?: Database["public"]["Enums"]["quality_review_outcome"]
          period_end: string
          period_start: string
          quality_score: number
          reliability_score: number
          responsible_ai_score: number
          review_date: string
          reviewer_id?: string | null
          risk_incidents?: number
          strengths?: string
          utilisation_percent: number
        }
        Update: {
          actions?: string
          client_feedback?: string
          client_satisfaction_score?: number
          created_at?: string
          deployment_id?: string
          hours_saved?: number
          hours_worked?: number
          id?: string
          operator_id?: string
          outcome?: Database["public"]["Enums"]["quality_review_outcome"]
          period_end?: string
          period_start?: string
          quality_score?: number
          reliability_score?: number
          responsible_ai_score?: number
          review_date?: string
          reviewer_id?: string | null
          risk_incidents?: number
          strengths?: string
          utilisation_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "operator_quality_reviews_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "workforce_deployments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_quality_reviews_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "workforce_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_quality_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      readiness_assessments: {
        Row: {
          adoption_score: number
          completed_at: string | null
          created_at: string
          data_score: number
          executive_summary: string
          governance_score: number
          id: string
          leadership_score: number
          maturity: Database["public"]["Enums"]["ai_maturity_level"]
          opportunity_id: string
          overall_score: number
          people_score: number
          priorities: string
          process_score: number
          respondent_name: string
          risks: string
          status: Database["public"]["Enums"]["diagnostic_status"]
          tools_score: number
          updated_at: string
        }
        Insert: {
          adoption_score?: number
          completed_at?: string | null
          created_at?: string
          data_score?: number
          executive_summary?: string
          governance_score?: number
          id?: string
          leadership_score?: number
          maturity?: Database["public"]["Enums"]["ai_maturity_level"]
          opportunity_id: string
          overall_score?: number
          people_score?: number
          priorities?: string
          process_score?: number
          respondent_name?: string
          risks?: string
          status?: Database["public"]["Enums"]["diagnostic_status"]
          tools_score?: number
          updated_at?: string
        }
        Update: {
          adoption_score?: number
          completed_at?: string | null
          created_at?: string
          data_score?: number
          executive_summary?: string
          governance_score?: number
          id?: string
          leadership_score?: number
          maturity?: Database["public"]["Enums"]["ai_maturity_level"]
          opportunity_id?: string
          overall_score?: number
          people_score?: number
          priorities?: string
          process_score?: number
          respondent_name?: string
          risks?: string
          status?: Database["public"]["Enums"]["diagnostic_status"]
          tools_score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "readiness_assessments_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: true
            referencedRelation: "corporate_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_opportunities: {
        Row: {
          created_at: string
          current_pain: string
          department: string
          feasibility_score: number
          frequency: string
          human_oversight: string
          id: string
          priority: number
          readiness_assessment_id: string
          recommendation: string
          risk_level: Database["public"]["Enums"]["ai_risk_level"]
          value_score: number
          workflow_name: string
        }
        Insert: {
          created_at?: string
          current_pain?: string
          department: string
          feasibility_score?: number
          frequency?: string
          human_oversight?: string
          id?: string
          priority?: number
          readiness_assessment_id: string
          recommendation?: string
          risk_level?: Database["public"]["Enums"]["ai_risk_level"]
          value_score?: number
          workflow_name: string
        }
        Update: {
          created_at?: string
          current_pain?: string
          department?: string
          feasibility_score?: number
          frequency?: string
          human_oversight?: string
          id?: string
          priority?: number
          readiness_assessment_id?: string
          recommendation?: string
          risk_level?: Database["public"]["Enums"]["ai_risk_level"]
          value_score?: number
          workflow_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_opportunities_readiness_assessment_id_fkey"
            columns: ["readiness_assessment_id"]
            isOneToOne: false
            referencedRelation: "readiness_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      workforce_deployments: {
        Row: {
          account_id: string
          account_manager_id: string | null
          client_owner_email: string
          client_owner_name: string
          client_rate_monthly_aed: number
          created_at: string
          deployment_number: string
          ended_at: string | null
          ends_on: string | null
          id: string
          management_allocation_aed: number
          match_id: string | null
          minimum_term_months: number
          next_review_at: string | null
          operator_cost_monthly_aed: number
          operator_id: string
          opportunity_id: string | null
          outcomes: string
          plan: Database["public"]["Enums"]["workforce_plan"]
          role_title: string
          starts_on: string
          status: Database["public"]["Enums"]["workforce_deployment_status"]
          success_measures: string
          target_hours_month: number
          tools_overhead_aed: number
          updated_at: string
        }
        Insert: {
          account_id: string
          account_manager_id?: string | null
          client_owner_email: string
          client_owner_name: string
          client_rate_monthly_aed: number
          created_at?: string
          deployment_number: string
          ended_at?: string | null
          ends_on?: string | null
          id?: string
          management_allocation_aed?: number
          match_id?: string | null
          minimum_term_months?: number
          next_review_at?: string | null
          operator_cost_monthly_aed: number
          operator_id: string
          opportunity_id?: string | null
          outcomes?: string
          plan?: Database["public"]["Enums"]["workforce_plan"]
          role_title: string
          starts_on: string
          status?: Database["public"]["Enums"]["workforce_deployment_status"]
          success_measures?: string
          target_hours_month?: number
          tools_overhead_aed?: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          account_manager_id?: string | null
          client_owner_email?: string
          client_owner_name?: string
          client_rate_monthly_aed?: number
          created_at?: string
          deployment_number?: string
          ended_at?: string | null
          ends_on?: string | null
          id?: string
          management_allocation_aed?: number
          match_id?: string | null
          minimum_term_months?: number
          next_review_at?: string | null
          operator_cost_monthly_aed?: number
          operator_id?: string
          opportunity_id?: string | null
          outcomes?: string
          plan?: Database["public"]["Enums"]["workforce_plan"]
          role_title?: string
          starts_on?: string
          status?: Database["public"]["Enums"]["workforce_deployment_status"]
          success_measures?: string
          target_hours_month?: number
          tools_overhead_aed?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workforce_deployments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workforce_deployments_account_manager_id_fkey"
            columns: ["account_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workforce_deployments_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "workforce_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workforce_deployments_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "workforce_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workforce_deployments_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "corporate_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      workforce_matches: {
        Row: {
          account_id: string
          client_requirements: string
          created_at: string
          created_by: string | null
          decided_at: string | null
          id: string
          match_score: number
          operator_id: string
          opportunity_id: string | null
          proposed_rate_aed: number
          rationale: string
          role_title: string
          status: Database["public"]["Enums"]["workforce_match_status"]
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          account_id: string
          client_requirements?: string
          created_at?: string
          created_by?: string | null
          decided_at?: string | null
          id?: string
          match_score?: number
          operator_id: string
          opportunity_id?: string | null
          proposed_rate_aed?: number
          rationale?: string
          role_title: string
          status?: Database["public"]["Enums"]["workforce_match_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          client_requirements?: string
          created_at?: string
          created_by?: string | null
          decided_at?: string | null
          id?: string
          match_score?: number
          operator_id?: string
          opportunity_id?: string | null
          proposed_rate_aed?: number
          rationale?: string
          role_title?: string
          status?: Database["public"]["Enums"]["workforce_match_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workforce_matches_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workforce_matches_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workforce_matches_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "workforce_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workforce_matches_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "corporate_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      workforce_operators: {
        Row: {
          application_id: string | null
          available_from: string | null
          background_check_complete: boolean
          capacity_hours_month: number
          created_at: string
          credential_id: string | null
          data_policy_signed_at: string | null
          email: string
          experience_summary: string
          full_name: string
          id: string
          location: string
          monthly_cost_aed: number
          nda_signed_at: string | null
          operator_number: string
          operator_type: Database["public"]["Enums"]["workforce_operator_type"]
          owner_id: string | null
          phone: string
          profile_id: string | null
          readiness_score: number
          skills: string[]
          specialisation: string
          status: Database["public"]["Enums"]["workforce_operator_status"]
          updated_at: string
          work_mode: Database["public"]["Enums"]["workforce_work_mode"]
        }
        Insert: {
          application_id?: string | null
          available_from?: string | null
          background_check_complete?: boolean
          capacity_hours_month?: number
          created_at?: string
          credential_id?: string | null
          data_policy_signed_at?: string | null
          email: string
          experience_summary?: string
          full_name: string
          id?: string
          location?: string
          monthly_cost_aed?: number
          nda_signed_at?: string | null
          operator_number: string
          operator_type: Database["public"]["Enums"]["workforce_operator_type"]
          owner_id?: string | null
          phone?: string
          profile_id?: string | null
          readiness_score?: number
          skills?: string[]
          specialisation?: string
          status?: Database["public"]["Enums"]["workforce_operator_status"]
          updated_at?: string
          work_mode?: Database["public"]["Enums"]["workforce_work_mode"]
        }
        Update: {
          application_id?: string | null
          available_from?: string | null
          background_check_complete?: boolean
          capacity_hours_month?: number
          created_at?: string
          credential_id?: string | null
          data_policy_signed_at?: string | null
          email?: string
          experience_summary?: string
          full_name?: string
          id?: string
          location?: string
          monthly_cost_aed?: number
          nda_signed_at?: string | null
          operator_number?: string
          operator_type?: Database["public"]["Enums"]["workforce_operator_type"]
          owner_id?: string | null
          phone?: string
          profile_id?: string | null
          readiness_score?: number
          skills?: string[]
          specialisation?: string
          status?: Database["public"]["Enums"]["workforce_operator_status"]
          updated_at?: string
          work_mode?: Database["public"]["Enums"]["workforce_work_mode"]
        }
        Relationships: [
          {
            foreignKeyName: "workforce_operators_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workforce_operators_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: true
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workforce_operators_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workforce_operators_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
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
        | "account"
        | "opportunity"
        | "diagnostic"
        | "proposal"
        | "workshop"
        | "operator"
        | "match"
        | "deployment"
        | "sop"
        | "quality_review"
      ai_maturity_level: "emerging" | "developing" | "ready" | "leading"
      ai_risk_level: "green" | "amber" | "red"
      app_role:
        | "super_admin"
        | "academy_ops"
        | "assessor"
        | "candidate"
        | "talent_ops"
        | "operator"
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
      client_sop_status: "draft" | "review" | "approved" | "retired"
      cohort_module_status: "locked" | "open" | "completed"
      cohort_status: "draft" | "enrolling" | "active" | "completed"
      corporate_account_status: "prospect" | "active" | "client" | "inactive"
      corporate_package:
        | "team_enablement_15"
        | "team_enablement_30"
        | "private_caio"
        | "enterprise"
      corporate_workshop_type:
        | "executive_readiness"
        | "team_enablement"
        | "manager_coaching"
        | "workflow_lab"
      credential_classification: "pass" | "distinction"
      credential_status: "eligible" | "issued" | "revoked" | "expired"
      diagnostic_status: "draft" | "completed"
      enrollment_status:
        | "invited"
        | "enrolled"
        | "active"
        | "completed"
        | "withdrawn"
      learning_module_status: "draft" | "published" | "archived"
      onboarding_task_status: "pending" | "in_progress" | "complete" | "waived"
      opportunity_stage:
        | "lead"
        | "qualified"
        | "diagnosis"
        | "proposal"
        | "proof"
        | "won"
        | "lost"
      proposal_status: "draft" | "sent" | "accepted" | "declined" | "expired"
      quality_review_outcome: "on_track" | "coaching" | "at_risk"
      session_delivery_mode: "live_online" | "in_person" | "hybrid"
      session_status: "scheduled" | "live" | "completed" | "cancelled"
      submission_status:
        | "not_started"
        | "submitted"
        | "under_review"
        | "revision_requested"
        | "accepted"
      workforce_deployment_status:
        | "preparing"
        | "active"
        | "paused"
        | "completed"
        | "terminated"
      workforce_match_status:
        | "suggested"
        | "shortlisted"
        | "client_review"
        | "approved"
        | "rejected"
        | "withdrawn"
      workforce_operator_status:
        | "applicant"
        | "screening"
        | "onboarding"
        | "available"
        | "matched"
        | "deployed"
        | "paused"
        | "inactive"
      workforce_operator_type:
        | "executive_assistant"
        | "marketing"
        | "sales"
        | "operations"
        | "customer_experience"
        | "recruitment"
      workforce_plan: "starter" | "growth" | "scale" | "custom"
      workforce_work_mode: "remote" | "on_site" | "hybrid"
      workshop_status: "planned" | "confirmed" | "completed" | "cancelled"
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
        "account",
        "opportunity",
        "diagnostic",
        "proposal",
        "workshop",
        "operator",
        "match",
        "deployment",
        "sop",
        "quality_review",
      ],
      ai_maturity_level: ["emerging", "developing", "ready", "leading"],
      ai_risk_level: ["green", "amber", "red"],
      app_role: [
        "super_admin",
        "academy_ops",
        "assessor",
        "candidate",
        "talent_ops",
        "operator",
      ],
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
      client_sop_status: ["draft", "review", "approved", "retired"],
      cohort_module_status: ["locked", "open", "completed"],
      cohort_status: ["draft", "enrolling", "active", "completed"],
      corporate_account_status: ["prospect", "active", "client", "inactive"],
      corporate_package: [
        "team_enablement_15",
        "team_enablement_30",
        "private_caio",
        "enterprise",
      ],
      corporate_workshop_type: [
        "executive_readiness",
        "team_enablement",
        "manager_coaching",
        "workflow_lab",
      ],
      credential_classification: ["pass", "distinction"],
      credential_status: ["eligible", "issued", "revoked", "expired"],
      diagnostic_status: ["draft", "completed"],
      enrollment_status: [
        "invited",
        "enrolled",
        "active",
        "completed",
        "withdrawn",
      ],
      learning_module_status: ["draft", "published", "archived"],
      onboarding_task_status: ["pending", "in_progress", "complete", "waived"],
      opportunity_stage: [
        "lead",
        "qualified",
        "diagnosis",
        "proposal",
        "proof",
        "won",
        "lost",
      ],
      proposal_status: ["draft", "sent", "accepted", "declined", "expired"],
      quality_review_outcome: ["on_track", "coaching", "at_risk"],
      session_delivery_mode: ["live_online", "in_person", "hybrid"],
      session_status: ["scheduled", "live", "completed", "cancelled"],
      submission_status: [
        "not_started",
        "submitted",
        "under_review",
        "revision_requested",
        "accepted",
      ],
      workforce_deployment_status: [
        "preparing",
        "active",
        "paused",
        "completed",
        "terminated",
      ],
      workforce_match_status: [
        "suggested",
        "shortlisted",
        "client_review",
        "approved",
        "rejected",
        "withdrawn",
      ],
      workforce_operator_status: [
        "applicant",
        "screening",
        "onboarding",
        "available",
        "matched",
        "deployed",
        "paused",
        "inactive",
      ],
      workforce_operator_type: [
        "executive_assistant",
        "marketing",
        "sales",
        "operations",
        "customer_experience",
        "recruitment",
      ],
      workforce_plan: ["starter", "growth", "scale", "custom"],
      workforce_work_mode: ["remote", "on_site", "hybrid"],
      workshop_status: ["planned", "confirmed", "completed", "cancelled"],
    },
  },
} as const

