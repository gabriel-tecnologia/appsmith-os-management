export default {
	stock: [],
	async getStockRecords() {
		this.stock = []
		const stockData = await Leitura_Movimento_Estoque.run()
		const stockFieldsData = stockData.records.map(rec => rec.fields)
		
		for (let i = 0; i < stockFieldsData.length; i++) {
			const sublist = stockFieldsData[i];
			if (sublist["Tipo de Movimento"] === "Saída") {
					this.stock.push({
						name: 'Saída de Estoque',
						data: stockFieldsData[i]})
			}
			if (sublist["Tipo de Movimento"] === "Retorno") {
					this.stock.push({
						name: 'Retorno de Estoque',
						data: stockFieldsData[i]})
			}
		}	
		storeValue('stock', this.stock)
	}
}