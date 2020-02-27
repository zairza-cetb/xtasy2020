window.onload = function () {
  
	var error = Snap.select("#error" ),
      hole = Snap.select("#svg-hole" ),
      hand = Snap.select("#svg-hand" ),
      mask = Snap.select("#svg-mask" );


	function onSVGLoaded( ){
    
		function animOn(){
			hand.animate({
				transform: "t10,-300, r0"
			}, 4500, mina.easeinout, animOut);

			mask.animate({
				transform: "t-10,300, r0"
			}, 4500, mina.easeinout);
		}

		function animOut() {
			hand.animate({
				transform: "t-10,-305, r0"
			}, 4500, mina.easeinout, animOn);

			mask.animate({
				transform: "t10,305, r0"
			}, 4500, mina.easeinout);
		};
    
    function open() {
			clearTimeout(timer);
			hand.animate({
				transform: "t0,-300"
			}, 800, mina.backout, animOn);

			mask.animate({
				transform: "t0,300"
			}, 800, mina.backout);

		}
		timer = setTimeout(open, 1000);

		hand.attr({
			mask: mask
		});
	}
  
  onSVGLoaded();
};