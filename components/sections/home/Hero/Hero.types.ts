export type HeroCta = {
  readonly label: string;
  readonly href: string;
};

export type HeroData = {
  readonly eyebrow: string;
  readonly headlineLine1: string;
  readonly headlineLine2: string;
  readonly subtext: string;
  readonly primaryCta: HeroCta;
  readonly secondaryCta: HeroCta;
};

export type HeroProps = {
  readonly className?: string;
};
