describe("Combinators 03", function () {

	it("oneOf success", function () {
		var data = 5;
		var schema = {
			"oneOf": [
				{"type": "integer"},
				{"type": "string"},
				{"type": "string", minLength: 1}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isTrue(valid);
	});

	it("oneOf failure (too many)", function () {
		var data = "string";
		var schema = {
			"oneOf": [
				{"type": "integer"},
				{"type": "string"},
				{"minLength": 1}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});

	it("oneOf failure (no matches)", function () {
		var data = false;
		var schema = {
			"oneOf": [
				{"type": "integer"},
				{"type": "string"},
				{"type": "string", "minLength": 1}
			]
		};
		var valid = tv4.validate(data, schema);
		assert.isFalse(valid);
	});
    
    it("oneOf success (complex schema)", function() {
        tv4.addSchema({
            "type": "object",
            "id": "http://remoney.co.uk/wrong-url-here/bank-commission.json",
            "properties": {
                "type": {"type": "string", "pattern": "^BANK_COMMISSION$"}
            },
            "required": ["type"],
            "additionalProperties": false
        });
        tv4.addSchema({
            "type": "object",
            "id": "http://remoney.co.uk/transaction-repository/bank-interest.json",
            "properties": {
                "type": {"type": "string", "pattern": "^BANK_INTEREST"}
            },
            "required": ["type"],
            "additionalProperties": false
        });
        tv4.addSchema({
            "id": "http://remoney.co.uk/transaction-repository/any-transaction.json",
            "type": "object",
            "oneOf": [
                {"$ref": "/transaction-repository/bank-commission.json"},
                {"$ref": "/transaction-repository/bank-interest.json"}
        ]});
    
        var result = tv4.validateResult({
            "type": "BANK_INTEREST"
        }, 
            'http://remoney.co.uk/transaction-repository/any-transaction.json');
        assert.isNotNull(result.error);
        assert.equal(result.missing.length, 1);
    });
});
