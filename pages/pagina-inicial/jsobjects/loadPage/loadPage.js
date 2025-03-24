export default {
	loadPage() {
		const filteringKeys = ['data', 'estado', 'filterFase', 'parceiro', 'periodo', 'tipo', 'titulo']

		let shouldLoadData = false;

		filteringKeys.forEach(key => {
			if(!!appsmith.store[key]) shouldLoadData = true
		})

		if(shouldLoadData) osListHook.handleSearch()
	}
}