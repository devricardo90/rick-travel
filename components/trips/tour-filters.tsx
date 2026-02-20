"use client";

import { Button } from "@/components/ui/button";
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
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export function TourFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [duration, setDuration] = useState<string>("all");
    const [physicalLevel, setPhysicalLevel] = useState<string>("all");
    const [childrenAllowed, setChildrenAllowed] = useState(false);

    // Debounce price to avoid too many URL updates
    const [debouncedPrice] = useDebounce(priceRange, 500);

    useEffect(() => {
        // Initial sync with URL
        const priceMin = searchParams.get("minPrice");
        const priceMax = searchParams.get("maxPrice");
        const dur = searchParams.get("duration");
        const level = searchParams.get("level");
        const children = searchParams.get("children");

        if (priceMin && priceMax) setPriceRange([Number(priceMin), Number(priceMax)]);
        if (dur) setDuration(dur);
        if (level) setPhysicalLevel(level);
        if (children === "true") setChildrenAllowed(true);
    }, []);

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
    }, [debouncedPrice, duration, physicalLevel, childrenAllowed, router]);

    return (
        <div className="space-y-6 rounded-lg border p-6 shadow-sm bg-card">
            <div>
                <h3 className="text-lg font-semibold mb-4">Filtros</h3>
                <div className="space-y-4">

                    {/* Preço */}
                    <div className="space-y-2">
                        <Label>Faixa de Preço (R$)</Label>
                        <Slider
                            defaultValue={[0, 5000]}
                            value={priceRange}
                            max={5000}
                            step={50}
                            onValueChange={setPriceRange}
                            className="py-4"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>R$ {priceRange[0]}</span>
                            <span>R$ {priceRange[1]}</span>
                        </div>
                    </div>

                    {/* Duração */}
                    <div className="space-y-2">
                        <Label>Duração (dias)</Label>
                        <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger>
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
                        <Label>Nível Físico</Label>
                        <Select value={physicalLevel} onValueChange={setPhysicalLevel}>
                            <SelectTrigger>
                                <SelectValue placeholder="Qualquer nível" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="LIGHT">Leve</SelectItem>
                                <SelectItem value="MODERATE">Moderado</SelectItem>
                                <SelectItem value="HARD">Difícil</SelectItem>
                                <SelectItem value="EXTREME">Extremo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Crianças */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="children-allowed">Permite Crianças</Label>
                        <Switch
                            id="children-allowed"
                            checked={childrenAllowed}
                            onCheckedChange={setChildrenAllowed}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
