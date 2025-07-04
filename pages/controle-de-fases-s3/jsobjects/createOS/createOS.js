export default {
		
	async copyFileToChildOs(fileName, childInstallationIdBifrost, childIdOs) {
		
		const parts = fileName.split('/');
		const tipoArquivo = parts[2]; 
		const fileNameOnly = parts.slice(3).join('/');

		// Nova destinationKey com dados da nova OS
		const destinationKey = `${childInstallationIdBifrost}/${childIdOs}/${tipoArquivo}/${fileNameOnly}`;

		await Copiar_Arquivo_S3.run({
			bucket: "bifrost-os-pictures-prod",
			sourceKey: fileName,
			destinationKey: destinationKey
		});
	},
	
	async handleCreateOS() {
		
		// Cria nova OS filha, se não existir
		
		if (!appsmith.store.selectedOS["OS (Filha)"]) {
			try {
				const newOS = await Criar_OS_V2.run();
				storeValue("newOS", newOS.fields);
				showAlert("Nova OS criada com sucesso", "success")
			}
			catch (error) {
				showAlert("Falha ao criar OS filha", "error")
				return;
			}
		} else {
			showAlert("Essa OS já possui uma OS filha!", "error");
			return;
		}

		const childInstallationIdBifrost = appsmith.store.newOS["installationIdBifrost (from id_assinatura)"][0];
		const childIdOs = appsmith.store.newOS.id_os;
		const childRecordId = appsmith.store.newOS.record_id;

		// --- SERVICE PICTURES ---
		const serviceFiles = await Leitura_Arquivos_S3.run({
			installationIDBifrost: appsmith.store.selectedOS["installationIdBifrost (from id_assinatura)"][0],
			idOs: appsmith.store.selectedOS.id_os,
			tipo_arquivo: "service_pictures"
		});

		if (serviceFiles && serviceFiles.length > 0) {
			for (const arquivo of serviceFiles) {
				try {
					await this.copyFileToChildOs(arquivo.fileName, childInstallationIdBifrost, childIdOs);
				} catch (error) {
					console.log(error);
				}
			}
		}

		// --- INSTRUCTION PICTURES ---
		const instructionFiles = await Leitura_Arquivos_S3.run({
			installationIDBifrost: appsmith.store.selectedOS["installationIdBifrost (from id_assinatura)"][0],
			idOs: appsmith.store.selectedOS.id_os,
			tipo_arquivo: "instruction_pictures"
		});

		if (instructionFiles && instructionFiles.length > 0) {
			for (const arquivo of instructionFiles) {
				try {
					await this.copyFileToChildOs(arquivo.fileName, childInstallationIdBifrost, childIdOs);
				} catch (error) {
					console.log(error);
				}
			}
		}

		// --- FINALIZATION TERM ---
		const termFiles = await Leitura_Arquivos_S3.run({
			installationIDBifrost: appsmith.store.selectedOS["installationIdBifrost (from id_assinatura)"][0],
			idOs: appsmith.store.selectedOS.id_os,
			tipo_arquivo: "finalization_term"
		});

		if (termFiles && termFiles.length > 0) {
			for (const arquivo of termFiles) {
				try {
					await this.copyFileToChildOs(arquivo.fileName, childInstallationIdBifrost, childIdOs);
				} catch (error) {
					console.log(error);
				}
			}
		}

		// Conecta OS mãe com OS filha
		await this.linkMotherAndChildOS();

		// Atualiza OS atual e renderiza os botões de OS mãe/filha
		const newData = await Leitura_OS_Por_RecordID.run({
			recordId: appsmith.store.selectedOS.record_id
		});
		storeValue("selectedOS", newData.fields);

		await renderFunctions.renderOSMotherInfo();
		await renderFunctions.renderOSChildInfo();
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