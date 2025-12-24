"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { X, SlidersHorizontal, MapPin, Calendar, BookOpen, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { EducationId, MaritalStatusId } from "@/lib/mock-data";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export interface FilterState {
  ageRange: [number, number];
  maxDistance: number;
  education?: EducationId;
  maritalStatus?: MaritalStatusId;
}

export function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [40, 65],
    maxDistance: 50,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 border-purple-100">
        <div className="p-6 sticky top-0 bg-white z-10 border-b flex justify-between items-center">
          <div className="flex items-center gap-2 text-purple-700">
            <SlidersHorizontal className="w-6 h-6" />
            <Typography variant="h3">Filtrele</Typography>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Age Range */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-purple-500" />
              <Typography variant="h3" className="text-lg">Yaş Aralığı</Typography>
            </div>
            <div className="px-2">
              <input
                type="range"
                min="40"
                max="80"
                value={filters.ageRange[1]}
                onChange={(e) => setFilters({ ...filters, ageRange: [filters.ageRange[0], parseInt(e.target.value)] })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between mt-2 text-lg font-medium text-gray-600">
                <span>{filters.ageRange[0]}</span>
                <span>{filters.ageRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5 text-purple-500" />
              <Typography variant="h3" className="text-lg">Mesafe</Typography>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[10, 25, 50, 100].map((km) => (
                <button
                  key={km}
                  onClick={() => setFilters({ ...filters, maxDistance: km })}
                  className={cn(
                    "px-4 py-2 rounded-xl border-2 text-lg font-medium transition-all",
                    filters.maxDistance === km
                      ? "border-purple-600 bg-purple-50 text-purple-700"
                      : "border-gray-200 text-gray-600 hover:border-purple-200"
                  )}
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>

          {/* Marital Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Heart className="w-5 h-5 text-purple-500" />
              <Typography variant="h3" className="text-lg">Medeni Durum</Typography>
            </div>
            <select
              className="w-full h-14 rounded-xl border border-gray-300 px-4 text-lg bg-white"
              onChange={(e) => setFilters({ ...filters, maritalStatus: e.target.value as MaritalStatusId })}
              value={filters.maritalStatus || ""}
            >
              <option value="">Farketmez</option>
              <option value="ms_single">Hiç Evlenmemiş</option>
              <option value="ms_divorced">Boşanmış</option>
              <option value="ms_private">Eşi Vefat Etmiş</option>
            </select>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <Typography variant="h3" className="text-lg">Eğitim</Typography>
            </div>
            <select
              className="w-full h-14 rounded-xl border border-gray-300 px-4 text-lg bg-white"
              onChange={(e) => setFilters({ ...filters, education: e.target.value as EducationId })}
              value={filters.education || ""}
            >
              <option value="">Farketmez</option>
              <option value="edu_highschool">Lise</option>
              <option value="edu_associates">Ön Lisans</option>
              <option value="edu_bachelors">Lisans</option>
              <option value="edu_masters">Yüksek Lisans</option>
            </select>
          </div>

        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-4 sticky bottom-0">
          <Button variant="ghost" onClick={onClose} className="flex-1 h-14 text-lg">
            Vazgeç
          </Button>
          <Button onClick={() => { onApply(filters); onClose(); }} className="flex-[2] h-14 text-lg bg-purple-700 hover:bg-purple-800">
            Uygula
          </Button>
        </div>
      </Card>
    </div>
  );
}
