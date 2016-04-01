describe('Arcadia.Button', function () {
    var button;

	beforeEach(function () {
		button = new Arcadia.Button({
			text: 'Click me!',
			font: '20px monospace',
			action: function () {
				console.info('Buy something, will ya!')
			}
		});
	});

	afterEach(function () {
		button = null;
	});

	describe('#onPointEnd', function () {
		it('executes an `action` callback if touch/click is within button', function () {
			spyOn(button, 'action');

			var points = [{ x: 0, y: 0 }]; // center of button
			button.onPointEnd(points);
			expect(button.action).toHaveBeenCalled();
		});

		it('does nothing if touch/click is outside button', function () {
			spyOn(button, 'action');

			var points = [{ x: 10000, y: 0 }];
			button.onPointEnd(points);
			expect(button.action).not.toHaveBeenCalled();
		});

		it('does nothing if button is disabled', function () {
			spyOn(button, 'action');

			var points = [{ x: 0, y: 0 }]; // center of button
			button.disabled = true;
			button.onPointEnd(points);
			expect(button.action).not.toHaveBeenCalled();
		});
	});

	describe('#text', function () {
		it('sets the content of the button label', function () {
			button.text = 'new content here, yo!';
			expect(button.label.text).toBe('new content here, yo!');
		});

		it('gets the content of the button label', function () {
			expect(button.text).toBe('Click me!');
		});
	});

	describe('#font', function () {
		it('sets the font of the button label', function () {
			button.font = '90px serif';
			expect(button.label.font).toBe('90px serif');
		});

		it('gets the font of the button label', function () {
			expect(button.font).toBe('20px monospace');
		});
	});
});
