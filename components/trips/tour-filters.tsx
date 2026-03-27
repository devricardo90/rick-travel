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
import { SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";

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
        <div className="surface-dark-solid space-y-6 p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-white/70" />
                        <h3 className="text-base font-semibold text-white">Filtros</h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/56">
                        Refine os passeios por faixa de preço, duração e perfil do roteiro.
                    </p>
                </div>
                <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/58 transition-colors hover:bg-white/[0.07] hover:text-white/82"
                >
                    <RotateCcw className="h-3 w-3" />
                    Limpar
                </button>
            </div>

            <div className="rounded-[22px] border border-white/8 bg-[#091d2c] px-4 py-3 text-sm text-white/68">
                <div className="flex items-center gap-2 text-[#d8c18f]">
                    <Sparkles className="h-4 w-4" />
                    Busca mais objetiva
                </div>
                <p className="mt-2 leading-6 text-white/56">
                    Os resultados são atualizados automaticamente conforme você ajusta os filtros.
                </p>
            </div>

            <div className="h-px bg-white/10" />

            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <Label className="text-sm text-white/72">Faixa de preço</Label>
                        <span className="text-xs text-white/46">R$ {priceRange[0]} - R$ {priceRange[1]}</span>
                    </div>
                    <Slider
                        defaultValue={[0, 5000]}
                        value={priceRange}
                        max={5000}
                        step={50}
                        onValueChange={setPriceRange}
                        className="py-4"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm text-white/72">Duração</Label>
                    <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.07] focus:ring-white/20">
                            <SelectValue placeholder="Qualquer duração" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-white/10 bg-[#10283c] text-white">
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="1">1 dia</SelectItem>
                            <SelectItem value="2">2 dias</SelectItem>
                            <SelectItem value="3">3+ dias</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm text-white/72">Nível físico</Label>
                    <Select value={physicalLevel} onValueChange={setPhysicalLevel}>
                        <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.07] focus:ring-white/20">
                            <SelectValue placeholder="Qualquer nível" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-white/10 bg-[#10283c] text-white">
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="LIGHT">Leve</SelectItem>
                            <SelectItem value="MODERATE">Moderado</SelectItem>
                            <SelectItem value="HARD">Difícil</SelectItem>
                            <SelectItem value="EXTREME">Extremo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div>
                        <Label htmlFor="children-allowed" className="cursor-pointer text-sm text-white/78">
                            Permite crianças
                        </Label>
                        <p className="mt-1 text-xs text-white/48">
                            Mostra experiências mais adequadas para famílias.
                        </p>
                    </div>
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
