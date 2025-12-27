"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, SlidersHorizontal, MapPin, Calendar, BookOpen, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { EducationId, MaritalStatusId } from "@/lib/constants";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { getMaritalStatuses, getEducations } from "@/lib/actions/contentActions";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

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
  const { language } = useAppStore();
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [40, 65],
    maxDistance: 50,
  });

  const [maritalStatusesList, setMaritalStatusesList] = useState<string[]>([]);
  const [educationsList, setEducationsList] = useState<string[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      const [dbMarital, dbEdu] = await Promise.all([
        getMaritalStatuses(),
        getEducations()
      ]);
      setMaritalStatusesList(dbMarital || []);
      setEducationsList(dbEdu || []);
    };
    if (isOpen) {
      loadContent();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            <h3 className="text-xl font-semibold">Filtreleme</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto">
          {/* Age Range */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              {getLabel('age_range', language)}
            </Label>
            <div className="px-2">
              <input
                type="range"
                min="40"
                max="80"
                value={filters.ageRange[1]}
                onChange={(e) => setFilters({ ...filters, ageRange: [filters.ageRange[0], parseInt(e.target.value)] })}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{filters.ageRange[0]}</span>
                <span>{filters.ageRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Distance */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              {getLabel('max_distance', language)}
            </Label>
            <div className="flex gap-2 flex-wrap">
              {[10, 25, 50, 100].map((km) => (
                <Button
                  key={km}
                  variant={filters.maxDistance === km ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters({ ...filters, maxDistance: km })}
                >
                  {km} km
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Marital Status */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-muted-foreground" />
              {getLabel('maritalStatus', language)}
            </Label>
            <Select
              value={filters.maritalStatus || "all"}
              onValueChange={(val) => setFilters({ ...filters, maritalStatus: val === "all" ? undefined : (val as MaritalStatusId) })}
            >
              <SelectTrigger>
                <SelectValue placeholder={getLabel('select_all', language)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getLabel('select_all', language)}</SelectItem>
                {maritalStatusesList.map(s => <SelectItem key={s} value={s}>{getLabel(s, language)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              {getLabel('education', language)}
            </Label>
            <Select
              value={filters.education || "all"}
              onValueChange={(val) => setFilters({ ...filters, education: val === "all" ? undefined : (val as EducationId) })}
            >
              <SelectTrigger>
                <SelectValue placeholder={getLabel('select_all', language)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getLabel('select_all', language)}</SelectItem>
                {educationsList.map(e => <SelectItem key={e} value={e}>{getLabel(e, language)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-6 border-t flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            İptal
          </Button>
          <Button onClick={() => { onApply(filters); onClose(); }} className="flex-[2]">
            Filtreleri Uygula
          </Button>
        </div>
      </Card>
    </div>
  );
}
