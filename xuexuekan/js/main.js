(function(doc, win) {
	var docEl = doc.documentElement, resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize', recalc = function() {
		var clientWidth = docEl.clientWidth || 320;
		var width = (clientWidth <= 320) ? 320 : ((clientWidth >= 640) ? 640 : clientWidth);
		var fontSize = 100 * (width / 640);
		docEl.style.fontSize = fontSize + 'px';
	};
	if (!doc.addEventListener)
		return;
	win.addEventListener(resizeEvt, recalc, false);
	recalc();
})(document, window);