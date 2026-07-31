import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ExternalLink, Shield, Building, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

interface Portal {
  name: string;
  shortName: string;
  description: string;
  url: string;
}

const UAE_INSURANCE_PORTALS: Portal[] = [
  {
    name: "Riyaiti",
    shortName: "Riyaiti",
    description: "Dubai Health Authority (DHA) portal for claims, approvals, and insurance services.",
    url: "",
  },
  {
    name: "Nextcare",
    shortName: "Nextcare",
    description: "Leading UAE health insurance third-party administrator and claims platform.",
    url: "",
  },
  {
    name: "Daman - National Health Insurance Company",
    shortName: "Daman",
    description: "UAE-based health insurer serving Abu Dhabi and Dubai residents.",
    url: "",
  },
  {
    name: "ADNIC - Abu Dhabi National Insurance Company",
    shortName: "ADNIC",
    description: "One of the largest insurance groups in the UAE.",
    url: "",
  },
  {
    name: "Sukoon (formerly Oman Insurance)",
    shortName: "Sukoon",
    description: "Major UAE health and general insurance provider.",
    url: "",
  },
  {
    name: "Tawuniya",
    shortName: "Tawuniya",
    description: "Saudi Arabian insurer with UAE operations.",
    url: "",
  },
  {
    name: "Bupa Arabia",
    shortName: "Bupa",
    description: "International health insurance provider active in the UAE.",
    url: "",
  },
  {
    name: "Saada",
    shortName: "Saada",
    description: "Abu Dhabi government health insurance program for UAE nationals.",
    url: "",
  },
  {
    name: "MaxCare",
    shortName: "MaxCare",
    description: "Third-party administrator and health benefits manager.",
    url: "",
  },
  {
    name: "Neuron",
    shortName: "Neuron",
    description: "Health insurance claims and provider management platform.",
    url: "",
  },
  {
    name: "Mubadala Health",
    shortName: "Mubadala Health",
    description: "Healthcare network with linked insurance and patient services.",
    url: "",
  },
  {
    name: "Al Buhaira National Insurance Company",
    shortName: "Al Buhaira",
    description: "Sharjah-based insurer offering health and medical coverage in the UAE.",
    url: "",
  },
  {
    name: "Orient Insurance",
    shortName: "Orient",
    description: "Part of Al-Futtaim Group, providing health and general insurance.",
    url: "",
  },
  {
    name: "Qatar Insurance Company (QIC) UAE",
    shortName: "QIC UAE",
    description: "International insurer with health and medical products in the UAE.",
    url: "",
  },
  {
    name: "Watania",
    shortName: "Watania",
    description: "UAE national insurance company offering health and general takaful.",
    url: "",
  },
  {
    name: "Dubai Insurance",
    shortName: "Dubai Insurance",
    description: "Dubai-based insurer providing health and group medical coverage.",
    url: "",
  },
  {
    name: "Emirates Insurance Company",
    shortName: "Emirates Insurance",
    description: "Abu Dhabi-based insurer with health and medical insurance plans.",
    url: "",
  },
  {
    name: "Aman Insurance",
    shortName: "Aman",
    description: "Takaful and health insurance provider operating in the UAE.",
    url: "",
  },
  {
    name: "Insurance House",
    shortName: "Insurance House",
    description: "UAE insurer offering health, medical, and general insurance solutions.",
    url: "",
  },
  {
    name: "Cigna",
    shortName: "Cigna",
    description: "Global health services company with UAE health insurance plans.",
    url: "",
  },
  {
    name: "MetLife Alico",
    shortName: "MetLife",
    description: "International insurer providing health and life coverage in the UAE.",
    url: "",
  },
  {
    name: "Axa Gulf / GIG Gulf",
    shortName: "GIG Gulf",
    description: "Major regional health and general insurer formerly known as Axa Gulf.",
    url: "",
  },
  {
    name: "National Takaful Company (Watania)",
    shortName: "Watania Takaful",
    description: "Islamic insurance (takaful) provider for health and medical plans.",
    url: "",
  },
  {
    name: "MedNet UAE",
    shortName: "MedNet",
    description: "Health benefits management and third-party administrator in the UAE.",
    url: "",
  },
  {
    name: "Pentacare",
    shortName: "Pentacare",
    description: "Healthcare management and TPA serving UAE health insurance members.",
    url: "",
  },
];

export default function InsurancePortals() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return UAE_INSURANCE_PORTALS;
    return UAE_INSURANCE_PORTALS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0B3D91] text-white shadow-md shrink-0">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">Insurance Portals</div>
              <div className="text-xs text-blue-200">UAE provider links</div>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-slate-800">UAE Insurance Portals</h1>
            <p className="text-sm text-slate-500 mt-1">
              Quick links to major UAE insurance provider portals. Add URLs when ready.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search portals (e.g. Riyaiti, Nextcare...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 pr-9 bg-white border-slate-200"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="text-xs text-slate-500 mb-3">
            {filtered.length} {filtered.length === 1 ? "portal" : "portals"} found
          </div>

          {/* Square portal grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((portal) => (
              <Card
                key={portal.shortName}
                className="border-slate-200 hover:shadow-md transition-shadow flex flex-col aspect-square justify-center"
              >
                <CardHeader className="pb-2">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0B3D91]/10 flex items-center justify-center">
                      <Building className="w-6 h-6 text-[#0B3D91]" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-800 leading-tight">
                        {portal.shortName}
                      </CardTitle>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{portal.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <a
                    href={portal.url || "#"}
                    target={portal.url ? "_blank" : undefined}
                    rel={portal.url ? "noopener noreferrer" : undefined}
                    className="inline-flex w-full"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-[#0B3D91] border-[#0B3D91]/30 hover:bg-[#0B3D91]/5"
                      disabled={!portal.url}
                    >
                      Go
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Building className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-sm">No portals match your search.</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-[#0B3D91]"
                onClick={() => setQuery("")}
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
