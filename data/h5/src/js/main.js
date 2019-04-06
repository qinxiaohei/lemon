require.config({
	paths: {
		"mui": "libs/mui.min"
	}
})
require(["mui"], function(mui) {
	let list = document.querySelector(".list")

	function init() {
		renderFun()
	}

	function renderFun() {
		mui.ajax("/api/increase", {
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				render(data.data)
			}
		});
	}

	function render(data) {
		var target = [];
		var num = Math.ceil(data.length / 10);

		for (var i = 0; i < num; i++) {
			target.push(data.splice(0, 12));
		}
		var str = '';
		target.forEach(function(item) {
			str += `<div class="mui-slider-item">
							<ul>`;
			item.map(function(v) {
				return str += `<li><i class="${v.icon}"></i></li>`
			}).join('');
			str += `</ul>
			</div>`
		})

		document.querySelector(".mui-slider-group").innerHTML = str;

		//获得slider插件对象
		var gallery = mui('.mui-slider');
		gallery.slider({
			interval: 0 //自动轮播周期，若为0则不自动播放，默认为0；
		});
	}
	init()
})
