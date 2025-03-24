export default {
	async handleCreateOS(){
		const newOS = await Criar_OS.run()
		storeValue("newOS", newOS.fields)
		await Alterar_CampoEspecifico.run({Field: {"Ordem de Serviço (Mãe)": [appsmith.store.selectedOS.record_id]}})
	}
}