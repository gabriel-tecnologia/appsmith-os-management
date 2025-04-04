export default {
	async handleCreateOS(){
		
		// Gambiarra para manter as Instruções (Foto) na nova OS
		storeValue('photosURL', "")
		
		if (appsmith.store.selectedOS["Instruções (Foto)"] != undefined) {
			let fotos = appsmith.store.selectedOS["Instruções (Foto)"]
			let arquivos_para_envio = fotos.map(foto => ({"url": foto.url}))
			storeValue('photosURL', arquivos_para_envio)
		}
		
		// Cria nova OS
		const newOS = await Criar_OS.run()
		storeValue("newOS", newOS.fields)
		await Alterar_CampoEspecifico.run({Field: {"OS (Filha)": [appsmith.store.newOS.record_id]}})
		
		// Atualiza OS atual e renderiza os botões de OS mãe/filha
		const newData = await Leitura_OS_porRecordID.run({
			recordId: appsmith.store.selectedOS.record_id
		});
		storeValue("selectedOS", newData.fields)
		
		await renderFunctions.renderOSMotherInfo()
		await renderFunctions.renderOSChildInfo()
		
	}
}