import React, { useState } from 'react';
import { Table } from 'antd';
import FormSchet from '../Form/FormSchet';

const LichnyjSchet = ({setActiveComponent}) => {
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const [data, setData] = useState([
    {
      key: '1',
      date: '01.01.2025',
      amount: '50 р.',
      orderNumber: '12345',
      description: 'Оплата заказа',
    },
    {
      key: '2',
      date: '02.01.2025',
      amount: '150 р.',
      orderNumber: '67890',
      description: 'Возврат средств',
    },
  ]);

  const columns = [
    {
      title: 'Дата транзакции',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Номер заказа',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <div className="mt-2 border">
      <div className="border-b sd:p-6 xz:p-4">
        <p className="font-light text-gray-500 text-sm">
          Состояние счёта на {currentDate}
        </p>

        <div className="flex sd:flex-row xz:flex-col items-center sd:space-x-5 xz:space-x-0 mt-4">
          <p className="text-xl font-semibold">100 р.</p>
          <p className="sd:mt-0 xz:mt-3 text-xs text-[#9D5D00]">
            BYN (Белорусский рубль)
          </p>
        </div>
      </div>

      <div className="sd:p-6 xz:p-4 flex xz:justify-center sd:justify-start">
        <FormSchet />
      </div>

      <div className='mt-3'>
        <Table columns={columns} dataSource={data} pagination={false} className='overflow-x-auto' />
      </div>
    </div>
  );
};

export default LichnyjSchet;
