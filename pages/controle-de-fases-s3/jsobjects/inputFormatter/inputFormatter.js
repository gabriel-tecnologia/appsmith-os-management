export default {
	compare(inputValue,originalValue){
		if(typeof(originalValue)=="number"){
			if(originalValue.toString()!=inputValue) return false
		}
		if(typeof(originalValue)=="undefined"||typeof(originalValue)==null){
			if(inputValue===null||inputValue===undefined) return true
			if(inputValue!=="") return false
		}
		if(typeof(originalValue)=="string"){
			if(inputValue!=originalValue) return false
		}
		return true
	},
	onDiffColor(inputValue,originalValue,isValid){
		if(!isValid) return 'red'
		return this.compare(inputValue,originalValue)?"black":'blue'
	},
	onDiffIcon(inputValue,originalValue,isValid){
		if(!isValid) return '❌ '
		return this.compare(inputValue,originalValue)?"":'✍️'
	},
	onDiffBold(inputValue,originalValue){
		return this.compare(inputValue,originalValue)?"":'BOLD'
	}
}