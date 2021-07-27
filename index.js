/* change JS error message to a loading message */
$('#colorPreviewText').html('Loading...');





/* colour picker with gradient preview */
let color1, color2;

function updateColors() {
	color1 = $('#colorSel1').val();
	color2 = $('#colorSel2').val();
	$('#colorPreviewText').html(color1 + '　→　' + color2);
	$('#colorPreview').css({'background': 'linear-gradient(90deg, ' + color1 + ', ' + color2 + ')'});
};

$('#colorSel1,#colorSel2').on('change', function() { updateColors(); });

/* copy colour on right click */
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

/* random colours */
function rndColors() {
	const hexNums = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f']

	var rndColorValues = ['',''];
	
	/* count values for color1 and color2 at the same time */
	while(rndColorValues[0].length + rndColorValues[1].length < 12) {
		rndColorValues[0] += hexNums[Math.round( Math.random() * 15 )];
		rndColorValues[1] += hexNums[Math.round( Math.random() * 15 )];
	};
	$('#colorSel1').val('#' + rndColorValues[0]);
	$('#colorSel2').val('#' + rndColorValues[1]);

	updateColors();
};

$('#rndColorsBtn').on('click', function() { rndColors(); });





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
	if ($('#cLenghtBtn3').html() != "Custom...") {
		stepLen = prompt('Please enter a custom length (any integer equal or more than 3)', parseInt( $('#cLenghtBtn3').html().replace("Custom (", "").replace(")", "") ));
	} else {
		stepLen = prompt('Please enter a custom length (any integer equal or more than 3)', stepLen);
	};
	
	/* process amogus */
	if (stepLen == 'amogus' | stepLen == 'sus') {
		alert('OH MY GOD THE CHAIN IS SUS HAHA :D :D LOL AMOGUS MEME SO FUNNY SUS SUS SUSSY LMAO HAHAHAHAHA :DDDDD');
		$("#ggBtn, label, h1, h2, a, em").html("ｓｕｓ");
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

	/* the first step is just color1, no need to count it */
	steps.push(hexToRgb(color1));

	var stepCount = 1;
	while(stepCount < stepLen - 1) {

		/* math sorcery goes here (daaamn i hate math >_<).
		in a nutshell: since we already know first and last steps, we're starting from the second (1) step and counting until the pre-last one (this is why we're substracting 1 from stepLen). 

		since every step in a chain as a sum of color1 and color2 in some proportion (i.e. second step in 9-step-long chain has 87.5% of color1 and 12.5% of color2), we can calculate step X's formula as (color1*(L-X) + color2*X); L is the chain length.

		thus, we multiply first colour on its per-step percentage (i.e. 8-1/8 = 7/8 = 0.875) and add to it the second colour multiplied on its per-step percentage (i.e. 1/8 = 0.125). perform this for Red, Green and Blue values and voila! */
		steps.push([ 
			( hexToRgb(color1)[0] * (((stepLen - 1) - stepCount) / (stepLen - 1)) ) + ( hexToRgb(color2)[0] * (stepCount / (stepLen - 1)) ),
			( hexToRgb(color1)[1] * (((stepLen - 1) - stepCount) / (stepLen - 1)) ) + ( hexToRgb(color2)[1] * (stepCount / (stepLen - 1)) ),
			( hexToRgb(color1)[2] * (((stepLen - 1) - stepCount) / (stepLen - 1)) ) + ( hexToRgb(color2)[2] * (stepCount / (stepLen - 1)) ) 
		]);
		stepCount += 1;
	};
	/* and the last step is just color2, no need to count it either */
	steps.push(hexToRgb(color2));
}




/* block generation */
var stepLeaders = [];
var stepCount = 0;

function genBlocks() {
	console.log('[g] Starting blocks gradient generation... ');

	/* wipe all the blocks previously visualised if "optRKeep" is NOT enabled */
	if (! $('#optRKeep').is(':checked')) {
		$( ".visImg" ).remove();
	};
	
	/* wipe previous step leaders */
	stepLeaders = [];
	
	/* compare all the blocks from list to a given step */
	stepCount = 0;

	while(stepCount <= (stepLen - 1)) {
		var currentStep = steps[stepCount];
		var stepLeaderboard = ["missingNo", 0];
		var blockCount = blockData.length -1;
		while(blockCount >= 0) {
			var currentBlock = blockData[blockCount];

			/* count similarity for Red, Green and Blue */
			var calcR = 255 - Math.abs(currentStep[0] - currentBlock.rgb[0]);
			calcR /= 255;
			var calcG = 255 - Math.abs(currentStep[1] - currentBlock.rgb[1]);
			calcG /= 255;
			var calcB = 255 - Math.abs(currentStep[2] - currentBlock.rgb[2]);
			calcB /= 255;

			/* 0.0 means 'completely opposite colour', 1.0 means 'same colour'. Values <0.8 in 99% of cases are junk */
			var currentComparison = [currentBlock.id, (calcR + calcG + calcB) / 3];

			blockCount -= 1;

			/* update the "leaderboard" if results are higher than previous */
			if (currentComparison[1] > stepLeaderboard[1]) {
				stepLeaderboard = currentComparison;
		}};
	
	/* write current step leader to a corresponding stepLeaderX variable */
	stepLeaders.push(stepLeaderboard[0]);
	// console.log('[g -- step ' + stepCount + '] AAAND THE WINNER IS "' + stepLeaders[stepCount] + '" !!!');

	/* check for duplicate if "optNodub" is enabled and visualise block */
	if ($('#optNodub').is(':checked') && stepCount > 0) {
		if (stepLeaders[stepCount] != stepLeaders[stepCount -1]) {
			blockVis();
	}} else {
		blockVis();
	};

	/* move to the next step */
	stepCount += 1;
	};
	console.log('[v] Blocks gradient visualised successfully.');
};





/* block visualisation */
function blockVis() {
	var stepVis = $('<img class="visImg" onclick="$(this).hide(200);" onmouseover="showPopup(this);" onmouseout="hidePopup(this);">');
	stepVis.attr('src', './data/' + blocksType + '/' + stepLeaders[stepCount]);
	stepVis.attr('blockname', stepLeaders[stepCount].replace('.png', '').replace(/\_/g, ' '));
	stepVis.css('width', visSize + 'px');
	stepVis.css('height', visSize + 'px');
	stepVis.appendTo('#visResult');
}





/* visualisation upscale/downscale buttons */
var visSize = 64;

$('#visDownscale').on('click', function() { if (visSize > 16) {
	visSize /= 2;
	$('.visImg').css('width', visSize + 'px');
	$('.visImg').css('height', visSize + 'px');
}});
$('#visUpscale').on('click', function() { if (visSize < 256) {
	visSize /= 0.5;
	$('.visImg').css('width', visSize + 'px');
	$('.visImg').css('height', visSize + 'px');
}});

/* update and show popup when block is hovered */
function showPopup(e) {
	$('#visPopup').html($(e).attr('blockname'));
	$('#visPopup').css('left', e.x + 4).css('top', e.y + 4);
	$('#visPopup').show();
};

/* hide popup when block is not hovered */
function hidePopup(e) {
	$('#visPopup').hide();
};




/* default values for block types and data */
var blocksType = 'blocks';
var blockData = eval('blocks');
var presetsLocation = eval('presets');

/* presets importer */
function presetImport () {
	/* wipe previous presets */
	$( "option" ).remove();
	
	/* create 'Default (1.17.1 blocks)' option if blocksType = blocks */
	if (blocksType == 'blocks') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks',
				text: 'Default (1.17.1 blocks)' 
		}));
	$('#blocksPresetDD').val('blocks');
	blockData = eval( $('#blocksPresetDD').val() );
	};

	/* create 'Default (1.12.2 blocks)' option if blocksType = blocks_pa */
	if (blocksType == 'blocks_pa') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_pa',
				text: 'Default (1.12.2 blocks)'
		}));
	$('#blocksPresetDD').val('blocks_pa');
	blockData = eval( $('#blocksPresetDD').val() );
	};
	
	var presetImporter = 0;
	
	if (blocksType == 'blocks') { presetsLocation = eval('presets'); };
	if (blocksType == 'blocks_pa') { presetsLocation = eval('presets_pa'); };

	while(presetImporter < presetsLocation.length) {
		
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: presetsLocation[presetImporter]['value'],
				text: presetsLocation[presetImporter]['text']
			}));
		presetImporter += 1;
	}
	
	/* when all the presets imported, add 'Custom blocks...' option
	$('#blocksPresetDD').append(
		$(document.createElement('option')).prop({
			value: 'custom',
			text: 'Custom blocks...'
		})); */
};

presetImport();





/* preset selector */
$('#blocksPresetDD').change(function () {
	if ($('#blocksPresetDD').val() != 'custom') {
		console.log('[p] changed preset to "' + $('#blocksPresetDD').val() + '"');
		blockData = eval( $('#blocksPresetDD').val() );
}});





/* custom blocks screen */
$('#blocksPresetDD').change(function () {
	if ($('#blocksPresetDD').val() == 'custom') {
		console.log('[p] custom preset screen selected, waiting for preset...');
		
		$('#blocksSelScreen').fadeIn(300);
	}
});

/* custom blocks screen cancel button */
$('#blocksSelScreenClose').on('click', function() {
	$('#blocksPresetDD').val('blocks');
	console.log('[p] custom preset screen cancelled, reverted to "' + $('#blocksPresetDD').val() + '"');
	blockData = eval( $('#blocksPresetDD').val() );

	$('#blocksSelScreen').fadeOut(300);
});





/* blocks type switcher ('blocks' -- Jappa-nese *badum-tss* textures | 'blocks_pa' -- Programmer's Art textures */
function blocksTypeSwitch () {
	if ($('#blocksTypeSwitcher').is(':checked')) { blocksType = 'blocks_pa'; }
	if (! $('#blocksTypeSwitcher').is(':checked')) { blocksType = 'blocks'; }

	presetImport();
	console.log('[p] blocks type changed to "' + blocksType + '", reverted to "' + $('#blocksPresetDD').val() + '"');
};

$('#blocksTypeSwitcher').on('click', function() { blocksTypeSwitch(); });





/* finally, process GG button */
$('#ggBtn').on('click', function() { genGradient(); });
function genGradient() {
	$('#ggBtn').prop('disabled', true);
	updateSteps();
	genBlocks();
	$('#ggBtn').prop('disabled', false);
};





/* init console message */
console.log('*boop* main script initialized');

/* le final countdown */
$(document).ready(function() {
	/* randomize colours on startup if no cached colours available; otherwise just update colors */
	color1 = $('#colorSel1').val();
	color2 = $('#colorSel2').val();
	if (color1 == '#000000', color2 == '#000000') { rndColors(); } else { updateColors(); };
	
	/* enable GG button when the script is ready */
	$("#ggBtn").prop("disabled", false);
});
