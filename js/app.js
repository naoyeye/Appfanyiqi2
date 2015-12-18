;(function(){

	//alert(navigator.userAgent)

	var shareData = {
		title: "豌豆荚应用翻译器",
		desc: "把手机里的国内应用翻成海外应用！",
		url: window.location.href.replace(/#.*$/,''),
		img: window.location.href.replace(/#.*$/,'') + '/images/logo.png',
	};

	//识别X5内核
	var isx5 = false;
	if(navigator.userAgent.match(/MQQBrowser/)){
		$('body').addClass('x5');
		isx5 = true;
	}

	//禁止窗口拉动
	$('.home, .pass, .layer-info').bind('touchmove', function (ev) {
		ev.preventDefault();
	});

	//分享
	$('.list .bottom .button').click(function(){
		if(campaignTools.UA.inWechat){
			$('.inwx').removeClass('hide');
		}else{
			$('.inwdj').removeClass('hide');
		}
	});

	//关闭浮层
	$('.layer-info .mask-layer, .layer-info .know a').click(function(e){
		e.preventDefault();
		$('.layer-info').addClass('hide');
		$('.inwx .reminder-layer').removeClass('hide');
		$('.guide').addClass('hide');
	});

	//微信分享
	$('.inwx .share-ways-wx, .inwx .share-ways-wxtimeline').click(function(e){
		e.preventDefault();
		$('.inwx .reminder-layer').addClass('hide');
		$('.guide').removeClass('hide');
	});
	$('.inwx .share-ways-weibo').click(function(e){
		e.preventDefault();
		var weibo = {
			title: shareData.title,
			desc: shareData.desc,
			link: shareData.url,
			imgUrl: shareData.img,
		};
		var weiboURL = 'http://service.weibo.com/share/share.php?appkey=1483181040&relateUid=1727978503&url=' + encodeURIComponent(weibo.shortLink || weibo.link) + '&title=' + encodeURIComponent(weibo.desc) + '&pic=' + weibo.imgUrl;
		window.location = weiboURL;
	});
	if(campaignTools.UA.inWechat){
		var wxTimelineShareObj = {
			title: shareData.title,
			link: shareData.url,
			imgUrl: shareData.img,
			successCallback: function () {
				//window.location = '#share';
			}
		};
		var wxShareObj = {
			title: shareData.title,
			desc: shareData.desc,
			link: shareData.url,
			imgUrl: shareData.img,
			successCallback: function () {
				//window.location = '#share';
			}
		};
		campaignTools.wechatWebviewShareSetup(wxTimelineShareObj, wxShareObj);

	}

	//分享(除微信以外)：
	var weiboShareObj = {
		element: '.inwdj .share-ways-weibo',
		title: shareData.title,
		desc: shareData.desc,
		link: shareData.url,
		imgUrl: shareData.img,
		successCallback: function () {
			//window.location = '#share';
		}
	};
	var wxAppShareObj = {
		element: '.inwdj .share-ways-wx',
		title: shareData.title,
		desc: shareData.desc,
		link: shareData.url,
		imgUrl: shareData.img,
		successCallback: function () {
			//window.location = '#share';
		},
		qrcode: function(){
			$('.layer-info').addClass('hide');
			$('.qrcodepop').removeClass('hide');
		}
	};
	var wxAppTimelineShareObj = {
		element: '.inwdj .share-ways-wxtimeline',
		title: shareData.title,
		link: shareData.url,
		imgUrl: shareData.img,
		successCallback: function () {
			//window.location = '#share';
		},
		qrcode: function(){
			$('.layer-info').addClass('hide');
			$('.qrcodepop').removeClass('hide');
		}
	};
	campaignTools.shareButtonSetup(weiboShareObj, wxAppShareObj, wxAppTimelineShareObj);

	//跳转逻辑
	//测试专用：刷新
	$('.logo').click(function(){
		window.location.reload();
	});

	//hash 处理
	var current_page = 'home';
	var go = function(page){
		current_page = page;
		$('.page').addClass('hide');
		$('.page.'+page).removeClass('hide');
		if(page == 'pass'){
			pass();
			setTimeout(go.bind(this, 'list'), 2000);
		}
		if(page == 'list'){
			setTimeout(zoom, 100);
		}
	};
	var loadByHash = function(){
		var hash = window.location.hash.replace('#','');
		if(hash === '') hash = 'home';
		go(hash);
	};
	$(document).ready(loadByHash);
	window.onhashchange = loadByHash;

	//首页跳转
	$('.home .button').click(function(){
		go('pass');
	});

	//过渡页
	var pass = function(){
		$('.pass').animate({'background-position-y':-1000}, 6000);
		var scan = function(){
			$('.scan').css('top', 0);
			$('.scan').animate({top: '100%'}, 1000);
		};
		scan();
		var timer = setInterval(scan, 1100);
		setTimeout(function(){
			clearInterval(timer);
		}, 10000);
	};

	//列表动画
	var zoom = function(){
		$('.list .item').map(function(i, item){
			return $(item).find('.icon2');
		}).addClass('zoomed');
	};

	//翻译数据源
	AV.initialize('VxUGnnLkan5rsrLKsBErzDrB', 'cVnPbqsLfeeMark0WVwkzf6G');
	var Convert = AV.Object.extend('Convert');

	var translate = function(packageNames, cb){
		var query = new AV.Query(Convert);
		query.containedIn("packageName", packageNames);
		query.find({
			success: function(results) {
				if(results.length){
					cb(results);
				}else{
					cb(null);
				}
			},
			error: function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	};

	//获取单个应用信息
	var getApp = function(packageName, cb, ecb){
		var url = 'http://www.wandoujia.com/api/apps/apps/'+packageName+'?opt_fields=title,icons.*,apks.*.size,apks.*.downloadUrl.*.url,installedCountStr,tagline,packageName';
		$.ajax({
			url: url,
			dataType: 'jsonp',
			success: function(res){
				cb(res);
			},
			error: function(){
				if(ecb) ecb();
			}
		});
	};

	//应用模版
	
	var buildItem = function(theapp, findapp, $el, note){
		var html = $el;
		html.find('.idx').html($el.index());
		html.find('.orig').html(theapp.title);
		html.find('.name').html(findapp.title);
		html.find('.icon1').attr('src', theapp.icons.px78);
		html.find('.icon2').attr('src', findapp.icons.px100);
		//html.find('.download').html(app.installedCountStr + '人安装 ' + app.apks[0].size);
		html.find('.desc').html(note);

		if(current_page == 'list'){
			html.find('.icon2').addClass('zoomed');
		}
		if(false){
			html.find('.action').removeClass('hide');
			html.find('.action .button').click(function(ev){
				ev.preventDefault();
				var install = {
					'packageName': app.packageName,
					'downloadUrl': app.apks[0].downloadUrl.url,
					'appName':app.title,
					'iconUrl': app.icons.px100,
					'size': ''
				};
				if (campaignTools.UA.inWdj) {
					campaignTools.installApp(install, function (resp) {
					if (resp) {
						campaignTools.toast(resp.message);
						}
					});
					return;
				}
				if(campaignTools.UA.inIos) {
					var find = window.apps.filter(function(one){
						return (one.target == app.packageName);
					});
					if(find){
						if(campaignTools.UA.inWechat){
							$('.inwxinstall').removeClass('hide');
							return;
						}else
							window.location = find[0].url;
					}
					return;
				}
				window.location = 'http://www.wandoujia.com/apps/' + app.packageName;
			});
		}
	};

	//转换
	var convert = function(apps, $items){
		var packageNames = apps.map(function(app) {
			return app.packageName;
		});
		var template = $('#item-tpl').html();
		translate(packageNames, function(results){
			if(results){
				results.forEach(function(result){
					var packageName = result.get('packageName');
					var target = result.get('target');
					getApp(packageName, function(theapp){
						getApp(target, function(findapp){
							var $el = $(template);
							$items.append($el);
							buildItem(theapp, findapp, $el, result.get('note'));
							$items.find('.title span.cnt').text($items.find('.item:not(.hide)').length);
						});
					});
				});
			}
		});
	};

	//初始化转换

	function load_my(){
		if (campaignTools.UA.inWdj) {
			var $my_items = $('.my.items');
			$my_items.removeClass('hide');
			var installedApps = JSON.parse(window.campaignPlugin.getNonSystemApps());
			var apps = installedApps.map(function(app){
				return {
					title: app.title,
					packageName: app.packageName,
				};
			});
			
			convert(apps, $my_items);
			check(apps);
		}
	}
	var page_idx = 1;
	var loading_all = false;
	function initlist(){
		load_my();
		load_all(page_idx);
	}
	function load_all(page){
		if(loading_all) return;
		loading_all = true;
		var $all_items = $('.all.items');
		$.get('hotapps.json', function(results){
			var apps = results.slice(0, 10);
			convert(apps, $all_items);
			window.apps = results;
			loading_all = false;
		});
	}
	initlist();

	//滚动加载更多
	$(window).scroll(function() {
		if(current_page == 'list'){
			var st = $(window).scrollTop();
			var gap = $('.list .content').height() - $(window).height();
			if(gap - st < 30){
				page_idx = page_idx + 1;
				load_all(page_idx);
			}
		}
	});

	//计数
	function check(apps){
		var packageNames = apps.map(function(app) {
			return app.packageName;
		});
		var query = new AV.Query(Convert);
		query.containedIn("target", packageNames);
		query.count({
			success: function(count) {
				show_image_for(count);
			},
			error: function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	}
	function show_image_for(count){
		var src = 'nodetect.jpg';
		if(campaignTools.UA.inWdj){
			if(count >= 30){
				src = '30more.jpg';
			}else if(count >= 20 ){
				src = '20to30.jpg';
			}else if(count >= 10){
				src = '10to20.jpg';
			}else if(count >= 5){
				src = '5to10.jpg';
			}else if(count > 0){
				src = 'less5.jpg';
			}else{
				src = 'nodetect.jpg';
			}
		}else{
			src = 'nodetect.jpg';
		}
		$('.list .top.section').find('img').attr('src', 'images/' + src);
	}

	//二维码生成
	var qrcode = 'http://www.wandoujia.com/qr?s=5&c=' + encodeURIComponent(shareData.url);
	$('.qrcodepop .qrcode').attr('src' , qrcode);
})();
