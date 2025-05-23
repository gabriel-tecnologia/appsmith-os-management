export default {

  async compressAndUpload(files) {
    // Busca as fotos atuais do Airtable antes de começar
    const data = await Leitura_OS_Por_RecordID.run({
      recordId: appsmith.store.selectedOS.record_id
    });
    let fotos = data.fields["Foto do Serviço"] ? [...data.fields["Foto do Serviço"]] : [];

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

      // Upload S3
      try {
        const resposta = await Enviar_Arquivo_S3.run({
          fileName: finalCompressedFile.name,
          filesData: finalCompressedFile
        });
        const url = resposta.signedUrl;
        fotos.push({ url }); // Acumula localmente

        // Upload Airtable
        await Enviar_Fotos_Airtable.run({ photosUrl: fotos });
        storeValue("service_pictures", fotos);

        showAlert(`Arquivo '${finalCompressedFile.name}' enviado ao Airtable com sucesso`, "success");
      } catch (error) {
        showAlert(`Falha ao enviar o arquivo '${file.name}'`, "error");
        statusEnvio = false;
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
		storeValue("tipo_arquivo", "term")
		let arquivos_para_envio = [];
		
		for (const arquivo of arquivos){
			storeValue('arquivo_para_nuvem', arquivo);
			const resposta = await Enviar_Arquivo_S3.run({
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
			
			await changeOSFunctions.renderChangeHistory()
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
			await changeOSFunctions.renderChangeHistory()
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
		return list.filter(file => 
			(file.filename && file.filename.includes("mp4")) || 
			(file.url && file.url.includes("mp4")) || 
			(file.type && file.type.includes("mp4"))
		);
	},
	
	renderImagens(list) {
		return list.filter(file => file.type == "image/jpeg" || file.type == "image/png")
	},
	
	async removerTermoAirtable() {
		try {
			await Leitura_OS_Por_RecordID.run({
				recordId: appsmith.store.selectedOS.record_id
			});

			await Enviar_Termo.run({
				term: []
			});

			showAlert("Termo removido com sucesso", "success");

			// Atualiza o store e qualquer interface relacionada
			const newOS = await Leitura_OS_Por_RecordID.run({
				recordId: appsmith.store.selectedOS.record_id
			});
			storeValue('selectedOS', newOS.fields);

			resetWidget("termoDocumentViewer", true);

			await changeOSFunctions.renderChangeHistory();
		} catch (error) {
			showAlert("Falha ao remover termo de finalização", "error");
		}
	}
}