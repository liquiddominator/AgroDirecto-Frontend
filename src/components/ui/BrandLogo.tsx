import type { FC } from "react";

type LeafIconProps = {
  className?: string;
};

export const LeafIcon: FC<LeafIconProps> = ({ className = "h-6 w-6" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 19H4c.44-.87 1.71-3 3-4 1.42 4.37 6.05 6 10 4-3.18 1.55-7.9.98-10-1.5.6 1.32 1 2.5 1 4H6c0-2.39-1-4-1-4S2 17 2 21h2c0-3.5 1-5 2-8 1.12 5.33 5.5 7.5 10 7.5 0 0-5-1-7-7 2 4 6 5 8 4-4-2-5-6-5-9 2 3 4 5 8 5-3-1-5-4-6-7 3 2 7 2 9 0z" />
    </svg>
  );
};

type BrandLogoProps = {
  tagline?: string;
};

const BrandLogo: FC<BrandLogoProps> = ({
  tagline = "Del campo a tu negocio, sin intermediarios",
}) => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-800 text-white shadow-lg shadow-green-900/20">
          <LeafIcon />
        </span>
        <span className="font-display text-2xl font-bold text-green-950">
          Agro<span className="text-amber-600">Directo</span>
        </span>
      </div>
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-green-700">
        {tagline}
      </p>
    </header>
  );
};

export default BrandLogo;