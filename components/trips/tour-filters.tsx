"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

export function TourFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchParamsString = searchParams.toString();
    const initialFilters = useMemo(() => {
        const params = new URLSearchParams(searchParamsString);
        const priceMin = params.get("minPrice");
        const priceMax = params.get("maxPrice");
        const dur = params.get("duration");
        const level = params.get("level");
        const children = params.get("children");

        return {
            priceRange: priceMin && priceMax ? [Number(priceMin), Number(priceMax)] : [0, 5000],
            duration: dur ?? "all",
            physicalLevel: level ?? "all",
            childrenAllowed: children === "true",
        };
    }, [searchParamsString]);

    const [priceRange, setPriceRange] = useState(initialFilters.priceRange);
    const [duration, setDuration] = useState<string>(initialFilters.duration);
    const [physicalLevel, setPhysicalLevel] = useState<string>(initialFilters.physicalLevel);
    const [childrenAllowed, setChildrenAllowed] = useState(initialFilters.childrenAllowed);

    const [debouncedPrice] = useDebounce(priceRange, 500);

    useEffect(() => {
        const syncId = setTimeout(() => {
            setPriceRange(initialFilters.priceRange);
            setDuration(initialFilters.duration);
            setPhysicalLevel(initialFilters.physicalLevel);
            setChildrenAllowed(initialFilters.childrenAllowed);
        }, 0);

        return () => clearTimeout(syncId);
    }, [initialFilters]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (debouncedPrice[0] > 0 || debouncedPrice[1] < 5000) {
            params.set("minPrice", debouncedPrice[0].toString());
            params.set("maxPrice", debouncedPrice[1].toString());
        } else {
            params.delete("minPrice");
            params.delete("maxPrice");
        }

        if (duration && duration !== "all") {
            params.set("duration", duration);
        } else {
            params.delete("duration");
        }

        if (physicalLevel && physicalLevel !== "all") {
            params.set("level", physicalLevel);
        } else {
            params.delete("level");
        }

        if (childrenAllowed) {
            params.set("children", "true");
        } else {
            params.delete("children");
        }

        router.push(`?${params.toString()}`, { scroll: false });
    }, [childrenAllowed, debouncedPrice, duration, physicalLevel, router, searchParams]);

    function handleReset() {
        setPriceRange([0, 5000]);
        setDuration("all");
        setPhysicalLevel("all");
        setChildrenAllowed(false);
    }

    return (
        <div className="card-dark p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-white/70" />
                    <h3 className="text-base font-semibold text-white">Filtros</h3>
                </div>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors"
                >
                    <RotateCcw className="h-3 w-3" />
                    Limpar
                </button>
            </div>

            {/* Separador */}
            <div className="h-px bg-white/10" />

            <div className="space-y-5">
                {/* Preço */}
                <div className="space-y-3">
                    <Label className="text-sm text-white/70">Faixa de Preço (R$)</Label>
                    <Slider
                        defaultValue={[0, 5000]}
                        value={priceRange}
                        max={5000}
                        step={50}
                        onValueChange={setPriceRange}
                        className="py-4"
                    />
                    <div className="flex justify-between text-xs text-white/50">
                        <span>R$ {priceRange[0]}</span>
                        <span>R$ {priceRange[1]}</span>
                    </div>
                </div>

                {/* Duração */}
                <div className="space-y-2">
                    <Label className="text-sm text-white/70">Duração (dias)</Label>
                    <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-white/20 hover:bg-white/10 transition-colors">
                            <SelectValue placeholder="Qualquer duração" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="1">1 dia (Bate e volta)</SelectItem>
                            <SelectItem value="2">2 dias</SelectItem>
                            <SelectItem value="3">3+ dias</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Nível Físico */}
                <div className="space-y-2">
                    <Label className="text-sm text-white/70">Nível Físico</Label>
                    <Select value={physicalLevel} onValueChange={setPhysicalLevel}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-white/20 hover:bg-white/10 transition-colors">
                            <SelectValue placeholder="Qualquer nível" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="LIGHT">🌿 Leve</SelectItem>
                            <SelectItem value="MODERATE">⚡ Moderado</SelectItem>
                            <SelectItem value="HARD">🔥 Difícil</SelectItem>
                            <SelectItem value="EXTREME">💀 Extremo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Crianças */}
                <div className="flex items-center justify-between py-1">
                    <Label htmlFor="children-allowed" className="text-sm text-white/70 cursor-pointer">
                        Permite Crianças
                    </Label>
                    <Switch
                        id="children-allowed"
                        checked={childrenAllowed}
                        onCheckedChange={setChildrenAllowed}
                    />
                </div>
            </div>
        </div>
    );
}
