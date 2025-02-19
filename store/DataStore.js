import { makeAutoObservable } from 'mobx'

export default class DataStore {
	constructor() {
		this._dataKorzina = []
		this._isUpdateKorzina = false
		this._OfficialRate = null
		this._currency = 'USD'
		this._catalogId = null

		makeAutoObservable(this)
	}


	setDataKorzina(data) {
		this._dataKorzina = data
	}
	setIsUpdateKorzina(data) {
		this._isUpdateKorzina = data
	}
	setOfficialRate(data) {
		this._OfficialRate = data
	}
	setCurrency(data) {
		this._currency = data
	}
	setCatalogId(data) {
		this._catalogId = data
	}

	get dataKorzina() {
		return this._dataKorzina
	}
	get isUpdateKorzina() {
		return this._isUpdateKorzina
	}
	get OfficialRate() {
		return this._OfficialRate
	}
	get currency() {
		return this._currency
	}
	get catalogId() {
		return this._catalogId
	}


}
