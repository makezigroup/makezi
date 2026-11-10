import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, MapPin, Crosshair, ChevronDown } from "lucide-react";
import { Button, Icon } from "./core";
import { useProduct } from "@/lib/product-context";
import { usePublicSalons } from "@/lib/app-store";
import { normalizeSearch } from "@/lib/product-schemas";
import { CITIES, nearestCity } from "@/lib/data";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Suggestion = { kind: "salon" | "service" | "category"; id: string; label: string };
const KIND_LABEL = { salon: "سالن", service: "خدمت", category: "دسته" } as const;
const KIND_ICON = { salon: "salon", service: "package", category: "sort" } as const;

/** Unified hero search: one query field with database-backed autocomplete, one location popover, one lime CTA. */
export function HeroSearch() {
  const nav = useNavigate();
  const product = useProduct();
  const salons = usePublicSalons();
  const rootRef = useRef<HTMLDivElement>(null);

  const [q, setQ] = useState("");
  const [sugOpen, setSugOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [locOpen, setLocOpen] = useState(false);
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [locLabel, setLocLabel] = useState("");
  const [expanded, setExpanded] = useState("");
  const [locNote, setLocNote] = useState("");

  // Cities come from the static city list; neighborhoods are live database rows grouped by city.
  const cities = CITIES.filter((c) => product.locations.some((l) => l.city === c.slug));

  const suggestions = useMemo<Suggestion[]>(() => {
    const needle = normalizeSearch(q);
    if (!needle) return [];
    const hit = (v: string) => normalizeSearch(v).includes(needle);
    return [
      ...salons.filter((s) => hit(s.name)).slice(0, 4).map((s): Suggestion => ({ kind: "salon", id: s.id, label: s.name })),
      ...product.services.filter((s) => hit(s.name)).slice(0, 4).map((s): Suggestion => ({ kind: "service", id: s.id, label: s.name })),
      ...product.categories.filter((c) => hit(c.label)).slice(0, 3).map((c): Suggestion => ({ kind: "category", id: c.id, label: c.label })),
    ];
  }, [q, salons, product.services, product.categories]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setSugOpen(false);
        setLocOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const locSearch = { city: city || undefined, area: area || undefined };

  const submit = () => {
    track("search_submitted", { source: "home" });
    setSugOpen(false);
    setLocOpen(false);
    nav({ to: "/salons", search: { q: q.trim() || undefined, ...locSearch } });
  };

  const pick = (s: Suggestion) => {
    track("search_result_clicked", { source: "home_autocomplete", kind: s.kind });
    setSugOpen(false);
    if (s.kind === "salon") nav({ to: "/salons", search: { q: s.label, ...locSearch } });
    else if (s.kind === "service") nav({ to: "/salons", search: { service: s.id, ...locSearch } });
    else nav({ to: "/salons", search: { cat: s.id, ...locSearch } });
  };

  const pickLocation = (c: string, a: string, label: string) => {
    setCity(c);
    setArea(a);
    setLocLabel(label);
    setLocNote("");
    setLocOpen(false);
  };

  const geolocate = () => {
    setLocNote("");
    if (!("geolocation" in navigator)) {
      setLocNote("مرورگر شما موقعیت مکانی را پشتیبانی نمی‌کند.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = nearestCity(pos.coords.latitude, pos.coords.longitude);
        pickLocation(c.slug, "", c.name);
      },
      () => setLocNote("دسترسی به موقعیت مکانی داده نشد؛ شهر را دستی انتخاب کنید."),
      { timeout: 8000 },
    );
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSugOpen(false);
      return;
    }
    if (!sugOpen || !suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((v) => (v + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((v) => (v <= 0 ? suggestions.length - 1 : v - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      pick(suggestions[active]!);
    }
  };

  return (
    <div ref={rootRef} className="hero-search relative rounded-card border border-border bg-card shadow-modal">
      <form
        role="search"
        aria-label="جست‌وجوی سالن"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex flex-col gap-1.5 p-2 sm:flex-row sm:items-stretch sm:gap-1"
      >
        {/* Query field with autocomplete */}
        <div className="relative flex-1">
          <label className="flex h-full cursor-text items-center gap-2.5 rounded-input px-3 py-2.5 transition-shadow focus-within:bg-muted/60 focus-within:ring-2 focus-within:ring-pink">
            <Search className="size-5 shrink-0 text-pink" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block whitespace-nowrap text-caption font-semibold text-muted-foreground">چه چیزی دنبالش هستی؟</span>
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setSugOpen(true);
                  setActive(-1);
                }}
                onFocus={() => setSugOpen(true)}
                onKeyDown={onKeyDown}
                placeholder="مثلاً کاشت ناخن، فیشال یا نام سالن..."
                aria-label="نام سالن، خدمت یا دسته"
                aria-expanded={sugOpen && !!q.trim()}
                aria-autocomplete="list"
                role="combobox"
                className="w-full bg-transparent pt-0.5 text-body outline-none placeholder:text-muted-foreground/60"
              />
            </span>
          </label>
          {sugOpen && q.trim() && (
            <div role="listbox" aria-label="پیشنهادهای جست‌وجو" className="absolute inset-x-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-card border border-border bg-card p-2 shadow-modal">
              {suggestions.length ? (
                suggestions.map((s, i) => (
                  <button
                    key={`${s.kind}-${s.id}`}
                    type="button"
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => pick(s)}
                    className={cn("flex w-full items-center gap-2.5 rounded-input px-3 py-2.5 text-start text-body", i === active && "bg-pink-soft")}
                  >
                    <Icon name={KIND_ICON[s.kind]} size={18} className="shrink-0 text-pink" />
                    <span className="min-w-0 flex-1 truncate font-semibold">{s.label}</span>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-label text-muted-foreground">{KIND_LABEL[s.kind]}</span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-5 text-center text-caption text-muted-foreground">چیزی پیدا نشد؛ عبارت دیگری امتحان کنید.</p>
              )}
            </div>
          )}
        </div>

        {/* Location popover */}
        <div className="relative sm:w-60">
          <button
            type="button"
            onClick={() => {
              setLocOpen((v) => !v);
              setSugOpen(false);
            }}
            aria-expanded={locOpen}
            aria-label="انتخاب شهر یا محله"
            className="flex h-full w-full items-center gap-2.5 rounded-input px-3 py-2.5 text-start transition-shadow hover:bg-muted/60 focus:ring-2 focus:ring-pink"
          >
            <MapPin className="size-5 shrink-0 text-pink" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block whitespace-nowrap text-caption font-semibold text-muted-foreground">کجا؟</span>
              <span className={cn("block truncate pt-0.5 text-body", !locLabel && "text-muted-foreground/60")}>{locLabel || "انتخاب شهر یا محله"}</span>
            </span>
            <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", locOpen && "rotate-180")} aria-hidden />
          </button>
          {locOpen && (
            <div className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-card border border-border bg-card p-2 shadow-modal sm:w-72">
              <button type="button" onClick={() => pickLocation("", "", "")} className="flex w-full items-center gap-2 rounded-input px-3 py-2.5 text-start text-body font-semibold hover:bg-muted">
                همه‌جا — بدون فیلتر مکان
              </button>
              <button type="button" onClick={geolocate} className="flex w-full items-center gap-2 rounded-input px-3 py-2.5 text-start text-body font-semibold text-pink-text hover:bg-pink-soft">
                <Crosshair className="size-4" /> موقعیت فعلی من
              </button>
              {locNote && <p className="px-3 py-1 text-label text-pink-text">{locNote}</p>}
              <div className="my-1 border-t border-border" />
              {cities.map((c) => {
                const areas = product.locations.filter((l) => l.city === c.slug && l.area);
                const open = expanded === c.slug;
                return (
                  <div key={c.slug}>
                    <div className="flex items-center">
                      <button type="button" onClick={() => pickLocation(c.slug, "", c.name)} className="flex-1 rounded-input px-3 py-2.5 text-start text-body font-semibold hover:bg-muted">
                        {c.name}
                      </button>
                      {areas.length > 0 && (
                        <button type="button" aria-label={`محله‌های ${c.name}`} aria-expanded={open} onClick={() => setExpanded(open ? "" : c.slug)} className="grid size-9 place-items-center rounded-full hover:bg-muted">
                          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
                        </button>
                      )}
                    </div>
                    {open &&
                      areas.map((a) => (
                        <button key={a.id} type="button" onClick={() => pickLocation(c.slug, a.area ?? "", `${c.name}، ${a.label}`)} className="flex w-full items-center gap-2 rounded-input px-3 py-2 ps-8 text-start text-caption hover:bg-muted">
                          <MapPin className="size-3.5 text-pink" /> {a.label}
                        </button>
                      ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Button type="submit" size="lg" className="sm:self-center">
          <Icon name="search" size={20} /> جست‌وجوی سالن‌ها
        </Button>
      </form>
    </div>
  );
}
