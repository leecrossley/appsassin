
var locks = module.exports = (function(){
	var locks = {},
		lockDick = [];

	locks.add = function(number) {
		lockDick[number] = Date.now();
	};

	locks.recentlySent = function(number) {
		var previous = lockDick[number];
		
		if (!previous)
			return false;

		return ((Date.now() - previous) / 1000) < 600;
	};

	return locks;
})();