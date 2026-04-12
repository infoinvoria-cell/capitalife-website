"use client";

import { useEffect, useRef } from "react";

import { useLanguage, type Lang } from "@/lib/i18n/language";
import raw from "./Strategy.module.css";

type AssetRow = {
  iconSrc: string;
  title: string;
  sub: string;
};

type MethodRow = {
  iconSrc: string;
  title: string;
  desc: string;
};

type TradeCard = {
  iconSrc: string;
  name: string;
  category: string;
  perf: string;
  perfColor: string;
  signalIconSrc: string;
  slot: "top" | "upper" | "center" | "lower";
};

type SectionCopy = {
  badge: string;
  headline: string;
  intro: string;
  assets: AssetRow[];
  providerLabel: string;
  howTitle: string;
  howText: string;
  methods: MethodRow[];
};

function s(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

const COPY: Record<Lang, SectionCopy> = {
  en: {
    badge: "Institutional-Grade Investing",
    headline: "Investing in Global Markets",
    intro:
      "A systematic quantitative macro strategy combining data-driven models, predefined execution rules and disciplined risk control across currencies, indices, commodities and metals.",
    assets: [
      { iconSrc: "/Forex.png", title: "Forex", sub: "EUR, USD, JPY . . ." },
      { iconSrc: "/Indices.png", title: "Indices", sub: "S&P500, DAX40 . . ." },
      { iconSrc: "/Commodities.png", title: "Commodities", sub: "OJ, Sugar, Oil . . ." },
      { iconSrc: "/metals.png", title: "Metals", sub: "Gold, Copper . . ." },
      { iconSrc: "/Stocks.png", title: "Stocks", sub: "AAPL, META . . ." },
    ],
    providerLabel: "Institutional-grade market data",
    howTitle: "How We Operate",
    howText:
      "Multiple uncorrelated models across macro, technical and regime signals. Systematic execution with portfolio-level risk control, dynamic exposure adjustment and staged drawdown protection.",
    methods: [
      { iconSrc: "/valuation.png", title: "Valuation", desc: "Fair value & pricing models" },
      { iconSrc: "/seasonality.png", title: "Seasonality", desc: "Calendar & cyclical patterns" },
      { iconSrc: "/macro.png", title: "Macro", desc: "Global macro signal integration" },
      { iconSrc: "/supply und demand.png", title: "Supply & Demand", desc: "Order flow & market structure" },
      { iconSrc: "/quant.png", title: "Quant Execution", desc: "Algorithmic rule-based entry & exit" },
      { iconSrc: "/mathematical.png", title: "Mathematical Models", desc: "Monte Carlo Simulation & more" },
    ],
  },
  de: {
    badge: "Institutional-Grade Investing",
    headline: "Investieren in globale Märkte",
    intro:
      "Eine systematische, quantitative Makrostrategie, die datengetriebene Modelle, klar definierte Ausführungsregeln und diszipliniertes Risikomanagement über Währungen, Indizes, Rohstoffe und Metalle kombiniert.",
    assets: [
      { iconSrc: "/Forex.png", title: "Forex", sub: "EUR, USD, JPY . . ." },
      { iconSrc: "/Indices.png", title: "Indizes", sub: "S&P500, DAX40 . . ." },
      { iconSrc: "/Commodities.png", title: "Rohstoffe", sub: "OJ, Zucker, Öl . . ." },
      { iconSrc: "/metals.png", title: "Metalle", sub: "Gold, Kupfer . . ." },
      { iconSrc: "/Stocks.png", title: "Aktien", sub: "AAPL, META . . ." },
    ],
    providerLabel: "Institutionelle Marktdaten in Profiqualität",
    howTitle: "Wie wir arbeiten",
    howText:
      "Mehrere unkorrelierte Modelle über Makro-, technische und Regime-Signale. Systematische Umsetzung mit Portfolio-Risikokontrolle, dynamischer Exposure-Anpassung und gestaffeltem Drawdown-Schutz.",
    methods: [
      { iconSrc: "/valuation.png", title: "Valuation", desc: "Fair value & pricing models" },
      { iconSrc: "/seasonality.png", title: "Seasonality", desc: "Calendar & cyclical patterns" },
      { iconSrc: "/macro.png", title: "Macro", desc: "Global macro signal integration" },
      { iconSrc: "/supply und demand.png", title: "Supply & Demand", desc: "Order flow & market structure" },
      { iconSrc: "/quant.png", title: "Quant Execution", desc: "Algorithmic rule-based entry & exit" },
      { iconSrc: "/mathematical.png", title: "Mathematical Models", desc: "Monte Carlo Simulation & more" },
    ],
  },
};

const TRADE_CARDS: TradeCard[] = [
  {
    iconSrc: "/british pound.png",
    name: "British Pound",
    category: "Forex",
    perf: "+1.200$ (+1.2%)",
    perfColor: "#22c55e",
    signalIconSrc: "/Profit.png",
    slot: "top",
  },
  {
    iconSrc: "/orange.png",
    name: "Orange Juice",
    category: "Commodities",
    perf: "+1.950$ (+1.9%)",
    perfColor: "#22c55e",
    signalIconSrc: "/Profit.png",
    slot: "upper",
  },
  {
    iconSrc: "/Apple.png",
    name: "Apple",
    category: "Stocks",
    perf: "-1.000$ (-1.0%)",
    perfColor: "#ef4444",
    signalIconSrc: "/Loss.png",
    slot: "center",
  },
  {
    iconSrc: "/Indices.png",
    name: "DAX40",
    category: "Indices",
    perf: "+25$ (+0%)",
    perfColor: "#3b82f6",
    signalIconSrc: "/Breakeven.png",
    slot: "lower",
  },
];

function useReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cls = s("reveal");
    const vis = s("visible");
    const items = el.querySelectorAll(`.${cls}`);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add(vis);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
    );

    items.forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, []);

  return ref;
}

export default function Strategy() {
  const { lang } = useLanguage();
  const copy = COPY[lang];
  const wrapRef = useReveal();
  const R = s("reveal");
  const slotClass: Record<TradeCard["slot"], string> = {
    top: s("tradeCardTop"),
    upper: s("tradeCardUpper"),
    center: s("tradeCardCenter"),
    lower: s("tradeCardLower"),
  };

  return (
    <section className={s("section")} id="strategy" ref={wrapRef}>
      <div className={s("sectionBg")} aria-hidden />

      <div className={s("inner")}>
        <div className={s("grid")}>
          <div className={s("left")}>
            <div className={`${s("pill")} ${R}`}>
              <span className={s("pillDot")} />
              <span className={s("pillText")}>{copy.badge}</span>
            </div>

            <h2 className={`${s("headline")} ${R}`}>{copy.headline}</h2>

            <p className={`${s("desc")} ${s("descLead")} ${R}`}>{copy.intro}</p>

            <div className={s("assetGrid")}>
              {copy.assets.map((asset) => (
                <div
                  key={asset.title}
                  className={s("assetCard")}
                >
                  <span className={s("assetIcon")}>
                    <img src={asset.iconSrc} alt="" className={s("iconPng")} width={22} height={22} />
                  </span>
                  <div>
                    <span className={s("assetTitle")}>{asset.title}</span>
                    <span className={s("assetSub")}>{asset.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={`${s("providers")} ${R}`}>
              <span className={s("provLabel")}>{copy.providerLabel}</span>
              <div className={s("provLogos")}>
                <img className={s("provLogo")} src="/Tradingview.png" alt="TradingView" />
                <img className={s("provLogo")} src="/Nasdaq.png" alt="Nasdaq" />
              </div>
            </div>

            <h3 className={`${s("h3")} ${R}`}>{copy.howTitle}</h3>

            <p className={`${s("desc")} ${s("descTight")} ${R}`}>{copy.howText}</p>

            <div className={s("methodGrid")}>
              {copy.methods.map((method, i) => (
                <div key={method.title} className={`${s("methodCard")} ${R}`} style={{ transitionDelay: `${i * 60}ms` }}>
                  <span className={s("methodIcon")}>
                    <img src={method.iconSrc} alt="" className={s("iconPng")} width={22} height={22} />
                  </span>
                  <div>
                    <span className={s("methodTitle")}>{method.title}</span>
                    <span className={s("methodDesc")}>{method.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={s("right")}>
            <div className={s("globeStage")} aria-hidden>
              <div className={s("globe")}>
                <div className={s("globeAura")} />
                <div className={s("globeMap")}>
                  <div className={s("globeMapTrack")}>
                    <div className={s("globeMapLayer")} />
                    <div className={s("globeMapLayer")} />
                  </div>
                </div>
                <div className={s("globeShade")} />
              </div>
            </div>

            {TRADE_CARDS.map((card, i) => (
              <div
                key={card.name}
                className={`${s("tradeCard")} ${slotClass[card.slot]} ${R}`}
                style={{
                  transitionDelay: `${260 + i * 120}ms`,
                  animationDelay: `${-i * 1.5}s`,
                }}
              >
                <span className={s("tradeIcon")}>
                  <img src={card.iconSrc} alt="" className={s("tradeIconPng")} width={22} height={22} />
                </span>
                <div className={s("tradeInfo")}>
                  <span className={s("tradeName")}>{card.name}</span>
                  <span className={s("tradeCat")}>{card.category}</span>
                  <span className={s("tradePerf")} style={{ color: card.perfColor }}>
                    {card.perf}
                  </span>
                </div>
                <span className={s("tradeSignal")}>
                  <img src={card.signalIconSrc} alt="" className={s("tradeSignalPng")} width={40} height={22} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
