export default {
	handleDateOptions(){		
		const datas = Leitura_Data_de_Agendamento_OS.data.records.map(record => record.fields["Data Agendada para o Serviço"]);
		const availableDatas = datas.filter((item, index) => datas.indexOf(item) === index);
		const result = availableDatas.map(element => ({name: element, code: element}))
		return result
	},



	handleTextColorTechnician(tecnico) {
		switch (tecnico) {
			case "[EXT] Power.com": return "#dbeafe";
			case "[EXT] Telebit": return "#d8b4fe";
			case "[EXT] C&K": return "#dcfce7";
			case "[EXT] Multivoltz": return "#fef9c3";
			case "[EXT] Icatel": return "#fee2e2";
			case "[EXT] MDJ Solutions": return "#b0fffa";
			case "[EXT] T7 Solutions": return "#bcc0c1";
			case "[EXT] CAVI Tecnologia": return "#fce7f3";
			case "[EXT] JLB SOLUÇÕES": return "#ffbb62";
			default: return "#ffffff";
		}
	},
	handleTextColorPhase(fase) {
		switch (fase) {
			case "Agendamento de Serviço": return "#dbeafe";
			case "Fila de Serviço": return "#d8b4fe";
			case "Serviço em Andamento": return "#dcfce7";
			case "Controle de Qualidade": return "#fef9c3";
			case "Ajuste": return "#fee2e2";
			case "Improdutiva": return "#b0fffa";
			default: return "#ffffff";
		}
	},
	handleTextColorPeriod(periodo) {
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
	renderPartners(empresa) {
		const data = Leitura_parceiros_por_empresa.data.records

		const filteredData = data.filter(rec => rec.fields.Empresa === empresa)

		const formattedData = filteredData.map(rec => {
			const { Nome, CPF } = rec.fields;
			return `${Nome} - ${CPF}` 
		}).join("\n");

		return formattedData
	}
}