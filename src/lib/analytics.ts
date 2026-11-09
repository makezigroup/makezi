import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
// Discovery analytics. Events stay in this browser (no analytics backend yet).
// Never put personal data (names, phones, review text) in event props.
export type EventName =
  | "search_submitted" | "search_results_viewed" | "filter_applied" | "category_selected"
  | "salon_profile_viewed" | "portfolio_viewed" | "service_details_viewed" | "reviews_viewed"
  | "review_submitted" | "review_approved" | "review_reported"
  | "review_started" | "salon_favorited" | "salon_unfavorited" | "partnership_form_submitted" | "search_result_clicked" | "service_viewed" | "whatsapp_contact_clicked" | "website_contact_clicked" | "instagram_contact_clicked"
  | "salon_added_to_favorites" | "salon_removed_from_favorites"
  | "comparison_started" | "salon_added_to_comparison" | "comparison_completed"
  | "phone_contact_clicked" | "directions_clicked" | "website_clicked" | "business_inquiry_submitted";

export interface TrackedEvent { name: EventName; at: string; props?: Record<string, string | number | boolean> | undefined }
const KEY = "mkz-events-v1";

export function track(name: EventName, props?: TrackedEvent["props"]) {
  if (typeof window === "undefined") return;
  try {
    void Promise.resolve(supabase.from("discovery_events").insert({name,props:(props ?? {}) as Json})).catch(()=>{});
    const list = getEvents();
    list.push({ name, at: new Date().toISOString(), props });
    localStorage.setItem(KEY, JSON.stringify(list.slice(-500)));
    window.dispatchEvent(new CustomEvent("mkz:track", { detail: { name, props } }));
  } catch {
    /* storage full or blocked */
  }
}

export function getEvents(): TrackedEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as TrackedEvent[];
  } catch {
    return [];
  }
}
export const clearEvents = () => localStorage.removeItem(KEY);
