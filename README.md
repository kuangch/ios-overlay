# IOS-Overlay

���ݼ�����ʾ��

## ʹ��

����
``` html
<link rel="stylesheet" href="iOS-Overlay/css/iosOverlay.css">
<script src="iOS-Overlay/js/iosOverlay.js"></script>
<script src="iOS-Overlay/js/spin.min.js"></script>
```


�������ؿ�
``` javascript
loading = newLoading({
        text: '������...',
        timeout: 1000 * 5,
        parentEl: 'test'
    });
```

���¼��ؿ�
``` javascript
loading.update({
            icon: "iOS-Overlay/img/check.png",
            text: "�ɹ�",
            timeout: 1000 * 5
        });
```

�رռ��ؿ�
``` javascript
loading.hide();
```


## Ч��
![image](https://github.com/kuangch/ios-overlay/blob/master/screen.gif)
