import { prisma } from "@/lib/prisma";
import { ContactActions } from "@/components/admin/contact-actions";

type ContactSubmissionWhereInput = NonNullable<NonNullable<Parameters<typeof prisma.contactSubmission.findMany>[0]>["where"]>;

function buildDateRange(dateFrom?: string, dateTo?: string) {
    const createdAt: { gte?: Date; lte?: Date } = {};

    if (dateFrom) {
        const start = new Date(`${dateFrom}T00:00:00`);
        if (!Number.isNaN(start.getTime())) {
            createdAt.gte = start;
        }
    }

    if (dateTo) {
        const end = new Date(`${dateTo}T23:59:59.999`);
        if (!Number.isNaN(end.getTime())) {
            createdAt.lte = end;
        }
    }

    return Object.keys(createdAt).length > 0 ? createdAt : undefined;
}

function contactStatusClass(status: string) {
    if (status === "REPLIED") return "border-emerald-400/18 bg-emerald-500/10 text-emerald-200";
    if (status === "READ") return "border-sky-400/18 bg-sky-500/10 text-sky-200";
    return "border-amber-400/18 bg-amber-500/10 text-amber-200";
}

export default async function AdminContactsPage({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
    }>;
}) {
    const { q, status, dateFrom, dateTo } = await searchParams;

    const where: ContactSubmissionWhereInput = {};
    const andFilters: ContactSubmissionWhereInput[] = [];

    if (q) {
        andFilters.push({
            OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { message: { contains: q, mode: "insensitive" } },
            ],
        });
    }

    if (status) {
        andFilters.push({ status });
    }

    const createdAt = buildDateRange(dateFrom, dateTo);
    if (createdAt) {
        andFilters.push({ createdAt });
    }

    if (andFilters.length > 0) {
        where.AND = andFilters;
    }

    const contacts = await prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    const totalContacts = await prisma.contactSubmission.count();
    const pendingContacts = await prisma.contactSubmission.count({
        where: { status: "PENDING" },
    });

    return (
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
            <div className="mb-8 rounded-[30px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
                            Atendimento e triagem
                        </div>
                        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                            Contatos recebidos
                        </h1>
                        <p className="mt-4 max-w-3xl text-[15px] leading-8 text-white/64 md:text-lg">
                            Acompanhe as mensagens enviadas pelo formulario do site com mais clareza para leitura, resposta e organizacao do atendimento.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:w-[340px]">
                        <div className="rounded-[24px] border border-white/8 bg-[#091d2c] px-4 py-4">
                            <div className="text-[11px] uppercase tracking-[0.14em] text-white/44">Total</div>
                            <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{totalContacts}</div>
                        </div>
                        <div className="rounded-[24px] border border-white/8 bg-[#091d2c] px-4 py-4">
                            <div className="text-[11px] uppercase tracking-[0.14em] text-white/44">Pendentes</div>
                            <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{pendingContacts}</div>
                        </div>
                    </div>
                </div>
            </div>

            <form className="mb-6 grid gap-3 rounded-[28px] border border-white/8 bg-[#0d2436] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:grid-cols-5">
                <input
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="Buscar por nome, email ou mensagem..."
                    className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/34 hover:bg-white/[0.06] focus:border-white/18 md:col-span-2"
                />

                <select
                    name="status"
                    defaultValue={status ?? ""}
                    className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-white/18"
                >
                    <option value="" className="text-slate-900">Todos status</option>
                    <option value="PENDING" className="text-slate-900">Pendente</option>
                    <option value="READ" className="text-slate-900">Lido</option>
                    <option value="REPLIED" className="text-slate-900">Respondido</option>
                </select>

                <input
                    type="date"
                    name="dateFrom"
                    defaultValue={dateFrom}
                    className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-white/18"
                />

                <input
                    type="date"
                    name="dateTo"
                    defaultValue={dateTo}
                    className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-white/18"
                />

                <div className="flex gap-2 md:col-span-5 md:justify-end">
                    <a
                        href="?"
                        className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
                    >
                        Limpar
                    </a>
                    <button
                        type="submit"
                        className="h-12 rounded-2xl bg-[#123a28] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#184731]"
                    >
                        Filtrar
                    </button>
                </div>
            </form>

            <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[#0d2436] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                <div className="hidden grid-cols-[1fr_1.8fr_0.65fr_0.85fr_0.75fr] gap-4 border-b border-white/8 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 lg:grid">
                    <div>Contato</div>
                    <div>Mensagem</div>
                    <div>Status</div>
                    <div>Recebido em</div>
                    <div className="text-right">Acoes</div>
                </div>

                {contacts.length === 0 ? (
                    <div className="px-5 py-10 text-center text-sm text-white/56">
                        Nenhum contato encontrado.
                    </div>
                ) : (
                    <div className="divide-y divide-white/8">
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="grid gap-5 px-5 py-5 transition-colors hover:bg-white/[0.02] lg:grid-cols-[1fr_1.8fr_0.65fr_0.85fr_0.75fr] lg:items-start"
                            >
                                <div>
                                    <div className="font-semibold text-white">{contact.name}</div>
                                    <div className="mt-1 text-xs text-white/50">{contact.email}</div>
                                    {contact.phone ? (
                                        <div className="mt-1 text-xs text-white/42">{contact.phone}</div>
                                    ) : null}
                                </div>

                                <div>
                                    <div className="max-w-2xl whitespace-pre-wrap text-sm leading-7 text-white/72">
                                        {contact.message}
                                    </div>
                                </div>

                                <div>
                                    <span
                                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${contactStatusClass(contact.status)}`}
                                    >
                                        {contact.status}
                                    </span>
                                </div>

                                <div className="text-xs leading-6 text-white/46">
                                    {new Date(contact.createdAt).toLocaleString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>

                                <div className="lg:justify-self-end">
                                    <ContactActions
                                        contactId={contact.id}
                                        currentStatus={contact.status}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
