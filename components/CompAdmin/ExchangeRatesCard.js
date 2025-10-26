// /components/CompAdmin/ExchangeRatesCard.js
"use client";
import { useEffect, useState } from "react";

export default function ExchangeRatesCard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let abort = false;
    fetch("/api/admin/fx", { cache: "no-store" })
      .then(r => r.json())
      .then(j => { if (!abort) setData(j); })
      .catch(e => { if (!abort) setErr(String(e)); });
    return () => { abort = true; };
  }, []);

  const Box = ({ label, value }) => (
    <div className="rounded-md border border-zinc-700 p-3">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="text-lg">{value ?? "—"}</div>
    </div>
  );

  return (
    <div className="bg-[#141414] text-white rounded-lg border border-[#2B2B2B] p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Курсы (НБ РБ)</h3>
        <span className="text-xs text-zinc-400">
          {data?.at ? new Date(data.at).toLocaleString() : ""}
        </span>
      </div>
      {err ? (
        <div className="text-red-400 text-sm">{err}</div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <Box label="RUB → USD" value={data?.RUBtoUSD ? data.RUBtoUSD.toFixed(4) : null} />
          <Box label="CNY → USD" value={data?.CNYtoUSD ? data.CNYtoUSD.toFixed(4) : null} />
          <Box label="1 USD = BYN" value={data?.BYNperUSD ? data.BYNperUSD.toFixed(4) : null} />
        </div>
      )}
    </div>
  );
}
