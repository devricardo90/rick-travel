import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ContactActions } from "@/components/admin/contact-actions";

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

    const where: Prisma.ContactSubmissionWhereInput = {};
    const andFilters: Prisma.ContactSubmissionWhereInput[] = [];

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
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Contatos recebidos</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Acompanhe mensagens enviadas pelo formulario do site.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:w-[320px]">
                        <div className="rounded-xl border bg-card px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-muted-foreground">Total</div>
                            <div className="mt-1 text-2xl font-bold">{totalContacts}</div>
                        </div>
                        <div className="rounded-xl border bg-card px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-muted-foreground">Pendentes</div>
                            <div className="mt-1 text-2xl font-bold">{pendingContacts}</div>
                        </div>
                    </div>
                </div>

                <form className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-5">
                    <input
                        type="text"
                        name="q"
                        defaultValue={q}
                        placeholder="Buscar por nome, email ou mensagem..."
                        className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                    />

                    <select
                        name="status"
                        defaultValue={status ?? ""}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todos status</option>
                        <option value="PENDING">Pendente</option>
                        <option value="READ">Lido</option>
                        <option value="REPLIED">Respondido</option>
                    </select>

                    <input
                        type="date"
                        name="dateFrom"
                        defaultValue={dateFrom}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <input
                        type="date"
                        name="dateTo"
                        defaultValue={dateTo}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <div className="flex gap-2 md:col-span-5 md:justify-end">
                        <a
                            href="?"
                            className="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-muted/40"
                        >
                            Limpar
                        </a>
                        <button
                            type="submit"
                            className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Filtrar
                        </button>
                    </div>
                </form>
            </div>

            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                        <tr>
                            <th className="py-4 px-4">Contato</th>
                            <th className="py-4 px-4">Mensagem</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4">Recebido em</th>
                            <th className="py-4 px-4 text-right">Acoes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {contacts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-10 px-4 text-center text-muted-foreground">
                                    Nenhum contato encontrado.
                                </td>
                            </tr>
                        ) : (
                            contacts.map((contact) => (
                                <tr key={contact.id} className="align-top hover:bg-muted/30 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="font-semibold text-foreground">{contact.name}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{contact.email}</div>
                                        {contact.phone ? (
                                            <div className="text-xs text-muted-foreground mt-1">{contact.phone}</div>
                                        ) : null}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="max-w-xl whitespace-pre-wrap text-foreground/90">
                                            {contact.message}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                contact.status === "REPLIED"
                                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                                    : contact.status === "READ"
                                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                                                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                            }`}
                                        >
                                            {contact.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-xs text-muted-foreground">
                                        {new Date(contact.createdAt).toLocaleString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <ContactActions
                                            contactId={contact.id}
                                            currentStatus={contact.status}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
