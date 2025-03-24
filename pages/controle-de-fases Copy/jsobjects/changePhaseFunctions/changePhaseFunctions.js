export default {
	async handleMoveToConcluded(){
		if (!appsmith.store.selectedOS["Foto do Serviço"]){
			showAlert("Falta incluir Fotos do Serviço", "error")
			return;
		}
		if (!appsmith.store.selectedOS["Termo de Finalização"] && (appsmith.store.selectedOS["Tipo de Ordem de Serviço"] == "Adesão" || appsmith.store.selectedOS["Tipo de Ordem de Serviço"] == "Desinstalação" || appsmith.store.selectedOS["Tipo de Ordem de Serviço"] == "Aditivo")){
			showAlert("Falta incluir Termo de Finalização", "error")
			return;
		}
		if (!appsmith.store.selectedOS["Observações (do Terceiro para Gabriel)"]){
			showAlert("Falta incluir Observações (do Terceiro para Gabriel)", "error")
			return;
		}
		if (!appsmith.store.selectedOS["Momento de Término"]){
			showAlert("Falta incluir Momento de Término", "error")
			return;
		}
		if (appsmith.store.selectedOS["Valor a Pagar (ao Terceiro)"] == undefined) {
			showAlert("Falta incluir o Valor a Pagar (ao Terceiro)", "error")
			return;
		}
		
		try {
			storeValue("fase", "Concluído")
			await Alterar_CampoEspecifico.run({Field: {"Fase": appsmith.store.fase}})
			const newData = await Leitura_OS_porRecordID.run()
			storeValue("selectedOS", newData.fields)
			showAlert("OS concluída com sucesso", "success")
			await renderFunctions.renderPhaseState()
		}
		catch(error) {
			showAlert("Erro ao concluir OS", "error")
		}
	},
	
	async handleMoveToReschedule() { // Enquanto não implementamos novo fluxo
		try {
			storeValue("fase", "Reagendamento de Serviço")
			await Alterar_CampoEspecifico.run({Field: {"Fase": appsmith.store.fase}})
			const newData = await Leitura_OS_porRecordID.run()
			storeValue("selectedOS", newData.fields)
			showAlert("OS reagendada com sucesso", "success")
			await renderFunctions.renderPhaseState()
		}
		catch(error) {
			showAlert("Erro ao mudar a fase da OS para 'Reagendamento'", "error")
		}
	},
	
	async handleStartOS() { // Enquanto não implementamos novo fluxo
		try {
			storeValue('hora_inicio',new Date())
			await Alterar_CampoEspecifico.run({Field: {"Momento de Início": appsmith.store.hora_inicio}})
			showAlert("Momento de Início registrado com sucesso", "success")
			
			storeValue("fase", "Serviço em Andamento")
			await Alterar_CampoEspecifico.run({Field: {"Fase": appsmith.store.fase}})
			showAlert("OS iniciada com sucesso", "success")
			
			const newData = await Leitura_OS_porRecordID.run()
			storeValue("selectedOS", newData.fields)
			await renderFunctions.renderPhaseState()
		}
		catch(error) {
			console.log(error)
			showAlert("Erro ao marcar momento de início", "error")
			showAlert("Erro ao iniciar OS", "error")
		}
	},
	
	async handleConfirmMoveTo(){
		if (appsmith.store.changeTo == "Ajuste"){
			await changePhaseFunctions.handleMoveToAdjust()
		}
		else if (appsmith.store.changeTo == "Improdutiva"){
			await changePhaseFunctions.handleMoveToImproductive()
		}
		await renderFunctions.renderPhaseState()
		selecaoMotivo.setVisibility(false)
	},
	
	async handleMoveToImproductive() {
		try {
			await Alterar_CampoEspecifico.run({Field: {"Motivo de Improdutiva": selecaoMotivo.selectedOptionLabel}})
			showAlert("Motivo de Improdutiva atualizado", "success")
		}
		catch (error) {
			showAlert("Falha ao atualizar Motivo de Improdutiva", "error")			
		}
		if (selecaoMotivo.selectedOptionLabel != "") {
			try {
				storeValue("fase", "Improdutiva")
				await Alterar_CampoEspecifico.run({Field: {"Fase": appsmith.store.fase}})
				showAlert("Fase da OS alterada para 'Improdutiva'", "success")
				const newData = await Leitura_OS_porRecordID.run()
				storeValue("selectedOS", newData.fields)
			}
			catch(error) {
				showAlert("Falha ao alterar fase da OS para 'Improdutiva'", "error")
			}
		}
		else {
			showAlert("Falha ao alterar fase da OS para 'Improdutiva'", "error")			
		}
		if (appsmith.store.selectedOS.Fase == "Improdutiva") {
			try {
				await createOS.handleCreateOS()
				showAlert("Nova OS criada com sucesso", "success")
				const newData = await Leitura_OS_porRecordID.run()
				storeValue("selectedOS", newData.fields)
			}
			catch(error) {
				showAlert("Falha ao criar uma nova OS", "error")
			}
		}
		else {
			showAlert("Não foi possível criar uma nova OS", "error")
		}
	},
	
	async handleMoveToAdjust() {
		try {
			await Alterar_CampoEspecifico.run({Field: {"Motivo do Ajuste": selecaoMotivo.selectedOptionLabel}})
			showAlert("Motivo de Ajuste atualizado", "success")
		}
		catch (error) {
			showAlert("Falha ao atualizar o Motivo de Ajuste", "error")
		}
		if (selecaoMotivo.selectedOptionLabel != "") {
			try {
				storeValue("fase", "Ajuste")
				await Alterar_CampoEspecifico.run({Field: {"Fase": appsmith.store.fase}})
				showAlert("Fase da OS alterada para 'Ajuste'", "success")
				await renderFunctions.renderPhaseState()
				const newData = await Leitura_OS_porRecordID.run()
				storeValue("selectedOS", newData.fields)
				resetWidget("Tabs")
			}
			catch(error){
				showAlert("Falha ao alterar fase da OS para 'Ajuste'", "error")
			}		
		}
		else {
			showAlert("Falha ao mudar a fase da OS para 'Ajuste'", "error")	
		}	
	},
	
	async handleMoveToQualityControl() {
		try {			
			
			await Alterar_CampoEspecifico.run({Field: {"Momento de Término": moment().format('YYYY-MM-DD HH:mm')}})		
			showAlert("Momento de Término preenchido com sucesso", "success")
			
			await Alterar_CampoEspecifico.run({Field: {"Solução": "Não se aplica"}})		
			showAlert("Solução preenchida com sucesso", "success")
			
			await Alterar_CampoEspecifico.run({Field: {"Observações (do Terceiro para Gabriel)": `OS Forçada pelo CGS para Controle de Qualidade em '${moment().format('YYYY-MM-DD HH:mm')}'`}})
			showAlert("Observações (do Terceiro para Gabriel) preenchidas com sucesso", "success")
			
			storeValue("fase", "Controle de Qualidade")	
			await Alterar_CampoEspecifico.run({Field: {"Fase": appsmith.store.fase}})
			showAlert("Fase da OS alterada para 'Controle de Qualidade'", "success")
			
			const newData = await Leitura_OS_porRecordID.run()
			storeValue("selectedOS", newData.fields)
			await renderFunctions.renderPhaseState()
			resetWidget("Tabs")
		}
		catch (error) {
			console.log(error)
			showAlert("Falha ao mudar a fase da OS para 'Controle de Qualidade'", "error")
		}		
	},
	
	async handleCancelOS() {
		try {
			storeValue("fase", "Cancelado")
			await Alterar_CampoEspecifico.run({Field: {"Fase": appsmith.store.fase}})
			showAlert("OS cancelada com sucesso", "success")
			const newData = await Leitura_OS_porRecordID.run()
			storeValue("selectedOS", newData.fields)
			await renderFunctions.renderPhaseState()
		}
		catch (error) {
			showAlert("Falha ao cancelar a OS", "error")
		}
	},
	
	async handleMoveToServiceQueue() {
		if(!appsmith.store.selectedOS["Data Agendada para o Serviço"]) {
			showAlert("Data Agendada para o Serviço não foi preenchida", "error")
			return;
		}
		if(!appsmith.store.selectedOS["Período"]) {
			showAlert("Período não foi preenchido", "error")
			return;
		}
		if(!appsmith.store.selectedOS["Técnico Responsável"]) {
			showAlert("Técnico parceiro não foi definido", "error")
			return;
		}
		if (appsmith.store.selectedOS["Data Agendada para o Serviço"] != undefined || appsmith.store.selectedOS["Período"] != undefined || appsmith.store.selectedOS["Técnico Responsável"] != undefined) {
			try {
				storeValue("fase", "Fila de Serviço")
				await Alterar_CampoEspecifico.run({Field: {"Fase": appsmith.store.fase}})
				showAlert("Fase da OS alterada para 'Fila de Serviço'", "success")
				const newData = await Leitura_OS_porRecordID.run()
				storeValue("selectedOS", newData.fields)
				await renderFunctions.renderPhaseState()
				resetWidget("Tabs")
			}
			catch(error) {
				showAlert("Falha ao mudar a fase da OS para 'Fila de Serviço'", "error")
			}
		}
		else {
			showAlert("Falha ao mudar a fase da OS para 'Fila de Serviço'", "error")
		}		
	},
	
	async handleTemporaryMoveToAdjust() { // Enquanto não implementamos novo Fluxo
		try {
			storeValue("fase", "Ajuste")
			await Alterar_CampoEspecifico.run({Field: {"Fase": appsmith.store.fase}})
			showAlert("Fase da OS alterada para 'Ajuste'", "success")
			await renderFunctions.renderPhaseState()
			const newData = await Leitura_OS_porRecordID.run()
			storeValue("selectedOS", newData.fields)
			resetWidget("Tabs")
		}
		catch(error){
			showAlert("Falha ao alterar fase da OS para 'Ajuste'", "error")
		}		
	}
}