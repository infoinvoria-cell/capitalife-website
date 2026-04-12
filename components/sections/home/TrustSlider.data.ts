export type TrustLogo = {
  readonly src: string;
  readonly alt: string;
};

export const trustSliderLabel = "Bekannt aus" as const;

/** Reference order: darwinex → vantage → TradingView → myfxbook */
export const trustSliderLogos: readonly TrustLogo[] = [
  { src: "/darwinex.png", alt: "Darwinex" },
  { src: "/vantage.png", alt: "Vantage" },
  { src: "/tradingview.png", alt: "TradingView" },
  { src: "/myfxbook.png", alt: "Myfxbook" },
] as const;
