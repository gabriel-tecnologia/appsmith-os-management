export default {
	async handleCreateOS(){
		const newOS = await Criar_OS.run()
		storeValue("newOS", newOS.fields)
		await Alterar_CampoEspecifico.run({Field: {"OS (Filha)": [appsmith.store.newOS.record_id]}})
	}
}