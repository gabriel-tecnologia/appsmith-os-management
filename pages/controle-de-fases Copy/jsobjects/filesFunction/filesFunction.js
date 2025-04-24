export default {
	
	async compressAndUpload(files) {
		
		const scale = 0.5;
		const quality = 0.9;
		const compressedFiles = [];
		
		try {
			for (const file of files) {
				// Se for vídeo, dá bypass na compressão
				if (file.type === "video/mp4") {
					compressedFiles.push(file)
				}
				else {
					// Logs para visibilidade
					console.log("Arquivo recebido do FilePicker:", file);

					// Convertendo de base64 para Blob
					const fileBlob = await this.base64ToBlob(file.data);

					// Comprimindo cada imagem usando a lib
					const compressedFile = await this.compressImage(fileBlob, scale, quality, file.name);

					// Reconverte de Blob para Base64
					const compressedBase64 = await this.blobToBase64(compressedFile);

					// Pusha para a lista no formato base64
					compressedFiles.push({
						data: compressedBase64,
						id: file.id,
						name: file.name,
						type: file.type,
						size: compressedFile.size
					});
				}			
			}		
		}
		catch (error) {
			showAlert("Erro ao comprimir imagens", "error")
			await this.envia_arquivos_pra_nuvem(files)
			return
		}

		try {
			await this.envia_arquivos_pra_nuvem(compressedFiles);
			showAlert("Upload de arquivos finalizado com sucesso", "success")
		}
		catch(error) {
			showAlert("Falha ao fazer upload de arquivos", "error")
		}
	},
	
	async compressImage(file, scale, quality, fileName) {
		const options = {
			maxSizeMB: 1,
			maxWidthOrHeight: Math.round(2000 * scale),
			useWebWorker: true,
			initialQuality: quality
		};

		try {
			const compressedBlob = await imageCompression(file, options);
			return this.blobToFile(compressedBlob, fileName);
		} catch (error) {
			console.error('Erro ao comprimir a imagem:', error);
			throw error;
		}
	},
		
	async base64ToBlob(dataURL) {
    console.log("DataURL recebido em base64ToBlob", dataURL);
		
    const response = await fetch(dataURL);
    const blob = await response.blob();
		
    console.log("Blob enviado como resposta", blob);
		
    return blob;
	},
	
	blobToFile(blob, fileName) {
		const object = {
			name: fileName,
			type: blob.type,
			size: blob.size,
			blob: blob
		};
		return object
	},
	
	async blobToBase64(input) {
		const blob = input.blob || input;

		if (typeof blob.arrayBuffer !== "function") {
			console.error("Objeto passado não é um Blob válido:", blob);
			throw new Error("blob.arrayBuffer is not a function");
		}

		const arrayBuffer = await blob.arrayBuffer();
		const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
		return `data:${blob.type};base64,${base64String}`;
	},
	
	async envia_arquivos_pra_nuvem(arquivos) {
		storeValue("tipo_arquivo", "Foto do Servico")
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
		
		for (const arquivo of arquivos) {
			const resposta = await Enviar_Arquivos_S3.run({
				filesData: arquivo
			});
			const url = resposta.signedUrl;
			arquivos_para_envio.push({"url": url});
			storeValue('arquivo_para_nuvem', null);
		}
		
		try {
			await Enviar_Fotos_Airtable.run({
				photosUrl: arquivos_para_envio
			});
			showAlert("Foto(s) enviada(s) com sucesso", "success")
		}
		catch(error) {
			showAlert("Falha ao enviar foto(s)", "error")
		}

		storeValue('arquivo_para_nuvem', null);
		storeValue('arquivos_para_envio_airtable', null);
		
		const newOS = await Leitura_OS_Por_RecordID.run({
			recordId: appsmith.store.selectedOS.record_id
		});
		storeValue('selectedOS', newOS.fields)
		
		resetWidget("listaVideos", true)
		},
	
	async enviarTermoS3(arquivos) {
		storeValue("tipo_arquivo", "term")
		let arquivos_para_envio = [];
		
		for (const arquivo of arquivos){
			storeValue('arquivo_para_nuvem', arquivo);
			const resposta = await Enviar_Arquivos_S3.run({
				filesData: arquivo
			});
			const url = resposta.signedUrl;
			arquivos_para_envio.push({"url": url});
			storeValue('arquivo_para_nuvem', null);
		}
		
		try {
			await Enviar_Termo.run({
				term: arquivos_para_envio
			});
			showAlert("Termo enviado com sucesso", "success")
		}
		catch (error) {
			showAlert("Falha ao enviar termo de finalização", "error")
		}

		storeValue('arquivo_para_nuvem', null);
		storeValue('arquivos_para_envio_airtable', null);
		
		const newOS = await Leitura_OS_Por_RecordID.run({
			recordId: appsmith.store.selectedOS.record_id
		});
		storeValue('selectedOS', newOS.fields)
	},
	
	async removerFotoAirtable() {
		let fotos = appsmith.store.selectedOS["Foto do Serviço"]
		
		fotos = fotos.filter(image => image.url != galery.model.image.url)
				
		try {
			await Enviar_Fotos_Airtable.run({
				photosUrl: fotos
			});
			const newOS = await Leitura_OS_Por_RecordID.run({
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
	
	async removerVideoAirtable(video) {
		let arquivos = appsmith.store.selectedOS["Foto do Serviço"]
		
		arquivos = arquivos.filter(arquivo => arquivo.url != video.url)
		
		try {
			await Enviar_Fotos_Airtable.run({
				photosUrl: arquivos
			});
			const newOS = await Leitura_OS_Por_RecordID.run({
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
	
	renderImages(list) {
		return list.filter(file => file.type == "image/jpeg" || file.type == "image/png")
	},
	
	renderFile(fileName) {
		if (fileName.includes(".jpg") || (fileName.includes(".png") || (fileName.includes(".jpeg")))) {
			return 'imagem'
		}
		else {
			return 'video'
		}
	}
}