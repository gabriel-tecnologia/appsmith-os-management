export default {
	
	handleTextColorTechnician(tecnico) {
		switch (tecnico) {
			case "[EXT] Power.com": return "#9EBBFF";
			case "[EXT] Telebit": return "#8EAFFF";
			case "[EXT] C&K": return "#7EA2FF";
			case "[EXT] Multivoltz": return "#6E96FF";
			case "[EXT] Icatel": return "#5E89FF";
			case "[EXT] MDJ Solutions": return "#4E7DFF";
			case "[EXT] T7 Solutions": return "#3E70FF";
			case "[EXT] CAVI Tecnologia": return "#2E64FF";
			case "[EXT] JLB SOLUÇÕES": return "#1E57FF";
			default: return "#ffffff";
		}
	},
	handleTextColorPhase(fase) {
		switch (fase) {
			case "Agendamento de Serviço": return "#D6E3FF";
			case "Fila de Serviço": return "#C6D9FF";
			case "Serviço em Andamento": return "#B6CEFF";
			case "Controle de Qualidade": return "#A6C4FF";
			case "Ajuste": return "#96B9FF";
			case "Improdutiva": return "#86AFFF";
			default: return "#ffffff";
		}
	},
	handleMapColorPeriod(periodo) {
		switch (periodo) {
			case "Manhã": return "#822222";
			case "08h": return "#2A0A0A";
			case "09h": return "#3C0E0E";
			case "10h": return "#4D1313";
			case "11h": return "#5F1818";
			case "12h": return "#701D1D";
			case "Tarde": return "#932727";
			case "13h": return "#A52C2C";
			case "14h": return "#B73232";
			case "15h": return "#C83A3A";
			case "16h": return "#D84242";
			case "17h": return "#E84A4A";
			case "18h": return "#F05353";
			case "Horário comercial": return "#F05353";
			default: return "#ffffff";
		}
	},
	handleTextColorPeriod(periodo) {
	switch (periodo) {
		case "Manhã": return "#3FE785";
		case "08h": return "#4FFF95";  // Verde principal
		case "09h": return "#63FF9E";
		case "10h": return "#77FFAA";
		case "11h": return "#8BFFB4";
		case "12h": return "#A0FFBE";
		case "Tarde": return "#B4FFC8";
		case "13h": return "#C8FFD2";
		case "14h": return "#DCFFDD";
		case "15h": return "#B4F7C0";
		case "16h": return "#9DEEB3";
		case "17h": return "#86E5A6";
		case "18h": return "#6FDB98";
		case "Horário comercial": return "#58D28B";
		default: return "#ffffff";
	}
}
,
	renderPartners(empresa) {
		const data = Leitura_parceiros_por_empresa.data.records

		const filteredData = data.filter(rec => rec.fields.Empresa === empresa)

		const formattedData = filteredData.map(rec => {
			const { Nome, CPF } = rec.fields;
			return `${Nome} - ${CPF}` 
		}).join("\n");

		return formattedData
	},
	
	renderPartner(record_ID) {
    const data = Leitura_parceiros_por_empresa.data.records;
    
    const filteredData = data.filter(rec => rec.fields.record_id == record_ID);
    
    const formattedData = filteredData.map(rec => rec.fields.Nome).join("\n");

    return formattedData
}

	
}