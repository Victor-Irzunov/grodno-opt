import { getAllUsers } from "@/http/userAPI"
import { useEffect, useState } from "react"
import { Button, Modal, Form, InputNumber, message } from "antd"

const UserDataAdmin = () => {
  const [data, setData] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers()
      if (response) {
        setData(response)
      } else {
        message.error("Не удалось получить пользователей")
      }
    } catch (error) {
      console.error("Ошибка при получении всех пользователей:", error)
      message.error("Ошибка при получении всех пользователей")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const showEditModal = (user) => {
    setEditingUser(user)
    form.setFieldsValue({
      discount: user.wholesaleBuyer?.discount || 0,
      limit: user.wholesaleBuyer?.limit || 0,
    })
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const res = await fetch("/api/user/update-limit-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser.id,
          ...values,
        }),
      })

      const result = await res.json()
      if (res.ok) {
        message.success("Успешно обновлено")
        setIsModalVisible(false)
        fetchUsers() // Обновляем данные
      } else {
        message.error(result.message || "Ошибка при обновлении")
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div className="pt-10 px-12 text-white pb-28">
      <p className="text-3xl mb-16">Данные клиента</p>

      {data.map((user) => (
        <div key={user.id} className="mb-8 border-b border-gray-700 pb-4">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Имя:</strong> {user.userData?.fullName}</p>
          <p><strong>Телефон:</strong> {user.userData?.phone}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          {user.wholesaleBuyer && (
            <div className="mb-2">
              <p><strong>Баланс:</strong> {user.wholesaleBuyer.balance}</p>
              <p><strong>Долг:</strong> {user.wholesaleBuyer.debt}</p>
              <p><strong>Скидка:</strong> {user.wholesaleBuyer.discount}%</p>
              <p><strong>Лимит:</strong> {user.wholesaleBuyer.limit}$</p>
            </div>
          )}
          <Button onClick={() => showEditModal(user)} type="primary">
            Редактировать
          </Button>
        </div>
      ))}

      <Modal
        title="Редактировать скидку и лимит"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="discount"
            label="Скидка (%)"
            rules={[{ required: true, message: "Введите скидку" }]}
          >
            <InputNumber min={0} max={100} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="limit"
            label="Лимит ($)"
            rules={[{ required: true, message: "Введите лимит" }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserDataAdmin
