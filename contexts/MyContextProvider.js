"use client"
import { createContext, useState, useEffect } from 'react';
import UserStore from '../store/UserStore';
import DataStore from '../store/DataStore';
import { dataUser } from '../http/userAPI';
import { dollarExchangeRate } from '@/Api-bank/api';
const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const [state, setState] = useState({});
  const [user] = useState(new UserStore())
  const [dataApp] = useState(new DataStore())

  const updateState = (newState) => {
    setState(newState);
  };
  
  useEffect(() => {
    dataUser()
      .then(data => {
        user.setUserData(data)
        if (data) {
          user.setIsAuth(true)
          user.setUser(true)
        }
      })
      .catch(data => {
        console.log('🚀 🚀 🚀dataUser err:', data)
      })
  }, [user])

  useEffect(() => {
    dollarExchangeRate()
      .then(data => {
        dataApp.setOfficialRate(data.data.Cur_OfficialRate)
    })
  }, [])
  
  const handleCurrencyChange = (currency) => {
    dataApp.setCurrency(currency);
  };

  return (
    <MyContext.Provider value={{ state, updateState, user, dataApp, handleCurrencyChange }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
