export default {
	async handleSearch(){

		//---------------FILTROS--------------------

		let formula = "AND({Fase} != 'Cancelado', {Fase} != 'Conformidade Jurídica'";

		// Filtro para Fase da OS
		if (selectFase.selectedOptionLabels.length > 1) {
			for (let i = 0; i < selectFase.selectedOptionLabels.length; i++) {
				if (i == 0) {
					formula = formula.concat(`, OR({Fase} = '${selectFase.selectedOptionLabels[i]}', `)
				}
				else if (i != 0 && i < selectFase.selectedOptionLabels.length - 1){
					formula = formula.concat(`{Fase} = '${selectFase.selectedOptionLabels[i]}',`)
				}
				else {
					formula = formula.concat(`{Fase} = '${selectFase.selectedOptionLabels[i]}')`)
				}
			}
		}
		else if (selectFase.selectedOptionLabels.length == 1) {
			formula = formula.concat(`, {Fase} = '${selectFase.selectedOptionLabels[0]}'`)
		}

		// Filtro para Tipo da OS
		if (selectTipo.selectedOptionLabels.length > 1) {
			for (let i = 0; i < selectTipo.selectedOptionLabels.length; i++) {
				if (i == 0) {
					formula = formula.concat(`, OR({Tipo de Ordem de Serviço} = '${selectTipo.selectedOptionLabels[i]}', `)
				}
				else if (i != 0 && i < selectTipo.selectedOptionLabels.length - 1){
					formula = formula.concat(`{Tipo de Ordem de Serviço} = '${selectTipo.selectedOptionLabels[i]}',`)
				}
				else {
					formula = formula.concat(`{Tipo de Ordem de Serviço} = '${selectTipo.selectedOptionLabels[i]}')`)
				}
			}
		}
		else if (selectTipo.selectedOptionLabels.length == 1) {
			formula = formula.concat(`, {Tipo de Ordem de Serviço} = '${selectTipo.selectedOptionLabels[0]}'`)
		}

		// Filtro para Técnico Parceiro
		if (selectTecnicoFilter.selectedOptionLabels.length > 1) {
			for (let i = 0; i < selectTecnicoFilter.selectedOptionLabels.length; i++) {
				if (i == 0) {
					formula = formula.concat(`, OR({Técnico Responsável} = '${selectTecnicoFilter.selectedOptionLabels[i]}', `)
				}
				else if (i != 0 && i < selectTecnicoFilter.selectedOptionLabels.length - 1){
					formula = formula.concat(`{Técnico Responsável} = '${selectTecnicoFilter.selectedOptionLabels[i]}',`)
				}
				else {
					formula = formula.concat(`{Técnico Responsável} = '${selectTecnicoFilter.selectedOptionLabels[i]}')`)
				}
			}
		}
		else if (selectTecnicoFilter.selectedOptionLabels.length == 1) {
			formula = formula.concat(`, {Técnico Responsável} = '${selectTecnicoFilter.selectedOptionLabels[0]}'`)
		}

		// Filtro para Data
		if (!!selecaoDataOS.formattedDate){
			formula = formula.concat(`, IS_SAME({Data Agendada para o Serviço}, '${selecaoDataOS.formattedDate}')`)
		}

		// Filtro para Período
		if (selectPeriodo.selectedOptionLabels.length > 1) {
			for (let i = 0; i < selectPeriodo.selectedOptionLabels.length; i++) {
				if (i == 0) {
					formula = formula.concat(`, OR({Período} = '${selectPeriodo.selectedOptionLabels[i]}', `)
				}
				else if (i != 0 && i < selectPeriodo.selectedOptionLabels.length - 1){
					formula = formula.concat(`{Período} = '${selectPeriodo.selectedOptionLabels[i]}',`)
				}
				else {
					formula = formula.concat(`{Período} = '${selectPeriodo.selectedOptionLabels[i]}')`)
				}
			}
		}
		else if (selectPeriodo.selectedOptionLabels.length == 1) {
			formula = formula.concat(`, {Período} = '${selectPeriodo.selectedOptionLabels[0]}'`)
		}

		// Filtros para Estados
		if(selecaoEstado.selectedOptionValue === 'SP'){
			formula = formula.concat(", {Cidade} = 'São Paulo'")
		}

		if(selecaoEstado.selectedOptionValue === 'RJ'){
			formula = formula.concat(", {Cidade} = 'Rio de Janeiro'")
		}

		// Filtro por título
		formula = formula.concat(`, SEARCH("${selecaoTitulo.text}", {Título})`);

		formula = formula.concat(')')

		//---------------PAGINAÇÃO--------------------
		

		let allRecords = [];

		let response = await Leitura_OS.run({
			filterByFormula: formula,
			maxRecords: 100,
		});

		allRecords = allRecords.concat(response.records);
		storeValue("allRecords", allRecords);
		return allRecords
		

			// let allRecords = [];
			// let offset = "";
// 
			// do {
			// let response = await Leitura_OS.run({
				// filterByFormula: formula,
				// maxRecords: numeroRegistros.value == "Ilimitado" ? 10000 : Number(numeroRegistros.value),
				// offset: offset,
			// });
// 
			// allRecords = allRecords.concat(response.records);
// 
			// offset = response.offset || null;
// 
			// } while (offset);
// 
			// storeValue("allRecords", allRecords);
// 
			// return allRecords
		},


	async patchPartner() {
		try {
			await Alterar_OS.run()
			showAlert("Técnico Parceiro atualizado com sucesso", "success")
		}
		catch (error) {
			showAlert("Falha ao atualizar Técnico Parceiro", "error")
		}

		closeModal(modalConfirmacaoTecnico.name)
		this.handleSearch()
	},

	resetFilters() {
		Leitura_OS.clear()
		clearStore()
	}	,

	normalizeString(value){
		return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
	},
}