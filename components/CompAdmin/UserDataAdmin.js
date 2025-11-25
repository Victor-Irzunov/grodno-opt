// /components/CompAdmin/UserDataAdmin.jsx
import { getAllUsers } from "@/http/userAPI";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, message } from "antd";
import EditUserDataAdminForm from "../FormsAdmin/EditUserDataAdminForm";

const UserDataAdmin = () => {
  const [data, setData] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [openUserId, setOpenUserId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response) {
        setData(response);
      } else {
        message.error("Не удалось получить пользователей");
      }
    } catch (error) {
      console.error("Ошибка при получении всех пользователей:", error);
      message.error("Ошибка при получении всех пользователей");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormSuccess = () => {
    setEditUserId(null);
    fetchUsers();
  };

  const normalizedSearch = search.trim().toLowerCase();

  const filteredData = !normalizedSearch
    ? data
    : data.filter((user) => {
        const fullName = (user.userData?.fullName || "").toLowerCase();
        const phone = (user.userData?.phone || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        const idStr = String(user.id || "");

        return (
          fullName.includes(normalizedSearch) ||
          phone.includes(normalizedSearch) ||
          email.includes(normalizedSearch) ||
          idStr.includes(normalizedSearch)
        );
      });

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl">Просмотр должников</h2>

        <div className="w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenUserId(null);
              setEditUserId(null);
            }}
            placeholder="Поиск по ФИО, ID, телефону или email"
            className="w-full rounded-md bg-[#1f2933] border border-gray-600 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-primary"
          />
          <p className="text-xs text-gray-400 mt-1">
            Начните вводить фамилию, имя, ID, телефон или email для фильтрации.
          </p>
        </div>
      </div>

      {(normalizedSearch ? filteredData : data).map((user) => {
        const fullName =
          user.userData?.fullName?.trim() ||
          user.email?.trim() ||
          "Без имени";

        const balanceVal = Number(user.wholesaleBuyer?.balance || 0);
        const debtVal = Number(user.wholesaleBuyer?.debt || 0);

        const net = balanceVal - debtVal; // итоговая позиция клиента
        const netStr = `${net >= 0 ? "" : "-"}${Math.abs(net).toFixed(2)} $`;

        const isEditing = editUserId === user.id;
        const isOpen = openUserId === user.id;

        const initialFormData = {
          fullName: user.userData?.fullName || "",
          address: user.userData?.address || "",
          phone: user.userData?.phone || "",
          email: user.email,
          password: "",
          discount: parseFloat(user.wholesaleBuyer?.discount || 0),
          limit: parseFloat(user.wholesaleBuyer?.limit || 0),
          balance: balanceVal,
        };

        return (
          <div
            key={user.id}
            className="bg-gray-800 py-3 px-8 rounded mb-3"
          >
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                <p className="text-base font-bold">{fullName}</p>
                <span className="text-xs text-gray-400">id: {user.id}</span>
              </div>

              <div className="flex items-center space-x-3">
                {/* Итоговая позиция клиента с учётом долга и баланса */}
                <p
                  className={`text-sm ${
                    net < 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {netStr}
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
                <p>
                  <strong>id:</strong> {user.id}
                </p>
                <p>
                  <strong>Фамилия и имя:</strong>{" "}
                  {user.userData?.fullName || "—"}
                </p>
                <p>
                  <strong>Телефон:</strong> {user.userData?.phone || "—"}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Адрес:</strong> {user.userData?.address || "—"}
                </p>
                <p>
                  <strong>Баланс:</strong> {balanceVal.toFixed(2)} $
                </p>
                <p
                  className={`text-sm ${
                    debtVal > 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  <strong>Задолженность:</strong>{" "}
                  {debtVal > 0 ? debtVal.toFixed(2) : "0.00"} $
                </p>
                <p>
                  <strong>Скидка:</strong> {user.wholesaleBuyer?.discount}% 
                </p>
                <p>
                  <strong>Лимит:</strong> {user.wholesaleBuyer?.limit}$
                </p>
                <p>
                  <strong>Дата регистрации:</strong>{" "}
                  {new Date(user.createdAt).toLocaleString()}
                </p>
                <p className="mt-2">
                  <strong>Итоговая позиция (баланс − долг):</strong>{" "}
                  <span
                    className={net < 0 ? "text-red-400" : "text-green-400"}
                  >
                    {netStr}
                  </span>
                </p>
              </div>
            )}

            {isEditing && (
              <div className="mt-6 bg-[#1a1a1a] p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">Редактирование клиента</h3>
                  <Button
                    size="small"
                    danger
                    style={{ backgroundColor: "#191919" }}
                    onClick={() => setEditUserId(null)}
                  >
                    Скрыть форму
                  </Button>
                </div>
                <EditUserDataAdminForm
                  data={initialFormData}
                  userId={user.id}
                  onSuccess={handleFormSuccess}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserDataAdmin;
