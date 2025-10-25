"use client";
import { useEffect, useState } from "react";

const ProductAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState([]);
  const [total, setTotal] = useState(0);
  const [mode, setMode] = useState("receive"); // reprice | receive (ПО УМОЛЧАНИЮ — ПРИЁМКА)
  const [fx, setFx] = useState("");
  const [result, setResult] = useState(null);

  async function loadPreview() {
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch("/api/admin/price/preview", { cache: "no-store" });
      const j = await r.json();
      if (j?.ok) {
        setPreview(j.items || []);
        setTotal(j.total || 0);
      } else {
        setPreview([]);
      }
    } catch {
      setPreview([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPreview(); }, []);

  async function handleSync() {
    try {
      const payload = {
        mode, // "receive" (прибавляем qty) | "reprice" (только цены/названия)
        exchangeRate: fx ? parseFloat(fx) : null,
      };
      const r = await fetch("/api/admin/price/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      setResult(j);
      if (j?.ok) {
        alert(
          `Режим: ${j.mode}\nСоздано: ${j.created}\nОбновлено: ${j.updated}\nПропущено: ${j.skipped}\nНедостаточно данных для создания (нет дефолтных ID): ${j.missingForCreate}\nПрибавлено на склад (шт): ${j.qtyIncreased}`
        );
      } else {
        alert(`Ошибка: ${j?.error || "unknown"}`);
      }
    } catch (e) {
      alert(`Ошибка: ${e.message}`);
    }
  }

  return (
    <div className="pt-10 px-12 text-white pb-24">
      <p className="text-3xl mb-6">Загрузить прайс</p>

      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div className="flex gap-2">
          <button
            className={`btn ${mode === "reprice" ? "btn-primary" : ""}`}
            onClick={() => setMode("reprice")}
            type="button"
          >
            Переоценка
          </button>
          <button
            className={`btn ${mode === "receive" ? "btn-primary" : ""}`}
            onClick={() => setMode("receive")}
            type="button"
          >
            Приёмка (прибавить Количество)
          </button>
        </div>

        <div>
          <label className="block mb-2 text-sm opacity-80">Курс (опц., умножим цену)</label>
          <input
            type="number"
            step="0.0001"
            value={fx}
            onChange={(e) => setFx(e.target.value)}
            className="input input-bordered bg-transparent"
            placeholder="1.0000"
          />
        </div>

        <button onClick={handleSync} className="btn btn-success" type="button">
          Синхронизировать
        </button>

        <button onClick={loadPreview} className="btn" type="button">
          Обновить превью
        </button>
      </div>

      <div className="mb-6 text-sm opacity-80">
        <p>Всего позиций: {total}</p>
        <p>Предпросмотр ограничен {process.env.NEXT_PUBLIC_PRICE_PREVIEW_MAX_ROWS || 500} строками.</p>
        {result && result.ok && (
          <div className="mt-2">
            <span className="badge badge-outline mr-2">Создано: {result.created}</span>
            <span className="badge badge-outline mr-2">Обновлено: {result.updated}</span>
            <span className="badge badge-outline mr-2">Пропущено: {result.skipped}</span>
            <span className="badge badge-outline mr-2">Недост. для создания: {result.missingForCreate}</span>
            <span className="badge badge-outline">Прибавлено шт.: {result.qtyIncreased}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center">
          <button className="btn bg-transparent border-none text-white">
            <span className="loading loading-spinner"></span>
            загрузка превью ...
          </button>
        </div>
      ) : Array.isArray(preview) && preview.length ? (
        <div className="overflow-auto border border-gray-700 rounded-lg">
          <table className="table table-xs">
            <thead>
              <tr>
                {preview[0].map((h, i) => (
                  <th key={i} className="whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.slice(1).map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="whitespace-nowrap">{String(cell ?? "")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="opacity-80">Данных для превью нет.</p>
      )}
    </div>
  );
};

export default ProductAdmin;
