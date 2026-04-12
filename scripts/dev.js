/**
 * Startet Next.js dev zuverlässig:
 * - Sucht einen freien Port (3000 … 3010), beendet nur „stale“ next dev aus DIESEM Repo.
 * - Bindet an 0.0.0.0 (localhost + 127.0.0.1 + LAN), um typische Windows-/IPv6-Probleme zu vermeiden.
 *
 * Ohne Turbopack: setze NEXT_DEV_WEBPACK=1 (bei Windows + Leerzeichen im Pfad automatisch)
 * Fester erster Port: setze PORT=3000 (Standard)
 */

const { spawn, execFileSync } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
/*
 * Force a consistent dev runtime regardless of host shell defaults.
 * A non-development NODE_ENV (e.g. production/local) can break dev compilation.
 */
if (process.env.NODE_ENV !== "development") {
  if (process.env.NODE_ENV) {
    console.warn(
      `[dev] NODE_ENV="${process.env.NODE_ENV}" erkannt — für Dev auf "development" gesetzt.`,
    );
  }
  process.env.NODE_ENV = "development";
}

/* Turbopack kann unter Windows bei Leerzeichen im Projektpfad abstürzen / leere Seiten liefern. */
if (
  process.platform === "win32" &&
  PROJECT_ROOT.includes(" ") &&
  !Object.prototype.hasOwnProperty.call(process.env, "NEXT_DEV_WEBPACK")
) {
  process.env.NEXT_DEV_WEBPACK = "1";
  console.warn(
    "[dev] Projektpfad enthält Leerzeichen — verwende Webpack (Turbopack aus). Für Turbopack: NEXT_DEV_WEBPACK=0 setzen.\n",
  );
}

const HOST = process.env.NEXT_DEV_HOST || "0.0.0.0";
const PORT_START = Number(process.env.PORT) || 3000;
const PORT_SPAN = 11;

function portAcceptsOn(host, port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host }, () => {
      socket.destroy();
      resolve(true);
    });
    socket.setTimeout(800);
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => resolve(false));
  });
}

async function checkPortFree(port) {
  if (await portAcceptsOn("127.0.0.1", port)) return false;
  try {
    if (await portAcceptsOn("::1", port)) return false;
  } catch {
    /* IPv6 optional */
  }
  return true;
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const NETSTAT_LISTEN_REGEX =
  /LISTENING|ABH[ÖO]REN|ABHOEREN|LISTEN|ÉCOUTE|ESCUCHANDO|IN ASCOLTO|LYSSNAR/i;

function getListeningPidsWindowsPowerShell(port) {
  try {
    const script =
      "$ErrorActionPreference = 'SilentlyContinue'; " +
      "Get-NetTCPConnection -LocalPort " +
      port +
      " -State Listen | " +
      "Select-Object -ExpandProperty OwningProcess -Unique";
    const out = execFileSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        script,
      ],
      { encoding: "utf8", windowsHide: true },
    );
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      const n = Number(String(line).trim());
      if (Number.isFinite(n) && n > 0) pids.add(n);
    }
    return [...pids];
  } catch {
    return [];
  }
}

function getListeningPidsWindowsNetstat(port) {
  let output;
  try {
    output = execFileSync("netstat", ["-ano"], { encoding: "utf8" });
  } catch {
    return [];
  }
  const pids = new Set();
  const suffix = `:${port}`;
  for (const line of output.split(/\r?\n/)) {
    if (!NETSTAT_LISTEN_REGEX.test(line)) continue;
    const parts = line.trim().split(/\s+/);
    if (parts.length < 5) continue;
    const local = parts[1];
    if (!local || !local.endsWith(suffix)) continue;
    const pid = Number(parts[parts.length - 1]);
    if (Number.isFinite(pid) && pid > 0) pids.add(pid);
  }
  return [...pids];
}

function getListeningPidsWindows(port) {
  const fromPs = getListeningPidsWindowsPowerShell(port);
  if (fromPs.length > 0) return fromPs;
  return getListeningPidsWindowsNetstat(port);
}

function getListeningPidsUnix(port) {
  try {
    const out = execFileSync(
      "lsof",
      ["-iTCP:" + port, "-sTCP:LISTEN", "-n", "-P", "-t"],
      { encoding: "utf8" },
    );
    return out
      .split(/\r?\n/)
      .filter(Boolean)
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0);
  } catch {
    return [];
  }
}

function getListeningPids(port) {
  if (process.platform === "win32") return getListeningPidsWindows(port);
  return getListeningPidsUnix(port);
}

function getCommandLineWindows(pid) {
  try {
    const ps =
      "(Get-CimInstance Win32_Process -Filter \"ProcessId=" +
      pid +
      '").CommandLine';
    return execFileSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        ps,
      ],
      { encoding: "utf8", windowsHide: true },
    ).trim();
  } catch {
    return "";
  }
}

function getCommandLineUnix(pid) {
  try {
    return execFileSync("ps", ["-p", String(pid), "-o", "args="], {
      encoding: "utf8",
    }).trim();
  } catch {
    return "";
  }
}

function getCommandLine(pid) {
  if (process.platform === "win32") return getCommandLineWindows(pid);
  return getCommandLineUnix(pid);
}

function normalizePath(p) {
  return path.resolve(p).replace(/\\/g, "/").toLowerCase();
}

function isSafeStaleNextDev(commandLine, projectRoot) {
  if (!commandLine) return false;
  const rootNorm = normalizePath(projectRoot);
  const cmdNorm = commandLine.replace(/\\/g, "/").toLowerCase();
  if (!cmdNorm.includes(rootNorm)) return false;

  const looksLikeNextCliDev =
    /\bnext\s+dev\b/.test(cmdNorm) ||
    /\bnext\.cmd\s+dev\b/.test(cmdNorm) ||
    cmdNorm.includes("next/dist/bin/next") ||
    /[\\/]next["']\s+dev\b/.test(cmdNorm) ||
    /node(\.exe)?\s+.*next[\\/]dist[\\/]bin[\\/]next/.test(cmdNorm);

  const looksLikeNextServerWorker =
    cmdNorm.includes("next/dist/server/lib/start-server");

  return looksLikeNextCliDev || looksLikeNextServerWorker;
}

function killPid(pid) {
  if (process.platform === "win32") {
    execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
    return;
  }
  try {
    process.kill(pid, "SIGTERM");
  } catch {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      /* ignore */
    }
  }
}

async function tryClearStaleNextOnPort(port) {
  if (await checkPortFree(port)) return true;

  const pids = getListeningPids(port);
  if (pids.length === 0) return false;

  const entries = pids.map((pid) => ({
    pid,
    commandLine: getCommandLine(pid),
  }));

  const foreign = entries.filter(
    (e) => !isSafeStaleNextDev(e.commandLine, PROJECT_ROOT),
  );
  if (foreign.length > 0) {
    console.warn(
      `[dev] Port ${port}: fremdes Programm (nicht dieser Ordner) — nächster Port …`,
    );
    for (const { pid, commandLine } of foreign) {
      console.warn(`      PID ${pid}: ${commandLine || "(keine Kommandozeile)"}`);
    }
    return false;
  }

  console.log(`[dev] Beende vorherigen Next.js-Dev auf Port ${port} …`);
  for (const { pid } of entries) {
    try {
      killPid(pid);
    } catch (e) {
      console.error(`[dev] Konnte PID ${pid} nicht beenden: ${e?.message || e}`);
      return false;
    }
  }

  await delay(1200);
  return checkPortFree(port);
}

async function resolveUsablePort() {
  const end = PORT_START + PORT_SPAN - 1;
  for (let port = PORT_START; port <= end; port++) {
    if (await checkPortFree(port)) return port;
    if (await tryClearStaleNextOnPort(port)) return port;
  }
  return null;
}

function startNextDev(port) {
  const nextCli = path.join(
    PROJECT_ROOT,
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );

  if (!fs.existsSync(nextCli)) {
    console.error("[dev] Next.js nicht gefunden. Bitte: npm install\n");
    process.exit(1);
  }

  const args = [nextCli, "dev", "-p", String(port), "-H", HOST];
  if (process.env.NEXT_DEV_WEBPACK !== "1") {
    args.splice(2, 0, "--turbopack");
  }

  const child = spawn(process.execPath, args, {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
    env: { ...process.env },
  });

  child.on("exit", (code, signal) => {
    if (signal) process.exit(1);
    process.exit(code ?? 0);
  });
}

async function main() {
  console.log("");
  console.log("  Capitalife — Entwicklungsserver");
  console.log("  Terminal offen lassen. Beenden: Strg+C");
  if (process.env.NEXT_DEV_WEBPACK === "1") {
    console.log("  (Modus: Webpack, kein Turbopack)");
  }
  console.log("");

  let port;
  try {
    port = await resolveUsablePort();
  } catch (e) {
    console.error("[dev] Port-Check fehlgeschlagen:", e?.message || e);
    process.exit(1);
  }

  if (port == null) {
    console.error(
      `[dev] Kein freier Port zwischen ${PORT_START} und ${PORT_START + PORT_SPAN - 1}.`,
    );
    console.error("    npm run dev:clean   — Ports 3000–3002 hart freiräumen");
    console.error("    Oder fremde App beenden.\n");
    process.exit(1);
  }

  if (port !== PORT_START) {
    console.warn(
      `[dev] Port ${PORT_START} war belegt — verwende ${port} (URL unten anpassen).\n`,
    );
  }

  console.log("  ─────────────────────────────────────");
  console.log(`    http://localhost:${port}`);
  console.log(`    http://127.0.0.1:${port}`);
  console.log("  ─────────────────────────────────────\n");

  startNextDev(port);
}

main();
