/*
* @Author: @schumilin
* @Date:   2015-01-28 14:20:50
* @Last Modified by:   Jiyun
* @Last Modified time: 2015-11-24 19:30:20
*/

/*global $, jQuery, ga, _gaq, wx */

/* jshint ignore:start */
;
/* jshint ignore:end */

(function (window, undefined, define) {

    var campaignTools = {};

    /*
     * 判断设备
     * @type Object
     * {
     *   inWdj:     true || false,
     *   inWechat:     true || false,
     *   inIos: true || false,
     *   inAndroid:     true || false,
     *   inWp:  true || false,
     *   inSymbian:  true || false,
     *   inMac:     true || false,
     *   inWindows:     true || false,
     *   inIphone: true || false,
     *   inIpad:     true || false,
     *   inMobile:  true || false,
     *   inPC:  true || false,
     *   isRetina:  true || false
     * }
     */
    campaignTools.UA = (function () {

        var ua = navigator.userAgent.toLowerCase();
        var uaObj = {};

        // Software
        uaObj.inWdj = typeof window.campaignPlugin !== 'undefined' && window.campaignPlugin;
        uaObj.inWechat = !!ua.match(/micromessenger/);

        // OS
        uaObj.inIos = !!ua.match(/(iphone|ipod|ipad)/);
        uaObj.inAndroid = !!ua.match(/(android)/);
        uaObj.inWp = !!ua.match(/(windows phone)/);
        uaObj.inSymbian = !!ua.match(/(symbianos)/);
        uaObj.inMac = navigator.platform.indexOf('Mac') === 0;
        uaObj.inWindows = navigator.platform.indexOf('Win') === 0;

        // Device
        uaObj.inIphone = !!ua.match(/(iphone)/);
        uaObj.inIpad = !!ua.match(/(ipad)/);

        // Device Attr
        uaObj.inMobile = (uaObj.inIos || uaObj.inAndroid || uaObj.inWp || uaObj.inSymbian);
        uaObj.inPC = !(uaObj.inIos || uaObj.inAndroid || uaObj.inWp || uaObj.inSymbian);
        uaObj.isRetina = typeof window.campaignPlugin !== 'undefined' && window.devicePixelRatio > 1;

        // Backward Compatibility
        uaObj.inWindow = uaObj.inWindows;

        return uaObj;
    })();

    /*
     * 判断是否在 PC 中
     * @return {boolean} true || false
     */
    campaignTools.inPC = campaignTools.UA.inPC;


    // 封装豌豆荚客户端中的各接口
    if (campaignTools.UA.inWdj) {

        var campaignPlugin = window.campaignPlugin;


        /*
        ===========================================================================
            分享相关
        ===========================================================================
        */

        /*
         * 调起安卓系统级别分享
         * @param title {string} 分享标题
         * @param content {string} 分享内容
         * @notice 只可分享文字，如需带有图片的分享请使用 shareTo 方法
         */
        campaignTools.runSystemShare = function (title, content) {
            title = title || '豌豆荚';
            content = content || '你的手机娱乐中心';
            campaignPlugin.share(title, content);
        };

        /*
         * 调起应用级别分享
         * @param title {string} 分享标题
         * @param content {string} 分享内容
         * @param imgUrl {string} 分享图片的地址(不建议过大)
         * @param shareUrl {string} 分享 URL
         * @param appType {string} SINA_WEIBO || WECHAT || WECHAT_TIMELINE
         * @notice 目前只支持新浪微博，微信对话框，微信朋友圈
         */
        campaignTools.runAppShare = function (title, content, imgUrl, shareUrl, appType) {
            title = title || '豌豆荚';
            content = content || '你的手机娱乐中心';
            imgUrl = imgUrl || 'http://static.wdjimg.com/www/images/www/p4.png';
            shareUrl = shareUrl || 'http://www.wandoujia.com/';
            appType = appType || 'SINA_WEIBO';

            // // 此接口在微博版本 >= 5.2.8 时，会出现无法微博分享传递文案的情况
            // // 判断如果微博版本小于 5.2.8时，调用此接口，否则，跳转到微博的 http 分享页面
            // if (appType === 'SINA_WEIBO') {
            //     var weiboURL = 'http://service.weibo.com/share/share.php?appkey=1483181040&relateUid=1727978503&url=' + encodeURIComponent(shareUrl) + '&title=' + encodeURIComponent(title) + '&pic=' + imgUrl;
            //     var localVersion = null;

            //     if (campaignPlugin.isInstalled('com.sina.weibo')) {
            //         localVersion = campaignPlugin.getAppVersionName('com.sina.weibo').replace(/\./g, '');
            //     }

            //     if (localVersion && parseInt(localVersion) < 528) {
            //         campaignPlugin.shareTo(title, content, imgUrl, shareUrl, appType);
            //     } else {
            //         window.location.href = weiboURL;
            //     }
            // } else {
            //     campaignPlugin.shareTo(title, content, imgUrl, shareUrl, appType);
            // }

            campaignPlugin.shareTo(title, content, imgUrl, shareUrl, appType);
        };

        /*
         * 在外部浏览器中打开链接
         * @param {string} URL
         */
        campaignTools.openInBrowser = function (url) {
            campaignPlugin.openInBrowser(url);
        };





        /*
        ===========================================================================
            用户相关
        ===========================================================================
        */
        /*
         * 获取手机 UDID
         * @return {string} UDID
         */
        campaignTools.getUDID = function () {
            return campaignPlugin.getUDID();
        };

        /*
         * 获取已登录用户账号 UID
         * @return {string} UID
         */
        campaignTools.getUID = function () {
            return campaignPlugin.getUID();
        };

        /*
         * 获取已登录用户头像
         * @return {string} URL
         */
        campaignTools.getAvatar = function () {
            return campaignPlugin.getAvatar();
        };

        /*
         * 获取已登录用户邮箱
         * @return {string} email
         */
        campaignTools.getUserEmail = function () {
            return campaignPlugin.getUserEmail();
        };

        /*
         * 获取已登录用户昵称
         * @return {string} nickName
         */
        campaignTools.getNickName = function () {
            return campaignPlugin.getNickName();
        };

        /*
         * 获取 P4 中当前已登录用户的 auth (cookie)
         * 版本 >= 4.18 可用
         * @return {string} 如果未登录，则为空
         */
        campaignTools.getUserAuth = function () {
            return campaignPlugin.getUserAuth();
        };

        /*
         * 判断 P4 中当前用户是否已登录
         * 版本 >= 4.18 可用
         * @return {boolean}
         */
        campaignTools.isLogin = function () {
            return campaignPlugin.isLogin();
        };

        /*
         * 获取用户手机号码
         * @return {string} phoneNumber +8618518281507
         */
        campaignTools.getPhoneNumber = function () {
            return campaignPlugin.getPhoneNumber();
        };

        /*
         * 调起 P4 内的用户个人主页
         * @param uid {string} 用户的 UID
         * @example '4383987'
         */
        campaignTools.openUserDetail = function (uid) {
            campaignPlugin.openUserDetail(uid);
        };


        /*
        ===========================================================================
            应用相关
        ===========================================================================
        */
        /*======== 判断 ========*/

        /*
         * 获取应用安装状态
         * @param packageName {string} 应用包名
         * @return {boolean} true || false
         */
        campaignTools.isInstalled = function (packageName) {
            return campaignPlugin.isInstalled(packageName);
        };

        /*
         * 获取应用是否可升级
         * @param packageName {string} 应用包名
         * @return {boolean} true || false
         */
        campaignTools.isUpgradable = function (packageName) {
            return campaignPlugin.isUpgradable(packageName);
        };



        /*======== 获取 ========*/

        /*
         * 获取应用状态
         * @param packageName {string} 应用包名
         * @return {int}
         *         0 -- Waiting install 等待安装
         *         1 -- Installed 已经安装
         *         2 -- Not exist 不存在
         *         3 -- Uninstalling 正在卸载
         *         4 -- Patching
         */
        campaignTools.getAppState = function (packageName) {
            return campaignPlugin.getAppState(packageName);
        };

        /*
         * 获取应用版本号
         * @param packageName {string} 应用包名
         * @return {string} 版本号
         * @notice 慎用，取到的是 versionCode，通常你需要的是格式为 1.23.45 的 versionName
         */
        campaignTools.getAppVersionCode = function (packageName) {
            return campaignPlugin.getAppVersionCode(packageName);
        };

        /*
         * 获取应用的 versionName
         * 2015-06-11 hanjiyun update
         * @param packageName {string} 应用包名
         * @return {string} 版本号 e.g: 5.2.8
         */
        campaignTools.getAppVersionName = function (packageName) {
            return campaignPlugin.getAppVersionName(packageName);
        };


        /*======== 打开 ========*/

        /*
         * 打开其他应用
         * @param packageName {string} 应用包名
         */
        campaignTools.openApp = function (packageName) {
            campaignPlugin.openApp(packageName);
        };

        /*
         * 打开应用在 P4 内的详情页（如果该应用得过设计奖，则会打开设计奖页面）
         * @param packageName {string} 应用包名
         */
        campaignTools.openAppDetail = function (packageName) {
            campaignPlugin.openAppDetail(packageName);
        };

        /*
         * 跳过设计奖直接打开应用详情页
         * @param packageName {string} 应用包名
         */
        campaignTools.openAppDetailWithoutAward = function (packageName) {
            campaignPlugin.openAppDetailWithoutAward(packageName);
        };

        /*
         * 打开其他应用内某页面
         * @param serializedIntent {string} 应用内搜索协议地址
         * @example meituanmovie://www.meituan.com/movie?id=78379&nm=后会无期
         */
        campaignTools.sendIntent = function (serializedIntent) {
            campaignPlugin.startActivity(serializedIntent);
        };

        // TODO: 下面四个合并成一个接口
        campaignTools.openVideoDetail = function (id) {
            campaignPlugin.startActivity('wdj://detail/video/' + id + '?video_type=');
        };

        campaignTools.openEbookDetail = function (id) {
            campaignPlugin.startActivity('wdj://detail/ebbok/' + id);
        };

        campaignTools.searchWords = function (str) {
            campaignPlugin.startActivity('wdj://search?q=' + str);
        };

        campaignTools.openSubscribeDetail = function (id, type) {
            campaignPlugin.startActivity('wdj://detail/subscribe/publisher/' + type + '/' + id);
        };

        // // 打开某个订阅源账号的 P4 profile 页面
        // campaignTools.openSubscribePublisher = function (uid) {
        //     if (typeof campaignPlugin.openSubscribePublisher !== 'undefined') {
        //         campaignPlugin.openSubscribePublisher(uid);
        //     } else {
        //         var url = 'intent://subscribe.wandoujia.com/publisher/ACCOUNT/' + uid + '#Intent;scheme=http;action=android.intent.action.MAIN;end';
        //         campaignPlugin.startActivity(url);
        //     }
        // };

        // 打开某个订阅列表
        campaignTools.openSubscribeSubset = function (id) {
            if (typeof campaignPlugin.openSubscribeSubset !== 'undefined') {
                campaignPlugin.openSubscribeSubset(id);
            } else {
                var url = 'intent://subscribe.wandoujia.com/list/' + id + '#Intent;scheme=http;action=android.intent.action.MAIN;end';
                campaignPlugin.startActivity(url);
            }
        };

        /*
         * 调起 P4 登录界面
         */
        campaignTools.loginAccount = function () {
            if (typeof campaignTools.loginAccount !== 'undefined') {
                campaignPlugin.loginAccount();
            } else {
                campaignPlugin.startActivity('intent:#Intent;component=com.wandoujia.phoenix2/com.wandoujia.p4.account.activity.PhoenixAccountActivity;end');
            }
        };

        /*
         * 让用户选择以哪种方式登录
         */
        campaignTools.choseLoginAccount = function () {
            campaignPlugin.startActivity('intent://account.wandoujia.com/android/login#Intent;scheme=https;action=android.intent.action.MAIN;end');
        };


        /*======== 安装 ========*/

        /*
         * !ABANDON! *
         * 安装应用
         * @param packageName {string} 应用包名
         * @param downloadUrl {string} 下载链接
         * @param appName {string} 应用名称（用于显示在 P4 下载任务列表中）
         * @param iconUrl {string} 图标 URL（用于显示在 P4 下载任务列表中）
         * @param size {number} 应用大小（请访问 http://apps.wandoujia.com/api/v1/apps/ + packageName 查询 bytes 字段）

        campaignTools.installApp = function (packageName, downloadUrl, appName, iconUrl, size) {
            campaignPlugin.install(packageName, downloadUrl, appName, iconUrl, size);
        };
        */

        /*
         * 安装应用
         * 2015-06-11 hanjiyun update
         * @param app {object} 目标应用的：包名、下载链接、应用名称、图标 URL、应用大小
         * @example:
            var app = {
                'packageName': 'com.sina.weibo',
                'downloadUrl': 'http://apps.wandoujia.com/redirect?signature=ba846b8&url=http%3A%2F%2Fapk.wandoujia.com%2F5%2F2c%2F7a3fefa5bd378db1723e86cba104e2c5.apk&pn=com.sina.weibo&md5=7a3fefa5bd378db1723e86cba104e2c5&apkid=14404328&vc=2022&size=37266945&pos=t/detail&appType=APP',
                'appName': '新浪微博',
                'iconUrl': 'http://img.wdjimg.com/mms/icon/v1/4/4b/89c84a36d3cdbfef226b42b073d9f4b4_256_256.png',
                'size': '37266945'
             }
         * @param callback {function} 如果安装完毕后需要执行回调请传入
         * @notice 不带 POS 信息，如需 POS 信息请使用废弃的老方法，把 POS 信息写进 URL 中，
                   此接口已经开始 Polish，下一版本会加上 POS 参数
         */
        campaignTools.installApp = function (app, callback) {
            var installed = false;

            // 判断是否支持新版接口
            if (typeof campaignPlugin.installByPackage !== undefined) {
                campaignPlugin.installByPackage(app.packageName);
                responseCallback({
                    'error': 0,
                    'message': '安装成功'
                });
            // 如果不支持则调用旧版接口
            } else {
                // 使用旧版接口时，需要判断参数的值是否完整
                if (!app.packageName || !app.downloadUrl || !app.appName || !app.iconUrl) {
                    if (callback && typeof callback === 'function') {
                        callback({
                            'error': 1,
                            'message': '缺少必要参数'
                        });
                    }
                } else {
                    campaignPlugin.install(app.packageName, app.downloadUrl, app.appName, app.iconUrl, app.size);
                    responseCallback({
                        'error': 0,
                        'message': '安装成功'
                    });
                }
            }

            function responseCallback (object) {
                if (callback && typeof callback === 'function') {
                    var checkInstalled = setInterval(function () {
                        installed = campaignPlugin.isInstalled(app.packageName);
                        if (installed) {
                            clearInterval(checkInstalled);
                            checkInstalled = 0;
                            callback(object);
                        }
                    }, 1500);
                }
            }
        };

        // TODO
        // setDownloadListener(final String statusChangeCallback,  final String progressChangeCallback)




        /*
        ===========================================================================
            P4 & 系统
        ===========================================================================
        */

        /*
         * 刷新当前 WebView
         */
        campaignTools.reload = function () {
            campaignPlugin.reload();
        };

        /*
         * 设置 WebView 横竖屏
         * @param isVertical {boolean}  是否为垂直
         */
        campaignTools.setOrientation = function (isVertical) {
            campaignPlugin.setOrientation(isVertical);
        };

        
        //  * 下载文件
        //  * @param url {string} 需要下载的URL
        //  * @param title {string} 为文件的标题（如壁纸的名字，音乐的标题）
        //  * @param type {num} type为文件类型
        //  * @example:
        //     type:
        //     1: App
        //     2: 是保留类型，请勿使用
        //     3: 图片
        //     4: 音乐
        //     5: 视频
        //     6: 漫画
         
        // campaignTools.download = function (url, title, type) {
        //     campaignPlugin.download(url, title, type);
        // };

        /*
         * 关闭当前 WebView
         todo 增加旧版本支持
         */
        campaignTools.closeWebView = function () {
            campaignPlugin.closeWebView();
        };

        /*
         * 打开一个新的 Webview
         * @param url {string} Webview 加载的 URL
         * @param title {string} Webview 顶部的标题
         * @param showActionBar {boolean} 是否显示顶部系统状态栏（时间，电量，运营商那栏）
         * @param isPortrait {boolean} 竖屏(true) or 横屏(false)
         * @param isFullScreen {boolean} 是否隐藏掉底部虚拟按钮栏（特定机型才有）
         */
        campaignTools.openNewWebView = function (url, title, showActionBar, isPortrait, isFullScreen) {
            url = url || 'http://www.wandoujia.com';
            title = title || '豌豆荚';
            showActionBar = showActionBar || true;
            isPortrait = isPortrait || true;
            isFullScreen = isFullScreen || false;
            campaignPlugin.openNewWebView(url, title, showActionBar, isPortrait, isFullScreen);
        };

        /*
         * 获得当前 P4 的 version code
         * @return {num}
         * @example 10828
         */
        campaignTools.getVersionCode = function () {
            return campaignPlugin.getVersionCode();
        };

        /*
         * 获得当前 P4 版本号
         * @return {string}
         * @example '4.12.0'
         */
        // TODO: to a object
        campaignTools.getVersionName = function () {
            return campaignPlugin.getVersionName();
        };

        /*
         * 获得当前 P4 完整版本号
         * @return {string}
         * @example '4.12.0.5060'
         */
        campaignTools.getFullVersionName = function () {
            return campaignPlugin.getFullVersionName();
        };

        /*
         * 获得当前 P4 IMEI
         * @return {string}
         * @example '359250051766648'
         */
        campaignTools.getIMEI = function () {
            return campaignPlugin.getIMEI();
        };

        /*
         * 获得当前手机品牌
         * @return {string}
         * @example 'google'
         */
        campaignTools.getBrand = function () {
            return campaignPlugin.getBrand();
        };

        /*
         * 获得当前网络类型
         * @return {num}
         * @example:
            -1 -- disconnect
            0 -- mobile
            1 -- Wi-Fi
         */
        campaignTools.getNetworkType = function () {
            return campaignPlugin.getNetworkType();
        };

        /*
         * 获得当前语言
         * @return {string}
         * @example 'cn'
         */
        campaignTools.getLocaleLanguage = function () {
            return campaignPlugin.getLocaleLanguage();
        };

        /*
         * 获得当前国家
         * @return {string}
         * @example 'CN'
         */
        campaignTools.getLocaleCountry = function () {
            return campaignPlugin.getLocaleCountry();
        };

        /*
         * 获得 Android 系统 SDK Version
         *
         */
        campaignTools.getSDKVersion = function () {
            return campaignPlugin.getSDKVersionInt();
        };

        /*
         * 从页面中复制文字到系统剪贴板
         * @param string {string} 要复制的文字
         * @example '这是一段文字'
         */
        campaignTools.setClipboardText = function (string) {
            return campaignPlugin.setClipboardText(string);
        };

        /*
         * toast
         */
        campaignTools.toast = function (string) {
            campaignPlugin.toast(string);
        };

    }

    /*
     * 一些常用的方法及对象
     *
     *
     */
    campaignTools.constant = {
        // 用于电话号码验证，已加入阿里巴巴运营的 170 号段，最后更新于 2014.7
        telReg: /^0?(13[0-9]|15[0-9]|18[0-9]|14[57]|17[0])[0-9]{8}$/
    };

     // 常用 API 地址
     campaignTools.api = {
        needle: 'http://www.wandoujia.com/needle/source/',
        apps: 'http://www.wandoujia.com/api/apps/apps',
        appsOptFields: '?opt_fields=title,icons.*,apks.*.size,apks.*.bytes,apks.*.downloadUrl.*.url,apks.*.creation,installedCountStr,apks.*.versionName,apks.*.versionCode',
        itemlist: 'http://www.wandoujia.com/api/subscribe/itemlist/',
        subscribe: 'http://www.wandoujia.com/api/subscribe/subscriber/subscribe',
        unsubscribe: 'http://www.wandoujia.com/api/subscribe/subscriber/unsubscribe',
        subscribeStatus: 'http://www.wandoujia.com/api/subscribe/publisher/ACCOUNT/'
    };

    /*
    ===========================================================================
        订阅相关
    ===========================================================================
    */

    // 获取某订阅列表的简介、对应的订阅源账号信息
    campaignTools.getFeedListData = function (id, callback) {
        $.ajax({
            url: campaignTools.api.itemlist + id + '/summary',
            dataType: 'json',
            success: function (resp) {
                if (callback && typeof callback === 'function') {
                    callback(resp);
                }
            }
        });
    };

    // 获取某订阅列表中的所有条目
    campaignTools.getFeedItemsData = function (id, callback) {
        $.ajax({
            url: campaignTools.api.itemlist + id + '/item',
            dataType: 'json',
            success: function (resp) {
                if (callback && typeof callback === 'function') {
                    callback(resp);
                }
            }
        });
    };

    // 获取当前用户与某订阅源账号的关系（是否已关注）
    campaignTools.getSubscribeStatus = function (uid, callback) {
        $.ajax({
            url :  campaignTools.api.subscribeStatus + uid,
            dataType : 'json',
            success: function (resp) {
                if (callback && typeof callback === 'function') {
                    callback(resp);
                }
            }
        });
    };


    // 订阅某「订阅源账号」
    // 需要用户已登录
    campaignTools.subscribe = function (uid, callback) {
        $.ajax({
            url: campaignTools.api.subscribe,
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            type: 'POST',
            data: JSON.stringify([{'type': 'ACCOUNT', 'id': uid}]),
            success: function (resp) {
                if (callback && typeof callback === 'function') {
                    callback(resp);
                }
            }
        });
    };

    // 取消订阅某「订阅源账号」
    // 需要附带登录信息 wdj_auth
    campaignTools.unsubscribe = function (uid, callback) {
        var req = new XMLHttpRequest();
        req.open('POST', campaignTools.api.unsubscribe, false);
        req.send(JSON.stringify([{'type': 'ACCOUNT', 'id': uid, 'wdj_auth': $.cookie('wdj_auth')}]));
        var headers = req.getAllResponseHeaders().toLowerCase();

        // 后端以 200 作为取消关注成功的标志
        if (req.status === 200) {
            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    };

    /*
    ===========================================================================
        其他
    ===========================================================================
    */

    /*
     * GA 事件统计
     */
    campaignTools.pushGaEvent = function (category, action, label, value) {

        category = category || '';
        action = action || '';
        label = label || '';
        value = parseInt(value, 10) || 0;

        if (typeof ga !== 'undefined' && ga) {
            ga('send', 'event', category, action, label, value);
        } else if (typeof _gaq !== 'undefined' && _gaq) {
            _gaq.push(['_trackEvent', category, action, label, value]);
        }
    };

    /*
     * body 高设置为屏幕显示区域高度
     * @notice Webview 有时屏幕初始高度会有 bug，此方法为解决此 bug
     */
    campaignTools.setFullScreenHeight = function (minHeight) {

        var height = window.innerHeight;
        minHeight = minHeight || 480; // 根据页面需求变化，默认 480px

        if (height < minHeight) {
            setTimeout(function () {
                height = window.innerHeight;
                if (height < minHeight) {
                    height = minHeight;
                }
                document.body.style.height = height + 'px';
            }, 1000);
        } else {
            document.body.style.height = height + 'px';
        }
    };

    // 取 URL 中的参数
    // http://www.xxxx.com/xxx/xxx?id=1
    // campaignTools.parseQueryString().id;
    campaignTools.parseQueryString = function () {
        var str = window.location.search;
        var objURL = {};
        str.replace(
            new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
            function ($0, $1, $2, $3) {
                objURL[$1] = $3;
            }
        );
        return objURL;
    };


    /*
    ===========================================================================
        分享相关
    ===========================================================================
    */

    /*
     * 微信 sdk 分享
     * @param shareTimelineObject {object}
     * @param shareFriendObject {object}
     *  shareTimelineObject = {
            title: '',
            link: '',
            imgUrl: '',
            successCallback: function () {
                alert('分享成功');
            }
        }
     *  shareFriendObject = {
            title: '',
            desc: '',
            link: '',
            imgUrl: '',
            successCallback: function () {
                alert('分享成功');
            }
        }
     *
     */
    campaignTools.wechatWebviewShareSetup = function (shareTimelineObject, shareFriendObject) {
        $.ajax({
            url: 'http://who.wandoujia.com/wx-corp/js-sdk',
            type: 'POST',
            data: {
                url: location.href.split('#')[0]
            }
        }).done(function (r) {
            // 开始配置微信JS-SDK
            wx.config({
                debug: false,
                appId: r.appId,
                timestamp: r.timestamp,
                nonceStr: r.nonceStr,
                signature: r.signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'hideMenuItems'
                ]
            });

            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: shareTimelineObject.title, // 分享标题
                    link: shareTimelineObject.link, // 分享链接
                    imgUrl: shareTimelineObject.imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        if (shareTimelineObject.successCallback && typeof shareTimelineObject.successCallback === 'function') {
                            shareTimelineObject.successCallback();
                        }
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareAppMessage({
                    title: shareFriendObject.title, // 分享标题
                    desc: shareFriendObject.desc, // 分享描述
                    link: shareFriendObject.link, // 分享链接
                    imgUrl: shareFriendObject.imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        if (shareFriendObject.successCallback && typeof shareFriendObject.successCallback === 'function') {
                            shareFriendObject.successCallback();
                        }
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
        });
    };

    // 常用分享按钮
    // 微博 & 微信好友 & 微信朋友圈

    /* eg.
    // 设置各按钮的分享：

    var weibo = {
        element: '.share-weibo',
        desc: '',
        link: '',
        shortLink: '', // 选填
        imgUrl: '',
        successCallback: function (resp) {
            switch (resp) {
                case 'P4-weibo-launch':
                    console.log('P4 内，调起微博 app 的分享界面进行分享');
                    break;
                case 'P4-weibo-redirect':
                    console.log('P4 内，跳转到微博分享页进行分享');
                    break;
                case 'other-weibo-redirect':
                    console.log('P4 外，跳转到微博分享页进行分享');
                    break;
            }
        }
    };

    var wechatFriend = {
        element: '.share-wechat-friend',
        title: '',
        desc: '',
        link: '',
        imgUrl: '',
        tips: function () {
            // 可以自定义弹出提示的方法
            var tipsImg = 'http://t.wdjcdn.com/upload/mkt-campaign/designaward/208/wechat-share-tips.png';
            $('body').append('<div class="overlay"></div><div class="popup wechat-image"><img width="103" id="wechat-share-tips-img" src="' + tipsImg + '" /></div>');
        },
        qrcode: function () {
            // 可以自定义弹出二维码的方法
            var popup = {
                title: '分享到微信',
                content: '<div class="center"><img class="qrcode" width="150" src="http://www.wandoujia.com/qr?s=5&c=' + encodeURIComponent(wechatFriend.link) + '" /></div><p>用微信扫描二维码，就可以分享到好友或朋友圈了</p>',
                button: '关 闭'
            };
            window.renderPopoup(popup);
        },
        successCallback: function (resp) {
            switch (resp) {
                case 'P4-wechatFriend-launch':
                    console.log('P4 内，调起微信 app 的分享给好友界面进行分享');
                    break;
                case 'wechat-wechatFriend-tips':
                    console.log('微信 webview 内，提示点击右上角下拉菜单，手动分享');
                    break;
                case 'other-wechatFriend-qrcode':
                    console.log('其他情况，弹出二维码');
                    break;
            }
        }
    };

    var wechatTimeline = {
        element: '.share-wechat-timeline',
        title: '',
        link: '',
        imgUrl: '',
        tips: function () {
            // 可以自定义弹出提示的方法
            var tipsImg = 'http://t.wdjcdn.com/upload/mkt-campaign/designaward/208/wechat-share-tips.png';
            $('body').append('<div class="overlay"></div><div class="popup wechat-image"><img width="103" id="wechat-share-tips-img" src="' + tipsImg + '" /></div>');
        },
        qrcode: function () {
            // 可以自定义弹出二维码的方法
            var popup = {
                title: '分享到微信',
                content: '<div class="center"><img class="qrcode" width="150" src="http://www.wandoujia.com/qr?s=5&c=' + encodeURIComponent(wechatTimeline.link) + '" /></div><p>用微信扫描二维码，就可以分享到好友或朋友圈了</p>',
                button: '关 闭'
            };
            window.renderPopoup(popup);
        },
        successCallback: function (resp) {
            switch (resp) {
                case 'P4-wechatTimeline-launch':
                    console.log('P4 内，调起微信 app 的分享到朋友圈界面进行分享');
                    break;
                case 'wechat-wechatTimeline-tips':
                    console.log('微信 webview 内，提示点击右上角下拉菜单，手动分享');
                    break;
                case 'other-wechatTimeline-qrcode':
                    console.log('其他情况，弹出二维码');
                    break;
            }
        }
    };
    */

    campaignTools.shareButtonSetup = function (weibo, wechatFriend, wechatTimeline) {
        var weiboURL = 'http://service.weibo.com/share/share.php?appkey=1483181040&relateUid=1727978503&url=' + encodeURIComponent(weibo.shortLink || weibo.link) + '&title=' + encodeURIComponent(weibo.desc) + '&pic=' + weibo.imgUrl;

        if (campaignTools.UA.inWdj) {
            // var localVersion = null;
            // if (campaignTools.isInstalled('com.sina.weibo')) {
            //     localVersion = campaignTools.getAppVersionName('com.sina.weibo').replace(/\./g, '');
            // }

            $(weibo.element).click(function () {
                // if (localVersion && parseInt(localVersion, 10) < 528) {
                    weibo.successCallback('P4-weibo-launch');
                    campaignTools.toast('正在打开微博，请稍候...');
                    campaignTools.runAppShare(null, weibo.desc, weibo.imgUrl, weibo.shortLink || weibo.link, 'SINA_WEIBO');
                // } else {
                //     weibo.successCallback('P4-weibo-redirect');
                //     window.location.href = weiboURL;
                // }
            });

            $(wechatFriend.element).click(function () {
                wechatFriend.successCallback('P4-wechatFriend-launch');

                campaignTools.toast('正在打开微信，请稍候...');
                campaignTools.runAppShare(wechatFriend.title, wechatFriend.desc, wechatFriend.imgUrl, wechatFriend.link, 'WECHAT');
            });

            $(wechatTimeline.element).click(function () {
                wechatTimeline.successCallback('P4-wechatTimeline-launch');

                campaignTools.toast('正在打开微信，请稍候...');
                campaignTools.runAppShare(wechatTimeline.title, wechatTimeline.title, wechatTimeline.imgUrl, wechatTimeline.link, 'WECHAT_TIMELINE');
            });

        } else {

            // 分享到微博
            // 跳转页面
            $(weibo.element).click(function () {
                weibo.successCallback('weibo-redirect');
                location.href = weiboURL;
            });

            // 分享到微信
            $(wechatFriend.element + ', ' + wechatTimeline.element).click(function (e) {
                // 微信内
                // 提示点击右上角
                if (campaignTools.UA.inWechat) {
                    if ($(this).is(wechatFriend.element)) {
                        wechatFriend.successCallback('wechat-wechatFriend-tips');
                        wechatFriend.tips();
                    } else {
                        wechatTimeline.successCallback('wechat-wechatTimeline-tips');
                        wechatTimeline.tips();
                    }

                // 微信外
                // 弹二维码 提示用微信扫描
                } else {
                    if ($(this).is(wechatFriend.element)) {
                        wechatFriend.successCallback('other-wechatFriend-tips');
                        wechatFriend.qrcode();
                    } else {
                        wechatTimeline.successCallback('other-wechatTimeline-qrcode');
                        wechatTimeline.qrcode();
                    }
                }
            });
        }
    };

    /*
    ===========================================================================
        todo:
        应用安装、打开、升级
    ===========================================================================
    */

    var _campaignTools = window.campaignTools;
    window.campaignTools = campaignTools;

    campaignTools.noConflict = function () {
        window.campaignTools = _campaignTools;
        return campaignTools;
    };

    // 增加对 AMD 的支持
    if (typeof define === 'function' && define.amd) {
        define('campaignTools', [], function () {
            return campaignTools;
        });
    }
})(this);
