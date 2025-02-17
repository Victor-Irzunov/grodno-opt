import axios from "axios"


export const dollarExchangeRate = () => axios.get(`https://www.nbrb.by/API/ExRates/Rates/USD?ParamMode=2`)

export const fetchExchangeRates = async () => {
	 try {
		  const response = await axios.get('https://api.nbrb.by/exrates/rates?periodicity=0');
		  const data = response.data;

		  // Получаем курсы RUB, CNY и USD к BYN
		  const rateRUB = data.find(rate => rate.Cur_Abbreviation === 'RUB')?.Cur_OfficialRate;
		  const rateCNY = data.find(rate => rate.Cur_Abbreviation === 'CNY')?.Cur_OfficialRate;
		  const rateUSD = data.find(rate => rate.Cur_Abbreviation === 'USD')?.Cur_OfficialRate;

		  return {
				RUBtoUSD: rateRUB / rateUSD,
				CNYtoUSD: rateCNY / rateUSD,
				BYNtoUSD: rateUSD,
		  };
	 } catch (error) {
		  console.error('Ошибка при загрузке курсов валют:', error);
		  return null;
	 }
};
