import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071826] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(1200px 560px at 50% -10%, rgba(255,255,255,0.08), transparent 58%), linear-gradient(180deg, rgba(200,168,107,0.05) 0%, transparent 18%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
        <section className="w-full rounded-[34px] border border-white/8 bg-[#0d2436] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-10">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
            Rick Travel
          </div>

          <h1 className="mt-6 max-w-[12ch] text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
            Turismo receptivo no Rio com apresentacao mais profissional
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] leading-8 text-white/64 md:text-lg">
            Esta rota raiz nao era a home real do produto e ainda estava com o scaffold padrao do Next.js.
            Agora ela funciona como uma entrada limpa para o site localizado, mantendo o projeto mais coerente visualmente.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pt"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#123a28] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#184731]"
            >
              Entrar no site
            </Link>
            <Link
              href="/pt/contato"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              Falar com a equipe
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
