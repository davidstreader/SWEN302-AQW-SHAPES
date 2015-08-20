describe("Test get variable", function() {
    var V1;
    var V2;
    var V3;
    var check = true;
    beforeEach(function() {
        V1 = parse("A ∧ B");
        V2 = getVariables(V1);
        console.log(V2);
        V3 = ["A","B"];
        for(var i = 0; i<V3.length; i++){
            if(V3[i] != V2[i]){
                check = false;
            }
        }
    });

    it("Check should be true", function() {
        expect(check).toBe(true);
    });
});

describe("Test removeDuplicate", function() {
    var V1;
    var V2;
    var V3;
    var check = true;
    beforeEach(function() {
        V1 = ["A","B","B","C","C"];
        V2 = removeDuplicates(V1);
        V3 = ["A","B","C"];
        for(var i = 0; i < V3.length; i++){
            if(V3[i] != V2[i]){
                check = false;
            }
        }
    });

    it("V1 should be equals to V2", function() {
        expect(check).toBe(true);
    });
});

describe("Test contains", function() {
    var V1;
    beforeEach(function() {
        V1 = ["A","B","C"];
    });

    it("V1 should be equals to V2", function() {
        expect(contains(V1,"A")).toBe(true);
    });
});