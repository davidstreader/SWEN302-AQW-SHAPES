describe("Test AND", function() {
  var V1;
  var V2;
  beforeEach(function() {
  	V1 = parse("A ∧ B");
  	V2 = new Operator("AND");
 	V2.left = new Variable("A");
  	V2.right = new Variable("B");
  });

  it("V1 should be equals to V2", function() {
     expect(V1.equals(V2)).toBe(true);
  });
});

describe("Test OR", function() {
  var V1;
  var V2;
  beforeEach(function() {
  	V1 = parse("A ∨ B");
  	V2 = new Operator("OR");
 	V2.left = new Variable("A");
  	V2.right = new Variable("B");
  });

  it("V1 should be equals to V2", function() {
     expect(V1.equals(V2)).toBe(true);
  });
});

describe("Test Implies", function() {
  var V1;
  var V2;
  beforeEach(function() {
  	V1 = parse("A → B");
  	V2 = new Operator("IMPLIES");
 	V2.left = new Variable("A");
  	V2.right = new Variable("B");
  });

  it("V1 should be equals to V2", function() {
     expect(V1.equals(V2)).toBe(true);
  });
});

describe("Test Turnstile", function() {
  var V1;
  var V2;
  beforeEach(function() {
  	V1 = parse("A ⊢ A");
  	V2 = new Operator("TURNSTILE");
 	V2.left = new Variable("A");
  	V2.right = new Variable("A");
  });
  it("V1 should be equals to V2", function() {
     expect(V1.equals(V2)).toBe(true);
  });
});
describe("Test Not", function() {
  var V1;
  var V2;
  beforeEach(function() {
  	V1 = parse("¬A");
  	V2 = new Operator("NOT");
 	V2.left = new Variable("");
  	V2.right = new Variable("A");
  });
  it("V1 should be equals to V2", function() {
     expect(V1.equals(V2)).toBe(true);
  });
});
describe("Test Multiple Not", function() {
  var V1;
  var V2;
  beforeEach(function() {
  	V1 = parse("A ⊢ ¬¬A");
  	V2 = new Operator("TURNSTILE");
 	V2.left = new Variable("A");
  	V2.right = new Operator("NOT");
  	V2.right.left = new Variable("")
  	V2.right.right = new Operator("NOT");
  	V2.right.right.left = new Variable("");
  	V2.right.right.right = new Variable("A");
  });
  it("V1 should be equals to V2", function() {
     expect(V1.equals(V2)).toBe(true);
  });
});
describe("Test Order of Precedence 01", function() {
  var V1;
  var V2;
  beforeEach(function() {
  	V1 = parse("(A→C)∧(B→C) ⊢ A∨B→C");
  	V2 = new Operator("TURNSTILE");
 	V2.left = new Operator("AND");
 	V2.left.left = new Operator("IMPLIES");
 	V2.left.left.left = new Variable("A");
 	V2.left.left.right = new Variable("C");
 	V2.left.right = new Operator("IMPLIES");
 	V2.left.right.left = new Variable("B");
 	V2.left.right.right = new Variable("C");
 	V2.right = new Operator("IMPLIES");
 	V2.right.left = new Operator("OR");
 	V2.right.left.left = new Variable("A");
 	V2.right.left.right = new Variable("B");
 	V2.right.right = new Variable("C");
  });
  it("V1 should be equals to V2", function() {
     expect(V1.equals(V2)).toBe(true);
  });
});

describe("Test Order of Precedence 02", function() {
  var V1;
  var V2;
  beforeEach(function() {
  	V1 = parse("(A∨B)∧(A∨C) ⊢ A∨B∧C");
  	V2 = new Operator("TURNSTILE");
 	V2.left = new Operator("AND");
 	V2.left.left = new Operator("OR");
 	V2.left.left.left = new Variable("A");
 	V2.left.left.right = new Variable("B");
 	V2.left.right = new Operator("OR");
 	V2.left.right.left = new Variable("A");
 	V2.left.right.right = new Variable("C");
 	V2.right = new Operator("OR");
 	V2.right.left = new Variable("A");
 	V2.right.right = new Operator("AND");
 	V2.right.right.left = new Variable("B");
 	V2.right.right.right = new Variable("C");
  });
  it("V1 should be equals to V2", function() {
     expect(V1.equals(V2)).toBe(true);
  });
});

describe("Test Order of Precedence 03", function() {
  var V1;
  var V2;
  beforeEach(function() {
  	V1 = parse("A∨B→C ⊢ (A→C)∧(B→C)");
  	V2 = new Operator("TURNSTILE");
 	V2.left = new Operator("IMPLIES");
 	V2.left.left = new Operator("OR");
 	V2.left.left.left = new Variable("A");
 	V2.left.left.right = new Variable("B");
 	V2.left.right = new Variable("C");
 	V2.right = new Operator("AND");
 	V2.right.left = new Operator("IMPLIES");
 	V2.right.left.left = new Variable("A");
 	V2.right.left.right = new Variable("C");
 	V2.right.right = new Operator("IMPLIES");
 	V2.right.right.left = new Variable("B");
 	V2.right.right.right = new Variable("C");
  });
  it("V1 should be equals to V2", function() {
     expect(V1.equals(V2)).toBe(true);
  });
});
 /*case '⊢': return 0;
   case '→': return 1;
   case '∨': return 2;
   case '∧': return 3;
   case '¬': return 4;*/
