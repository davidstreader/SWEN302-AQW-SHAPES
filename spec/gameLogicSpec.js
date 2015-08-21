describe("Test getVariable 01", function() {
    var V1;
    var V2;
    var V3;
    var check = true;
    beforeEach(function() {
        V1 = parse("A ∧ B");
        V2 = getVariables(V1);
       // console.log(V2);
        V3 = ["A","B"];
        for(var i = 0; i<V3.length; i++){
            if(V3[i] != V2[i]){
                check = false;
            }
        }
    });

    it("A AND B should have variables A and B", function() {
        expect(check).toBe(true);
    });
});

describe("Test getVariable 02", function() {
    var V1;
    var V2;
    var V3;
    var check = true;
    beforeEach(function() {
        V1 = parse("(A∨B)∧(A∨C) ⊢ A∨B∧C");
        //console.log(V1);
        V2 = getVariables(V1);
        //console.log(V2);
        V3 = ["A","B","C"];
        for(var i = 0; i<V3.length; i++){
            if(V3[i] != V2[i]){
                check = false;
            }
        }
    });

    it("(A∨B)∧(A∨C) ⊢ A∨B∧C should have variables A, B, and C. Got "+V2+" instead.", function() {
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

    it("[A,B,B,C,C] should leave [A,B,C] after removing duplicates", function() {
        expect(check).toBe(true);
    });
});

describe("Test contains", function() {
    var V1;
    beforeEach(function() {
        V1 = ["A","B","C"];
    });

    it("[A,B,C] should contain A", function() {
        expect(contains(V1,"A")).toBe(true);
    });
});

describe("Multiplication", function() {
    it("10*1 should be 10", function() {
        expect(10*1).toBe(10);
    });
});