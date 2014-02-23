(function() {
	function dom(element, className, contents) {
		var element = jQuery(document.createElement(element));
		if (className) {
			element.addClass(className);
		}
		if(contents) {
			jQuery.each(contents, function(index, content) {
				element.append(content);
			});
		}
		return element;
	}

	function makeIntArray(max) {
		var arr = [];
		for(var i=0; i < max; i++) {
			arr.push(i);
		}
		return arr;
	}

	function getHintDistance(cols, pos) {
		var hintDistanceCenter = [-1*(cols+1), -1*cols, -1*(cols-1), -1, 1, cols-1, cols, cols+1];
		var hintDistanceLeft = [-1*cols, -1*(cols-1), 1, cols, cols+1]; 
		var hintDistanceRight = [-1*(cols+1), -1*cols, -1, cols-1, cols];

		if(pos === 0 || pos % cols === 0) {
			return hintDistanceLeft;
		} else if((pos + 1) % cols === 0) {
			return hintDistanceRight;
		} else {
			return hintDistanceCenter;
		}
	};

	function makePuzzleArray(rows, cols,  bombCount) {
		var randArr = makeIntArray(rows*cols);
		var puzzleArr = [];

		var incBombHints = function(bombPosition) {
			var hintDistance = getHintDistance(cols, bombPosition);

			for(var i=0; i < hintDistance.length; i++) {
				var hintPosition = bombPosition + hintDistance[i];
				if(hintPosition >= 0 && puzzleArr[hintPosition] >= 0 && puzzleArr[hintPosition] < rows*cols) {
					puzzleArr[hintPosition]++;
				}
			}
		};

		//fill puzzleArr with zeros
		for(var i=0; i < rows*cols; i++) {
			puzzleArr[i] = 0;
		}

		//fill in bombs and hints
		for(var i=0; i < bombCount; i++) {
			//fill in bombs
			var randInt = Math.floor(Math.random()*randArr.length);
			var bombPosition = randArr[randInt];

			//remove position from array
			randArr.splice(randInt, 1);
			
			puzzleArr[bombPosition] = -1;
			incBombHints(bombPosition);
		}

		return puzzleArr;
	}

	var drawPuzzle = function() {
		var ratioBombsToBoxes = 0.2;
		var boxSize = 25; 
		var boxSizeWithBorder = boxSize + 2;
		var windowWidth = 750;
		var windowHeight = 400;
		var rows = Math.floor(windowHeight/boxSizeWithBorder);
		var cols = Math.floor(windowWidth/boxSizeWithBorder);
		var bombCount = Math.floor(rows*cols*ratioBombsToBoxes);

		var puzzleArray = makePuzzleArray(rows, cols, bombCount);

		function addSelectedBoxClass(pos) {
			for(var i=0; i < pos.length; i++) {
				var selectedBox = jQuery('#' + pos[i]);
				var boxVal = puzzleArray[pos[i]];
				if(pos[i] >= 0 && pos[i] < rows*cols && !selectedBox.hasClass('selected')) {
					selectedBox.addClass('selected ' + (boxVal < 0 ? 'bomb ' : '') + (boxVal === 0 ? 'empty ' : '') + (boxVal > 0 ? 'hint' : ''));
					if(boxVal < 0) {
						gameOver();
					} else if(boxVal > 0) {
						selectedBox.text(boxVal);
					} else if(boxVal === 0) {
						var hintDistance = getHintDistance(cols, pos[i]);
						for(var j=0; j < hintDistance.length; j++) {
							hintDistance[j] += pos[i];
						}
						addSelectedBoxClass(hintDistance);
					}
				}
			}
		}

		var drawBox = function(className, contents) {
			return dom('div', className || '', contents).css({'height': boxSize + 'px', 'width': boxSize + 'px'});
		};

		var puzzle = dom('div', 'puzzleContainer', []).css({'height': rows*boxSizeWithBorder + 'px', 'width': cols*boxSizeWithBorder + 'px'});
		for(var i=0; i < (rows*cols); i++) {
			puzzle.append(drawBox('box', i).attr('id', i));
		};
		
		jQuery('.mainview').append(puzzle);

		var shiftDown = false;
		jQuery(document).keydown(function(e) {
			if(e.keyCode === 16) {
				shiftDown = true;
			}
		});
		jQuery(document).keyup(function(e) {
			if(e.keyCode === 16) {
				shiftDown = false;
			}
		});
		jQuery('.box').click(function() {
			if(shiftDown === true) {
				jQuery(this).toggleClass('flag');
			} else {
				if(!jQuery(this).hasClass('flag')) {
					var puzzlePosition = jQuery(this).attr('id');
					addSelectedBoxClass([parseInt(puzzlePosition)]);
				}
			}
		});
	};

	var setup = function() {
		jQuery('.startButton').click(function() {
			jQuery('.startview').hide();
			jQuery('.mainview').empty().show();
			drawPuzzle();
		});

		jQuery('.restartButton').click(function() {
			jQuery('.gameoverview').hide();
			jQuery('.mainview').empty().show();
			drawPuzzle();
		});
	};

	var gameOver = function() {
		jQuery('.gameoverview').show();
	};

	setup();
	drawPuzzle();
})();
