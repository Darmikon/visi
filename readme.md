## Visi.js ##

### Description ###
Visi.js is a small library written on vanilla.js. 
It doesn't require any dependencies.
Visi.js provides functionality to monitor when dom element is partially in a viewport
It adds some methods to simplify your work with handling of such event.

### Demo ###
[Visi + animation](http://visi.mana.pro/ "Visi.js")
[Visi on jsfiddler](https://jsfiddle.net/Hellfrom/ksn8je0o/ "Visi on jsfiddler") (Watch console)

### Installation ###

1. Remote

	```
	<script type="text/javascript" 
		src="https://cdn.rawgit.com/hellfrom/visi/master/visi.min.js"
	></script>
	```
2. npm
	```
	npm install visi
	```
3. bower
	```
	bower install visi
	```  

### How to use ###
Event names
`visible` and `hidden`

Short api
- add
```
.add(domElements); //single or multiple dom elements
```

Short api
- add
```
.add(domElements); //single or multiple dom elements
```
- on
```
.on(eventName,function(changedElement,off){
	//off() removes event listeners from fired element
});
```
- once (unregisters all events from fired element after first triggering)
```
.once(eventName,function(changedElement){
	//...
});
```
- off
```
var visi = Visi.add(/*dom elements*/);
visi.off();	//remove all event listeners from selection
```
- getOff
```
var off = Visi.add(dom)
	.on('visible',callback)
	.getOff();
off(); //remove all listeners from selection
```



HTML
```
<div class = "p1"
	 id = "id1">
	Lorem...
</div>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
<div class = "p2"
	 id = "id2">
	Lorem ipsum...
</div>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
<div class = "p3 p1">
	Lorem ipsum dolor...
</div>
```

JS
```
var visi = Visi.add(document.getElementById('id1'))
	.on('visible',function(){
		console.log('visible id1');
	});

visi.off();
```

Add event to the same instance again
```
visi.on('visible',function(){
	console.log('visible again');
});

```

Add event only once - after first triggering it will automatically unregister
all event listeners
```
Visi.add(document.getElementById('id1')).once('hidden',function(element,off){
	//off() is not necessary for this use case
	//...
});

```

Listen if element becomes hidden every time with ```.on```
```
Visi.add(document.querySelectorAll('.p1'))
	.on('hidden',function(element,off){
		console.log('hidden id1',element);
		console.log(arguments);
		
		//unregister listeners only for element which
		//became hidden after some scrolling etc.
		off();
	});
```

Get unregisters
```
var off = Visi.add(document.getElementById('id1'))
	.on('visible',function(){
		console.log('visible id1');
	}).getOff();

//remove all events from all dom elements for current selection
off();

```