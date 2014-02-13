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

	function makePuzzleArray(rows, cols,  bombCount) {
		var randArr = makeIntArray(rows*cols);
		var puzzleArr = [];
		var hintDistanceCenter = [-1*(cols+1), -1*cols, -1*(cols-1), -1, 1, cols-1, cols, cols+1];
		var hintDistanceLeft = [-1*cols, -1*(cols-1), 1, cols, cols+1]; 
		var hintDistanceRight = [-1*(cols+1), -1*cols, -1, cols-1, cols];

		var incBombHints = function(bombPosition) {
			var getHintDistance = function() {
				if(bombPosition === 0 || bombPosition % cols === 0) {
					return hintDistanceLeft;
				} else if((bombPosition + 1) % cols === 0) {
					return hintDistanceRight;
				} else {
					return hintDistanceCenter;
				}
			};

			var hintDistance = getHintDistance();
			console.log('bombPosition = ' + bombPosition + ', hintDistance = ' + hintDistance);

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

	var drawPuzzle = function(rows, cols, bombCount) {
		var puzzleArray = makePuzzleArray(rows, cols, bombCount);
		console.log(puzzleArray);

		var drawBox = function(className, contents) {
			return dom('div', className || '', contents);
		};

		var puzzle = dom('div', 'puzzleContainer', []);
		for(var i=0; i < (rows*cols); i++) {
			puzzle.append(drawBox('box', i).attr('id', i));
		};
		
		jQuery('body').append(puzzle);
		jQuery('.box:nth-child(' + 30 + 'n + 1)').css('clear', 'both');
		jQuery('.box').click(function() {
			var selectedBox = $(this);
			var puzzlePosition = selectedBox.attr('id');
			var boxVal = puzzleArray[puzzlePosition];
			console.log(boxVal);
			selectedBox.addClass('selected ' + (boxVal < 0 ? 'bomb ' : '') + (boxVal === 0 ? 'empty ' : '') + (boxVal > 0 ? 'hint' : ''));
			if(boxVal > 0) {
				selectedBox.text(boxVal);
			}
		});
		return puzzle;
	};

	drawPuzzle(16,30,100);
})();
