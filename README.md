# IOS-Overlay

数据加载提示框

## 使用

引用
``` html
<link rel="stylesheet" href="iOS-Overlay/css/iosOverlay.css">
<script src="iOS-Overlay/js/iosOverlay.js"></script>
<script src="iOS-Overlay/js/spin.min.js"></script>
```


创建加载框
``` javascript
loading = newLoading({
        text: '加载中...',
        timeout: 1000 * 5,
        parentEl: 'test'
    });
```

更新加载框
``` javascript
loading.update({
            icon: "iOS-Overlay/img/check.png",
            text: "成功",
            timeout: 1000 * 5
        });
```

关闭加载框
``` javascript
loading.hide();
```


## 效果
![image](https://github.com/kuangch/ios-overlay/blob/master/screen.gif)
