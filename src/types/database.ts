
import { Database as SupabaseDatabase } from '@/integrations/supabase/types';
import { SupabaseClient } from '@supabase/supabase-js';

// Extend the Supabase types with our custom tables
export interface CustomDatabase extends SupabaseDatabase {
  public: SupabaseDatabase['public'] & {
    Tables: SupabaseDatabase['public']['Tables'] & {
      app_users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          is_online: boolean;
          status: string;
          max_concurrent_chats: number;
          secretary_id: string | null;
          secretary_name: string | null;
          department_id: string | null;
          department_name: string | null;
          avatar: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: string;
          is_online?: boolean;
          status?: string;
          max_concurrent_chats?: number;
          secretary_id?: string | null;
          secretary_name?: string | null;
          department_id?: string | null;
          department_name?: string | null;
          avatar?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: string;
          is_online?: boolean;
          status?: string;
          max_concurrent_chats?: number;
          secretary_id?: string | null;
          secretary_name?: string | null;
          department_id?: string | null;
          department_name?: string | null;
          avatar?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      secretaries: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          name: string;
          secretary_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          secretary_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          secretary_id?: string;
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          department_id: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          department_id: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          department_id?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      questions_answers: {
        Row: {
          id: string;
          service_id: string;
          question: string;
          answer: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_id: string;
          question: string;
          answer: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string;
          question?: string;
          answer?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_service_assignments: {
        Row: {
          id: string;
          user_id: string;
          service_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_id?: string;
          created_at?: string;
        };
      };
      user_department_assignments: {
        Row: {
          id: string;
          user_id: string;
          department_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          department_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          department_id?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Type for the custom Supabase client
export type CustomSupabaseClient = SupabaseClient<CustomDatabase>;
