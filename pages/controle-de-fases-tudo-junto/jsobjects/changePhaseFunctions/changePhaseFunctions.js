export default {
	async handleMoveToConcluded(){
		if (!appsmith.store.selectedOS["Foto do Serviço"]){
			showAlert("Falta incluir Fotos do Serviço", "error")
			return;
		}
		if (!appsmith.store.selectedOS["Termo de Finalização"] && (appsmith.store.selectedOS["Tipo de Ordem de Serviço"] == "Adesão" || appsmith.store.selectedOS["Tipo de Ordem de Serviço"] == "Desinstalação")){ // No futuro, adicionar Aditivo
			showAlert("Falta incluir Termo de Finalização", "error")
			return;
		}
		if (!appsmith.store.selectedOS["Observações (do Terceiro para Gabriel)"] && appsmith.store.selectedOS["Tipo de Ordem de Serviço"] !== "Adesão"){
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
		
		if (appsmith.store.selectedOS.Fase == "Ajuste" && appsmith.store.selectedOS["Motivo do Ajuste"] == undefined) {
			showAlert("Falta incluir o Motivo do Ajuste", "error")
			return;
		}
		
		if (appsmith.store.selectedOS["Tipo de Ordem de Serviço"] == "Manutenção" && appsmith.store.selectedOS["Solução"] == undefined) {
			showAlert("Falta incluir a Solução", "error")
			return;
		}
		
		try {
			storeValue("fase", "Concluído")
			await Alterar_Campo_Especifico.run({Field: {"Fase": appsmith.store.fase}})
			const newData = await Leitura_OS_Por_RecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
			storeValue("selectedOS", newData.fields)
			showAlert("OS concluída com sucesso", "success")
			await renderFunctions.renderPhaseState()
		}
		catch(error) {
			showAlert("Erro ao concluir OS", "error")
		}
	},
	
	async handleMoveToSchedule() {
		
		try {
			await Alterar_Campo_Especifico.run({Field: {"Período": null}})
			await Alterar_Campo_Especifico.run({Field: {"Data Agendada para o Serviço": null}})
			await Alterar_Campo_Especifico.run({Field: {"Técnico Responsável": null}})
		}
		catch (error) {
			showAlert("Falha ao limpar campos: Período e Data de Agendamento", "error")
		}
			
		try {
			storeValue("fase", "Agendamento de Serviço")
			await Alterar_Campo_Especifico.run({Field: {"Fase": appsmith.store.fase}})
			const newData = await Leitura_OS_Por_RecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
			storeValue("selectedOS", newData.fields)
			showAlert("OS movida para 'Agendamento' com sucesso", "success")
			await renderFunctions.renderPhaseState()
		}
		catch(error) {
			showAlert("Erro ao mudar a fase da OS para 'Agendamento'", "error")
		}
	},
	
	async handleMoveToReschedule() {
		
		try {
			await Alterar_Campo_Especifico.run({Field: {"Período": null}})
			await Alterar_Campo_Especifico.run({Field: {"Data Agendada para o Serviço": null}})
			await Alterar_Campo_Especifico.run({Field: {"Técnico Responsável": null}})
		}
		catch (error) {
			showAlert("Falha ao limpar campos: Período e Data de Agendamento", "error")
		}
			
		try {
			storeValue("fase", "Reagendamento de Serviço")
			await Alterar_Campo_Especifico.run({Field: {"Fase": appsmith.store.fase}})
			const newData = await Leitura_OS_Por_RecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
			storeValue("selectedOS", newData.fields)
			showAlert("OS movida para 'Reagendamento' com sucesso", "success")
			await renderFunctions.renderPhaseState()
		}
		catch(error) {
			showAlert("Erro ao mudar a fase da OS para 'Reagendamento'", "error")
		}
	},
	
	async handleStartOS() { // Poderá fazer no novo fluxo?
		try {
			storeValue('hora_inicio',new Date())
			await Alterar_Campo_Especifico.run({Field: {"Momento de Início": appsmith.store.hora_inicio}})
			showAlert("Momento de Início registrado com sucesso", "success")
			
			storeValue("fase", "Serviço em Andamento")
			await Alterar_Campo_Especifico.run({Field: {"Fase": appsmith.store.fase}})
			showAlert("OS iniciada com sucesso", "success")
			
			const newData = await Leitura_OS_Por_RecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
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
		if (selecaoMotivo.selectedOptionLabel != "") {
			try {
				await Alterar_Campo_Especifico.run({Field: {"Motivo de Improdutiva": selecaoMotivo.selectedOptionLabel}})
				showAlert("Motivo de Improdutiva atualizado", "success")
			}
			catch (error) {
				showAlert("Falha ao atualizar Motivo de Improdutiva", "error")
				return;
			}
		}
		else if (selectImproductiveReason.selectedOptionLabel != "") {
			try {
				await Alterar_Campo_Especifico.run({Field: {"Motivo de Improdutiva": selectImproductiveReason.selectedOptionLabel}})
				showAlert("Motivo de Improdutiva atualizado", "success")
			}
			catch (error) {
				showAlert("Falha ao atualizar Motivo de Improdutiva", "error")	
				return;
			}
		}
		else if (selecaoMotivoCopy.selectedOptionLabel != "") {
			try {
				await Alterar_Campo_Especifico.run({Field: {"Motivo de Improdutiva": selecaoMotivoCopy.selectedOptionLabel}})
				showAlert("Motivo de Improdutiva atualizado", "success")
			}
			catch (error) {
				showAlert("Falha ao atualizar Motivo de Improdutiva", "error")
				return;
			}
		}
		else {
			showAlert("Falha ao mudar a fase para Improdutiva, falta preencher o motivo", "error")
			return
		}
		
		try {
			storeValue("fase", "Improdutiva")
			await Alterar_Campo_Especifico.run({Field: {"Fase": appsmith.store.fase}})
			showAlert("Fase da OS alterada para 'Improdutiva'", "success")
			const newData = await Leitura_OS_Por_RecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
			storeValue("selectedOS", newData.fields)
		}
		catch(error) {
			showAlert("Falha ao alterar fase da OS para 'Improdutiva'", "error")
		}
		
		if (appsmith.store.selectedOS.Fase == "Improdutiva" && appsmith.store.selectedOS["Motivo de Improdutiva"] != "Não foi necessário realizar o serviço" && appsmith.store.selectedOS["OS (Filha)"] == undefined) {
			try {
				await createOS.handleCreateOS()
				showAlert("Nova OS criada com sucesso", "success")
				
				const newData = await Leitura_OS_Por_RecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
				storeValue("selectedOS", newData.fields)
			}
			catch(error) {
				showAlert("Falha ao criar uma nova OS", "error")
				console.log(error)
				storeValue("fase", "Controle de Qualidade")	
				await Alterar_Campo_Especifico.run({Field: {"Fase": appsmith.store.fase}})
				showAlert("Fase da OS retornou para 'Controle de Qualidade'", "success")

				const newData = await Leitura_OS_Por_RecordID.run({
							recordId: appsmith.store.selectedOS.record_id
						});
				storeValue("selectedOS", newData.fields)
				await renderFunctions.renderPhaseState()
				resetWidget("Tabs")
			}
		}
	},
	
	async handleMoveToAdjust() {
		if (selecaoMotivo.selectedOptionLabel != "") {
			try {
				await Alterar_Campo_Especifico.run({Field: {"Motivo do Ajuste": selecaoMotivo.selectedOptionLabel}})
				showAlert("Motivo de Ajuste atualizado", "success")
			}
			catch (error) {
				showAlert("Falha ao atualizar o Motivo de Ajuste", "error")
			}
		}
		else if (selectAdjustReason.selectedOptionLabel != "") {
			try {
				await Alterar_Campo_Especifico.run({Field: {"Motivo do Ajuste": selectAdjustReason.selectedOptionLabel}})
				showAlert("Motivo de Ajuste atualizado", "success")
			}
			catch (error) {
				showAlert("Falha ao atualizar o Motivo de Ajuste", "error")
			}
		}
		else {
			showAlert("Falha ao mudar a fase para Ajuste, falta preencher o motivo", "error")
			return
		}
		
		if (appsmith.store.selectedOS["Tipo de Ordem de Serviço"] == "Manutenção" && appsmith.store.selectedOS["Solução"] == undefined) {
			showAlert("Falta incluir a Solução", "error")
			return;
		}
		
		try {
			storeValue("fase", "Ajuste")
			await Alterar_Campo_Especifico.run({Field: {"Fase": appsmith.store.fase}})
			showAlert("Fase da OS alterada para 'Ajuste'", "success")
			await renderFunctions.renderPhaseState()
			const newData = await Leitura_OS_Por_RecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
			storeValue("selectedOS", newData.fields)
			resetWidget("Tabs")
		}
		catch(error){
			showAlert("Falha ao alterar fase da OS para 'Ajuste'", "error")
		}			
	},
	
	async handleMoveToQualityControl() {
		
		if (appsmith.store.selectedOS["Tipo de Ordem de Serviço"] == "Manutenção" && appsmith.store.selectedOS["Solução"] == undefined) {
			showAlert("Falta incluir a Solução", "error")
			return;
		}
		
		try {
			await Alterar_Campo_Especifico.run({Field: {"Momento de Término": moment().format('YYYY-MM-DD HH:mm')}})		
			showAlert("Momento de Término preenchido com sucesso", "success")
		}
		catch(error) {
			showAlert("Falha ao preencher Momento de Término", "error")
			return;
		}
		
		try {
			await Alterar_Campo_Especifico.run({Field: {"Observações (do Terceiro para Gabriel)": `OS Forçada pelo CGS para Controle de Qualidade em '${moment().format('YYYY-MM-DD HH:mm')}'`}})
			showAlert("Observações (do Terceiro para Gabriel) preenchidas com sucesso", "success")
		}
		catch (error) {
			showAlert("Falha ao preencher Observações do Terceiro", "error")
			return
		}
			
		try {		
			storeValue("fase", "Controle de Qualidade")	
			await Alterar_Campo_Especifico.run({Field: {"Fase": appsmith.store.fase}})
			showAlert("Fase da OS alterada para 'Controle de Qualidade'", "success")
			
			const newData = await Leitura_OS_Por_RecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
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
		
		if (appsmith.store.selectedOS.Fase == "Ajuste" && appsmith.store.selectedOS["Motivo do Ajuste"] == undefined) {
			showAlert("Falta incluir o Motivo de Ajuste", "error")
			return;
		}
		
		try {
			storeValue("fase", "Cancelado")
			await Alterar_Campo_Especifico.run({Field: {"Fase": appsmith.store.fase}})
			showAlert("OS cancelada com sucesso", "success")
			const newData = await Leitura_OS_Por_RecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
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
				await Alterar_Campo_Especifico.run({Field: {"Fase": appsmith.store.fase}})
				showAlert("Fase da OS alterada para 'Fila de Serviço'", "success")
				const newData = await Leitura_OS_Por_RecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
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
	}
}