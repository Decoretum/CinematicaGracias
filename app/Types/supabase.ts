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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      actor: {
        Row: {
          birthday: string
          description: string
          first_name: string
          id: number
          img: string | null
          last_name: string
          sex: string
          socmed: string[] | null
        }
        Insert: {
          birthday: string
          description: string
          first_name: string
          id?: number
          img?: string | null
          last_name: string
          sex: string
          socmed?: string[] | null
        }
        Update: {
          birthday?: string
          description?: string
          first_name?: string
          id?: number
          img?: string | null
          last_name?: string
          sex?: string
          socmed?: string[] | null
        }
        Relationships: []
      }
      director: {
        Row: {
          birthday: string
          description: string
          first_name: string
          id: number
          img: string | null
          last_name: string
          sex: string
        }
        Insert: {
          birthday: string
          description: string
          first_name: string
          id?: number
          img?: string | null
          last_name: string
          sex: string
        }
        Update: {
          birthday?: string
          description?: string
          first_name?: string
          id?: number
          img?: string | null
          last_name?: string
          sex?: string
        }
        Relationships: []
      }
      film: {
        Row: {
          actor_fk: number | null
          average_user_rating: number
          content_rating: string | null
          date_released: string
          description: string
          director_fk: number | null
          duration: number
          frame_rate: number | null
          genres: string[]
          id: number
          img: string | null
          name: string
        }
        Insert: {
          actor_fk?: number | null
          average_user_rating?: number
          content_rating?: string | null
          date_released: string
          description: string
          director_fk?: number | null
          duration: number
          frame_rate?: number | null
          genres: string[]
          id?: number
          img?: string | null
          name: string
        }
        Update: {
          actor_fk?: number | null
          average_user_rating?: number
          content_rating?: string | null
          date_released?: string
          description?: string
          director_fk?: number | null
          duration?: number
          frame_rate?: number | null
          genres?: string[]
          id?: number
          img?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "film_actor_fk_fkey"
            columns: ["actor_fk"]
            isOneToOne: false
            referencedRelation: "actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "film_director_fk_fkey"
            columns: ["director_fk"]
            isOneToOne: false
            referencedRelation: "director"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          content: string
          id: number
          user_fk: number | null
        }
        Insert: {
          content: string
          id?: number
          user_fk?: number | null
        }
        Update: {
          content?: string
          id?: number
          user_fk?: number | null
        }
        Relationships: []
      }
      producer: {
        Row: {
          birthday: string
          description: string
          film_fk: number | null
          first_name: string
          id: number
          img: string | null
          last_name: string
          sex: string
        }
        Insert: {
          birthday: string
          description: string
          film_fk?: number | null
          first_name: string
          id?: number
          img?: string | null
          last_name: string
          sex: string
        }
        Update: {
          birthday?: string
          description?: string
          film_fk?: number | null
          first_name?: string
          id?: number
          img?: string | null
          last_name?: string
          sex?: string
        }
        Relationships: [
          {
            foreignKeyName: "producer_film_pk_fkey"
            columns: ["film_fk"]
            isOneToOne: false
            referencedRelation: "film"
            referencedColumns: ["id"]
          },
        ]
      }
      review: {
        Row: {
          content: string
          date_created: string
          date_updated: string | null
          film_fk: number | null
          id: number
          rating: number
          users_fk: string | null
        }
        Insert: {
          content: string
          date_created: string
          date_updated?: string | null
          film_fk?: number | null
          id?: number
          rating: number
          users_fk?: string | null
        }
        Update: {
          content?: string
          date_created?: string
          date_updated?: string | null
          film_fk?: number | null
          id?: number
          rating?: number
          users_fk?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_film_fk_fkey"
            columns: ["film_fk"]
            isOneToOne: false
            referencedRelation: "film"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_users_fk_fkey"
            columns: ["users_fk"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          birthday: string
          first_name: string
          id: string
          is_admin: boolean
          last_name: string
          password: string
          sex: string
          username: string
        }
        Insert: {
          birthday: string
          first_name: string
          id: string
          is_admin: boolean
          last_name: string
          password: string
          sex: string
          username: string
        }
        Update: {
          birthday?: string
          first_name?: string
          id?: string
          is_admin?: boolean
          last_name?: string
          password?: string
          sex?: string
          username?: string
        }
        Relationships: []
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
