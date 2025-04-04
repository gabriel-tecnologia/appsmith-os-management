export default {
	async changeOS() {
		if (appsmith.store.selectedOS.Fase == "Controle de Qualidade") {	
			if (selectAdjustReason.selectedOptionValue != "") {
				try {
					storeValue("fase", "Ajuste")
					await Alterar_CampoEspecifico.run({Field: {"Fase": appsmith.store.fase}})
					const newData = await Leitura_OS_porRecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
					storeValue("selectedOS", newData.fields)
					showAlert("Fase da OS alterada para 'Ajuste'", "success")
				}
				catch (error) {
					showAlert("Falha em alterar a fase da OS para 'Ajuste'", "error")
					return;
				}
			}
			else if (selectImproductiveReason.selectedOptionValue != "") {
				try {
					storeValue("fase", "Improdutiva")
					await Alterar_CampoEspecifico.run({Field: {"Fase": appsmith.store.fase}})
					const newData = await Leitura_OS_porRecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
					storeValue("selectedOS", newData.fields)
					showAlert("Fase da OS alterada para 'Improdutiva'", "success")	
				}
				catch (error) {
					showAlert("Não foi possível alterar a fase da OS para 'Improdutiva'", "error")
					const newData = await Leitura_OS_porRecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
					storeValue("selectedOS", newData.fields)
					return;
				}
				try {
					await createOS.handleCreateOS()
					showAlert("Nova OS criada com sucesso", "success")
					const newData = await Leitura_OS_porRecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
					storeValue("selectedOS", newData.fields)
				}
				catch (error) {
					showAlert("Falha em criar nova OS", "error")
					return;
				}
			}
			else {
				showAlert("Preencha o motivo de ajuste/improdutiva", "error")
				return;
			}
		}
		
		else if (appsmith.store.selectedOS.Fase == "Agendamento de Serviço") {
			try {
				storeValue("fase", "Fila de Serviço")
				await Alterar_CampoEspecifico.run({Field: {"Fase": appsmith.store.fase}})
				const newData = await Leitura_OS_porRecordID.run({
						recordId: appsmith.store.selectedOS.record_id
				});
				storeValue("selectedOS", newData.fields)
				showAlert("Fase da OS alterada para 'Fila de Serviço'", "success")
			}
			catch (error) {
				showAlert("Falha em alterar a fase da OS para 'Fila de Serviço'", "error")
				return;
			}
		}
	const newOS = await Leitura_OS_porRecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
	storeValue("selectedOS", newOS.fields)
	},
	
	async changeOSFields () {	
		if (appsmith.store.selectedOS.Fase == "Controle de Qualidade") {
			if (!valorACobrarCliente.isValid) {
				showAlert("O Valor a Cobrar (do Cliente) não é válido", "error")
				return;
			}
			if (!valorAPagarParceiro.isValid) {
				showAlert("O Valor a Pagar (ao Terceiro) não é válido", "error")
				return;
			}
			if (!inputJustifValorACobrar.isValid) {
				showAlert("A Justificativa de Valor a Cobrar não é válida", "error")
				return;
			}
			if(!inputJustifValorAPagar.isValid) {	
				showAlert("A Justificativa de Valor a Pagar Divergente não é válida", "error")
				return;
			}
			
			try {
				await Alterar_OS.run()
				const newOS = await Leitura_OS_porRecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
				storeValue("selectedOS", newOS.fields)
				showAlert("Alterações feitas com sucesso", "success")
			}
			catch(error) {
				showAlert("Falha ao alterar informações", "error")
			}
			
			if (selectAdjustReason.selectedOptionLabel != "" || selectImproductiveReason.selectedOptionLabel != "") {
				showModal(confirmModal.name)
			}
		}
		else if (appsmith.store.selectedOS.Fase == "Agendamento de Serviço") {
			if (selectDate.formattedDate == "") {
				showAlert("É necessário preencher 'Data Agendada'", "error")
				return;
			}
			if (selectPeriod.selectedOptionLabel == "") {
				showAlert("É necessário preencher 'Período'", "error")
				return;
			}
			if (selectPartner.selectedOptionLabel == "") {
				showAlert("É necessário preencher 'Técnico Parceiro'", "error")
				return;
			}
			else {
				try {
					await Alterar_OS.run()
					const newOS = await Leitura_OS_porRecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
					storeValue("selectedOS", newOS.fields)
					showAlert("Alterações feitas com sucesso", "success")
					showModal(confirmModal.name)
				}
				catch(error) {
					showAlert("Falha ao alterar informações", "error")
				}					
			}
		}
		// else if (appsmith.store.selectedOS.Fase == "Fila de Serviço") {
			// if (selectDate.formattedDate == "") {
				// showAlert("É necessário preencher 'Data Agendada'", "error")
				// return;
			// }
			// if (selectPeriod.selectedOptionLabel == "") {
				// showAlert("É necessário preencher 'Período'", "error")
				// return;
			// }
			// if (selectPartner.selectedOptionLabel == "") {
				// showAlert("É necessário preencher 'Técnico Parceiro'", "error")
				// return;
			// }
			// else {
				// try {
					// await Alterar_OS.run()
					// const newOS = await Leitura_OS_porRecordID.run({
						// recordId: appsmith.store.selectedOS.record_id
					// });
					// storeValue("selectedOS", newOS.fields)
					// showAlert("Alterações feitas com sucesso", "success")
				// }
				// catch(error) {
					// showAlert("Falha ao alterar informações", "error")
				// }
			// }
		// }
		else {
			try {
				await Alterar_OS.run()
				const newOS = await Leitura_OS_porRecordID.run({
						recordId: appsmith.store.selectedOS.record_id
					});
				storeValue("selectedOS", newOS.fields)
				showAlert("Alterações feitas com sucesso", "success")
			}
			catch(error) {
				showAlert("Falha ao alterar informações", "error")
			}
		}
	}
}
