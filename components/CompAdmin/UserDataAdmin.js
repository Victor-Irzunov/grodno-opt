import { getAllUsers } from "@/http/userAPI"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Button, message } from "antd"
import EditUserDataAdminForm from "../FormsAdmin/EditUserDataAdminForm"

const UserDataAdmin = () => {
  const [data, setData] = useState([])
  const [editUserId, setEditUserId] = useState(null)
  const [openUserId, setOpenUserId] = useState(null) // кто открыт на просмотр

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

  const handleFormSuccess = () => {
    setEditUserId(null)
    fetchUsers()
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-6">Просмотр должников</h2>

      {data.map((user) => {
        const fullName =
          user.userData?.fullName?.trim() ||
          user.email?.trim() ||
          "Без имени"

        const rawDebt = parseFloat(user.wholesaleBuyer?.debt || 0)
        const debt = rawDebt > 0 ? `-${rawDebt.toFixed(2)} $` : "0.00 $"
        const isEditing = editUserId === user.id
        const isOpen = openUserId === user.id

        const initialFormData = {
          fullName: user.userData?.fullName || "",
          address: user.userData?.address || "",
          phone: user.userData?.phone || "",
          email: user.email,
          password: "",
          discount: parseFloat(user.wholesaleBuyer?.discount || 0),
          limit: parseFloat(user.wholesaleBuyer?.limit || 0),
        }

        return (
          <div
            key={user.id}
            className="bg-gray-800 py-3 px-8 rounded mb-3"
          >
            <div className="flex justify-between items-center">
              <div className='flex space-x-2 items-center'>
                <p className="text-base font-bold">{fullName}</p>
                <span className="text-xs text-gray-400">id: {user.id}</span>
              </div>

              <div className="flex items-center space-x-3">
                <p className={`text-sm ${rawDebt > 0 ? "text-red-400" : "text-green-400"}`}>
                  {debt}
                </p>

                <Image
                  src="/svg/user-see.svg"
                  alt="Смотреть"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                  onClick={() =>
                    setOpenUserId(openUserId === user.id ? null : user.id)
                  }
                />

                <Image
                  src="/svg/customization.svg"
                  alt="Редактировать"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                  onClick={() => setEditUserId(user.id)}
                />
              </div>
            </div>

            {isOpen && (
              <div className="text-sm text-white mt-5 space-y-2">
                <p><strong>Телефон:</strong> {user.userData?.phone}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Адрес:</strong> {user.userData?.address}</p>
                <p><strong>Баланс:</strong> {user.wholesaleBuyer?.balance}</p>
                <p className={`text-sm ${rawDebt > 0 ? "text-red-400" : "text-green-400"}`}><strong>Задолженность:</strong> {debt}</p>
                <p><strong>Скидка:</strong> {user.wholesaleBuyer?.discount}%</p>
                <p><strong>Лимит:</strong> {user.wholesaleBuyer?.limit}$</p>
                <p><strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleString()}</p>
              </div>
            )}

            {isEditing && (
              <div className="mt-6 bg-[#1a1a1a] p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">Редактирование клиента</h3>
                  <Button
                    size="small"
                    danger
                    style={{ backgroundColor: '#191919' }}
                    onClick={() => setEditUserId(null)}
                  >
                    Скрыть форму
                  </Button>
                </div>
                <EditUserDataAdminForm
                  data={initialFormData}
                  onSuccess={handleFormSuccess}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default UserDataAdmin
