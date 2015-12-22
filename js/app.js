/*global $, express, data, needRedirect, apkUrl, require(), _, AV, FastClick, wx, campaignTools, campaignPlugin, performance, ga, moment */

$(document).ready(function(){

	var first_load_app = false;

	$.get('http://www.wandoujia.com/needle/source/getJSON/739', function(result){
		var shareData = result.share;
		//微信分享
		$('.inwx .share-ways-wx').click(function(e){
			e.preventDefault();
			$('.inwx .reminder-layer').addClass('hide');
			$('.guide').removeClass('hide');
			ga('send', 'event', 'translator', 'share', 'wechat-friend');
		});
		$('.inwx .share-ways-wxtimeline').click(function(e){
			e.preventDefault();
			$('.inwx .reminder-layer').addClass('hide');
			$('.guide').removeClass('hide');
			ga('send', 'event', 'translator', 'share', 'wechat-timeline');
		});
		$('.inwx .share-ways-weibo').click(function(e){
			e.preventDefault();
			ga('send', 'event', 'translator', 'share', 'weibo');
			var weibo = {
				title: shareData.weibo.title,
				desc: shareData.weibo.desc,
				link: shareData.weibo.url,
				imgUrl: shareData.weibo.img,
			};
			var weiboURL = 'http://service.weibo.com/share/share.php?appkey=1483181040&relateUid=1727978503&url=' + encodeURIComponent(weibo.link) + '&title=' + encodeURIComponent(weibo.desc) + '&pic=' + weibo.imgUrl;
			window.location = weiboURL;
		});

		if(campaignTools.UA.inWechat){
			var wxTimelineShareObj = {
				title: shareData.wechatTimeline.title,
				link: shareData.wechatTimeline.url,
				imgUrl: shareData.wechatTimeline.img,
				successCallback: function () {
					go('share');
				}
			};
			var wxShareObj = {
				title: shareData.wechatFriend.title,
				desc: shareData.wechatFriend.desc,
				link: shareData.wechatFriend.url,
				imgUrl: shareData.wechatFriend.img,
				successCallback: function () {
					go('share');
				}
			};
			campaignTools.wechatWebviewShareSetup(wxTimelineShareObj, wxShareObj);
		}

		//分享(除微信以外)：
		var weiboShareObj = {
			element: '.inwdj .share-ways-weibo',
			title: shareData.weibo.title,
			desc: shareData.weibo.desc,
			link: shareData.weibo.url,
			imgUrl: shareData.weibo.img,
			successCallback: function () {
				ga('send', 'event', 'translator', 'share', 'weibo');
				go('share');
			}
		};

		var wxAppShareObj = {
			element: '.inwdj .share-ways-wx',
			title: shareData.wechatFriend.title,
			desc: shareData.wechatFriend.desc,
			link: shareData.wechatFriend.url,
			imgUrl: shareData.wechatFriend.img,
			successCallback: function () {
				ga('send', 'event', 'translator', 'share', 'wechat-friend');
				go('share');
			},
			qrcode: function(){
				$('.layer-info').addClass('hide');
				$('.qrcodepop').removeClass('hide');
			}
		};
		var wxAppTimelineShareObj = {
			element: '.inwdj .share-ways-wxtimeline',
			title: shareData.wechatTimeline.title,
			link: shareData.wechatTimeline.url,
			imgUrl: shareData.wechatTimeline.img,
			successCallback: function () {
				ga('send', 'event', 'translator', 'share', 'wechat-timeline');
				go('share');
			},
			qrcode: function(){
				$('.layer-info').addClass('hide');
				$('.qrcodepop').removeClass('hide');
			}
		};
		campaignTools.shareButtonSetup(weiboShareObj, wxAppShareObj, wxAppTimelineShareObj);

		//二维码生成
		var qrcode = 'http://www.wandoujia.com/qr?s=5&c=' + encodeURIComponent(shareData.qrcode.url);
		$('.qrcodepop .qrcode').attr('src' , qrcode);
	});

	//点击事件
	$(function() {
		FastClick.attach(document.body);
	});

	//识别X5内核
	var isx5 = false;
	if(navigator.userAgent.match(/MQQBrowser/)){
		$('body').addClass('x5');
		isx5 = true;
	}

	//内部用户，外部用户
	if(campaignTools.UA.inWdj){
		$('.inside').show();
		$('.outside').hide();
	}else{
		$('.inside').hide();
		$('.outside').show();
	}

	//禁止窗口拉动
	$('.home, .pass, .layer-info').bind('touchmove', function (ev) {
		ev.preventDefault();
	});

	//横屏判断
	window.addEventListener('orientationchange', function(){
		if (window.orientation === 90 || window.orientation === -90) {
			$('.heng').removeClass('hide');
		}else{
			$('.heng').addClass('hide');
		}
	}, false);

	//分享
	$('.list .bottom').click(function(){
		ga('send', 'event', 'translator', 'share', 'button');
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



	//跳转逻辑
	//测试专用：刷新
	$('.home .logo').click(function(){
		window.location.reload();
	});

	//hash 处理
	var current_page = 'home';
	var go = function(page, fade){
		if(fade){
			$('.page.'+current_page).fadeOut();
			$('.page.'+page).fadeIn();
			window.location = '#'+page;
		}else{
			$('.page.'+current_page).hide();
			$('.page.'+page).show();
		}
		current_page = page;

		if(page === 'pass'){
			setTimeout(function(){
				var pass_timer = setInterval(function(){
					if(first_load_app){
						go('list', true);
						clearInterval(pass_timer);
					}
				}, 1000);
			}, 1200);
		}
		if(page === 'list'){
			$('.list.page').css('transform', '');
		}
	};
	var loadByHash = function(){
		var hash = window.location.hash.replace('#','');
		if(hash === '') {
			hash = 'home';
		}
		go(hash);
	};
	$(document).ready(loadByHash);

	//首页跳转
	$('.home .button').click(function(){
		go('pass', true);
	});

	//top 
	$('.list .top .button').click(function(){
		ga('send', 'event', 'translator', 'install', 'wandoujia');

		// 微信弹提示
		if (campaignTools.UA.inWechat) {
			$('.inwxinstall').removeClass('hide');
			return;
		} else {
			// 跳转到一览
			if (campaignTools.UA.inIos) {
				window.location = 'http://wdj.im/u8';
			// 下载豌豆荚apk
			} else if (campaignTools.UA.inAndroid) {
				window.location = 'http://wdj.im/u4';
			}
		}
	});

	// 打开之前的字典活动页面
	$('.share .logo').click(function(){
		window.location = 'http://wdj.im/td';
	});

	//翻译数据源
	AV.initialize('VxUGnnLkan5rsrLKsBErzDrB', 'cVnPbqsLfeeMark0WVwkzf6G');
	var Convert = AV.Object.extend('Convert');

	var translate = function(packageNames, cb){
		var query = new AV.Query(Convert);
		query.containedIn('packageName', packageNames);
		query.find({
			success: function(results) {
				if(results.length){
					cb(results);
				}else{
					cb(null);
				}
			},
			error: function(error) {
				console.log('Error: ' + error.code + ' ' + error.message);
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
				if(ecb) {
					ecb();
				}
			}
		});
	};

	//应用模版
	var buildItem = function(theapp, findapp, $el, result){
		var note = result.get('note');
		var url = result.get('url');
		var rank = result.get('rank');
		var html = $el;
		html.data('rank', rank);
		html.find('.idx').html($el.index());
		html.find('.orig').html(theapp.title);
		html.find('.name').html(findapp.title);
		html.find('.icon1').attr('src', theapp.icons.px78);
		html.find('.icon2').attr('src', findapp.icons.px100);
		html.find('.installs').html(findapp.installedCountStr + '人安装 ');
		html.find('.size').html(findapp.apks[0].size);
		if (note) {
			html.find('.desc').html(note);
		}

		//切换
		var desc = html.find('.desc');
		var action = html.find('.action');
		var status = false;
		html.find('.icon2').click(function(){
			if(!status){
				desc.css('left', '-110%');
				action.css('left', 0);
			}else{
				desc.css('left', 0);
				action.css('left', '110%');
			}
			status = !status;
		});

		html.find('.action .button').click(function(ev){
			ev.preventDefault();

			ga('send', 'event', 'translator', 'installApp', findapp.packageName);

			var install = {
				'packageName': findapp.packageName,
				'downloadUrl': findapp.apks[0].downloadUrl.url,
				'appName': findapp.title,
				'iconUrl': findapp.icons.px100,
				'size': ''
			};
			if (campaignTools.UA.inWdj) {
				campaignTools.installApp(install, function (resp) {
					if (resp) {
						campaignTools.toast(resp.message);
					}
				});
				return;
			} else if (campaignTools.UA.inAndroid) {
				if(campaignTools.UA.inWechat){
					window.location = 'http://www.wandoujia.com/apps/' + findapp.packageName;
					return;
				} else {
					window.location = findapp.apks[0].downloadUrl.url;
					return;
				}
			}

			if(campaignTools.UA.inIos && url) {
				if(campaignTools.UA.inWechat || !!(navigator.userAgent.toLowerCase()).match(/(weibo)/)){
					$('.inwxinstall').removeClass('hide');
					return;
				}else{
					window.location = url;
				}
				return;
			}
			window.location = 'http://www.wandoujia.com/apps/' + findapp.packageName;
		});
	};

	//转换
	var convert = function(apps, $items){
		var packageNames = apps.map(function(app) {
			return app.packageName;
		});
		var template = $('#item-tpl').html();
		translate(packageNames, function(results){
			if(results){
				results.forEach(function(result, i){
					var packageName = result.get('packageName');
					var target = result.get('target');
					setTimeout(function(){
						getApp(packageName, function(theapp){
							getApp(target, function(findapp){
								var $el = $(template);
								$items.append($el);
								buildItem(theapp, findapp, $el, result);
								$items.find('.title span.cnt').text($items.find('.item:not(.hide)').length);

								if(campaignTools.UA.inWdj){
									if($items.hasClass('my')){
										$items.removeClass('hide');
										first_load_app = true;
									}
								}else{
									first_load_app = true;
								}

								if($items.hasClass('all')){
									if($items.find('.item:not(.hide)').length >= 100){
										stop_load_all = true;
										$('.detect').hide();
										$('.card.section').show();
										$('.all .item:not(.hide)').filter(function(i, item){
											return i >= 100;
										}).hide();
									}
								}
							});
						});
					}, i*200);
				});
			}
		});
	};

	//初始化转换
	var installedApps = [];
	if (campaignTools.UA.inWdj) {
		installedApps = JSON.parse(window.campaignPlugin.getNonSystemApps());
	}
	function load_my(){
		if (campaignTools.UA.inWdj) {
			var $my_items = $('.my.items');
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

	//加载数据
	function get_apps(page, cb){
		var packageNames = installedApps.map(function(app) {
			return app.packageName;
		});
		var query = new AV.Query(Convert);
		query.notContainedIn('packageName', packageNames);
		query.notEqualTo('note', '');
		query.ascending('rank');
		if(campaignTools.UA.inIos){
			query.notEqualTo('url', '');
		}
		query.skip(10 * (page - 1)).limit(10);
		query.find({
			success: function(results) {
				var apps = results.map(function(result){
					return result.toJSON();
				});
				if(apps.length){
					cb(apps);
				}else{
					cb(null);
				}
			},
			error: function(error) {
				console.log('Error: ' + error.code + ' ' + error.message);
			}
		});
	}

	var page_idx = 1;
	var loading_all = false;
	var stop_load_all = false;
	function initlist(){
		load_my();
		load_all(page_idx);
	}
	function load_all(page){
		if(stop_load_all) {
			$('.detect').hide();
			$('.card.section').show();
			return;
		}
		if(loading_all) {
			return;
		}
		loading_all = true;
		var $all_items = $('.all.items');
		get_apps(page, function(results){
			if(results.length < 10){
				stop_load_all = true;
				$('.detect').hide();
				$('.card.section').show();
				return;
			}
			var apps = results.slice(0, 10);
			convert(apps, $all_items);
			setTimeout(function(){
				loading_all = false;
			}, 1000);
			page_idx = page_idx + 1;
		});
	}
	initlist();

	//滚动加载更多
	$(window).scroll(function() {
		if(current_page === 'list'){
			var st = $(window).scrollTop();
			var gap = $('.list .content').height() - $(window).height();
			if(gap - st < 30){
				if(!stop_load_all){
					load_all(page_idx);
				}else{
					$('.detect').hide();
					$('.card.section').show();
				}
			}
		}
	});

	//计数
	function check(apps){
		var packageNames = apps.map(function(app) {
			return app.packageName;
		});
		var query = new AV.Query(Convert);
		query.containedIn('target', packageNames);
		query.count({
			success: function(count) {
				show_image_for(count);
			},
			error: function(error) {
				console.log('Error: ' + error.code + ' ' + error.message);
			}
		});
	}
	function show_image_for(count){
		var src = 'nodetect.jpg';
		if(campaignTools.UA.inWdj){
			if(count >= 30){
				src = '30more.jpg';
				ga('send', 'event', 'translator', 'apps', '30more');
			}else if(count >= 21 ){
				src = '21to30.jpg';
				ga('send', 'event', 'translator', 'apps', '21to30');
			}else if(count >= 6){
				src = '6to20.jpg';
				ga('send', 'event', 'translator', 'apps', '6to20');
			}else{
				src = 'less5.jpg';
				ga('send', 'event', 'translator', 'apps', 'less5');
			}
			$('.list .top.section .title').text('豌豆荚发现你安装了 '+ count +' 个海外应用');
			$('.list .top.section').find('.button').hide();
		}else{
			src = 'nodetect.jpg';
		}
		$('.list .top.section').find('img').attr('src', 'images/' + src);
	}

	//GA
	ga('send', 'pageview');
});