export default {
	
	async handleCreateOS(){
		
		// Gambiarra para manter as Instruções (Foto) na nova OS
		storeValue('instructionPhotosURL', "")
		
		if (appsmith.store.selectedOS["Instruções (Foto)"] != undefined) {
			let fotos = appsmith.store.selectedOS["Instruções (Foto)"]
			let arquivos_para_envio = fotos.map(foto => ({"url": foto.url}))
			storeValue('instructionPhotosURL', arquivos_para_envio)			
		}
		
		// Gambiarra para manter as Fotos de Serviço na nova OS
		storeValue('servicePhotosUrl', "")
		
		if (appsmith.store.selectedOS["Foto do Serviço"] != undefined) {
			let fotos = appsmith.store.selectedOS["Foto do Serviço"]
			let arquivos_para_envio = fotos.map(foto => ({"url": foto.url}))
			storeValue('servicePhotosUrl', arquivos_para_envio)
		}
		
		// Gambiarra para manter o Termo de Finalização na nova OS
		storeValue('termPdf', "")
		
		if (appsmith.store.selectedOS["Termo de Finalização"] != undefined) {
			let term = appsmith.store.selectedOS["Termo de Finalização"]
			let arquivos_para_envio = term.map(term => ({"url": term.url}))
			storeValue('termPdf', arquivos_para_envio)
		}
		
		// Cria nova OS
		if (appsmith.store.selectedOS["OS (Filha)"] == undefined) {
			const newOS = await Criar_OS.run()
			storeValue("newOS", newOS.fields)
		}		
		
		// Conecta OS mãe com OS filha
		await this.linkMotherAndChildOS()
		
		// Atualiza OS atual e renderiza os botões de OS mãe/filha
		const newData = await Leitura_OS_Por_RecordID.run({
			recordId: appsmith.store.selectedOS.record_id
		});
		storeValue("selectedOS", newData.fields)
		
		await renderFunctions.renderOSMotherInfo()
		await renderFunctions.renderOSChildInfo()
	},
	
	async linkMotherAndChildOS() {
		try {
			await Alterar_Campo_Especifico.run({Field: {"OS (Filha)": [appsmith.store.newOS.record_id]}})
			showAlert('Campo OS(Filha) preenchida na coluna OS (Mãe)', 'success')
		}
		catch(error) {
			showAlert('Falha ao preencher campo OS(Filha) preenchida na coluna OS (Mãe)', 'error')
		}
	}
	
}