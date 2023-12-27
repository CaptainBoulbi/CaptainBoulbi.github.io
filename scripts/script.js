(function(window, document, undefined) {

    "use strict";

    var winWidth = window.innerWidth-60,
        winHeight = window.innerHeight-60,
        defaultOptions = {
            minSize: 10,
            maxSize: 30,
            type: "text",
            content: "&#10052",
            fadeOut: true,
            autoplay: true,
            interval: 200
        };

    function cssPrefix(propertyName) {
        var capitalizePropertyName = propertyName.charAt(0).toUpperCase() + propertyName.slice(1),
            tempDiv = document.createElement("div"),
            style = tempDiv.style,
            vendorPrefixes = ["Webkit", "Moz", "ms", "O"];

        if (propertyName in style) return propertyName;

        for (var i = 0, l = vendorPrefixes.length; i < l; i++) {
            var name = vendorPrefixes[i] + capitalizePropertyName;
            if (name in style) return name;
        };

        return null;
    };

    var cssPrefixedNames = {
            "transform": cssPrefix("transform"),
            "transition": cssPrefix("transition")
        },
        transitionendEventName = {
            "WebkitTransition": "webkitTransitionEnd",
            "OTransition": "oTransitionEnd",
            "Moztransition": "transitionend",
            "transition": "transitionend"
        }[cssPrefixedNames.transition];

    function random(min, max, deviation) {
        if (deviation) {
            deviation *= max;
            max = max + deviation;
            min = max - deviation;
        } else {
            min = min || 0;
        };
        return parseInt(Math.random() * (max - min + 1) + min);
    };

    function extend(target, source) {
        for (var prop in source) {
            target[prop] = source[prop];
        };
        return target;
    };

    function setStyle(element, rules) {
        for (var name in rules) {
            element.style[cssPrefixedNames[name] || name] = rules[name];
        };
    };

    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    };

    window.addEventListener("resize", function() {
        winHeight = window.innerHeight-60;
        winWidth = window.innerWidth-60;
    }, false);

    function Snowfall(newOptions) {

        var _ = this,
            queue = [],
            options = defaultOptions,
            $snowfield = document.createElement("div"),
            isImage, cntLength, $snowflake, timer;

        _.config = function(newOptions) {
            extend(options, newOptions);

            isImage = options.type == "image";
            cntLength = options.content.length;

            $snowflake = isImage ? new Image() : document.createElement("div");
            $snowflake.className = "snowflake snowflake-" + options.type;
            $snowflake.dataset.type = options.type;
        };

        _.config(newOptions);

        function Snowflake() {
            var _$snowflake = $snowflake.cloneNode();
            if (options.type != "solid") {
                _$snowflake[isImage ? "src" : "innerHTML"] = typeof options.content == "string" ? options.content : options.content[cntLength == 0 ? 0 : Math.floor(Math.random() * cntLength)];
            };

            return _$snowflake;
        };

        function snowAnimate() {
            var size = random(options.minSize, options.maxSize),
                top = -2 * size,
                left = random(0, winWidth - size),
                opacity = random(5, 10) / 10,
                angle = random(null, winHeight * 0.8, 0.8),
                translateX = random(-100, 100),
                translateY = winHeight + size * 2,
                duration = random(null, winHeight * 20, 0.2),
                _$snowflake;

            if (queue.length) {
                _$snowflake = queue.shift();
                if (_$snowflake.dataset.type != options.type) _$snowflake = new Snowflake();
            } else {
                _$snowflake = new Snowflake();
            };

            var styleRules = {
                "top": top + "px",
                "left": left + "px",
                "opacity": opacity,
                "transform": "none",
                "transition": duration + "ms linear"
            };

            switch (options.type) {
                case "solid":
                    styleRules.width = styleRules.height = size + "px";
                    break;
                case "text":
                    styleRules["font-size"] = size + "px";
                    break;
                case "image":
                    styleRules.width = size + "px";
                    break;
            };

            setStyle(_$snowflake, styleRules);

            $snowfield.appendChild(_$snowflake);

            setTimeout(function() {
                setStyle(_$snowflake, {
                    "transform": "translate(" + translateX + "px," + translateY + "px) rotate(" + angle + "deg)",
                    "opacity": options.fadeOut ? 0 : opacity
                });
            }, 100);
        };

        _.playing = 0;

        _.play = function() {
            if (_.playing) return;
            timer = setInterval(snowAnimate, options.interval);
            _.playing = 1;
        };

        _.stop = function() {
            if (!_.playing) return;
            clearInterval(timer);
            timer = null;
            _.playing = 0;
        };

        document.addEventListener(visibilityChange, function() {
            document[hidden] ? _.stop() : _.play();
        }, false);

        $snowfield.addEventListener(transitionendEventName, function(e) {
            var snowflake = e.target || e.srcElement;
            $snowfield.removeChild(snowflake);
            queue.push(snowflake);
        }, false);

        $snowfield.className = "snowfield";
        document.body.appendChild($snowfield);

        options.autoplay && _.play();

        return _;
    };

    window.Snowfall = Snowfall;

})(window, document);

var c = document.getElementById("canvas-club");
var ctx = c.getContext("2d");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var clearColor = 'rgba(0, 0, 0, .1)';
var max = 30;
var drops = [];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function O() {}

O.prototype = {
    init: function() {
        this.x = random(0, w);
        this.y = 0;
        this.color = 'hsl(000, 100%, 50%)';
        this.w = 2;
        this.h = 1;
        this.vy = random(4, 5);
        this.vw = 3;
        this.vh = 1;
        this.size = 2;
        this.hit = random(h * .8, h * .9);
        this.a = 1;
        this.va = .96;
    },
    draw: function() {
        if (this.y > this.hit) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.h / 2);
            ctx.moveTo(this.x, this.y - this.h / 2);

            ctx.bezierCurveTo(
                this.x + this.w / 2, this.y - this.h / 2,
                this.x + this.w / 2, this.y + this.h / 2,
                this.x, this.y + this.h / 2);

            ctx.bezierCurveTo(
                this.x - this.w / 2, this.y + this.h / 2,
                this.x - this.w / 2, this.y - this.h / 2,
                this.x, this.y - this.h / 2);

            ctx.strokeStyle = 'hsla(000, 100%, 50%, '+this.a+')';
            ctx.stroke();
            ctx.closePath();
            
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size * 5);
        }
        this.update();
    },
    update: function() {
        if(this.y < this.hit){
            this.y += this.vy;
        } else {
            if(this.a > .03){
                this.w += this.vw;
                this.h += this.vh;
                if(this.w > 100){
                    this.a *= this.va;
                    this.vw *= .98;
                    this.vh *= .98;
                }
            } else {
                this.init();
            }
        }
        
    }
}



function resize(){
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;

}

function setup(){
    for(var i = 0; i < max; i++){
        (function(j){
            setTimeout(function(){
                var o = new O();
                o.init();
                drops.push(o);
            }, j * 200)
        }(i));
    }
}


function anim() {
    ctx.fillStyle = clearColor;
    ctx.fillRect(0,0,w,h);
    for(var i in drops){
        drops[i].draw();
    }
    requestAnimationFrame(anim);
}


window.addEventListener("resize", resize);

function change_theme() {
	//const date = new Date();
	const date = new Date('2023, 10, 26'); //pour tester directement
	const month = date.getMonth();
	const elements = document.querySelectorAll(".logo");
	const logo = document.getElementById('logo');
    const mrmoi = document.getElementById('char_mrmoi');
    const nemo = document.getElementById('char_nemo');
    const canard = document.getElementById('char_canard');

	if (month === 9) {
		elements.forEach(element => {
            setup();
            anim();
			element.classList.add("halloween");
			element.classList.remove("noel");
		});
	} else if (month === 11) {
		elements.forEach(element => {
            var snow = new Snowfall();
			snow.play();
			logo.src = "../ressources/themes/logo_noel.png";
            mrmoi.src = "../ressources/themes/mrmoi_char_noel.webp";
            nemo.src = "../ressources/themes/nemo_char_noel.webp";
            canard.src = "../ressources/themes/simon_duk_char_noel.webp";
			element.classList.add("noel");
			element.classList.remove("halloween");
		});
	}
}

change_theme();