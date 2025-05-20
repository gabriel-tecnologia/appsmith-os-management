export default {
	exitStock: [],
	returnStock: [],
	
	async getStockRecords() {
		this.exitStock = []
		this.returnStock = []
		const stockData = await Leitura_Movimento_Estoque.run()
		const stockFieldsData = stockData.records.map(rec => rec.fields)
		
		for (let i = 0; i < stockFieldsData.length; i++) {
			const sublist = stockFieldsData[i];
			if (sublist["Tipo de Movimento"] === "Saída") {
					this.exitStock.push({
						name: 'Saída de Estoque',
						data: stockFieldsData[i]})
			}
			if (sublist["Tipo de Movimento"] === "Retorno") {
					this.returnStock.push({
						name: 'Retorno de Estoque',
						data: stockFieldsData[i]})
			}
		}
		storeValue('exitStock', this.exitStock)
		storeValue('returnStock', this.returnStock)
	}
}