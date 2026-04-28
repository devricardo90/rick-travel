import { prisma } from "@/lib/prisma";

/**
 * RT-013D: Admin Contacts Read-Only
 * Service para gerenciar operações de contatos e submissões de formulário.
 */

/**
 * Busca todas as mensagens de contato ordenadas por data de criação (mais recentes primeiro).
 */
export async function listAllContacts() {
    return prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
    });
}

/**
 * Marca uma mensagem de contato como lida.
 */
export async function markContactAsRead(id: string) {
    return prisma.contactSubmission.update({
        where: { id },
        data: { status: "READ" },
    });
}
