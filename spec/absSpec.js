describe("Test1", function() {
  var V1;
  var V2;

  beforeEach(function() {
    V1 = new Variable("A");
    V2 = new Variable("A");
  });

  it("V1 should be equals to V2", function() {
     expect(V1.equals(V2)).toBe(true);
  });
});