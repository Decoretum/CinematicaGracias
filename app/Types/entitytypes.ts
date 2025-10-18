import { Database } from "./supabase";

export type Film = Database['public']['Tables']['film']['Row'];
export type Actor = Database['public']['Tables']['actor']['Row'];
export type Users = Database['public']['Tables']['users']['Row'];
export type Producer = Database['public']['Tables']['producer']['Row'];
export type Director = Database['public']['Tables']['director']['Row'];
export type Review = Database['public']['Tables']['review']['Row'];
export type Log = Database['public']['Tables']['logs']['Row'];
export type ParseDataResult = {
    result: string,
    metadata: any

}