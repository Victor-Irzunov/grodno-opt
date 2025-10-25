// /contexts/MyContextProvider.jsx
"use client";
import { createContext, useState, useEffect } from 'react';
import UserStore from '../store/UserStore';
import DataStore from '../store/DataStore';
import { dataUser } from '../http/userAPI';
import { dollarExchangeRate } from '@/Api-bank/api';
import { getAllProducs } from '@/http/adminAPI';

const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const [state, setState] = useState({});
  const [isState, setIsState] = useState(false);
  const [products, setProducts] = useState([]);
  const [user] = useState(new UserStore());
  const [dataApp] = useState(new DataStore());

  const updateState = (newState) => setState(newState);
  const updateIsState = () => setIsState((i) => !i);

  useEffect(() => {
    dataUser()
      .then((data) => {
        user.setUserData(data);
        if (data) {
          user.setIsAuth(true);
          user.setUser(true);
        }
      })
      .catch((err) => console.log('🚀 dataUser err:', err));
  }, [user]);

  useEffect(() => {
    dollarExchangeRate().then((d) => {
      dataApp.setOfficialRate(d.data.Cur_OfficialRate);
    });
  }, []);

  const handleCurrencyChange = (currency) => dataApp.setCurrency(currency);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('parts')) || [];
    dataApp.setDataKorzina(cartData);
  }, [state, isState]);

  useEffect(() => {
    getAllProducs()
      .then((arr) => setProducts(Array.isArray(arr) ? arr : []))
      .catch(() => setProducts([]));
  }, [isState]);

  return (
    <MyContext.Provider
      value={{ state, products, updateIsState, isState, updateState, user, dataApp, handleCurrencyChange }}
    >
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
