"use client";
// /components/FormsAdmin/EditProductForm.jsx — ФАЙЛ ПОЛНОСТЬЮ
import { useEffect } from "react";
import { Form, Input, InputNumber, Select, Button } from "antd";

export default function EditProductForm({ product, onFinish }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        id: product.id,
        title: product.title,
        article: product.article,
        count: product.count,
        price: Number(product.price),
        status: product.status,
        categoryId: product.categoryId,
        groupId: product.groupId,
        description: product.description || "",
      });
    }
  }, [product, form]);

  const handleSubmit = (values) => {
    onFinish?.({
      id: product.id,
      title: values.title?.trim(),
      article: values.article?.trim(),
      count: Number(values.count),
      price: Number(values.price),
      status: values.status,
      categoryId: Number(values.categoryId),
      groupId: Number(values.groupId),
      description: values.description || null,
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Название" name="title" rules={[{ required: true, message: "Введите название" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Артикул" name="article" rules={[{ required: true, message: "Введите артикул" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Количество" name="count" rules={[{ required: true }]}>
        <InputNumber min={0} className="w-full" />
      </Form.Item>
      <Form.Item label="Цена (USD)" name="price" rules={[{ required: true }]}>
        <InputNumber min={0} step={0.001} className="w-full" />
      </Form.Item>
      <Form.Item label="Статус" name="status" rules={[{ required: true }]}>
        <Select
          options={[
            { value: "В наличии", label: "В наличии" },
            { value: "Ожидается", label: "Ожидается" },
            { value: "Нет в наличии", label: "Нет в наличии" },
          ]}
        />
      </Form.Item>
      <Form.Item label="Категория ID" name="categoryId" rules={[{ required: true }]}>
        <InputNumber min={1} className="w-full" />
      </Form.Item>
      <Form.Item label="Группа ID" name="groupId" rules={[{ required: true }]}>
        <InputNumber min={1} className="w-full" />
      </Form.Item>

      {/* Новое поле «Описание товара» */}
      <Form.Item label="Описание товара" name="description">
        <Input.TextArea rows={5} placeholder="Краткое описание, особенности, совместимость..." />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">Сохранить</Button>
      </Form.Item>
    </Form>
  );
}
