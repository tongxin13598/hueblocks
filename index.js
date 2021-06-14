/* loading message */
$('#colorPreviewText').html('Loading...');





/* color picker with gradient preview */
let color1, color2;

function updateColors() {
	color1 = $('#colorSel1').val();
	color2 = $('#colorSel2').val();
	$('#colorPreview').css({'background': 'linear-gradient(90deg, ' + color1 + ', ' + color2 + ')'});
	$('#colorPreviewText').html(color1 + '　→　' + color2);
};

$('#colorSel1,#colorSel2').on('change', function() { updateColors(); });

/* copy color on right click */
$('#colorBtn1').bind('contextmenu', function(cmenu) {
    cmenu.preventDefault();
	navigator.clipboard.writeText(color1);
	$('#colorPreviewText').html('＊COPIED!＊' + '　→　' + color2);
	setTimeout(function () { updateColors(); }, 500);
});
$('#colorBtn2').bind('contextmenu', function(cmenu) {
    cmenu.preventDefault();
	navigator.clipboard.writeText(color2);
	$('#colorPreviewText').html(color1 + '　→　' + '＊COPIED!＊');
	setTimeout(function () { updateColors(); }, 500);
});





/* compact HEX to RGB converter */
function hexToRgb(h) {
    r = parseInt((cutHex(h)).substring(0,2),16), 
	g = parseInt((cutHex(h)).substring(2,4),16), 
	b = parseInt((cutHex(h)).substring(4,6),16)
    return [r, g, b];
};
function cutHex(h) {return (h.charAt(0)=='#') ? h.substring(1,7):h};





/* calculate steps */
var steps = [];
var stepLen = 5;

/* change cLenght back to default value */
function cLenghtDefaulter() { 
	if ($('#cLenght3').is(':checked')) {
		stepLen = 9;
		$('#cLenght3').prop("checked", false);
		$('#cLenght1').prop("checked", true);
		setTimeout(function () {$('#cLenghtBtn3').html('Custom...'); }, 1);
}};

/* make sure "Custom..." cLenght btn is never selected at start to prevent errors */
cLenghtDefaulter();

/* create a prompt when "Custom..." cLenght btn is clicked */
$('#cLenght3').on('click', function() {
	stepLen = prompt('Please enter a chain custom lenght (any integer equal or more than 3)', stepLen);
	
	/* process amogus */
	if (stepLen == 'amogus') {
		alert('OH MY GOD THE CHAIN IS SUS HAHA :D :D LOL AMOGUS MEME SO FUNNY SUS SUS SUSSY HAHAHAHAHA :DDDDD');
		cLenghtDefaulter();
	};
	
	/* process null */
	if (stepLen == null) {
		cLenghtDefaulter();
	};
	stepLen = parseInt(stepLen);

	/* process invalid non-numeral input values */
	if (isNaN(stepLen) == true) {
		alert('Enter a NUMBER you goof >_<');
		cLenghtDefaulter();
	};

	/* process invalid numeral input values */
	if (stepLen < 3) {
		alert('Number is too small; please enter at least 3 or bigger.');
		stepLen = 3;
	};
	if (stepLen > 999) {
		var stepLenWarning = confirm('Woah! ' + stepLen + ' is a really big number, are you sure your browser can handle it?\n\nPress "OK" to confirm or "Cancel" to change the number to 999.');
		if (stepLenWarning == false) {
			stepLen = 999;
	}};
	
	/* display value on cLenght button */
	if (Number.isInteger(stepLen) == true) {
		$('#cLenghtBtn3').html('Custom (' + stepLen + ')');
		
		/* handler for values more than 99999 to be displayed correctly */
		if (stepLen > 99999) {
			$('#cLenghtBtn3').html('Custom (99999+)');
		}
	};
});

/* update steps */
function updateSteps() {
	console.log('[c] Calculating colors for every step... ');

	/* take steps count from non-custom button (must be at least 3, otherwise just makes no sense) */
	if ($('#cLenght1').is(':checked')) {
		stepLen = 9;
	}
	if ($('#cLenght2').is(':checked')) {
		stepLen = 25;
	}

	/* wipe previous steps */
	steps = [];

	/* the first color is just color1, no need to count it */
	steps.push(hexToRgb(color1));

	var stepCount = 1;
	while(stepCount < stepLen - 1) {

		/* math sorcery goes here (daaamn i hate math >_<).
		in a nutshell: since we already know first and last steps, we're starting from the second (1) step and counting until the pre-last one (this is why we're substracting 1 from stepLen). 

		since every step in a chain as a sum of color1 and color2 in some proportion (i.e. second step in 9-step-long chain has 87.5% of color1 and 12.5% of color2), we can calculate step X's formula as (color1*(L-X) + color2*X); L is the chain lenght.

		thus, we multiply first color on its per-step percentage (i.e. 8-1/8 = 7/8 = 0.875) and add to it the second color multiplied on its per-step percentage (i.e. 1/8 = 0.125). perform this for Red, Green and Blue values and voila! */
		steps.push([ 
			( hexToRgb(color1)[0] * (((stepLen - 1) - stepCount) / (stepLen - 1)) ) + ( hexToRgb(color2)[0] * (stepCount / (stepLen - 1)) ),
			( hexToRgb(color1)[1] * (((stepLen - 1) - stepCount) / (stepLen - 1)) ) + ( hexToRgb(color2)[1] * (stepCount / (stepLen - 1)) ),
			( hexToRgb(color1)[2] * (((stepLen - 1) - stepCount) / (stepLen - 1)) ) + ( hexToRgb(color2)[2] * (stepCount / (stepLen - 1)) ) 
		]);
		stepCount += 1;
	};
	/* and the last color is just color2, no need to count it either */
	steps.push(hexToRgb(color2));
}





function genBlocks() {
	console.log('[c] Starting blocks gradient generation... ');
	console.log(steps);

	/* wipe all the blocks previously visualized */
	$( ".visImg" ).remove();
	
	/* wipe previous step leaders */
	var stepLeaders = [];
	
	/* compare all the blocks from list to a given step */
	var stepCount = 0;

	while(stepCount <= (stepLen - 1)) {
		var currentStep = steps[stepCount];
		var stepLeaderboard = ["missingNo", 0];
		var blockCount = blockLen;
		while(blockCount >= 0) {
			var currentBlock = eval('block' + blockCount);

			/* count similarity for Red, Green and Blue */
			var calcR = 255 - Math.abs(currentStep[0] - currentBlock[1]);
			calcR /= 255;
			var calcG = 255 - Math.abs(currentStep[1] - currentBlock[2]);
			calcG /= 255;
			var calcB = 255 - Math.abs(currentStep[2] - currentBlock[3]);
			calcB /= 255;

			/* 0.0 means 'completely opposite colours', 1.0 means 'same colours'. Values <0.7 in 99% of cases are junk */
			var currentComparison = [currentBlock[0], (calcR + calcG + calcB) / 3];

			blockCount -= 1;

			/* update the "leaderboard" if results are higher than previous */
			if (currentComparison[1] > stepLeaderboard[1]) {
				stepLeaderboard = currentComparison;
		}};
	
	/* write current step leader to a corresponding stepLeaderX variable */
	stepLeaders.push(stepLeaderboard[0]);
	console.log('AAAND THE WINNER OF STEP ' + stepCount + ' IS ' + stepLeaders[stepCount] + ' !!!');

	/* visualize step leader block */
	var stepVis = $('<img class="visImg">');
	stepVis.attr('src', './data/input/' + stepLeaders[stepCount]);
	stepVis.attr('title', stepLeaders[stepCount].replace('.png', ''));
	stepVis.appendTo('#visResult');

	/* move to the next step */
	stepCount += 1;
	};
	console.log('[c] Blocks gradient generated successfully.');
};





/* upscale/downscale buttons */
$('#visDownscale').on('click', function() { 
	if (parseInt($('.visImg').css('width')) >= 32) {
	$('.visImg').css({'width': parseInt($('.visImg').css('width')) * 0.5 + 'px'});
	$('.visImg').css({'height': parseInt($('.visImg').css('height')) * 0.5 + 'px'});
}});
$('#visUpscale').on('click', function() { 
	if (parseInt($('.visImg').css('width')) <= 128) {
		$('.visImg').css({'width': parseInt($('.visImg').css('width')) * 2 + 'px'});
		$('.visImg').css({'height': parseInt($('.visImg').css('height')) * 2 + 'px'});
}});



/* finally, process GG button */
$('#ggBtn').on('click', function() { genGradient(); });
function genGradient() {
	$("#ggBtn").prop("disabled", true)
	updateSteps();
	genBlocks();
	$("#ggBtn").prop("disabled", false)
};





/* handle blocks from output.js */
blockImportCount = blockLen;





/* init console message */
console.log('*boop* main script initialized');

/* enable GG button when the script is ready */
$("#ggBtn").prop("disabled", false);

/* update colors just for sure (required in some cases) */
setTimeout(function () { updateColors(); }, 500);