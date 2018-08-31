var count = 0
var scrollEvent = false
var sh = $(window).height()

function loadOn () {
	$("html, body").scrollTop(sh*count)
	$(".bullet:first-child").css({background:"#6789ca"})
	$(".bullet > .name").css({color:"#dfdfdd"})
}

function mouseScrollAnimation (e) {
	e.preventDefault()
	var delta = e.originalEvent.wheelDelta
	if (delta == -120 && scrollEvent == false && count < 4) {
		scrollEvent = true
		count++
	} else if (delta == 120 && scrollEvent == false && count >= 1) {
		scrollEvent = true
		count--
	}
	$("html, body").stop().animate({scrollTop:sh*count},
		{duration:100, complete: () => {
			scrollEvent = false
		}
	})
	$(".bullet").css({background:"#dfdfdd"})
	$(".bullet").eq(count).css({background:"#6789ca"})
	if(count == 0) $(".bullet > .name").css({color:"#dfdfdd"})
	else $(".bullet > .name").css({color:"#504e49"})
}

function clickScrollAnimation () {
	count = $(this).index()
	$("html, body").stop().animate({scrollTop:sh*count},
		{duration:100, complete: () => {
			scrollEvent = false
		}
	})
	$(".bullet").css({background:"#dfdfdd"})
	$(".bullet").eq(count).css({background:"#6789ca"})
	if(count == 0) $(".bullet > .name").css({color:"#dfdfdd"})
	else $(".bullet > .name").css({color:"#504e49"})
}

$(loadOn)
.on("click",".bullet",clickScrollAnimation)
.on("mousewheel","html, body",mouseScrollAnimation)