export default {
	
	async handleCreateOS(){
		
		// Gambiarra para manter as Instruções (Foto) na nova OS
		storeValue('instructionPhotosURL', "")
		
		if (appsmith.store.selectedOS["Instruções (Foto)"] != undefined) {
			let fotos_servico = appsmith.store.selectedOS["Instruções (Foto)"]
			storeValue('instructionPhotosURL', fotos_servico)			
		}
		
		// Gambiarra para manter as Fotos de Serviço na nova OS
		storeValue('servicePhotosUrl', "")
		
		if (appsmith.store.selectedOS["Foto do Serviço"] != undefined) {
			let fotos_instrucao = appsmith.store.selectedOS["Foto do Serviço"]
			storeValue('servicePhotosUrl', fotos_instrucao)
		}
		
		// Gambiarra para manter o Termo de Finalização na nova OS
		storeValue('termPdf', "")
		
		if (appsmith.store.selectedOS["Termo de Finalização"] != undefined) {
			let term = appsmith.store.selectedOS["Termo de Finalização"]
			storeValue('termPdf', term)
		}
		
		// Cria nova OS
		if (appsmith.store.selectedOS["OS (Filha)"] == undefined) {
			const newOS = await Criar_OS.run()
			storeValue("newOS", newOS.fields)
		}
		
		// Enviar fotos de serviço
		
			// Upload S3
		
      for (const arquivo of appsmith.store.servicePhotosUrl) {
				let service_photo = [];
				try {
        const resposta = await Enviar_Arquivo_S3.run({
					installationIdBifrost: appsmith.store.newOS["installationIdBifrost (from id_assinatura)"][0],
					idOs: appsmith.store.newOS.id_os,
          fileName: arquivo.name,
          filesData: arquivo
        });
        const url = resposta.signedUrl;
        service_photo.push({ url }); // Acumula localmente

        // Upload Airtable
        await Enviar_Fotos_Airtable.run({ 
					recordId: appsmith.store.newOS.record_id,
					photosUrl: service_photo
				});
			}
				catch(error) {
					console.log(error)
				}
			}
		
		// Enviar fotos de instrução
		
		for (const arquivo of appsmith.store.instructionPhotosURL) {
				let instruction_photo = [];
				try {
        const resposta = await Enviar_Arquivo_S3.run({
					installationIdBifrost: appsmith.store.newOS["installationIdBifrost (from id_assinatura)"][0],
					idOs: appsmith.store.newOS.id_os,
          fileName: arquivo.name,
          filesData: arquivo
        });
        const url = resposta.signedUrl;
        instruction_photo.push({ url }); // Acumula localmente

        // Upload Airtable
        await Enviar_Fotos_Airtable.run({ 
					recordId: appsmith.store.newOS.record_id,
					photosUrl: instruction_photo
				});
			}
				catch(error) {
					console.log(error)
				}
			}
		
		// Enviar termo de finalização
		
		for (const arquivo of appsmith.store.termPdf) {
				let term = [];
				try {
        const resposta = await Enviar_Arquivo_S3.run({
					installationIdBifrost: appsmith.store.newOS["installationIdBifrost (from id_assinatura)"][0],
					idOs: appsmith.store.newOS.id_os,
          fileName: arquivo.name,
          filesData: arquivo
        });
        const url = resposta.signedUrl;
        term.push({ url }); // Acumula localmente

        // Upload Airtable
        await Enviar_Termo.run.run({ 
					recordId: appsmith.store.newOS.record_id,
					term: term
				});
			}
				catch(error) {
					console.log(error)
				}
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