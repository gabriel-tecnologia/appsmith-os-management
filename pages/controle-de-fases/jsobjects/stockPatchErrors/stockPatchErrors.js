export default {
	async handleExitError() {
		if (appsmith.store.exitStock != undefined) {
			var recordId = appsmith.store.exitStock.record_id
		}
		try {
			await Adicionar_Erro_de_Remessa.run({
			recordId: recordId
			});
			showAlert("Erro de remessa adicionado com sucesso", "success")
		}
		catch (error) {
			showAlert("Falha ao adicionar erro de remessa", "erro")
		}
	},
	
	async handleReturnError() {
		if (appsmith.store.returnStock != undefined) {
			var recordId = appsmith.store.returnStock.record_id
		}
		
		try {
			await Adicionar_Erro_de_Remessa.run({
			recordId: recordId
			});
			showAlert("Erro de remessa adicionado com sucesso", "success")
		}
		catch (error) {
			showAlert("Falha ao adicionar erro de remessa", "erro")
		}
	}
}