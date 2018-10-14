const sh = $(window).height()

const Model = new class {
}

const App = new class {
	
	init () {
		App.scrollEvent = false
		App.count = 0
		App.scrollAnimation()
	}

	scrollAnimation () {
		$("html, body").stop().animate({scrollTop:sh*App.count},
			{duration:100, complete: () => {
				App.scrollEvent = false
			}
		})
		$(".bullet").css({background:"#dfdfdd"})
		$(".bullet").eq(App.count).css({background:"#6789ca"})
		if(App.count == 1 || App.count == 2) $(".bullet > .name").css({color:"#504e49"})
		else $(".bullet > .name").css({color:"#dfdfdd"})
	}

	mouseScroll (e) {
		e.preventDefault()
		var delta = e.originalEvent.wheelDelta
		if (delta <= -120 && App.scrollEvent == false && App.count < 4) {
			App.scrollEvent = true
			App.count++
		} else if (delta >= 120 && App.scrollEvent == false && App.count >= 1) {
			App.scrollEvent = true
			App.count--
		}
		App.scrollAnimation()
	}

	clickScroll () {
		App.count = $(this).index()
		App.scrollAnimation()
	}
}

const Board = new class {

	init () {
		Board.type = 'tradition'
		Board.setBoard()
	}

	setBoard () {
		const slide = $(".slide:not(.dummy)")
		const type = eval(Board.type)
		type.forEach((val, idx) => {
			slide.eq(idx).find('.image').css({"background-image":"url("+val.url+")"})
			slide.eq(idx).find('.desc .text:nth-child(1)').text(val.name)
			slide.eq(idx).find('.desc .text:nth-child(2)').text(val.content)
		})
	}

	changeContent () {
		Board.type = $(this).data('type')
		Board.setBoard()
	}

	modalOpen () {
		const modal = $(".modal")
		modal.show()
		setTimeout(() => modal.find('.wrap').css({"transform":"translateX(0)"}),1)
		const idx = $(this).parents('.slide').index() - 1
		const type = eval(Board.type)
		modal.find('.image').css({"background-image":"url("+type[idx].url+")"})
		modal.find('.name').text(type[idx].name)
		modal.find('.content').text(type[idx].content)
	}

	modalClose () {
		const modal = $(".modal")
		modal.find('.wrap').css({"transform":"translateX(100%)"})
		setTimeout(() => modal.hide(),400)
	}

}

const Path = new class {

	init () {
		Path.lbl = ["경복궁","창덕궁","DDP","홍대","SMTOWN","명동","한강","북한산"]
		Path.distance = [
			[0, 15, 26, 32, 49, 28, 42, 53],
			[15, 0, 25, 32, 47, 25, 47, 55],
			[26, 25, 0, 29, 40, 18, 47, 69],
			[32, 32, 29, 0, 55, 33, 34, 72],
			[49, 47, 40, 55, 0, 49, 61, 90],
			[28, 25, 18, 33, 49, 0, 41, 63],
			[42, 47, 47, 34, 61, 41, 0, 87],
			[53, 55, 69, 72, 90, 63, 87, 0]
		]
	}

	Shortest () {
		Path.arr = []
		this.place.forEach((el, idx) => {
			if (el.checked) Path.arr.push(idx)
		})

		Path.len = Path.arr.length
		Path.min = 10000
		Path.pathList = []

		for (var i = 0; i < Path.len; i++) {
			Path.shortPathTree(i, 1, [i], 0)
		}

		let str = `<div>${Path.lbl[Path.arr[Path.pathList[0]]]}</div>`
		for (var i = 1; i < Path.pathList.length; i++) {
			str += `
				<i class="fa fa-angle-right fa-3x"></i>
				<div>${Path.lbl[Path.arr[Path.pathList[i]]]}</div>`
		}

		$(".course_display > .content").html(str)
		return false

	}

	shortPathTree (start, step, p, min) {
		if (Path.min < min) return
		if (step === Path.len) {
			if (Path.min >= min) {
				Path.min = min
				Path.pathList = p
			}
			return
		}

		Path.arr.forEach((el, idx) => {
			if (p.indexOf(idx) != -1) return
			let new_p = p.slice()
			new_p.push(idx)
			const cost = Path.distance[Path.arr[start]][Path.arr[idx]]
			Path.shortPathTree(idx, step + 1, new_p, min + cost)
		})
	}
}

const loadOn = () => {
	App.init()
	Board.init()
	Path.init()
}

$(loadOn)
.on("click",".bullet",App.clickScroll)
.on("mousewheel","html, body",App.mouseScroll)
.on("click",".theme",Board.changeContent)
.on("click",".modal_btn",Board.modalOpen)
.on("click",".close_btn",Board.modalClose)
.on("submit",".path_form",Path.Shortest)