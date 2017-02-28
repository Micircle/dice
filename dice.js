;(function(global) {
    //自定义事件
    function SelfEvent() {
        this.handlers = {};
    }

    SelfEvent.prototype = {
        constructor: SelfEvent,
        on: function(sign, handler) {
            if(typeof this.handlers[sign] == 'undefined') {
                this.handlers[sign] = [];
            }
            this.handlers[sign].push(handler);
        },

        off: function(sign, hanlder) {
            if(this.handlers[sign] instanceof Array) {
                var handlers = this.handlers[sign];
                for(var i = 0; i < handlers.length; i++) {
                    if(handlers[i] === hanlder) {
                        break;
                    }
                }
                handlers.splice(i, 1);
            }
        },

        trigger: function(sign, value) {
            if(this.handlers[sign] instanceof Array) {
                var handlers = this.handlers[sign];
                for(var i = 0; i < handlers.length; i++) {
                    handlers[i](value);
                }
            }
        }
    }

    //骰子对象
    function Dice(elem, logElem) {
        elem = elem || document.body;
        if (!(elem instanceof HTMLElement)) {
            console.error(elem + ' is not DOM');
            return false;
        }
        var diceElem = document.createElement('div');
        diceElem.className = 'wrapper';
        diceElem.innerHTML = `<ul class="dice-box">
                                    <li>
                                        <span></span>
                                    </li>
                                    <li>
                                        <span></span>
                                        <span></span>
                                    </li>
                                    <li>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </li>
                                    <li>
                                        <div>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </li>
                                </ul>`;
        elem.appendChild(diceElem);
        
        SelfEvent.call(this);
        this.dice = diceElem.querySelector('.dice-box');
        this.rollClassArray = ['rolling', 'roll-one', 'roll-two', 'roll-three', 'roll-four', 'roll-five', 'roll-six'];
        this._isRolling = false;
        this._point = 1;
        if(logElem instanceof HTMLElement) {
            this.logElem = logElem;
            this.logElem.innerText = this._point;
            this.on('rolling', () => {
                this.logElem.innerText = 'rolling...';
            });

            this.on('end', (point) => {
                this.logElem.innerText = point;
            });
        }
        Object.defineProperties(this, {
            isRolling: {
                get: function() {
                    console.log('Dice is rolling, place waiting...');
                    this.trigger('rolling');
                    return this._isRolling;
                },

                set: function(newValue) {
                    if(newValue !== this._isRolling) {
                        this._isRolling = newValue;
                    }
                    if(!newValue) {
                        console.log('Dice rolling end');
                    }
                }
            },
            point: {
                get: function() {
                    return this._point;
                },

                set: function(newPoint) {
                    this._point = newPoint;
                    this.trigger('end', newPoint);
                    console.log('Dice point is ' + newPoint);
                }
            }
        });
    }

    Dice.prototype = new SelfEvent();
    Dice.prototype.rolling = function() {
        this.isRolling = true;
        var classList = this.dice.classList;
        this.rollClassArray.map((item) => {
            classList.remove(item);
        });
        classList.add(this.rollClassArray[0]);
        var fn = null,
            dice = this.dice;
        return new Promise((resolve, reject) => {
            dice.addEventListener('animationend', fn = function() {
                resolve(true);
                dice.removeEventListener('animationend', fn);
                fn = null;
            }, false);
        });
    }

    Dice.prototype.rollTo = function(num) {
        if(this.isRolling) {
            return false;
        }
        if(typeof num == 'number' && num > 0 && num < 7) {
            num = Math.floor(num);
            return this.rolling().then(() => {
                this.dice.classList.add(this.rollClassArray[num]);
                var fn = null,
                    that = this;
                return new Promise((resolve, reject) => {
                    that.dice.addEventListener('animationend', fn = function() {
                        that.isRolling = false;
                        that.point = num;
                        that.dice.removeEventListener('animationend', fn);
                        fn = null;
                        resolve(true);
                    }, false);
                })
            })
        }
    }

    Dice.prototype.randomRoll = function() {
        return this.rollTo(Math.random() * 6 + 1);
    }
    global.Dice = Dice;
})(window);