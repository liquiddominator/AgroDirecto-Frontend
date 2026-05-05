import heroImage from "../../assets/hero.png";
import BrandLogo from "../ui/BrandLogo";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  tagline?: string;
};

export default function AuthLayout({ children, tagline }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-stone-50 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-green-950 lg:block">
          <img
            className="h-full w-full object-cover opacity-80"
            src={heroImage}
            alt="Productos agrícolas frescos"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/45 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
            <p className="max-w-xl text-4xl font-bold leading-tight">
              Una plataforma simple para conectar productores, compradores y transporte.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-[520px]">
            <BrandLogo tagline={tagline} />
            <div className="mt-7 rounded-lg border border-green-900/10 bg-white p-6 shadow-xl shadow-green-950/10 sm:p-8">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}