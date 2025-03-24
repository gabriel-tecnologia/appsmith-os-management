export default {
	async navigateToApp() {
		const record = await Record_ID_UserEmail.data.records[0].fields.record_id
		
		console.log(record)
		
		await Atualizar_Empresa_Usuario.run({record: record})
	
		navigateTo('https://appsmith.gabriel.com.br/app/ordem-de-servico/agenda-6679ce43aa707072e5982ffe?branch=master&environment=production', {}, 'NEW_WINDOW')
	}
	
}