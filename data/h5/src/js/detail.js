require.config({
	paths: {
		"mui": "libs/mui.min"
	}
})
require(["mui"], function(mui) {
	let ids = localStorage.getItem("id")
	let lis = [...document.querySelectorAll(".mui-bar-nav .top .center ul li")]
	let wraps = document.querySelector(".mui-slider-group")
	let ipt = document.querySelector(".bottom input")
	let spns = [...document.querySelectorAll(".counter li span")]
	let wan = document.querySelector(".wan")
	let timers = document.querySelector(".timers")
	let str=""
	mui.ajax('/api/refer', { //打开页面显示支出
		data: {
			"uid": ids,
			"income": lis[0].innerHTML
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			render(data.data)
		}
	})

	function init() {
		renderFun()
		calculator()

	}

	function renderFun() { //点击收入支出
		lis.forEach(function(item) {
			item.addEventListener("tap", function() {
				mui.ajax('/api/refer', {
					data: {
						"uid": ids,
						"income": item.innerHTML
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					success: function(data) {
						render(data.data)
						account = item.innerHTML
						list = [...wraps.querySelectorAll(".mui-slider-item ul li")]
						list.forEach(function(item) {
							item.addEventListener("tap", function() {
								cls = this.children[0].className
								types = this.children[1].innerHTML
							})
						})
						add()
					}
				})
				for (let i = 0; i < lis.length; i++) { //tab切换
					lis[i].classList.remove("active")
				}
				this.classList.add("active")
			})
		})
	}

	function render(data) { //渲染icon
		console.log(data)
		var arr = []
		var num = Math.ceil(data.length / 10)
		for(let i=0;i<num;i++){
			arr.push(data.splice(0,10))
		}
		arr.forEach(function(item){
			str += `
				<div class="mui-slider-item">
					<ul>
			`
			item.map(function(val){
				return str +=`
					<li class="custom">
							<i class="${val.icon}"></i>
							<span>${val.type}</span>
					</li>
					`
			}).join("") 
			str += `
				<li class="custom">
						<i class="mui-icon mui-icon-plus"></i>
						<span>自定义</span>
				</li>`
			
			str += `
				</ul>
				</div>
			`
		})
		wraps.innerHTML += str 
				
		//获得slider插件对象
		var gallery = mui('.mui-slider');
		gallery.slider({
			interval: 0 //自动轮播周期，若为0则不自动播放，默认为0；
		});
		edit()



	}

	function calculator() { //计算器
		spns.forEach(function(item) {
			item.addEventListener("tap", function() {
				if (item.innerHTML === "x") {
					ipt.value = ipt.value.substr(0, ipt.value.length - 1)
				} else if (ipt.value === "0.00") {
					ipt.value = ""
					ipt.value = item.innerHTML
				} else if (ipt.value.includes(".") && item.innerHTML === ".") {
					ipt.value = ipt.value
				} else if (ipt.value.includes(".") && ipt.value.split(".")[1].length === 2) {
					ipt.value = ipt.value
				} else {
					ipt.value += item.innerHTML
				}
			})
		})
	}

	function add() { //添加个人账单
		wan.addEventListener("tap", function() {
			mui.ajax('/api/addation', {
				data: {
					"uid": ids,
					"icon": cls,
					"type": types,
					"timer": timers.innerHTML,
					"money": ipt.value,
					"income": account
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					window.location.href = "../index.html"
				}
			});
		})
	}

	function edit() {
		var custom = document.querySelectorAll(".custom")
		custom.forEach(function(item) {
			item.addEventListener("tap", function() {
				window.location.href = "../pages/main.html"
			})
		})
	}
	init()
})
