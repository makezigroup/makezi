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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity: string
          id: string
          record_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity: string
          id?: string
          record_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity?: string
          id?: string
          record_id?: string
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          created_at: string
          id: string
          read: boolean
          request_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          read?: boolean
          request_id: string
        }
        Update: {
          created_at?: string
          id?: string
          read?: boolean
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "partnership_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      comparisons: {
        Row: {
          salon_ids: string[]
          user_id: string
        }
        Insert: {
          salon_ids?: string[]
          user_id: string
        }
        Update: {
          salon_ids?: string[]
          user_id?: string
        }
        Relationships: []
      }
      directory_categories: {
        Row: {
          archived: boolean
          description: string
          id: string
          image: string
          is_demo: boolean
          label: string
        }
        Insert: {
          archived?: boolean
          description?: string
          id: string
          image?: string
          is_demo?: boolean
          label: string
        }
        Update: {
          archived?: boolean
          description?: string
          id?: string
          image?: string
          is_demo?: boolean
          label?: string
        }
        Relationships: []
      }
      directory_locations: {
        Row: {
          archived: boolean
          area: string
          city: string
          id: string
          is_demo: boolean
          label: string
        }
        Insert: {
          archived?: boolean
          area?: string
          city: string
          id: string
          is_demo?: boolean
          label: string
        }
        Update: {
          archived?: boolean
          area?: string
          city?: string
          id?: string
          is_demo?: boolean
          label?: string
        }
        Relationships: []
      }
      discovery_events: {
        Row: {
          created_at: string
          id: string
          name: string
          props: Json
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          props?: Json
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          props?: Json
        }
        Relationships: []
      }
      favorites: {
        Row: {
          salon_id: string
          user_id: string
        }
        Insert: {
          salon_id: string
          user_id: string
        }
        Update: {
          salon_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      partnership_requests: {
        Row: {
          area: string
          business: string
          categories: string[]
          city: string
          created_at: string
          id: string
          instagram: string
          internal_note: string
          is_demo: boolean
          message: string
          name: string
          phone: string
          salon_id: string | null
          status: string
          website: string
        }
        Insert: {
          area?: string
          business: string
          categories?: string[]
          city: string
          created_at?: string
          id?: string
          instagram?: string
          internal_note?: string
          is_demo?: boolean
          message?: string
          name: string
          phone: string
          salon_id?: string | null
          status?: string
          website?: string
        }
        Update: {
          area?: string
          business?: string
          categories?: string[]
          city?: string
          created_at?: string
          id?: string
          instagram?: string
          internal_note?: string
          is_demo?: boolean
          message?: string
          name?: string
          phone?: string
          salon_id?: string | null
          status?: string
          website?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnership_requests_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          display_name: string
          id: string
          is_demo: boolean
          notifications: boolean
          private_account: boolean
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string
          id: string
          is_demo?: boolean
          notifications?: boolean
          private_account?: boolean
        }
        Update: {
          avatar_url?: string | null
          display_name?: string
          id?: string
          is_demo?: boolean
          notifications?: boolean
          private_account?: boolean
        }
        Relationships: []
      }
      review_evidence: {
        Row: {
          accepted: boolean
          checked_at: string | null
          checked_by: string | null
          id: string
          review_id: string
          storage_path: string
          user_id: string
        }
        Insert: {
          accepted?: boolean
          checked_at?: string | null
          checked_by?: string | null
          id?: string
          review_id: string
          storage_path: string
          user_id: string
        }
        Update: {
          accepted?: boolean
          checked_at?: string | null
          checked_by?: string | null
          id?: string
          review_id?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_evidence_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "published_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_evidence_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          resolved: boolean
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          resolved?: boolean
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          resolved?: boolean
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_reports_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "published_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_reports_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author: string
          created_at: string
          dims: number[]
          id: string
          is_demo: boolean
          kind: string
          moderation_note: string | null
          reply: string | null
          salon_id: string
          service: string
          status: string
          text: string
          title: string
          user_id: string
          visit_date: string | null
        }
        Insert: {
          author: string
          created_at?: string
          dims: number[]
          id?: string
          is_demo?: boolean
          kind?: string
          moderation_note?: string | null
          reply?: string | null
          salon_id: string
          service?: string
          status?: string
          text: string
          title?: string
          user_id: string
          visit_date?: string | null
        }
        Update: {
          author?: string
          created_at?: string
          dims?: number[]
          id?: string
          is_demo?: boolean
          kind?: string
          moderation_note?: string | null
          reply?: string | null
          salon_id?: string
          service?: string
          status?: string
          text?: string
          title?: string
          user_id?: string
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_documents: {
        Row: {
          checked_at: string | null
          checked_by: string | null
          created_at: string
          id: string
          internal_note: string
          label: string
          salon_id: string
          status: string
          storage_path: string
        }
        Insert: {
          checked_at?: string | null
          checked_by?: string | null
          created_at?: string
          id?: string
          internal_note?: string
          label: string
          salon_id: string
          status?: string
          storage_path: string
        }
        Update: {
          checked_at?: string | null
          checked_by?: string | null
          created_at?: string
          id?: string
          internal_note?: string
          label?: string
          salon_id?: string
          status?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_documents_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salons: {
        Row: {
          archived: boolean
          area: string
          city: string
          created_at: string
          data: Json
          id: string
          is_demo: boolean
          name: string
          published: boolean
          slug: string
        }
        Insert: {
          archived?: boolean
          area: string
          city: string
          created_at?: string
          data: Json
          id: string
          is_demo?: boolean
          name: string
          published?: boolean
          slug: string
        }
        Update: {
          archived?: boolean
          area?: string
          city?: string
          created_at?: string
          data?: Json
          id?: string
          is_demo?: boolean
          name?: string
          published?: boolean
          slug?: string
        }
        Relationships: []
      }
      service_catalog: {
        Row: {
          archived: boolean
          category_id: string
          description: string
          id: string
          image: string
          is_demo: boolean
          name: string
          seo: Json
        }
        Insert: {
          archived?: boolean
          category_id: string
          description?: string
          id: string
          image?: string
          is_demo?: boolean
          name: string
          seo?: Json
        }
        Update: {
          archived?: boolean
          category_id?: string
          description?: string
          id?: string
          image?: string
          is_demo?: boolean
          name?: string
          seo?: Json
        }
        Relationships: [
          {
            foreignKeyName: "service_catalog_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "directory_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          data: Json
          id: string
        }
        Insert: {
          data?: Json
          id: string
        }
        Update: {
          data?: Json
          id?: string
        }
        Relationships: []
      }
      support_submissions: {
        Row: {
          category: string
          contact: string
          created_at: string
          id: string
          internal_note: string
          kind: string
          message: string
          name: string
          related_path: string
          status: string
          user_id: string | null
        }
        Insert: {
          category: string
          contact?: string
          created_at?: string
          id?: string
          internal_note?: string
          kind: string
          message: string
          name?: string
          related_path?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          contact?: string
          created_at?: string
          id?: string
          internal_note?: string
          kind?: string
          message?: string
          name?: string
          related_path?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string
          event: string
          id: string
          message: string
          read: boolean
          record_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          message: string
          read?: boolean
          record_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          message?: string
          read?: boolean
          record_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      published_reviews: {
        Row: {
          author: string | null
          created_at: string | null
          dims: number[] | null
          id: string | null
          is_demo: boolean | null
          kind: string | null
          reply: string | null
          salon_id: string | null
          service: string | null
          status: string | null
          text: string | null
          title: string | null
          visit_date: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
