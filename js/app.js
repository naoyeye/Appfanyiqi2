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

	//测试专用：刷新
	$('.logo').click(function(){
		window.location.reload();
	});

	//hash 处理
	var hashChange = function(page){
		$('.page').addClass('hide');
		$('.page.'+page).removeClass('hide');
		if(page == 'pass'){
			
		}
	};
	var loadByHash = function(){
		var hash = window.location.hash.replace('#','');
		if(hash === '') hash = 'home';
		hashChange(hash);
	};
	window.onload = loadByHash;
	window.onhashchange = loadByHash;

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
	
	var buildItem = function(app, $el, withDownload){
		var html = $el;
		html.find('.name').html(app.title);
		html.find('img').attr('src', app.icons.px78);
		html.find('.download').html(app.installedCountStr + '人安装 ' + app.apks[0].size);
		html.find('.desc').html(app.tagline);
		if(withDownload){
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
	var convert = function(apps, $front, $back){
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

							var $frontItem = $(template);
							var $backItem = $(template);
							$front.append($frontItem);
							$back.append($backItem);

							buildItem(theapp, $frontItem, false);
							buildItem(findapp, $backItem, true);
							$('.list .header').find('.title span.cnt').text($('.list .content').eq(0).find('.item:not(.hide)').length);
						});
					});
				});
				
			}
		});
	};

	//初始化转换
	function initlist(){
		var $front = $('.list .content').eq(1);
		var $back = $('.list .content').eq(0);

		if (campaignTools.UA.inWdj) {
			var installedApps = JSON.parse(window.campaignPlugin.getNonSystemApps());
			var apps = installedApps.map(function(app){
				return {
					title: app.title,
					packageName: app.packageName,
				};
			});
			$('.list .content').empty();
			$('.list .header').find('.sub-title').hide();
			$('.list .header').find('.title').html('翻译结果：找到<span class="cnt">0</span>个海外应用');

			convert(apps, $front, $back);
		}else{
			$.get('hotapps.json', function(results){
				var apps = results;
				$('.list .header').find('.title').html('已为您翻译<span class="cnt">0</span>个热门应用：');

				//convert(apps, $front, $back);
				window.apps = results;
			});
		}
	}
	initlist();

	//二维码生成
	var qrcode = 'http://www.wandoujia.com/qr?s=5&c=' + encodeURIComponent(shareData.url);
	$('.qrcodepop .qrcode').attr('src' , qrcode);
})();
