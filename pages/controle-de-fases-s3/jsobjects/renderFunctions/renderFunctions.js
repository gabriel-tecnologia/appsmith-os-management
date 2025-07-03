export default {
	renderPhaseState(){
		switch(appsmith.store.selectedOS["Fase"]){
			case "Agendamento de Serviço":
				return "<span style='color: #00ce7c'>Agendamento ➞ </span><span style='color: #858282'>Fila ➞ Em Andamento ➞ Controle de Qualidade  ⇶ Destino OS</span>"
			case "Reagendamento de Serviço":
				return "<span style='color: #00ce7c'>Reagendamento ➞ </span><span style='color: #858282'>Fila ➞ Em Andamento ➞ Controle de Qualidade  ⇶ Destino OS</span>"
			case "Fila de Serviço":
				return "<span style='color: #00ce7c'>Agendamento ➞ Fila ➞ </span> <span style='color: #858282'>Em Andamento ➞ Controle de Qualidade  ⇶ Destino OS</span>"
			case "Serviço em Andamento":
				return "<span style='color: #00ce7c'>Agendamento ➞ Fila ➞ Em Andamento ➞ </span> <span style='color: #858282'>Controle de Qualidade  ⇶ Destino OS</span>"
			case "Controle de Qualidade":
				return "<span style='color: #00ce7c'>Agendamento ➞ Fila ➞ Em Andamento ➞ Controle de Qualidade  ⇶ </span> <span style='color: #858282'>Destino OS</span>"
			case "Concluído":
				return "<span style='color: #00ce7c'>Agendamento ➞ Fila ➞ Em Andamento ➞ Controle de Qualidade ➞ Concluído </span>"
			case "Improdutiva":
				return "<span style='color: #00ce7c'>Agendamento ➞ Fila ➞ Em Andamento ➞ Controle de Qualidade ➞ </span> <span style='color: #ef4444'>Improdutiva</span>"
			case "Ajuste":
				return "<span style='color: #00ce7c'>Agendamento ➞ Fila ➞ Em Andamento ➞ Controle de Qualidade ➞ </span> <span style='color: #eab308'>Ajuste ⇉ </span> <span style='color: #858282'>Destino OS </span>"
			case "Cancelado":
				return "<span style='color: #00ce7c'>Agendamento ➞ Fila ➞ Em Andamento ➞ Controle de Qualidade ➞ </span> <span style='color: #ef4444'>Cancelado</span>"
			default:
				return "Agendamento ➞ Fila ➞ Em Andamento ➞ Controle de Qualidade ➞ Concluido"
		}
	},
	renderReasons(){
		switch(appsmith.store.changeTo){
			case "Ajuste":
				return this.renderAdjustReasons.data
			case "Improdutiva":
				return this.renderImproductiveReasons.data
			default:
				return []
		}
	},
	
	renderAdjustReasons(){
		return [
								{
									"name": "Termo de finalização não assinado",
									"code": "Termo de finalização não assinado"
								},
								{
									"name": "Controle de Qualidade Sistêmico Reprovado",
									"code": "Controle de Qualidade Sistêmico Reprovado"
								}
							]
	},
	renderImproductiveReasons(){
		return [
			{
				"name": "[CLIENTE] Sem ponto elétrico disponível",
				"code": "[CLIENTE] Sem ponto elétrico disponível"
			},
			{
				"name": "[CLIENTE] Cliente ou síndico indisponível",
				"code": "[CLIENTE] Cliente ou síndico indisponível"
			},
			{
				"name": "[CLIENTE] Cliente ou síndico não ciente",
				"code": "[CLIENTE] Cliente ou síndico não ciente"
			},
			{
				"name": "[CLIENTE] Não aceitou infraestrutura",
				"code": "[CLIENTE] Não aceitou infraestrutura"
			},
			{
				"name": "[CLIENTE] Decisões ou preferências que exigem reagendamento (ex.: infra embutida, mudança de local, etc.)",
				"code": "[CLIENTE] Decisões ou preferências que exigem reagendamento (ex.: infra embutida, mudança de local, etc.)"
			},
			{
				"name": "[CLIENTE] Local em obra",
				"code": "[CLIENTE] Local em obra"
			},
			{
				"name": "[PARCEIRO] Atraso não tolerado",
				"code": "[PARCEIRO] Atraso não tolerado"
			},
			{
				"name": "[PARCEIRO] Problemas com veículos ou materiais insuficientes",
				"code": "[PARCEIRO] Problemas com veículos ou materiais insuficientes"
			},
			{
				"name": "[PARCEIRO] Controle de qualidade físico reprovado (ex.angulação inadequada, sealtubo mal instalado...)",
				"code": "[PARCEIRO] Controle de qualidade físico reprovado (ex.angulação inadequada, sealtubo mal instalado...)"
			},
			{
				"name": "[PARCEIRO] Falta de evidências fotográficas",
				"code": "[PARCEIRO] Falta de evidências fotográficas"
			},
			{
				"name": "[GABRIEL] Sem sinal de 4G",
				"code": "[GABRIEL] Sem sinal de 4G"
			},
			{
				"name": "[GABRIEL] Necessidade de cabeamento de internet",
				"code": "[GABRIEL] Necessidade de cabeamento de internet"
			},
			{
				"name": "[GABRIEL] Equipamento com defeito (SN/Camaleão)",
				"code": "[GABRIEL] Equipamento com defeito (SN/Camaleão)"
			},
			{
				"name": "[EXTERNO] Chuva ou condições climáticas adversas",
				"code": "[EXTERNO] Chuva ou condições climáticas adversas"
			},
			{
				"name": "Não foi necessário realizar o serviço",
				"code": "Não foi necessário realizar o serviço"
			},
			{
				"name": "Instalação parcialmente concluída",
				"code": "Instalação parcialmente concluída"
			}											
		]	
	},
	
	renderReasonsOptions(){
		if (appsmith.store.improductiveMotive) {
			return appsmith.store.improductiveMotive
		}
		else if (appsmith.store.adjustMotive) {
			return appsmith.store.adjustMotive
		}
		else {
			return []
		}
	},
	renderTab(){
		switch(appsmith.store.selectedOS.Fase){
			case "Controle de Qualidade":
				return "Controle de Qualidade"
			case "Ajuste":
				return "Ajuste"
			case "Serviço em Andamento":
				return "Serviço em Andamento"
			default:
				return "Outros"
		}
	},
	renderAvailablePartners() {
		const PARTNER = [
			"[EXT] C&K",
			"[EXT] Multivoltz",
			"[EXT] CAVI Tecnologia",
			"[EXT] Icatel",
			"[EXT] JLB SOLUÇÕES",
			"[EXT] MDJ Solutions",
			"[EXT] Power.com",
			"[EXT] T7 Solutions",
			"[EXT] Telebit"
		]
		
		const partner = PARTNER.map((partner) =>({name: partner, code: partner}))		
		return partner
	},
	
	renderSolutions() {
		return [
			{"name": "Remoção ou troca de equipamento ou componente", "code": "Remoção ou troca de equipamento ou componente"},
			{"name": "Reinicialização de equipamento", "code": "Reinicialização de equipamento"},
			{"name": "Não se aplica", "code": "Não se aplica"},
			{"name": "Restabelecimento automático", "code": "Restabelecimento automático"},
			{"name": "Atualização, ajuste ou reconfiguração do Software/Firmware", "code": "Atualização, ajuste ou reconfiguração do Software/Firmware"},
			{"name": "Readequação/reparo de infraestrutura", "code": "Readequação/reparo de infraestrutura"},
			{"name": "Reinicialização do modem da Internet/conexão 4G", "code": "Reinicialização do modem da Internet/conexão 4G"},
			{"name": "Solicitação de visita técnica da Operadora ao cliente", "code": "Solicitação de visita técnica da Operadora ao cliente"},
			{"name": "Desobstrução, limpeza ou ajuste da câmera", "code": "Desobstrução, limpeza ou ajuste da câmera"},
			{"name": "Remanejamento do rack/câmeras", "code": "Remanejamento do rack/câmeras"},
			{"name": "Envio de placas da Gabriel", "code": "Envio de placas da Gabriel"}
		]
	},
	
	formatStockText(stock) {
    let text = ""
		
		stock["Status da Remessa"] ? text = text.concat("Status: ", stock["Status da Remessa"], "\n\n") : ""
		
		stock["Saída de Material"] ? text = text.concat("Saída de Material: ", stock["Saída de Material"], "\n\n") : ""
		
		stock["Nota de Remessa / Retorno"] ? text = text.concat("Nota de Remessa / Retorno: ", stock["Nota de Remessa / Retorno"], "\n\n") : ""
		
		stock["Movimento Criado por"] ? text = text.concat("Movimento Criado por: ", stock["Movimento Criado por"], "\n\n") : text = text.concat("Movimento Criado por Automação no Airtable", "\n\n")
		
		stock.Camaleão ? text = text.concat(stock.Camaleão+" x Camaleão\n") : ""
		
		stock["Sistema Nervoso 2"] ? text = text.concat(stock["Sistema Nervoso 2"]+" x Sistema Nervoso 2\n") : ""
		
		stock["Kit Poste Canguru"] ? text = text.concat(stock["Kit Poste Canguru"] + " x Kit Poste Canguru\n") : ""
		
		stock["Kit Poste 2.0 (Piso)"] ? text = text.concat(stock["Kit Poste 2.0 (Piso)"] + " x Kit Poste 2.0 (Piso)\n") : ""
		
		stock["Kit Poste 2.0 (Parede)"] ? text = text.concat(stock["Kit Poste 2.0 (Parede)"]+" x Kit Poste 2.0 (Parede)\n") : ""
		
		stock["Kit Boas Vindas"] ? text = text.concat(stock["Kit Boas Vindas"]+" x Kit Boas Vindas\n") : ""
		
		stock["Placa de Sinalização - Gravata - 0800 GAB-RIEL"] ? text = text.concat(stock["Placa de Sinalização - Gravata - 0800 GAB-RIEL"]+" x Placa Gravata Gen1 (Verde)\n") : ""
		
		stock["Placa de Sinalização - Gravata 2- 0800 GAB-RIEL"] ? text = text.concat(stock["Placa de Sinalização - Gravata 2- 0800 GAB-RIEL"]+" x Placa Gravata Gen2 (Branca)\n") : ""
		
		stock["Placa Bolacha"] ? text = text.concat(stock["Placa Bolacha"]+" x Placa Bolacha Nova\n") : ""
		
		return text
	},
	
	renderPeriod() {
		switch (appsmith.store.selectedOS["Tipo de Ordem de Serviço"]){
			case "Manutenção":
				return [
					{
						"name": "Horário comercial",
						"code": "Horário comercial"
					},
					{
						"name": "Manhã",
						"code": "Manhã"
					},
					{
						"name": "08h",
						"code": "08h"
					},
					{
						"name": "09h",
						"code": "09h"
					},
					{
						"name": "10h",
						"code": "10h"
					},
					{
						"name": "11h",
						"code": "11h"
					},
					{
						"name": "Tarde",
						"code": "Tarde"
					},
					{
						"name": "12h",
						"code": "12h"
					},
					{
						"name": "13h",
						"code": "13h"
					},
					{
						"name": "14h",
						"code": "14h"
					},
					{
						"name": "15h",
						"code": "15h"
					},{
						"name": "16h",
						"code": "16h"
					},
					{
						"name": "17h",
						"code": "17h"
					},
					{
						"name": "18h",
						"code": "18h"
					}
				]
				case "Desinstalação":
				return [
					{
						"name": "Horário comercial",
						"code": "Horário comercial"
					},
					{
						"name": "Manhã",
						"code": "Manhã"
					},
					{
						"name": "08h",
						"code": "08h"
					},
					{
						"name": "09h",
						"code": "09h"
					},
					{
						"name": "10h",
						"code": "10h"
					},
					{
						"name": "11h",
						"code": "11h"
					},
					{
						"name": "Tarde",
						"code": "Tarde"
					},
					{
						"name": "12h",
						"code": "12h"
					},
					{
						"name": "13h",
						"code": "13h"
					},
					{
						"name": "14h",
						"code": "14h"
					},
					{
						"name": "15h",
						"code": "15h"
					},{
						"name": "16h",
						"code": "16h"
					},
					{
						"name": "17h",
						"code": "17h"
					},
					{
						"name": "18h",
						"code": "18h"
					}
				]
			case "Aditivo":
				return [
					{
						"name": "Horário comercial",
						"code": "Horário comercial"
					},
					{
						"name": "Manhã",
						"code": "Manhã"
					},
					{
						"name": "08h",
						"code": "08h"
					},
					{
						"name": "09h",
						"code": "09h"
					},
					{
						"name": "10h",
						"code": "10h"
					},
					{
						"name": "11h",
						"code": "11h"
					},
					{
						"name": "Tarde",
						"code": "Tarde"
					},
					{
						"name": "12h",
						"code": "12h"
					},
					{
						"name": "13h",
						"code": "13h"
					},
					{
						"name": "14h",
						"code": "14h"
					},
					{
						"name": "15h",
						"code": "15h"
					},
					{
						"name": "16h",
						"code": "16h"
					}
				]
				case "Adesão":
					return [
						{
							"name": "Horário comercial",
							"code": "Horário comercial"
						},
						{
							"name": "Manhã",
							"code": "Manhã"
						},
						{
							"name": "08h",
							"code": "08h"
						},
						{
							"name": "09h",
							"code": "09h"
						},
						{
							"name": "10h",
							"code": "10h"
						},
						{
							"name": "11h",
							"code": "11h"
						},
						{
							"name": "Tarde",
							"code": "Tarde"
						},
						{
							"name": "12h",
							"code": "12h"
						},
						{
							"name": "13h",
							"code": "13h"
						},
						{
							"name": "14h",
							"code": "14h"
						},
						{
							"name": "15h",
							"code": "15h"
						},
						{
							"name": "16h",
							"code": "16h"
						}
					]
			}
		},
		handleURLformat(url) {
			if (url == null || url == "" || url == undefined) {
				return ""
			}
			else {
				return url[0]
			}
		},
		handleItensFormat(itens) {
			if (itens == null || itens == "" || itens == undefined) {
				return ""
			}
			else {
				return itens.join('\n')
			}
		},
	
		async renderOSMotherInfo() {
			if (appsmith.store.selectedOS["OS (Mãe)"] != undefined) {
				let relativeOS = await Leitura_OS_Por_RecordID.run({
					recordId: appsmith.store.selectedOS["OS (Mãe)"][0]
				});
			
				let fields = relativeOS.fields

				return fields["id_os"]
			}
			else{
				return ""
			}
		},
	
		async renderOSChildInfo() {
				if (appsmith.store.selectedOS["OS (Filha)"] != undefined) {
				let relativeOS = await Leitura_OS_Por_RecordID.run({
					recordId: appsmith.store.selectedOS["OS (Filha)"][0]
				});
			
				let fields = relativeOS.fields

				return fields["id_os"]
			}
			else {
				return ""
			}
	},
	
	async updateOS () {		
			const serviceFiles = await Leitura_Arquivos_S3.run({
				installationIDBifrost: appsmith.store.selectedOS["installationIdBifrost (from id_assinatura)"][0],
				idOs: appsmith.store.selectedOS.id_os,
				tipo_arquivo: "service_pictures"
			});
		
			galery.model.data = serviceFiles
			resetWidget(galery, true)
	}
}


	
	
	
	
