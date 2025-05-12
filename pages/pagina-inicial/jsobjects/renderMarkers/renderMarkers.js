export default {
	setLocations() {
		const locs = Leitura_OS.data.records.map(record => record.fields)
		const pins = locs.map((field) => ({
			lat: parseFloat(field["Latitude"][0]),
			long: parseFloat(field["Longitude"][0]),
			title: `${field["Título"]}\n${field["Técnico Responsável"]??""}\n${field["Período"]??""}`,
			color: renderFunction.handleMapColorPeriod(field["Período"])
		}));
		return pins
	},
	defaultLocation() {
		const pins = this.setLocations()
		let lat = 0
		let long = 0
		let size = 0
		for (const pin of pins){
			size += 1
			lat += pin.lat
			long += pin.long
		}
		lat = lat/size
		long = long/size
		return {lat, long}
	},
	storesOS() {
		const fields = listaOSs.listData.map(record => record.fields)
		
		// Normaliza o título do marcador (remove espaços extras)
    const selectedTitle = map.selectedMarker.title.split("\n")[0].trim();
		console.log(selectedTitle)
    
    // Filtra a lista pelo título normalizado
    const rec = fields.filter((os) => os.Título === selectedTitle);
		
		storeValue('selectedOS', rec[0])
		console.log(appsmith.store.selectedOS)
		navigateTo('controle-de-fases-um-a-um', {}, 'SAME_WINDOW')		
	}
}