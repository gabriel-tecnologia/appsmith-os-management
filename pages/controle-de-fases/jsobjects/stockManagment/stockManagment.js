export default {
	stock: [],
	async getStockRecords() {
		this.stock = []
		const stockData = await Leitura_Movimento_Estoque.run()
		const stockFieldsData = stockData.records.map(rec => rec.fields)
		
		let exitStock, returnStock;

		for (let i = 0; i < stockFieldsData.length; i++) {
			const sublist = stockFieldsData[i];
    
			if (sublist["Tipo de Movimento"] === "Saída") {
					exitStock = sublist;
			}

			if (sublist["Tipo de Movimento"] === "Retorno") {
					returnStock = sublist; 
			}
				
			if (exitStock != undefined) {
			this.stock.push({
				name: 'Saída de Estoque',
				data: exitStock}), 
				storeValue('exitStock', exitStock) 
			}
			if (returnStock != undefined) {
				this.stock.push({
					name: 'Retorno de Estoque',
					data: returnStock}), 
					storeValue('returnStock', returnStock) 
			}
		}	
	}
}