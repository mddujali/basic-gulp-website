var home = 'home';

console.log(home);

class Greetings {
	constructor(name) {
		this.name = name;
	}

	hello() {
		if (typeof this.name === 'string') {
			return `Hello ${this.name}!`;
		} else {
			return 'Hello!';
		}
	}
}

var greetings =  new Greetings('Mark'),
	template = templates.greetings({
		message: greetings.hello()
	});

document.write(template);
