//http://www.richardrodger.com/2013/09/27/how-to-make-simple-node-js-modules-work-in-the-browser/#.Vvze1zpS3Dc
(function(){
	var moduleName = 'Visi'
		,root = this
		,previous_mymodule = root[moduleName]
		,has_require = typeof require !== 'undefined';

	var mod = function(window,document){
		var events = {
			visible: true
			,hidden: false
		};

		_$.prototype = {
			on: on
			,once: once
			,getOff: getOff
			,off: off
		};

		//returns factory method
		return {
			add: add
		};

		//implementation
		function _$(els){
			var that = this;

			this.elements = [];

			try{
				els = [].slice.call(els);
			}catch(e){
				console.error(e);
				return;
			}


			els.forEach(function(el){
				if(!el.length){
					that.elements.push(el);
				}else{
					[].slice.call(el).forEach(function(single){
						that.elements.push(single);
					});
				}
			});
		}

		function addEvent(el,eventName,callback){
			el.addEventListener(eventName,callback);

			return function(){
				el.removeEventListener(eventName,callback);
			}
		}

		function add(){
			return new _$(arguments);
		}

		function getHandler(element,eventName,callback){
			return onVisibilityChange(element, function(visible,cmdr) {
				if(eventName === 'visible' && visible){
					if(cmdr){
						cmdr.done = true;
					}

					callback(element,cmdr.unregister);
				}

				if(eventName !== 'visible' && !visible){
					if(cmdr){
						cmdr.done = true;
					}

					callback(element,cmdr.unregister);
				}
			});
		}

		function on(eventName,callback){
			return buildHandler.call(this,eventName,callback,false);
		}

		function once(eventName,callback){
			return buildHandler.call(this,eventName,callback,true);
		}

		function buildHandler(eventName,callback,isOnce){
			var that = this;

			if(events[eventName] === undefined){
				return this;
			}

			[].slice.call(this.elements).forEach(function(element,index){
				var unregister = {}
				//it's a special hack - to apply unregister for all methods only for mode 'once'
					,commander = {
					done: false
					,unregister: callCurrentUnregister //remove events for current element
				}
					,handler = getHandler(element,eventName,callback,commander);

				//don't set load events if some it was triggered or scroll or resize was made
				if(!that.domLoaded){
					unregister[0] = addEvent(window,'DOMContentLoaded', function(){
						// handler(); //if without true - success event on DOM loaded will disable further events for 'once'
						// mode
						handler(commander);
						that.domLoaded = true;
						// unregister[0];

						if(isOnce && commander.done){
							// console.log('off');
							callCurrentUnregister();
						}else{
							unregister[0];
						}
					});
				}

				if(!that.load){
					unregister[1] = addEvent(window,'load', function(){
						// handler(); //if without true - success event on load will disable further events for 'once'
						// mode
						handler(commander);
						that.load = true;
						// unregister[1];

						if(isOnce && commander.done){
							// console.log('off');
							callCurrentUnregister();
						}else{
							unregister[1];
						}
					});
				}

				unregister[2] = addEvent(window,'scroll'
					,throttle(function(){
						// ,function(){
						handler(commander);

						that.domLoaded = true;
						that.load = true;
						//turn off events for case when .once was used
						if(isOnce && commander.done){
							// console.log('off');
							callCurrentUnregister();
						}
						// });
					},50));

				unregister[3] = addEvent(window,'resize'
					,throttle(function(){
						// ,function(){
						handler(commander);

						that.domLoaded = true;
						that.load = true;
						//turn off events for case when .once was used
						if(isOnce && commander.done){
							// console.log('off');
							callCurrentUnregister();
						}
						// });
					},50));

				this._unregisters = this._unregisters || [];
				this._unregisters.push(unregister);

				function callCurrentUnregister(){
					Object.keys(unregister).forEach(function(key){
						unregister[key]();
					});
				}
			},this);

			return this;
		}

		//http://stackoverflow.com/a/26039199
		function isElementPartiallyInViewport(el){
			var rect
				,windowHeight
				,windowWidth
				,vertInView
				,horInView;

			rect = el.getBoundingClientRect();
			// DOMRect { x: 8, y: 8, width: 100, height: 100, top: 8, right: 108, bottom: 108, left: 8 }
			windowHeight = (window.innerHeight || document.documentElement.clientHeight);
			windowWidth = (window.innerWidth || document.documentElement.clientWidth);

			// http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
			vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
			horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

			return (vertInView && horInView);
		}


		function onVisibilityChange(el, callback) {
			var old_visible;

			return function (commander) {
				var visible = isElementPartiallyInViewport(el);

				if (visible != old_visible) {
					old_visible = visible;

					if (typeof callback == 'function') {
						callback(visible,commander);
					}
				}
			}
		}

		function getOff(){
			var that = this;

			return function(){
				that._unregisters.forEach(function(unregister){
					Object.keys(unregister).forEach(function(key){
						unregister[key]();
					});
				});
			}
		}

		function off(){
			this.getOff()();

			return this;
		}

		function throttle(fn, threshhold, scope) {
			threshhold || (threshhold = 250);
			var last
				,deferTimer;
			return function () {
				var context = scope || this;

				var now = +new Date
					,args = arguments;
				if (last && now < last + threshhold) {
					// hold on to it
					clearTimeout(deferTimer);
					deferTimer = setTimeout(function () {
						last = now;
						fn.apply(context, args);
					}, threshhold);
				} else {
					last = now;
					fn.apply(context, args);
				}
			};
		}
	}(window,document);

	mod.noConflict = function(){
		root[moduleName] = previous_mymodule;

		return mod;
	};

	if(typeof exports !== 'undefined'){
		if(typeof module !== 'undefined' && module.exports){
			exports = module.exports = mod;
		}

		exports[moduleName] = mod;
	}
	else{
		root[moduleName] = mod;
	}

}).call(this);