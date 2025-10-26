// /components/CompAdmin/ProductAdmin.js — ФАЙЛ ПОЛНОСТЬЮ
"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  addCategory,
  addGroup,
  createOneProduct,
  getAllCategory,
  getAllGroupOneCategory,
} from "@/http/adminAPI";
import { message, Modal, Input, Select, Button as AntBtn, Space } from "antd";

const ExchangeRatesCard = dynamic(() => import("@/components/CompAdmin/ExchangeRatesCard"), { ssr: false });

const ProductAdmin = () => {
  // antd message (v5) — ХУК
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState([]);
  const [total, setTotal] = useState(0);
  const [fx, setFx] = useState("");
  const [result, setResult] = useState(null);

  const [unresolved, setUnresolved] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groupsCache, setGroupsCache] = useState({});

  const [catModal, setCatModal] = useState(false);
  const [newCatTitle, setNewCatTitle] = useState("");
  const [grpModal, setGrpModal] = useState(false);
  const [newGrp, setNewGrp] = useState({ title: "", categoryId: null });

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
        setTotal(0);
        messageApi.open({ type: "warning", content: j?.error || "Не удалось получить превью прайса" });
      }
    } catch (e) {
      setPreview([]);
      setTotal(0);
      messageApi.open({ type: "error", content: e?.message || "Ошибка загрузки превью прайса" });
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const list = await getAllCategory();
      setCategories(Array.isArray(list) ? list : []);
    } catch {
      setCategories([]);
      messageApi.open({ type: "error", content: "Не удалось загрузить категории" });
    }
  }

  useEffect(() => { loadPreview(); loadCategories(); }, []);

  async function loadGroups(catId) {
    if (!catId) return [];
    if (groupsCache[catId]) return groupsCache[catId];
    const res = await getAllGroupOneCategory(catId);
    const arr = Array.isArray(res?.groupsOneCategory) ? res.groupsOneCategory : [];
    setGroupsCache(prev => ({ ...prev, [catId]: arr }));
    return arr;
  }

  async function handleSync() {
    try {
      const payload = {
        mode: "receive",
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
        setUnresolved(
          (j.unresolvedItems || []).map((it) => ({
            ...it,
            _catId: null,
            _grpId: null,
            _saving: false,
          }))
        );

        messageApi.open({
          type: "success",
          content:
            `Приёмка завершена. ` +
            `Создано: ${j.created}. Обновлено: ${j.updated}. ` +
            `Прибавлено шт.: ${j.qtyIncreased}. ` +
            `Без группы/категории: ${j.unresolved}.`,
          duration: 5,
        });

        if (j.writeBack && j.writeBack !== "updated_sheet") {
          messageApi.open({ type: "warning", content: `Запись в лист: ${j.writeBack}` });
        }
        if (j.writeBack === "updated_sheet") {
          messageApi.open({ type: "success", content: "Лист обновлён: оставлены только нерешённые позиции" });
        }

        await loadPreview();
      } else {
        messageApi.open({ type: "error", content: j?.error || "Ошибка при приёмке прайса" });
      }
    } catch (e) {
      messageApi.open({ type: "error", content: e?.message || "Ошибка при приёмке прайса" });
    }
  }

  async function quickSaveRow(row, idx) {
    if (!row._catId || !row._grpId) {
      messageApi.open({ type: "warning", content: "Выберите категорию и группу" });
      return;
    }
    setUnresolved((arr) => arr.map((x, i) => i === idx ? { ...x, _saving: true } : x));
    try {
      const payload = {
        title: row.title,
        status: "В наличии",
        count: Number(row.qty || 0),
        price: Number(row.price || 0),
        article: row.article,
        groupId: Number(row._grpId),
        categoryId: Number(row._catId),
        isDeleted: false,
        images: [],
      };
      const resp = await createOneProduct(payload);
      const createdId = resp?.id || resp?.product?.id;

      if (createdId) {
        messageApi.open({ type: "success", content: `Сохранено: ${row.title}` });
        setUnresolved((arr) => arr.filter((_, i) => i !== idx));
      } else {
        messageApi.open({ type: "error", content: resp?.message || "Не удалось сохранить позицию" });
        setUnresolved((arr) => arr.map((x, i) => i === idx ? { ...x, _saving: false } : x));
      }
    } catch (e) {
      messageApi.open({ type: "error", content: e?.message || "Ошибка сохранения" });
      setUnresolved((arr) => arr.map((x, i) => i === idx ? { ...x, _saving: false } : x));
    }
  }

  const hasUnresolved = useMemo(() => (unresolved && unresolved.length > 0), [unresolved]);

  return (
    <div className="pt-10 px-12 text-white pb-24">
      {/* Контейнер для antd message */}
      {contextHolder}

      <ExchangeRatesCard />

      <p className="text-3xl mb-6">Загрузить прайс</p>

      <div className="mb-4 flex flex-wrap items-end gap-4">
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
          Синхронизировать (приёмка)
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
            <span className="badge badge-outline mr-2">Прибавлено шт.: {result.qtyIncreased}</span>
            <span className="badge badge-outline">Без группы/категории: {result.unresolved}</span>
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
        <p className="opacity-80">Данных для превью нет (остались только без группы/категории).</p>
      )}

      {hasUnresolved && (
        <div className="mt-8">
          <p className="opacity-80 mb-2">Не сохранились (нужна группа/категория):</p>

          <div className="flex flex-wrap gap-3 mb-3">
            <AntBtn size="small" onClick={() => setCatModal(true)}>+ Категория</AntBtn>
            <AntBtn
              size="small"
              onClick={() => { setGrpModal(true); setNewGrp({ title: "", categoryId: null }); }}
            >
              + Группа
            </AntBtn>
          </div>

          <div className="max-h-96 overflow-auto border border-red-500/40 rounded-md p-3">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Артикул</th>
                  <th>Цена</th>
                  <th>Кол-во</th>
                  <th style={{minWidth:180}}>Категория</th>
                  <th style={{minWidth:180}}>Группа</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {unresolved.map((it, i) => (
                  <tr key={i} className="text-red-400">
                    <td className="whitespace-nowrap">{it.title}</td>
                    <td className="whitespace-nowrap opacity-70">{it.article || 'без артикула'}</td>
                    <td className="whitespace-nowrap">{it.price}</td>
                    <td className="whitespace-nowrap">{it.qty}</td>
                    <td>
                      <Select
                        size="small"
                        style={{ width: 180 }}
                        placeholder="Категория"
                        options={categories.map(c => ({ value: c.id, label: c.title }))}
                        value={it._catId ?? null}
                        onChange={async (val) => {
                          await loadGroups(val);
                          setUnresolved(arr => arr.map((x, idx) => idx === i ? { ...x, _catId: val, _grpId: null } : x));
                        }}
                      />
                    </td>
                    <td>
                      <Select
                        size="small"
                        style={{ width: 200 }}
                        placeholder="Группа"
                        value={it._grpId ?? null}
                        options={(groupsCache[it._catId] || []).map(g => ({ value: g.id, label: g.title }))}
                        onFocus={async () => { if (it._catId) await loadGroups(it._catId); }}
                        onChange={(val) => setUnresolved(arr => arr.map((x, idx) => idx === i ? { ...x, _grpId: val } : x))}
                        disabled={!it._catId}
                      />
                    </td>
                    <td>
                      <button
                        className={`btn btn-xs ${it._saving ? 'btn-disabled' : 'btn-outline btn-error'}`}
                        onClick={() => quickSaveRow(it, i)}
                        disabled={it._saving}
                      >
                        {it._saving ? 'Сохранение...' : 'Сохранить'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Модал: новая категория */}
      <Modal
        title="Новая категория"
        open={catModal}
        onCancel={() => setCatModal(false)}
        onOk={async () => {
          if (!newCatTitle.trim()) { messageApi.open({ type: "warning", content: "Название не заполнено" }); return; }
          try {
            const res = await addCategory({ title: newCatTitle.trim() });
            if (res?.id) {
              messageApi.open({ type: "success", content: "Категория добавлена" });
              setNewCatTitle("");
              setCatModal(false);
              await loadCategories();
            } else {
              messageApi.open({ type: "error", content: res?.message || "Не удалось создать категорию" });
            }
          } catch {
            messageApi.open({ type: "error", content: "Ошибка создания категории" });
          }
        }}
      >
        <Input placeholder="Название" value={newCatTitle} onChange={e => setNewCatTitle(e.target.value)} />
      </Modal>

      {/* Модал: новая группа */}
      <Modal
        title="Новая группа"
        open={grpModal}
        onCancel={() => setGrpModal(false)}
        onOk={async () => {
          if (!newGrp.title?.trim() || !newGrp.categoryId) {
            messageApi.open({ type: "warning", content: "Заполните название и выберите категорию" });
            return;
          }
          try {
            const r = await addGroup({ title: newGrp.title.trim(), categoryId: Number(newGrp.categoryId) });
            if (r?.id) {
              messageApi.open({ type: "success", content: "Группа добавлена" });
              setGrpModal(false);
              setGroupsCache((prev) => ({ ...prev, [newGrp.categoryId]: undefined }));
              await loadGroups(newGrp.categoryId);
            } else {
              messageApi.open({ type: "error", content: r?.message || "Не удалось создать группу" });
            }
          } catch {
            messageApi.open({ type: "error", content: "Ошибка создания группы" });
          }
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="Название группы"
            value={newGrp.title}
            onChange={e => setNewGrp(s => ({ ...s, title: e.target.value }))}
          />
          <Select
            style={{ width: '100%' }}
            placeholder="Категория"
            options={categories.map(c => ({ value: c.id, label: c.title }))}
            value={newGrp.categoryId ?? null}
            onChange={(val) => setNewGrp(s => ({ ...s, categoryId: val }))}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default ProductAdmin;
