import axios from "axios"


export const dollarExchangeRate = () => axios.get(`https://www.nbrb.by/API/ExRates/Rates/USD?ParamMode=2`)
