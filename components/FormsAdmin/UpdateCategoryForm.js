"use client";
import { editCategory } from '@/http/adminAPI';
import { Button, Input, Form, message } from 'antd';
import { useEffect } from 'react';

const UpdateCategoryForm = ({ editingCategory, setIsRender, handleCancel }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            await editCategory(editingCategory?.id, values.title);
            message.success("Категория успешно обновлена");
            setIsRender((prev) => !prev);
            handleCancel();
        } catch (error) {
            console.error("Ошибка при обновлении категории:", error);
            message.error("Ошибка при обновлении категории");
        }
    };

    useEffect(() => {
        if (editingCategory) {
            form.setFieldsValue({ title: editingCategory.title });
        }
    }, [editingCategory, form]);

    return (
        <div className='pl-10'>
            <Form
                form={form}
                name="updateCategory"
                onFinish={onFinish}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Form.Item
                    label="Введите новое название категории"
                    name="title"
                    rules={[{ required: true, message: "Введите название" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" className='text-white bg-primary' htmlType="submit">
                        Сохранить
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateCategoryForm;
