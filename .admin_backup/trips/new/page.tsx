import TripForm from "@/components/admin/trip-form";

export default function NewTripPage() {
    return (
        <div className="mx-auto max-w-5xl px-6 py-8 md:py-10">
            <div className="mb-8 rounded-[30px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-8">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
                    Novo passeio
                </div>
                <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                    Criar Nova Viagem
                </h1>
                <p className="mt-4 max-w-3xl text-[15px] leading-8 text-white/64 md:text-lg">
                    Cadastre um novo passeio com estrutura editorial mais clara, sem alterar o fluxo de criacao ja existente.
                </p>
            </div>

            <TripForm />
        </div>
    );
}
