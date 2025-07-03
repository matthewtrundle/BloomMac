// Database types for Supabase
// Auto-generated types would normally go here, but for now we'll use basic types

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email?: string;
          phone?: string;
          postpartum_date?: string;
          baby_due_date?: string;
          number_of_children?: number;
          emergency_contact_name?: string;
          emergency_contact_phone?: string;
          emergency_contact_relationship?: string;
          timezone?: string;
          marketing_consent?: boolean;
          total_stars?: number;
          role?: string;
          enrollment_status?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          email?: string;
          phone?: string;
          postpartum_date?: string;
          baby_due_date?: string;
          number_of_children?: number;
          emergency_contact_name?: string;
          emergency_contact_phone?: string;
          emergency_contact_relationship?: string;
          timezone?: string;
          marketing_consent?: boolean;
          total_stars?: number;
          role?: string;
          enrollment_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          postpartum_date?: string;
          baby_due_date?: string;
          number_of_children?: number;
          emergency_contact_name?: string;
          emergency_contact_phone?: string;
          emergency_contact_relationship?: string;
          timezone?: string;
          marketing_consent?: boolean;
          total_stars?: number;
          role?: string;
          enrollment_status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      course_enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          enrollment_date: string;
          progress_percentage: number;
          completion_status: string;
          payment_status: string;
          last_accessed?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          enrollment_date?: string;
          progress_percentage?: number;
          completion_status?: string;
          payment_status?: string;
          last_accessed?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          enrollment_date?: string;
          progress_percentage?: number;
          completion_status?: string;
          payment_status?: string;
          last_accessed?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string;
          points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          earned_at?: string;
          points: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          earned_at?: string;
          points?: number;
          created_at?: string;
        };
      };
      user_lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          lesson_id: string;
          week_number?: number;
          status: string;
          progress_percentage: number;
          time_spent_minutes: number;
          started_at?: string;
          completed_at?: string;
          last_accessed: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          lesson_id: string;
          week_number?: number;
          status?: string;
          progress_percentage?: number;
          time_spent_minutes?: number;
          started_at?: string;
          completed_at?: string;
          last_accessed?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          lesson_id?: string;
          week_number?: number;
          status?: string;
          progress_percentage?: number;
          time_spent_minutes?: number;
          started_at?: string;
          completed_at?: string;
          last_accessed?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_workbook_responses: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          week_number: number;
          question_id: string;
          response_data: any;
          response_type?: string;
          is_draft: boolean;
          submitted_at?: string;
          last_modified: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          week_number: number;
          question_id: string;
          response_data: any;
          response_type?: string;
          is_draft?: boolean;
          submitted_at?: string;
          last_modified?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          week_number?: number;
          question_id?: string;
          response_data?: any;
          response_type?: string;
          is_draft?: boolean;
          submitted_at?: string;
          last_modified?: string;
          created_at?: string;
        };
      };
      user_week_submissions: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          week_number: number;
          submitted_at: string;
          all_lessons_completed: boolean;
          all_workbook_completed: boolean;
          completion_percentage: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          week_number: number;
          submitted_at?: string;
          all_lessons_completed?: boolean;
          all_workbook_completed?: boolean;
          completion_percentage?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          week_number?: number;
          submitted_at?: string;
          all_lessons_completed?: boolean;
          all_workbook_completed?: boolean;
          completion_percentage?: number;
          created_at?: string;
        };
      };
      appointment_data: {
        Row: {
          id: string;
          user_id: string;
          appointment_type: string;
          appointment_date: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          appointment_type: string;
          appointment_date: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          appointment_type?: string;
          appointment_date?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}