var ChaddonOpen = false;
var buttonspace = "20px";

var chatbar = document.createElement('iframe');
chatbar.id = "myChatbar";
chatbar.src = chrome.extension.getURL("/src/browser_action/browser_action.html");
chatbar.style.cssText = "\
	position:fixed;\
	top:0px;\
	right:" + buttonspace + ";\
	width:0%;\
	height:100%;\
	background:white;\
	box-shadow:inset 0 0 1em black;\
	z-index:999999;\
";

document.body.appendChild(chatbar);

var chatbutton = document.createElement('div');
chatbutton.style.cssText = "\
	position:fixed;\
	top:0px;\
	right:0px;\
	width:" + buttonspace + ";\
	height:100%;\
	background: linear-gradient(to right, #ffff00 0%, #1e2833 42.5%);\
	box-shadow:inset 0 0 1em black;\
	z-index:999999;\
";

document.body.appendChild(chatbutton);

chatbutton.addEventListener("click", function () {
	//alert("click");

	if (ChaddonOpen) {
			FX.fadeOut(chatbar, {
				duration: 500,
				complete: function() {
					chatbar.style.width = "0%";
					ChaddonOpen = false;
				}
			});		
	} else {
		chatbar.style.width = "30%";
		ChaddonOpen = true;

		FX.fadeIn(chatbar, {
			duration: 500,
			complete: function() {
			}
		});		
	}
});

var FX = {
	easing: {
		linear: function(progress) {
			return progress;
		},
		quadratic: function(progress) {
			return Math.pow(progress, 2);
		},
		swing: function(progress) {
			return 0.5 - Math.cos(progress * Math.PI) / 2;
		},
		circ: function(progress) {
			return 1 - Math.sin(Math.acos(progress));
		},
		back: function(progress, x) {
			return Math.pow(progress, 2) * ((x + 1) * progress - x);
		},
		bounce: function(progress) {
			for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
				if (progress >= (7 - 4 * a) / 11) {
					return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
				}
			}
		},
		elastic: function(progress, x) {
			return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
		}
	},
	animate: function(options) {
		var start = new Date;
		var id = setInterval(function() {
			var timePassed = new Date - start;
			var progress = timePassed / options.duration;
			if (progress > 1) {
				progress = 1;
			}
			options.progress = progress;
			var delta = options.delta(progress);
			options.step(delta);
			if (progress == 1) {
				clearInterval(id);
				options.complete();
			}
		}, options.delay || 10);
	},
	fadeOut: function(element, options) {
		var to = 1;
		this.animate({
			duration: options.duration,
			delta: function(progress) {
				progress = this.progress;
				return FX.easing.swing(progress);
			},
			complete: options.complete,
			step: function(delta) {
				element.style.opacity = to - delta;
			}
		});
	},
	fadeIn: function(element, options) {
		var to = 0;
		this.animate({
			duration: options.duration,
			delta: function(progress) {
				progress = this.progress;
				return FX.easing.swing(progress);
			},
			complete: options.complete,
			step: function(delta) {
				element.style.opacity = to + delta;
			}
		});
	}
};