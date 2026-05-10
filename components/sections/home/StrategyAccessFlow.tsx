"use client";

import type { ReactNode } from "react";

import raw from "./StrategyAccess.module.css";

function c(n: string): string {
  return (raw as Record<string, string>)[n] ?? "";
}

export type StrategyAccessDiagramCopy = {
  investor: string;
  investment: string;
  investmentEx: string;
  risk: string;
  riskEx: string;
  cfs: string;
  cfsEx: string;
  outInv: string;
  outInvEx: string;
  outCap: string;
  outCapEx: string;
  figNote: string;
};

type Props = {
  diagram: StrategyAccessDiagramCopy;
  visible: boolean;
};

function IcUser(): ReactNode {
  return (
    <svg className={c("saIco")} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 11.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM5 20.2v-1.1a4.3 4.3 0 0 1 4.2-4.3h5.6a4.3 4.3 0 0 1 4.2 4.3v1.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IcWallet(): ReactNode {
  return (
    <svg className={c("saIco")} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7.2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.2z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M4 9.5h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M16.5 14.2h.01"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IcGauge(): ReactNode {
  return (
    <svg className={c("saIco")} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.2 15.1A8.2 8.2 0 0 1 19.8 15"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M12 13.2l3.2-5.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function IcLayers(): ReactNode {
  return (
    <svg className={c("saIco")} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.2l8 4.6-8 4.6-8-4.6 8-4.6z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M4 11.4l8 4.6 8-4.6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M4 15.4l8 4.6 8-4.6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function IcPercent(): ReactNode {
  return (
    <svg className={c("saIco")} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 15l10-10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8.5" cy="8.5" r="1.6" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

function IcShieldBadge(): ReactNode {
  return (
    <svg className={c("saIco")} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5l7 3.2v5.5c0 4.2-2.7 8.1-7 9.2-4.3-1.1-7-5-7-9.2V5.7l7-3.2z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M9 11l2 2 4-4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StrategyAccessFlow({ diagram, visible }: Props) {
  const wrapClass = `${c("saFlow")}${visible ? ` ${c("saFlowVisible")}` : ""}`;

  return (
    <div className={wrapClass}>
      <div className={c("saBox")} data-step="1">
        <span className={c("saBoxIcoWrap")}><IcUser /></span>
        <span className={c("saBoxLbl")}>{diagram.investor}</span>
      </div>

      <div className={c("saConn")} aria-hidden>
        <svg viewBox="0 0 100 42" preserveAspectRatio="xMidYMid meet" className={c("saConnSvg")}>
          <path className={c("saPath")} d="M50 3v9" />
          <path className={c("saPath")} d="M50 12L25 12v26" />
          <path className={c("saPath")} d="M50 12l25 0v26" />
          <circle className={c("saNode")} cx="50" cy="12" r="1.35" />
        </svg>
      </div>

      <div className={c("saRow2")}>
        <div className={c("saBox")} data-step="2">
          <span className={c("saBoxIcoWrap")}><IcWallet /></span>
          <span className={c("saBoxLbl")}>{diagram.investment}</span>
          <span className={c("saBoxEx")}>{diagram.investmentEx}</span>
        </div>
        <div className={c("saBox")} data-step="3">
          <span className={c("saBoxIcoWrap")}><IcGauge /></span>
          <span className={c("saBoxLbl")}>{diagram.risk}</span>
          <span className={c("saBoxEx")}>{diagram.riskEx}</span>
        </div>
      </div>

      <div className={c("saConn")} aria-hidden>
        <svg viewBox="0 0 100 48" preserveAspectRatio="xMidYMid meet" className={c("saConnSvg")}>
          <path className={c("saPath")} d="M25 4v14h25v24" />
          <path className={c("saPath")} d="M75 4v14H50v24" />
          <circle className={c("saNode")} cx="50" cy="18" r="1.35" />
        </svg>
      </div>

      <div className={c("saBox")} data-step="4">
        <span className={c("saBoxIcoWrap")}><IcLayers /></span>
        <span className={c("saBoxLbl")}>{diagram.cfs}</span>
        <span className={c("saBoxExSm")}>{diagram.cfsEx}</span>
      </div>

      <div className={c("saConn")} aria-hidden>
        <svg viewBox="0 0 100 42" preserveAspectRatio="xMidYMid meet" className={c("saConnSvg")}>
          <path className={c("saPath")} d="M50 3v9" />
          <path className={c("saPath")} d="M50 12L25 12v26" />
          <path className={c("saPath")} d="M50 12l25 0v26" />
          <circle className={c("saNode")} cx="50" cy="12" r="1.35" />
        </svg>
      </div>

      <div className={c("saRow2")}>
        <div className={c("saBox")} data-step="5">
          <span className={c("saBoxIcoWrap")}><IcPercent /></span>
          <span className={c("saBoxLbl")}>{diagram.outInv}</span>
          <span className={c("saBoxEx")}>{diagram.outInvEx}</span>
        </div>
        <div className={c("saBox")} data-step="6">
          <span className={c("saBoxIcoWrap")}><IcShieldBadge /></span>
          <span className={c("saBoxLbl")}>{diagram.outCap}</span>
          <span className={c("saBoxEx")}>{diagram.outCapEx}</span>
        </div>
      </div>

      <p className={c("saFigNote")}>{diagram.figNote}</p>
    </div>
  );
}
