describe('Arcadia', function () {
    describe('.ENV', function () {
        it('returns an object with data about the current environment', function () {
            var expectedKeys = ['android', 'ios', 'firefox', 'mobile', 'desktop', 'cordova'];
            var expectedValues = [true, false];

            expectedKeys.forEach(function (key) {
                expect(Arcadia.ENV[key]).toBeDefined();
                expect(expectedValues).toContain(Arcadia.ENV[key]);
            });
        });
    });

    describe('.distance', function () {
        it('calculates distance between two points', function () {
            var point1 = {x: 0, y: 0};
            var point2 = {x: 5, y: 5};
            expect(Arcadia.distance(point1, point2)).toBeCloseTo(7.07);
        });
    });

    describe('.random', function () {
        it('gives back a random number within the specified range', function () {
            var min = 5;
            var max = 10;
            expect(Arcadia.random(min, max)).toBeLessThan(10);
            expect(Arcadia.random(min, max)).toBeGreaterThan(5);
        });
    });
});
