var page = document.getElementById("page");
var defaultMarginLeft = "40em";
var defaultMarginTop = "40em";
var lineCharCount = 0;

function advanceCarriage(){
  var newMarginLeft = parseFloat(page.style.marginLeft) - 0.6 + "em";
  page.style.marginLeft = newMarginLeft;
}
function backspaceCarriage(){
  if (page.style.marginLeft < defaultMarginLeft){
    var newMarginLeft = parseFloat(page.style.marginLeft) + 0.6 + "em";
    page.style.marginLeft = newMarginLeft;
  }
}
function carriageReturn(){
  page.rows += 1;
  var newMarginTop = parseFloat(page.style.marginTop) - 1.143 + "em";
  page.style.marginTop = newMarginTop;
  page.style.marginLeft = defaultMarginLeft;
  lineCharCount = 0;
}
function upOneLine(){
  page.rows -= 1;
  var newMarginTop = parseFloat(page.style.marginTop) + 1.143 + "em";
  page.style.marginTop = newMarginTop;
  page.style.marginLeft = defaultMarginLeft;
  lineCharCount = 0;
}
function insertAtCursor(string) {
	var startPos = page.selectionStart, endPos = page.selectionEnd, oldText = page.value;
	page.value = oldText.substring(0, startPos) + string + oldText.substring(endPos);
	page.setSelectionRange(startPos + string.length, startPos + string.length);
	page.focus();
	lineCharCount += string.length;
	playAltHitSound();
  for (var i=0; i<string.length; i++){
    advanceCarriage();
	}
}
function playHitSound(){
  var hitSound = new Audio('sound/hit.mp3');
  hitSound.play();
}
function playAltHitSound(){
  var altHitSound = new Audio('sound/hit_alt.mp3');
  altHitSound.play();
}
function playDingSound(){
  var dingSound = new Audio('sound/ding.mp3');
  dingSound.play();
}

document.addEventListener('DOMContentLoaded', function (){
  page.style.marginLeft = defaultMarginLeft;
  page.style.marginTop = defaultMarginTop;
  page.addEventListener("keydown", function (e){
    var k = e.which;
    console.log(k);
    console.log(e);
    if (lineCharCount > 117){
      insertAtCursor('\n');
      carriageReturn();
      lineCharCount += 1;
      advanceCarriage();
    }
    else if (!e.repeat&&!e.metaKey&&!e.altKey&&!e.ctrlKey){
      if (k>=48&&k<=57||k>=65&&k<=90||k==32||k>=188&&k<=192||k>=219&&k<=222||k>=186&&k<=189){
        /*  Typing characters (shifted and unshifted):
         *  0-9, a-z, Space, ,./`, ;=-
         */
        lineCharCount += 1;
        advanceCarriage();
        if (lineCharCount == 114){
          playDingSound();
        } else if (k==32){
          playAltHitSound();
        } else {
          playHitSound();
        }
      } else if (k==8 && lineCharCount > 0 || k==37 && lineCharCount > 0){
        /*  Backspace, left arrow  */
        lineCharCount -= 1;
        backspaceCarriage();
        playAltHitSound();
      } else if (k==13){
        /* Enter */
        carriageReturn();
        playAltHitSound();
      } else if (k==40){
        /* Down arrow */
        var endPos = page.selectionEnd, endString = page.value.substring(endPos);
      	if (endString.search(/\n/g) > -1){
      	  carriageReturn();
          playAltHitSound();
      	} else {
      	  event.preventDefault();
      	}
      } else if (k==38 && page.rows > 1){
        /* Up arrow */
        upOneLine();
        playAltHitSound();
      } else if (k==39){
        /* Right arrow */
        var endPos = page.selectionEnd, endString = page.value.substring(endPos);
      	if (endString !== "" && endString.substring(0,1) !== "\n"){
      	  lineCharCount += 1;
          advanceCarriage();
          playAltHitSound();
      	} else {
      	  event.preventDefault();
      	}
      } else if (k==9) {
        /* Tab */
        insertAtCursor('     '); // 5 space tab
        event.preventDefault();
      }
      else {
        event.preventDefault();
      }
    } else {
      event.preventDefault();
    }
  });
});