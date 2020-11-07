const Validator = require('jsonschema').Validator

class JsonValidator {
    constructor() {
        this.jsonValidator = new Validator()
        this.selectedSchema = ''
    }

    selectSchema = (schema) => {
        this.selectedSchema = schema
    }

    getSelectedSchema = () => {
        return this.selectedSchema
    }

    validate = (json) => {
        return this.jsonValidator.validate(json, this.selectedSchema)
    }

    validateAll = (jsonList) => {
        let results = []
        jsonList.forEach(j => {
            results.push(this.jsonValidator.validate(j, this.selectedSchema))
        })
        return results
    }
}

module.exports = {
    JsonValidator: JsonValidator
}


