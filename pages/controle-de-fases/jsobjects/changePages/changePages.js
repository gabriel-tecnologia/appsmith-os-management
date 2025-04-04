export default {
	async renderOSMotherInfo() {
		let motherOS = await Leitura_OS_porRecordID.run({
			recordId: appsmith.store.selectedOS["OS (Mãe)"][0]
		});

		storeValue('selectedOS', motherOS.fields)

		navigateTo('controle-de-fases', {}, 'SAME_WINDOW');
		
		await renderFunctions.renderOSMotherInfo()
		await renderFunctions.renderOSChildInfo()
			
	},
	async renderOSChildInfo() {
		let childOS = await Leitura_OS_porRecordID.run({
			recordId: appsmith.store.selectedOS["OS (Filha)"][0]
		});

		storeValue('selectedOS', childOS.fields)

		navigateTo('controle-de-fases', {}, 'SAME_WINDOW');

		await renderFunctions.renderOSMotherInfo()
		await renderFunctions.renderOSChildInfo()

	}
}