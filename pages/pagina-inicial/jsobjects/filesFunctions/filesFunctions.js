export default {
	downloadCSV() {
    const data = listaOSs.listData.map(rec => rec.fields);
		return data.keys() 
		data
		const list = []
	
		Object.values(data[0]).forEach(valor => {
    list.push(valor);
		});	
		
		console.log(list)
		download(list, "AllData.csv", "data:text/csv")
	}
}