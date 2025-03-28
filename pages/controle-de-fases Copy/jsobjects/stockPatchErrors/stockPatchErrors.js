export default {
	async handleMovementError() {
		var recordId = appsmith.store.currentStock.record_id

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