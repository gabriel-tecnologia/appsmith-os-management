export default {
	async handleCreateMovement() {	
		const fields = {
			"Tipo de Movimento": appsmith.store.currentStock["Tipo de Movimento"],
			"Ordem de Servico": appsmith.store.currentStock["Ordem de Servico"],
			"Camaleão": Number(inputKitsCamaleao.text) || 0,
			"Sistema Nervoso 2": Number(inputSistemaNervoso2.text) || 0,
			"Kit Poste Canguru": Number(inputPosteCanguru.text) || 0,
			"Kit Poste 2.0 (Piso)": Number(inputPostePisoBranco.text) || 0,
			"Kit Poste 2.0 (Parede)": Number(inputPosteParede.text) || 0,
			"Placa de Sinalização - Gravata - 0800 GAB-RIEL": Number(inputPlacaVerde.text) || 0,
			"Placa de Sinalização - Gravata 2- 0800 GAB-RIEL": Number(inputPlacaBranca.text) || 0,
			"Placa Bolacha": Number(inputPlacaBolacha.text) || 0,
			"MAC Address do Roteador": appsmith.store.currentStock["MAC Address do Roteador"] ?? "",
			"Cancelar Remessa de Produto": false,
			"Cadastrar Remessa de Produto": true
		}
		try{
			await Criar_Movimento_Estoque.run({
				Fields: fields
			});
			showAlert("Movimento de estoque criado com sucesso", "success")
		}
		catch (error) {
			showAlert("Falha ao criar novo movimento de estoque", "error")
		}			
	},
	
	async handleCreateNewMovement() {
		let fields = "";
		
		fields = {
			"Ordem de Servico": [appsmith.store.selectedOS["record_id"]],
			"Camaleão": Number(inputKitsCamaleaoCopyCopy.text) || 0,
			"Sistema Nervoso 2": Number(inputSistemaNervoso2CopyCopy.text) || 0,
			"Kit Poste Canguru": Number(inputPosteCanguruCopyCopy.text) || 0,
			"Kit Poste 2.0 (Piso)": Number(inputPostePisoBrancoCopyCopy.text) || 0,
			"Kit Poste 2.0 (Parede)": Number(inputPosteParedeCopyCopy.text) || 0,
			"Placa de Sinalização - Gravata - 0800 GAB-RIEL": Number(inputPlacaVerdeCopyCopy.text) || 0,
			"Placa de Sinalização - Gravata 2- 0800 GAB-RIEL": Number(inputPlacaBrancaCopyCopy.text) || 0,
			"Tipo de Movimento": Select1.selectedOptionValue,
			"Placa Bolacha": Number(inputPlacaBolachaCopyCopy.text) || 0,
			"MAC Address do Roteador": inputMacAddressRoteador.text || "",
			"Cancelar Remessa de Produto": false,
			"Cadastrar Remessa de Produto": true
		}
    
		try{
			await Criar_Movimento_Estoque.run({
				Fields: fields
			});
			showAlert("Movimento de estoque criado com sucesso", "success")
		}
		catch (error) {
			showAlert("Falha ao criar novo movimento de estoque", "error")
			console.log(error)
		}			
	}
}