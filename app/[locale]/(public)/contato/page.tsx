
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: 'Contato e Orçamento | Rick Travel',
  description:
    'Solicite orçamento para passeios no Rio de Janeiro com guias credenciados Cadastur. Entre em contato conosco.',
  openGraph: {
    title: 'Contato e Orçamento | Rick Travel',
    description: 'Solicite orçamento para passeios no Rio de Janeiro com guias credenciados Cadastur.',
    url: 'https://ricktravel.com.br/contato',
    siteName: 'Rick Travel',
    locale: 'pt_BR',
    type: 'website',
  },
}


export default function ContatoPage() {
  return (
    <main className="container mx-auto max-w-5xl px-6 pt-32 pb-20">
      <div className="flex flex-col items-center justify-center">
        <ContactForm />
      </div>
    </main>
  );
}
