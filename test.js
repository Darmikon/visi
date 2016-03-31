// var off = Visi.add(document.getElementById('id1'))
// 	.on('visible',function(){
// 		console.log('visible id1');
// 	})
// 	.getOff();
//
// off();

var visi = Visi.add(document.getElementById('id1'))
	.on('visible',function(){
		console.log('visible id1');
	});

visi.off();

visi.on('visible',function(){
	console.log('visible again');
});

// Visi.add(document.getElementById('id1')).once('hidden',function(){
Visi.add(document.querySelectorAll('.p1'))
	.on('hidden',function(element,off){
		console.log('hidden id1',element);
		console.log(arguments);
		off();
	});