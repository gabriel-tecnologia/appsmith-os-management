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
				return [
								{
									"name": "[COMERCIAL] Termo de finalização não assinado",
									"code": "[COMERCIAL] Termo de finalização não assinado"
								},
								{
									"name": "[GABRIEL] Controle de qualidade sistêmico reprovado (ex.: sistema offline, câmeras indisponíveis...)",
									"code": "[GABRIEL] Controle de qualidade sistêmico reprovado (ex.: sistema offline, câmeras indisponíveis...)"
								}
							]
			// case "Improdutiva":
				// return [
								// {
									// "name": "[CLIENTE] Sem ponto elétrico disponível",
									// "code": "[CLIENTE] Sem ponto elétrico disponível"
								// },
								// {
									// "name": "[CLIENTE] Cliente ou síndico indisponível",
									// "code": "[CLIENTE] Cliente ou síndico indisponível"
								// },
								// {
									// "name": "[CLIENTE] Cliente ou síndico não ciente",
									// "code": "[CLIENTE] Cliente ou síndico não ciente"
								// },
								// {
									// "name": "[CLIENTE] Não aceitou infraestrutura",
									// "code": "[CLIENTE] Não aceitou infraestrutura"
								// },
								// {
									// "name": "[CLIENTE] Decisões ou preferências que exigem reagendamento (ex.: infra embutida, mudança de local, etc.)",
									// "code": "[CLIENTE] Decisões ou preferências que exigem reagendamento (ex.: infra embutida, mudança de local, etc.)"
								// },
								// {
									// "name": "[CLIENTE] Local em obra",
									// "code": "[CLIENTE] Local em obra"
								// },
								// {
									// "name": "[PARCEIRO] Atraso não tolerado",
									// "code": "[PARCEIRO] Atraso não tolerado"
								// },
								// {
									// "name": "[PARCEIRO] Problemas com veículos ou materiais insuficientes",
									// "code": "[PARCEIRO] Problemas com veículos ou materiais insuficientes"
								// },
								// {
									// "name": "[PARCEIRO] Controle de qualidade físico reprovado (ex.angulação inadequada, sealtubo mal instalado...)",
									// "code": "[PARCEIRO] Controle de qualidade físico reprovado (ex.angulação inadequada, sealtubo mal instalado...)"
								// },
								// {
									// "name": "[PARCEIRO] Falta de evidências fotográficas",
									// "code": "[PARCEIRO] Falta de evidências fotográficas"
								// },
								// {
									// "name": "[GABRIEL] Sem sinal de 4G",
									// "code": "[GABRIEL] Sem sinal de 4G"
								// },
								// {
									// "name": "[GABRIEL] Necessidade de cabeamento de internet",
									// "code": "[GABRIEL] Necessidade de cabeamento de internet"
								// },
								// {
									// "name": "[GABRIEL] Equipamento com defeito (SN/Camaleão)",
									// "code": "[GABRIEL] Equipamento com defeito (SN/Camaleão)"
								// },
								// {
									// "name": "[EXTERNO] Chuva ou condições climáticas adversas",
									// "code": "[EXTERNO] Chuva ou condições climáticas adversas"
								// }									
							// ]
			default:
				return []
		}
	},
	
	renderAdjustReasons(){
		return [
			{
				"name": "[COMERCIAL] Termo de finalização não assinado",
				"code": "[COMERCIAL] Termo de finalização não assinado"
			},
			{
				"name": "[GABRIEL] Controle de qualidade sistêmico reprovado (ex.: sistema offline, câmeras indisponíveis...)",
				"code": "[GABRIEL] Controle de qualidade sistêmico reprovado (ex.: sistema offline, câmeras indisponíveis...)"
			}
		]
	},
	renderImproductiveReasons(){
		return []
			// {
				// "name": "[CLIENTE] Sem ponto elétrico disponível",
				// "code": "[CLIENTE] Sem ponto elétrico disponível"
			// },
			// {
				// "name": "[CLIENTE] Cliente ou síndico indisponível",
				// "code": "[CLIENTE] Cliente ou síndico indisponível"
			// },
			// {
				// "name": "[CLIENTE] Cliente ou síndico não ciente",
				// "code": "[CLIENTE] Cliente ou síndico não ciente"
			// },
			// {
				// "name": "[CLIENTE] Não aceitou infraestrutura",
				// "code": "[CLIENTE] Não aceitou infraestrutura"
			// },
			// {
				// "name": "[CLIENTE] Decisões ou preferências que exigem reagendamento (ex.: infra embutida, mudança de local, etc.)",
				// "code": "[CLIENTE] Decisões ou preferências que exigem reagendamento (ex.: infra embutida, mudança de local, etc.)"
			// },
			// {
				// "name": "[CLIENTE] Local em obra",
				// "code": "[CLIENTE] Local em obra"
			// },
			// {
				// "name": "[PARCEIRO] Atraso não tolerado",
				// "code": "[PARCEIRO] Atraso não tolerado"
			// },
			// {
				// "name": "[PARCEIRO] Problemas com veículos ou materiais insuficientes",
				// "code": "[PARCEIRO] Problemas com veículos ou materiais insuficientes"
			// },
			// {
				// "name": "[PARCEIRO] Controle de qualidade físico reprovado (ex.angulação inadequada, sealtubo mal instalado...)",
				// "code": "[PARCEIRO] Controle de qualidade físico reprovado (ex.angulação inadequada, sealtubo mal instalado...)"
			// },
			// {
				// "name": "[PARCEIRO] Falta de evidências fotográficas",
				// "code": "[PARCEIRO] Falta de evidências fotográficas"
			// },
			// {
				// "name": "[GABRIEL] Sem sinal de 4G",
				// "code": "[GABRIEL] Sem sinal de 4G"
			// },
			// {
				// "name": "[GABRIEL] Necessidade de cabeamento de internet",
				// "code": "[GABRIEL] Necessidade de cabeamento de internet"
			// },
			// {
				// "name": "[GABRIEL] Equipamento com defeito (SN/Camaleão)",
				// "code": "[GABRIEL] Equipamento com defeito (SN/Camaleão)"
			// },
			// {
				// "name": "[EXTERNO] Chuva ou condições climáticas adversas",
				// "code": "[EXTERNO] Chuva ou condições climáticas adversas"
			// }									
		// ]	
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
	
	formatStockText(stock) {
   
    let text = ""
		stock["Status da Remessa"] ? text = text.concat("Status: ", stock["Status da Remessa"], "\n\n") : ""
		stock["Saída de Material"] ? text = text.concat("Saída de Material: ", stock["Saída de Material"], "\n\n") : ""
		stock["Nota de Remessa / Retorno"] ? text = text.concat("Nota de Remessa / Retorno: ", stock["Nota de Remessa / Retorno"], "\n\n") : ""
		
		stock.Camaleão ? text = text.concat(stock.Camaleão+" x Camaleão\n") : ""
		stock["Sistema Nervoso 2"] ? text = text.concat(stock["Sistema Nervoso 2"]+" x Sistema Nervoso 2\n") : ""
		stock["Kit Poste 2.0 (Piso)"] ? text = text.concat(stock["Kit Poste 2.0 (Piso)"] + " x Kit Poste 2.0 (Piso)\n") : ""
		stock["Kit Poste 2.0 (Parede)"] ? text = text.concat(stock["Kit Poste 2.0 (Parede)"]+" x Kit Poste 2.0 (Parede)\n") : ""
		stock["Placa de Sinalização - Gravata - 0800 GAB-RIEL"] ? text = text.concat(stock["Placa de Sinalização - Gravata - 0800 GAB-RIEL"]+" x Placa de Sinalização - Gravata\n") : ""
		stock["Placa de Sinalização - Gravata 2- 0800 GAB-RIEL"] ? text = text.concat(stock["Placa de Sinalização - Gravata 2- 0800 GAB-RIEL"]+" x Placa de Sinalização - Gravata 2\n") : ""
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
		}
}


	
	
	
	
