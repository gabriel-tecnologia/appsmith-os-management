export default {
	keepFilterOptions() {
		const fase = appsmith.store.filterFase ?? ""
		const data = appsmith.store.data ?? ""
		const tipo = appsmith.store.tipo ?? ""
		const parceiro = appsmith.store.parceiro ?? ""
		const estado = appsmith.store.estado ?? ""
		const periodo = appsmith.store.periodo?? ""
		
		clearStore()
		
		storeValue("filterFase", fase)
		storeValue("data", data)
		storeValue("tipo", tipo)
		storeValue("parceiro", parceiro)
		storeValue("estado", estado)
		storeValue("periodo", periodo)
		
	}
}