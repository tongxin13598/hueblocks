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
	const hexNums = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];

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





/* swap colours */
function swapColors() {
	var swapColorsTemp = [color1,color2];

	$('#colorSel1').val(swapColorsTemp[1]);
	$('#colorSel2').val(swapColorsTemp[0]);

	updateColors();
};

$('#swapColorsBtn').on('click', function() { swapColors(); });





/* compact HEX <--> RGB converter I found on stackoverflow */
function hexToRgb(h){return['0x'+h[1]+h[2]|0,'0x'+h[3]+h[4]|0,'0x'+h[5]+h[6]|0]}
function rgbToHex(r,g,b){return"#"+((1<<24)+(r<<16)+(g<<8)+ b).toString(16).slice(1);}





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
		alert('The entered number is too small; please enter at least 3 or bigger.');
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
	const id = stepLeaders[stepCount];
	const item = blockData.find(i => i.id === id.replace(".png"));
	stepVis.attr('src', item?.imageData ? item.imageData : './data/' + blocksType + '/' + stepLeaders[stepCount]);
	stepVis.attr('blockname', stepLeaders[stepCount].replace('.png', '').replace(/\_/g, ' '));
	stepVis.css({'width': visSize + 'px', 'height': visSize + 'px'});

	stepVis.appendTo('#visResult');
}





/* visualisation upscale/downscale buttons */
var visSize = 64;

$('#visDownscale').on('click', function() { if (visSize > 16) {
	visSize /= 2;
	$('.visImg').css({'width': visSize + 'px', 'height': visSize + 'px'});
}});
$('#visUpscale').on('click', function() { if (visSize < 256) {
	visSize /= 0.5;
	$('.visImg').css({'width': visSize + 'px', 'height': visSize + 'px'});
}});

/* update and show popup when block is hovered */
function showPopup(block) {
	$('#visPopup').html($(block).attr('blockname'));
	$('#visPopup').css('left', block.x + 4).css('top', block.y + 4);
	$('#visPopup').show();
};

/* hide popup when block is not hovered */
function hidePopup(block) {
	$('#visPopup').html('MissingNo');
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
				text: 'Default (1.12.2 blocks +1)'
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
	
	/* when all the presets imported, add 'Custom preset...' option */
	$('#blocksPresetDD').append(
		$(document.createElement('option')).prop({
			value: 'customPreset',
			text: 'Custom preset'
		}));

	/* add new option for custom blocksets */
	$('#blocksPresetDD').append(
		$(document.createElement('option')).prop({
			value: 'customBlockset',
			text: '[NEW] Custom blockset'
		}));
};

presetImport();


/* preset selector */
$('#blocksPresetDD').change(function () {
	if (!$('#blocksPresetDD').val().includes("custom")) {
		console.log('[p] changed preset to "' + $('#blocksPresetDD').val() + '"');
		blockData = eval( $('#blocksPresetDD').val() );
}});


/* Custom Blockset */

// Create Temporary Canvas
const tempCanvas = document.createElement("canvas");

// Set Width/Height To 1px & Hide
tempCanvas.width = 1;
tempCanvas.height = 1;
tempCanvas.style.visibility = "hidden";
tempCanvas.style.position = "fixed";
tempCanvas.style.top = "0";
tempCanvas.style.left = "0";

// Get Temporary Context
const tempContext = tempCanvas.getContext('2d');
console.log("[p]", "Temporary context created");

function readFile(file) {
	return new Promise((r,j) => {
		const reader = new FileReader();
		reader.onload = function(e) { r(e) };
		reader.onerror = function(e) { j(e) };
		reader.readAsDataURL(file);
	});
}

let customBlockset = [];
async function onDirectoryChange(d) {
	/**
	 * @type {File[]}
	 */
	const files = Array.from(d.files).filter(i => /(image\/png|image\/jpeg)/.test(i.type) && !i.type.includes("gif"));

	if (!files.length) {
		// Failed
		return;
	} else {
		async function wait(ms) {
			return new Promise((r) => setTimeout(() => r(), ms));
		}

		for (const file of files) {
			try {
				// Await Read File
				const f = await readFile(file);

				// Use base64 Data To Create New Image
				const image = new Image();
				image.src = f.target.result;

				// Once Image Is Loaded Continue
				image.onload = function () {
					// Draw Image To Temporary Context
					tempContext.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);

					// await wait(2);

					// Get RGBA Of Image
					const rgba = tempContext.getImageData(0, 0, 1, 1).data;

					// Append Image Custom Blocks View
					const img = $(`<img class="CBSelVisImg" src="${f.target.result}" alt="${file.name}"/>`);
					img.appendTo("#CBCustomBlocks");

					// Get Name Remove Extension
					let name = file.name.split(".");
					name.pop();
					name = name.join(".");

					// Get RGB From RGBA
					const rgb = [rgba[0], rgba[1], rgba[2]];

					// Push Texture To customBlockset Array
					customBlockset.push({id: name, rgb, imageData: f.target.result});

					console.log("[p]", "Successfully read file", file.name);
				}
			} catch (err) {
				console.log("[p]", "Failed to read file", file.name, err);
			}
		}

		if (customBlockset.length > 0) {
			// Allow Confirm
			CBConfirmUpdater(false);
		}
	}
}

$('#blocksPresetDD').change(function () {
	if ($('#blocksPresetDD').val() == 'customBlockset') {
		$('#CBSelScreen').fadeIn(300);
		var BPickBlocksVis = 0;
		$('#CBSelScreenVis').html('');

		blockData = [];
		customBlockset = [];
		CBConfirmUpdater(true);

		const CBInput = $('<div><input type="file" id="CBSelScreenDirectorySelector" onchange="onDirectoryChange(this)" accept="image/png, image/jpeg" multiple/></div>');
		CBInput.appendTo('#CBSelScreenVis');
		const CBBlock = $('<div id="CBCustomBlocks"></div>');
		CBBlock.appendTo('#CBSelScreenVis');

	}
})
$('#CBSelScreenConfirm').on('click', function() {
	$('#CBSelScreen').fadeOut(300);
	CBConfirmUpdater(true);
	blockData = customBlockset;
})
$('#CBSelScreenClose').on('click', function() {
	if (blocksType == 'blocks_pa') {$('#blocksPresetDD').val('blocks_pa')} else {$('#blocksPresetDD').val('blocks')};
	blockData = eval( $('#blocksPresetDD').val() );
	console.log(`[p] custom blockset cancelled. Changing type back to "${blocksType}"`);
	CBConfirmUpdater(true);
	$('#CBSelScreen').fadeOut(300);
	customBlockset = [];
});
function removeFileUpload() {
	$('#CBSelScreenDirectorySelector').remove();
}
function CBConfirmUpdater(i) {
	$('#CBSelScreenConfirm').prop('disabled', i);
};



/* custom preset blocks selection screen */
$('#blocksPresetDD').change(function () {
	if ($('#blocksPresetDD').val() == 'customPreset') {
		if (blocksType == 'blocks_pa') {$('#blocksPresetDD').val('blocks_pa')} else {$('#blocksPresetDD').val('blocks')};
		blockData = eval( $('#blocksPresetDD').val() );
		console.log('[p] custom preset selected, temporarily changed to "' + $('#blocksPresetDD').val() + '"');
		
		$('#CPSelScreen').fadeIn(300);
		var BPickBlocksVis = 0;
		$('#CPSelScreenVis').html('');

		/* visualise all the blocks available  */
		CPSelBlocksVis = blockData.length -1;
		var CPselVisLetter = 'ибражы';
		while(CPSelBlocksVis >= 0) {
			if (CPselVisLetter != blockData[CPSelBlocksVis].id[0]) {
				if (CPSelBlocksVis != blockData.length -1) {
					CPSelVis = $('</div>');
					CPSelVis.appendTo('#CPSelScreenVis');
				};
				CPselVisLetter = blockData[CPSelBlocksVis].id[0];
				var CPSelVis = $('<div class="CPSelVisLetterSeparator" id="CPSelVisLetter' + blockData[CPSelBlocksVis].id[0] + '">');
				CPSelVis.appendTo('#CPSelScreenVis');
			};
			var CPSelVis = $('<input type="checkbox" name="' + blockData[CPSelBlocksVis].id + 'Checkbox" class="CPSelVis"]>');
			
			/* jQuery doesn't work properly with IDs that contains ".", lmao*/
			CPSelVis.attr('id', blockData[CPSelBlocksVis].id.replace('.', '・'));
			
			CPSelVis.appendTo('#CPSelVisLetter' + blockData[CPSelBlocksVis].id[0]);

			var CPSelVis = $('<label for="' + blockData[CPSelBlocksVis].id.replace('.', '・') + '" class="CPSelVisBtn"></label>');
			CPSelVis.appendTo('#CPSelVisLetter' + blockData[CPSelBlocksVis].id[0]);
			
			var CPSelVis2 = $('<img class="CPSelVisImg" id="' + blockData[CPSelBlocksVis].id.replace('.', '・') + 'Img" onclick="CPBlockUpdater(' + "this.getAttribute('blockid'), this.getAttribute('blockrgb')" + ');" onmouseover="showPopup(this);" onmouseout="hidePopup(this);">')

			CPSelVis2.attr('src', './data/' + blocksType + '/' + blockData[CPSelBlocksVis].id);
			CPSelVis2.attr('blockname', blockData[CPSelBlocksVis].id.replace('.png', '').replace(/\_/g, ' '));
			CPSelVis2.attr('blockid', blockData[CPSelBlocksVis].id);
			CPSelVis2.attr('blockrgb', blockData[CPSelBlocksVis].rgb[0] + '|' + blockData[CPSelBlocksVis].rgb[1] + '|' + blockData[CPSelBlocksVis].rgb[2]);
			CPSelVis2.css({'width': visSize + 'px', 'height': visSize + 'px'});

			CPSelVis2.appendTo(CPSelVis);
			CPSelBlocksVis -= 1;
}}});

/* check if at least one block is selected (used for confirm button activation/deactivation) */
function CPBlockUpdater(blockid, blockrgb) {
	setTimeout(function () {
		if ($('.CPSelVis:checked').length <= 0) { $('#CPSelScreenConfirm').prop('disabled', true); } else { $('#CPSelScreenConfirm').prop('disabled', false)};
	}, 20);
};

var custom = [];
/* custom blocks screen confirm button */
$('#CPSelScreenConfirm').on('click', function() {
	$('#CPSelScreen').fadeOut(300);

	/* add current block to the preset if checked 
	setTimeout(function () {
		if ($('#' + blockid.replace('.', '・')).is(':checked')) { console.log('БЛ~~~ ~ой мама пришла')};
		console.log('[p] added "' + blockid + '" with rgb "' + blockrgb);
	}, 20); */
	
	/* wipe previous custom preset */
	custom = [];
	
	/* get array of all the selected blocks */
	var CPSelectedBlocks = $('.CPSelVis:checked');
	
	var CPSelectedBlocksPart = [];
	var currentCPSelectedBlock = 0;
	while(currentCPSelectedBlock <= CPSelectedBlocks.length -1) {
		/* convert blockrgb and blockid to preset array format */
		CPSelectedBlocksPart = { 
			id: $('#' + CPSelectedBlocks[currentCPSelectedBlock].id + 'Img').attr('blockid'),
			rgb: [
			parseInt($('#' + CPSelectedBlocks[currentCPSelectedBlock].id + 'Img').attr('blockrgb').split('|')[0]),
			parseInt($('#' + CPSelectedBlocks[currentCPSelectedBlock].id + 'Img').attr('blockrgb').split('|')[1]),
			parseInt($('#' + CPSelectedBlocks[currentCPSelectedBlock].id + 'Img').attr('blockrgb').split('|')[2]),
		]};

		/* push generated array to the custom preset */
		custom.push(CPSelectedBlocksPart);
		currentCPSelectedBlock += 1;
		};
	$('#blocksPresetDD').val('customPreset');
	blockData = custom;

	console.log('[p] custom preset generated successfully! changed to "' + $('#blocksPresetDD').val() + '"');
	console.log('[p]', custom);
});


/* custom blocks screen cancel button */
$('#CPSelScreenClose').on('click', function() {
	console.log('[p] custom preset cancelled.');
	$('#CPSelScreen').fadeOut(300);
});





/* blocks type switcher ('blocks' -- Jappa-nese *badum-tss* textures | 'blocks_pa' -- Programmer's Art textures */
function blocksTypeSwitch () {
	if ($('#blocksTypeSwitcher').is(':checked')) { blocksType = 'blocks_pa'; }
	if (! $('#blocksTypeSwitcher').is(':checked')) { blocksType = 'blocks'; }

	presetImport();
	console.log('[p] blocks type changed to "' + blocksType + '", reverted to "' + $('#blocksPresetDD').val() + '"');
};

$('#blocksTypeSwitcher').on('click', function() { blocksTypeSwitch(); });





/* BPick screen */
var BPickCSV = 'color1';

function colorBPick(color) {
	var BPickBlocksVis = 0;
	$('#BPickScreen').fadeIn(300);
	$('#BPickScreenVis').html('');

	/* store selected colour (color1 or color2) value */
	BPickSCV = color;

	/* visualise all the blocks available  */
	BPickBlocksVis = blockData.length -1;
	var BPickVisLetter = 'ибражы';
	while(BPickBlocksVis >= 0) {
		if (BPickVisLetter != blockData[BPickBlocksVis].id[0]) {
			if (BPickBlocksVis != blockData.length -1) {
				BPickVis = $('</div>');
				BPickVis.appendTo('#BPickScreenVis');
			};
			BPickVisLetter = blockData[BPickBlocksVis].id[0];
			var BPickVis = $('<div class="BPickVisLetterSeparator" id="BPickVisLetter' + blockData[BPickBlocksVis].id[0] + '">');
			BPickVis.appendTo('#BPickScreenVis');
		};
		var BPickVis = $('<img class="BPickVisImg" onclick="' + "BPickSelect(this.getAttribute('blockid'));" + '" onmouseover="showPopup(this);" onmouseout="hidePopup(this);">');

		/* add essential attributes */
		BPickVis.attr('src', blockData[BPickBlocksVis].imageData ? blockData[BPickBlocksVis].imageData : './data/' + blocksType + '/' + blockData[BPickBlocksVis].id);
		BPickVis.attr('blockname', blockData[BPickBlocksVis].id.replace('.png', '').replace(/\_/g, ' '));
		BPickVis.attr('blockid', blockData[BPickBlocksVis].id);

		/* add size controls */
		BPickVis.css({'width': visSize + 'px', 'height': visSize + 'px'});

		BPickVis.appendTo('#BPickVisLetter' + blockData[BPickBlocksVis].id[0]);
		BPickBlocksVis -= 1;
}};

$('#colorBPick1').on('click', function() { colorBPick('color1'); });
$('#colorBPick2').on('click', function() { colorBPick('color2'); });

/* bpick screen block selection */
function BPickSelect(blockid) {
	var BPickSelectedBlockResult = blockData.filter(function(bdblock) { return bdblock.id == blockid });

	if (BPickSCV == 'color1') {	$('#colorSel1').val(rgbToHex(BPickSelectedBlockResult[0].rgb[0],BPickSelectedBlockResult[0].rgb[1],BPickSelectedBlockResult[0].rgb[2]))};
	if (BPickSCV == 'color2') {	$('#colorSel2').val(rgbToHex(BPickSelectedBlockResult[0].rgb[0],BPickSelectedBlockResult[0].rgb[1],BPickSelectedBlockResult[0].rgb[2]))};
	
	updateColors();
	$('#BPickScreen').fadeOut(300);
};

/* bpick screen cancel button */
$('#BPickScreenClose').on('click', function() {
	$('#BPickScreen').fadeOut(300);
});





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
