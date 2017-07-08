var ORM = require("../..");
var Property = ORM.Property;

describe("Property", function () {
    it("passing String should return type: 'text'", function () {
        assert.equal(Property.normalize({
            prop: String,
            customTypes: {},
            settings: ORM.settings,
            name: 'abc'
        }).type, "text");
    });
    it("passing Number should return type: 'number'", function () {
        assert.equal(Property.normalize({
            prop: Number,
            customTypes: {},
            settings: ORM.settings,
            name: 'abc'
        }).type, "number");
    });
    it("passing deprecated rational: false number should return type: 'integer'", function () {
        assert.equal(Property.normalize({
            prop: {
                type: 'number',
                rational: false
            },
            customTypes: {},
            settings: ORM.settings,
            name: 'abc'
        }).type, "integer");
    });

    it("passing Boolean should return type: 'boolean'", function () {
        assert.equal(Property.normalize({
            prop: Boolean,
            customTypes: {},
            settings: ORM.settings,
            name: 'abc'
        }).type, "boolean");
    });
    it("passing Date should return type: 'date'", function () {
        assert.equal(Property.normalize({
            prop: Date,
            customTypes: {},
            settings: ORM.settings,
            name: 'abc'
        }).type, "date");
    });
    it("passing Object should return type: 'object'", function () {
        assert.equal(Property.normalize({
            prop: Object,
            customTypes: {},
            settings: ORM.settings,
            name: 'abc'
        }).type, "object");
    });
    it("passing Buffer should return type: 'binary'", function () {
        assert.equal(Property.normalize({
            prop: Buffer,
            customTypes: {},
            settings: ORM.settings,
            name: 'abc'
        }).type, "binary");
    });
    it("passing an Array of items should return type: 'enum' with list of items", function () {
        var prop = Property.normalize({
            prop: [1, 2, 3],
            customTypes: {},
            settings: ORM.settings,
            name: 'abc'
        })

        assert.equal(prop.type, "enum");
        assert.propertyVal(prop.values, "length", 3);
    });
    describe("passing a string type", function () {
        it("should return type: <type>", function () {
            assert.equal(Property.normalize({
                prop: "text",
                customTypes: {},
                settings: ORM.settings,
                name: 'abc'
            }).type, "text");
        });
        it("should accept: 'point'", function () {
            assert.equal(Property.normalize({
                prop: "point",
                customTypes: {},
                settings: ORM.settings,
                name: 'abc'
            }).type, "point");
        });

        describe("if not valid", function () {
            it("should throw", function () {
                assert.throws(function () {
                    Property.normalize({
                        prop: "string",
                        customTypes: {},
                        settings: ORM.settings,
                        name: 'abc'
                    })
                });
            });
        });
    });
    it("should not modify the original property object", function () {
        var original = {
            type: 'text',
            required: true
        };

        var normalized = Property.normalize({
            prop: original,
            customTypes: {},
            settings: ORM.settings,
            name: 'abc'
        });

        original.test = 3;
        assert.strictEqual(normalized.test, undefined);
    });
});