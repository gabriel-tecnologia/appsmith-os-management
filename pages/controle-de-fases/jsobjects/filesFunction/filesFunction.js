export default {
	async envia_arquivos_pra_nuvem(arquivos){
		storeValue("tipo_arquivo", "instruction")
		let arquivos_para_envio;
		let fotos = appsmith.store.selectedOS["Foto do Serviço"]
		console.log(fotos)
		if(fotos == undefined){
			arquivos_para_envio = [];
		}
		else{
			arquivos_para_envio = fotos.map(foto => ({"url": foto.url}));
		}
		console.log(arquivos_para_envio)
		for (const arquivo of arquivos){
			storeValue('arquivo_para_nuvem', arquivo);
			const resposta = await Upload_Images.run();
			const url = resposta.signedUrl;
			arquivos_para_envio.push({"url": url});
			storeValue('arquivo_para_nuvem', null);
		}
		storeValue('photosUrl', arquivos_para_envio);
		try {
			await Enviar_Fotos.run();
			showAlert("Foto(s) enviada(s) com sucesso", "success")
		}
		catch (error) {
			showAlert("Falha ao enviar foto(s)", "error")
		}

		storeValue('arquivo_para_nuvem', null);
		storeValue('arquivos_para_envio_airtable', null);
		
		const newOS = await Leitura_OS_porRecordID.run({
			recordId: appsmith.store.selectedOS.record_id
		});
		storeValue('selectedOS', newOS.fields)
		
		resetWidget("listaVideos", true)
		},
	
	async enviarTermoS3(arquivos){
		storeValue("tipo_arquivo", "term")
		let arquivos_para_envio = [];
		for (const arquivo of arquivos){
			storeValue('arquivo_para_nuvem', arquivo);
			const resposta = await Upload_Images.run();
			const url = resposta.signedUrl;
			arquivos_para_envio.push({"url": url});
			storeValue('arquivo_para_nuvem', null);
		}
		storeValue('termUrl', arquivos_para_envio);
		
		try {
			await Enviar_termo.run();
			showAlert("Termo enviado com sucesso", "success")
		}
		catch (error) {
			showAlert("Falha ao enviar termo de finalização", "error")
		}

		storeValue('arquivo_para_nuvem', null);
		storeValue('arquivos_para_envio_airtable', null);
		
		const newOS = await Leitura_OS_porRecordID.run({
			recordId: appsmith.store.selectedOS.record_id
		});
		storeValue('selectedOS', newOS.fields)
	},
	async removerFotoAirtable(){
		let fotos = appsmith.store.selectedOS["Foto do Serviço"]
		
		fotos = fotos.filter(image => image.url != galery.model.image.url)
		
		storeValue("photosUrl", fotos)
		
		try {
			await Enviar_Fotos.run()
			const newOS = await Leitura_OS_porRecordID.run({
				recordId: appsmith.store.selectedOS.record_id
			});
			storeValue('selectedOS', newOS.fields)
			resetWidget("listaVideos", true)
			galery.model.data = newOS.fields["Foto do Serviço"]
			showAlert(`Imagem removida com sucesso '${galery.model.image.filename}'`, "success")
		}
		catch(error) {
			showAlert("Falha ao remover arquivo", "error")
		}
	},
	
	async removerVideoAirtable(video){
		let arquivos = appsmith.store.selectedOS["Foto do Serviço"]
		
		arquivos = arquivos.filter(arquivo => arquivo.url != video.url)
		
		storeValue("photosUrl", arquivos)
		
		try {
			await Enviar_Fotos.run()
			const newOS = await Leitura_OS_porRecordID.run({
				recordId: appsmith.store.selectedOS.record_id
			});
			storeValue('selectedOS', newOS.fields)
			showAlert(`Vídeo removido com sucesso '${video.filename}'`, "success")
		}
		catch(error) {
			showAlert("Falha ao remover arquivo", "error")
		}
	},
	
	renderVideos(list) {
		return list.filter(file => file.type == "video/mp4")
	},
	
	renderImagens(list) {
		return list.filter(file => file.type == "image/jpeg")
	}
}