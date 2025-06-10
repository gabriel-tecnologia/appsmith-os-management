export default {
	
	async copyFileToChildOs(fileName) {
		
		// Troca o installationIdBifrost e o idOs do arquivo original para cópia
		const destinationKey = fileName.replace(
      /^([^\/]+)\/([^\/]+)/, 
      appsmith.store.selectedOS["installationIdBifrost (from id_assinatura)"][0] + '/' + appsmith.store.selectedOS.id_os
    );
		
		await Copiar_Arquivo_S3.run({
			bucket: "bifrost-os-pictures-prod",
			sourceKey: fileName,
			destinationKey: destinationKey
		});	
		
	},
	
	async handleCreateOS(){
				
		// Cria nova OS
		if (appsmith.store.selectedOS["OS (Filha)"] == undefined) {
			const newOS = await Criar_OS_V2.run()
			storeValue("newOS", newOS.fields)
		}
		
		// Passando as Fotos de Serviço na nova OS
		storeValue('servicePhotosUrl', "")
		
		const serviceFiles = await Leitura_Arquivos_S3.run({
			installationIDBifrost: appsmith.store.selectedOS["installationIdBifrost (from id_assinatura)"][0],
			idOs: appsmith.store.selectedOS.id_os,
			tipo_arquivo: "service_pictures"
		});
		
		if(serviceFiles) {
			storeValue('servicePhotosUrl', serviceFiles)
		}
		
		// Copia cada foto da OS mae para a filha no s3
		for (const arquivo of appsmith.store.servicePhotosUrl) {
			try {
				await this.copyFileToChildOs(arquivo.fileName)
			}
			catch(error) {
				console.log(error)
			}
		}
		
		const newServiceFiles = await Leitura_Arquivos_S3.run({
			installationIdBifrost: appsmith.store.newOS["installationIdBifrost (from id_assinatura)"][0],
			idOs: appsmith.store.selectedOS.id_os,
			tipo_arquivo: "service_pictures"
		})
		
		for (const file of newServiceFiles) {
			let service_file = [];
			const url = file.url
			service_file.push({ url }); // Acumula localmente

			// Upload Airtable
			await Enviar_Fotos_Airtable.run({ 
				recordId: appsmith.store.newOS.record_id,
				photosUrl: service_file
			});
		}
			
		// Passando as Fotos de Instruções na nova OS
		storeValue('instructionPhotosUrl', "")
		
		const instructionFiles = await Leitura_Arquivos_S3.run({
			installationIDBifrost: appsmith.store.selectedOS["installationIdBifrost (from id_assinatura)"][0],
			idOs: appsmith.store.selectedOS.id_os,
			tipo_arquivo: "instruction_pictures"
		});
		
		if(instructionFiles) {
			storeValue('instructionPhotosUrl', instructionFiles)
		}
		
		//Copia cada foto da OS mae para a filha no s3
		for (const arquivo of appsmith.store.instructionPhotosUrl) {
			try {
				await this.copyFileToChildOs(arquivo.fileName)
			}
			catch(error) {
				console.log(error)
			}
		}
		
		const newInstructionFiles = await Leitura_Arquivos_S3.run({
			installationIdBifrost: appsmith.store.newOS["installationIdBifrost (from id_assinatura)"][0],
			idOs: appsmith.store.selectedOS.id_os,
			tipo_arquivo: "instruction_pictures"
		})
		
		for (const file of newInstructionFiles) {
			let instruction_file = [];
			const url = file.url
			instruction_file.push({ url }); // Acumula localmente

			// Upload Airtable
			await Enviar_Fotos_Airtable.run({ 
				recordId: appsmith.store.newOS.record_id,
				photosUrl: instruction_file
			});
		}

		
		// Gambiarra para manter o Termo de Finalização na nova OS
		storeValue('term', "")
		
		const termFiles = await Leitura_Arquivos_S3.run({
			installationIDBifrost: appsmith.store.selectedOS["installationIdBifrost (from id_assinatura)"][0],
			idOs: appsmith.store.selectedOS.id_os,
			tipo_arquivo: "finalization_term"
		});
		
		if(termFiles) {
			storeValue('term', termFiles)
		}
		
		//Copia termo da OS mae para a filha no s3
		for (const arquivo of appsmith.store.term) {
			try {
				await this.copyFileToChildOs(arquivo.fileName)
			}
			catch(error) {
				console.log(error)
			}
		}
		
		const newTermFiles = await Leitura_Arquivos_S3.run({
			installationIdBifrost: appsmith.store.newOS["installationIdBifrost (from id_assinatura)"][0],
			idOs: appsmith.store.selectedOS.id_os,
			tipo_arquivo: "finalization_term"
		})
		
		for (const file of newTermFiles) {
			let term = [];
			const url = file.url
			term.push({ url }); // Acumula localmente

			// Upload Airtable
			await Enviar_Termo.run({ 
					recordId: appsmith.store.newOS.record_id,
					term: term
			});
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