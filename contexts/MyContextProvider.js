"use client"
import { createContext, useState, useEffect } from 'react';
import UserStore from '../store/UserStore';
import DataStore from '../store/DataStore';
import { dataUser } from '../http/userAPI';
import { dollarExchangeRate } from '@/Api-bank/api';
import { getAllCategoryAndGroup, getAllProducs } from '@/http/adminAPI';
const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const [state, setState] = useState({});
  const [isState, setIsState] = useState(false);
  // const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [user] = useState(new UserStore())
  const [dataApp] = useState(new DataStore())

  const updateState = (newState) => {
    setState(newState);
  };
  const updateIsState = () => {
    setIsState(i => !i);
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

  useEffect(() => {
    // if (typeof window !== "undefined") {
    const cartData = JSON.parse(localStorage.getItem("parts")) || [];
    dataApp.setDataKorzina(cartData)
    // }
  }, [state, isState]);

  // useEffect(() => {
  //   getAllCategoryAndGroup().then(data => {
  //     if (data) {
  //       setCategories(data)
  //    }
  //   })
  // },[])

  useEffect(() => {
    getAllProducs()
      .then(data => {
      if (data) {
        setProducts(data.serializedProducts)
     }
    })
  },[])
     

  return (
    <MyContext.Provider value={{ state, products, updateIsState, isState, updateState, user, dataApp, handleCurrencyChange }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
