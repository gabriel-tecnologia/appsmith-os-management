export default {

  async compressAndUpload(files) {
    const scale = 0.5;
    const quality = 0.75;
    let statusEnvio = true;

    showModal(modalCarregamentoArquivos.name);

    for (const file of files) {
      let finalCompressedFile = file;

      // Se for vídeo, dá bypass na compressão
      if (file.type !== "video/mp4") {
        try {
          const fileBlob = await this.base64ToBlob(file.data);
          const compressedFile = await this.compressImage(fileBlob, scale, quality, file.name);
          const compressedBase64 = await this.blobToBase64(compressedFile);

          finalCompressedFile = {
            data: compressedBase64,
            id: file.id,
            name: file.name,
            type: file.type,
            size: compressedFile.size
          };

          showAlert(`Arquivo '${finalCompressedFile.name}' foi comprimido com sucesso`, "success");
        } catch (error) {
          showAlert(`Falha ao comprimir o arquivo '${file.name}', enviando original`, "error");
        }
      }

      try {
        const resposta = await Enviar_Arquivo_S3.run({
					installationIdBifrost: appsmith.store.selectedOS["installationIdBifrost (from id_assinatura)"][0],
					idOs: appsmith.store.selectedOS.id_os,
					tipo_arquivo: "service_pictures",
          fileName: finalCompressedFile.name,
          filesData: finalCompressedFile
        });
				showAlert(`Arquivo '${finalCompressedFile.name}' enviado ao S3 com sucesso`, "success");
			}
			catch(error){
				showAlert(`Falha ao enviar arquivo '${finalCompressedFile.name}' ao S3`, "error");
			}
    }

    const newOS = await Leitura_OS_Por_RecordID.run({
				recordId: appsmith.store.selectedOS.record_id
			});
			storeValue('selectedOS', newOS.fields)
			resetWidget("listaVideos", true)
			galery.model.data = newOS.fields["Foto do Serviço"]
			
			await changeOSFunctions.renderChangeHistory()

    closeModal(modalCarregamentoArquivos.name);

    if (!statusEnvio) {
      showModal(modalFalhaEnvioArquivos.name);
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
    return object;
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

  async enviarTermoS3(arquivos) {
		let arquivos_para_envio = [];
		
		try {
			for (const arquivo of arquivos){
				storeValue('arquivo_para_nuvem', arquivo);
				const resposta = await Enviar_Arquivo_S3.run({
					installationIdBifrost: appsmith.store.selectedOS["installationIdBifrost (from id_assinatura)"][0],
					idOs: appsmith.store.selectedOS.id_os,
					tipo_arquivo: "finalization_term",
					fileName: arquivo.name ?? arquivo.filename,
					filesData: arquivo
				});
				const url = resposta.signedUrl;
				arquivos_para_envio.push({"url": url});
				storeValue('arquivo_para_nuvem', null);
			}
			showAlert("Termo de Finalização enviado ao S3 com sucesso", "success")
		}
		catch (error) {
			showAlert("Falha ao enviar Termo de Finalização para o S3", "error")
		}
				
		await changeOSFunctions.renderChangeHistory()

		storeValue('arquivo_para_nuvem', null);
		storeValue('arquivos_para_envio_airtable', null);
		
		const newOS = await Leitura_OS_Por_RecordID.run({
			recordId: appsmith.store.selectedOS.record_id
		});
		storeValue('selectedOS', newOS.fields)
	},
	
	async removerArquivoS3() {
		let files = await Leitura_Arquivos_S3.data;

		let file = files.find(f => f.url === galery.model.image.url);

		if (!file) {
			showAlert("Arquivo não encontrado para remoção", "error")
			console.error("Arquivo não encontrado:", galery.model.image.fileName);
			return;
		}
		console.log("Arquivo encontrado para remoção:", file);
				
		try {
			await Deletar_Arquivo_S3.run({
				fileName: file.fileName,
				bucket: "bifrost-os-pictures-prod"
			});
			showAlert(`Arquivo removido com sucesso '${galery.model.image.fileName}'`, "success")
		}
		catch(error) {
			showAlert("Falha ao deletar arquivo", "error")
			console.log(error)
		}

		const newOS = await Leitura_OS_Por_RecordID.run({
			recordId: appsmith.store.selectedOS.record_id
		});
		storeValue('selectedOS', newOS.fields)

		const updatedGalleryData = await Leitura_Arquivos_S3.run();
		galery.model.data = updatedGalleryData;
		
		//await changeOSFunctions.renderChangeHistory()
	},

	renderFile(fileName) {
		if (fileName.includes(".mp4") || fileName.includes(".mov") || fileName.includes(".avi") || fileName.includes(".mkv") || fileName.includes(".wmv") || fileName.includes(".flv") || fileName.includes(".webm") || fileName.includes(".3gp") || fileName.includes(".ogv")) {
			return 'video'
		}
		else {
			return 'imagem'
		}
	},
	
	async removerTermoS3(arquivo) {
		await Leitura_OS_Por_RecordID.run({
					recordId: appsmith.store.selectedOS.record_id
				});

		try {
			// Remove do S3
			await Deletar_Arquivo_S3.run({
				fileName: arquivo.fileName,
				bucket: "bifrost-os-pictures-prod" 
			});

			// Remove do Airtable (envia array vazio para remover todos os termos)
			await Enviar_Termo.run({
				term: []
			});

			showAlert(`Termo removido com sucesso`, "success");
		} catch (error) {
			showAlert("Falha ao deletar termo", "error");
			console.log(error);
		}

		const newOS = await Leitura_OS_Por_RecordID.run({
			recordId: appsmith.store.selectedOS.record_id
		});
		storeValue('selectedOS', newOS.fields);

		resetWidget("termDocumentViewer", true);

		//await changeOSFunctions.renderChangeHistory();
	}
	
}