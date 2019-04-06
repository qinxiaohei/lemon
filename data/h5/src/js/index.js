require.config({
    paths: {
        "mui": "libs/mui.min",
        "dtpicker": "libs/mui.picker.min",
        "poppicker": "libs/mui.poppicker"
    },
    shim: {
        "dtpicker": {
            deps: ["mui"]
        },
        "poppicker": {
            deps: ["mui"]
        }
    }
})
require(["mui", "dtpicker", "poppicker"], function(mui, dtpicker, poppicker) {
    let btn = document.querySelector(".mui-btn-primary")
    let ipt = document.querySelectorAll(".mui-input-group input")
    let logins = document.querySelector(".login")
    let wrap = document.querySelector(".mui-off-canvas-wrap")
    let ids = localStorage.getItem("id")
    let listbox = document.querySelector(".mui-scroll-wrapper>.mui-scroll>.mui-table-view")
    let addPlus = document.querySelector(".plus")
    let monthtime = document.querySelector(".monthtime")
    let yeartime = document.querySelector(".yeartime")
    let newTime = "" //全局变量让事件组件和一级联动连接起来
    let page = 1;
    let pageSize = 5;

    if (ids) { //如果缓存里有id显示账单页面
        logins.classList.remove("current")
        wrap.classList.add("current")
        bill()
    } else { //如果缓存里没有id显示登录页面
        logins.classList.add("current")
        wrap.classList.remove("current")
        login()
    }

    function init() { //初始化
        pullupRefresh()
        quit()
        jump()
        currentTime()
        dtPickerTime = new mui.DtPicker({ //实例化年月组件
            type: "month"
        })
        timer()
        picker = new mui.PopPicker() //实例化一级联动
        yearTime()
    }

    function timer() {
        monthtime.addEventListener("tap", function() { //点击展示年月
            dtPickerTime.show(function(selectItems) {
                if (newTime === "年") { //如果是年的话只显示年
                    monthtime.innerHTML = selectItems.y.value
                } else if (newTime === "月") { //如果是月的话显示年月
                    monthtime.innerHTML = selectItems.y.value + "-" + selectItems.m.value
                }
            })
        })
    }

    function yearTime() { //是年还是月
        picker.setData([{
            value: 'year',
            text: '年'
        }, {
            value: 'month',
            text: '月'
        }]);
        yeartime.addEventListener("tap", function() { //点击是年还是月
            picker.show(function(selectItems) {
                yeartime.innerHTML = selectItems[0].text

                let pickerM = document.querySelector("[data-id='picker-m']") //月的视图
                let pickerY = document.querySelector("[data-id='picker-y']") //年的视图
                let titleM = document.querySelector("[data-id='title-m']") //月的节点
                let titleY = document.querySelector("[data-id='title-y']") //年的节点
                if (selectItems[0].text === "年") { //只显示年视图
                    titleM.style.display = "none"
                    pickerM.style.display = "none"
                    titleY.style.width = "100%"
                    pickerY.style.width = "100%"
                    newTime = "年"
                } else if (selectItems[0].text === "月") { //显示年月视图
                    titleM.style.display = ""
                    pickerM.style.display = ""
                    titleY.style.width = "50%"
                    pickerY.style.width = "50%" //年视图
                    newTime = "月"
                }
            })
        })
    }

    function currentTime() { //当前时间
        var date = new Date()
        var year = date.getFullYear()
        var month = zero(date.getMonth() + 1)
        monthtime.innerHTML = year + "-" + month
    }

    function zero(t) { //加零函数
        return t >= 10 ? t : "0" + t
    }

    function pullupRefresh() { //上拉加载和下拉刷新
        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                // 				down: {
                // 					callback: pulldownRefresh
                // 				},
                up: {
                    contentrefresh: '正在加载...',
                    callback: bill
                }
            }
        });
    }

    function login() { // 当点击登录按钮的时候登陆个人账单
        btn.addEventListener("tap", function() {
            mui.ajax('/api/user', {
                data: {
                    name: ipt[0].value,
                    pwd: ipt[1].value
                },
                dataType: 'json', //服务器返回json格式数据
                type: 'post', //HTTP请求类型
                timeout: 10000, //超时时间设置为10秒；
                success: function(data) {
                    logins.classList.remove("current")
                    wrap.classList.add("current")
                    localStorage.setItem("id", data.data[0]._id)
                    bill()
                }
            })
        })
    }

    function bill() { //查询个人的账单
        setTimeout(function() { //等待加载的效果
            mui.ajax('/api/bill', {
                data: {
                    page: page++,
                    pageSize: pageSize,
                    uid: ids
                },
                dataType: 'json', //服务器返回json格式数据
                type: 'post', //HTTP请求类型
                timeout: 10000, //超时时间设置为10秒；
                success: function(data) {
                    if (!data.data) {
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
                    } else {
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                        //参数为false代表有更多数据了。
                        render(data.data)
                    }

                }
            })
        }, 1000)

    }

    function render(data) { //渲染个人账单
        listbox.innerHTML += data.map(item => {
            return `
				<li class="mui-table-view-cell mui-transitioning">
					<div class="mui-slider-right mui-disabled" >
						<a class="mui-btn mui-btn-red" data-id="${item._id}" style="transform: translate(0px, 0px);">删除</a>
					</div>
					<div class="mui-slider-handle" style="transform: translate(0px, 0px);">
						<i class="${item.icon}"></i>
						<ul>
							<li>${item.type}</li>
							<li>${item.timer}</li>
						</ul>
						<span class="${item.income== "支出"?"purple":"green"}">${item.money}</span>
					</div>
					</li>
			`
        }).join("")
        del()
    }

    function del() { //删除个人账单
        mui('#OA_task_1').on('tap', '.mui-btn', function(event) {
            var elem = this;
            var li = elem.parentNode.parentNode;
            mui.confirm('确认删除该条记录？', 'Hello MUI', btnArray, function(e) {
                if (e.index == 0) {
                    mui.ajax('/api/delete', { //数据库删除
                        data: {
                            "id": elem.getAttribute("data-id")
                        },
                        dataType: 'json', //服务器返回json格式数据
                        type: 'post', //HTTP请求类型
                        timeout: 10000, //超时时间设置为10秒；
                        success: function(data) {
                            alert(data.msg)
                        }
                    })
                    li.parentNode.removeChild(li)
                } else {
                    setTimeout(function() {
                        mui.swipeoutClose(li);
                    }, 0);
                }
            })
        });
        var btnArray = ['确认', '取消']
    }

    function quit() { //退出登录
        let quit = document.querySelectorAll(".mui-bar-tab>.mui-tab-item>.mui-tab-label")[3]
        quit.addEventListener("tap", function() {
            localStorage.removeItem("id")
            location.reload() //自动刷新页面
        })
    }

    function jump() { //点击加号跳转详情页
        addPlus.addEventListener("tap", function() {
            window.location.href = "../pages/detail.html"
        })
    }
    init()
})