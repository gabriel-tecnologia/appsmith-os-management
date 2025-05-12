export default {
	
	async compressAndUpload(files) {
		const scale = 0.5;
    const quality = 0.9;
    const compressedFiles = [];
    
    try {

			for (const file of files) {
				console.log("Iniciando processamento do arquivo:", file.name);

				// Se for vídeo, adiciona diretamente à lista
				if (file.type === "video/mp4") {
					compressedFiles.push(file);
					console.log("Arquivo de vídeo bypassado:", file.name);
					continue;
				}

				try {
					// Convertendo de base64 para Blob
					const fileBlob = await this.base64ToBlob(file.data);
					console.log("Blob criado para o arquivo:", file.name);

					// Comprimindo a imagem
					const compressedFile = await this.compressImage(fileBlob, scale, quality, file.name);
					console.log("Imagem comprimida:", file.name);

					// Convertendo de Blob para Base64
					const compressedBase64 = await this.blobToBase64(compressedFile);
					console.log("Imagem convertida para Base64:", file.name);

					// Adicionando à lista final
					compressedFiles.push({
						data: compressedBase64,
						id: file.id,
						name: file.name,
						type: file.type,
						size: compressedFile.size
					});
				} catch (error) {
					console.error("Erro ao processar o arquivo:", file.name, error);
					throw error;
				}
			}

			showAlert("Compressão de arquivos realizada com sucesso", "success");
		} catch (error) {
			console.error("Erro ao comprimir arquivos:", error);
			showAlert("Erro ao comprimir arquivos", "error");
			await this.envia_arquivos_pra_nuvem(files); // Envia os arquivos originais, se falhar
			return;
    }

    try {
        console.log("Iniciando upload de arquivos comprimidos...");
        await this.envia_arquivos_pra_nuvem(compressedFiles);
        showAlert("Upload de arquivos finalizado com sucesso", "success");
    } catch (error) {
        console.error("Erro ao fazer upload de arquivos:", error);
        showAlert("Falha ao fazer upload de arquivos", "error");
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

    // Valida se o objeto é um Blob válido
    if (!blob || typeof blob.arrayBuffer !== "function") {
        console.error("Objeto passado não é um Blob válido:", blob);
        throw new Error("Objeto não é um Blob válido");
    }

    console.log("Iniciando conversão de Blob para Base64, tamanho:", blob.size);

    try {
        // Converte o Blob em ArrayBuffer
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Processa o ArrayBuffer em pedaços menores
        const chunkSize = 1024 * 1024; // 1 MB
        let binaryString = "";

        for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.slice(i, i + chunkSize);
            binaryString += Array.from(chunk, byte => String.fromCharCode(byte)).join("");
        }

        // Converte a string binária para Base64
        const base64String = btoa(binaryString);
        return `data:${blob.type};base64,${base64String}`;
    } catch (error) {
        console.error("Erro ao converter Blob para Base64:", error);
        throw new Error("Erro durante a conversão de Blob para Base64");
    }
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
		
		try {
			for (const arquivo of arquivos) {
				const resposta = await Enviar_Arquivos_S3.run({
					fileName: arquivo.name,
					filesData: arquivo
				});
				const url = resposta.signedUrl;
				arquivos_para_envio.push({"url": url});
				storeValue('arquivo_para_nuvem', null);
			}
			showAlert("Arquivos enviados ao S3 com sucesso", "success")
		}
		catch(error) {
			showAlert("Falha ao enviar arquivos para o S3", "error")
		}
		
		
		try {
			await Enviar_Fotos_Airtable.run({
				photosUrl: arquivos_para_envio
			});
			showAlert("Arquivos enviados ao Airtable com sucesso", "success")
		}
		catch(error) {
			showAlert("Falha ao enviar arquivos para o Airtable", "error")
		}

		storeValue('arquivo_para_nuvem', null);
		storeValue('arquivos_para_envio_airtable', null);
		
		const newOS = await Leitura_OS_Por_RecordID.run({
			recordId: appsmith.store.selectedOS.record_id
		});
		storeValue('selectedOS', newOS.fields)
		
		galery.model.data = newOS.fields["Foto do Serviço"]
		
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
	
	renderImagens(list) {
		return list.filter(file => file.type == "image/jpeg" || file.type == "image/png")
	}
}