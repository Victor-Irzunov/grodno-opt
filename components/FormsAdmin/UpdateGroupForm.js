"use client";
import { editGroup } from '@/http/adminAPI';
import { Button, Input, Form, message } from 'antd';
import { useEffect } from 'react';

const UpdateGroupForm = ({ editingGroup, setIsRender, handleCancel }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            await editGroup(editingGroup?.id, values.title);
            message.success("Группа успешно обновлена");
            setIsRender((prev) => !prev);
            handleCancel();
        } catch (error) {
            console.error("Ошибка при обновлении группы:", error);
            message.error("Ошибка при обновлении группы");
        }
    };

    useEffect(() => {
        if (editingGroup) {
            form.setFieldsValue({ title: editingGroup.title });
        }
    }, [editingGroup, form]);

    return (
        <div className='pl-10'>
            <Form
                form={form}
                name="updateGroup"
                onFinish={onFinish}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Form.Item
                    label="Введите новое название группы"
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

export default UpdateGroupForm;
