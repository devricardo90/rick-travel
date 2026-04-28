'use client'

import { markContactAsReadAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * RT-013E: Botão para marcar mensagem de contato como lida.
 */
export function MarkAsReadButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleMarkAsRead() {
    setLoading(true);
    try {
      const result = await markContactAsReadAction(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Mensagem marcada como lida");
      }
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Erro ao processar acao");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-primary"
      onClick={handleMarkAsRead}
      disabled={loading}
      title="Marcar como lida"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  );
}
