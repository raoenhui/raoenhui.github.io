$.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function(_result) {
            if (remote_ip_info.ret == '1') {
                $('#search .search .address').html(remote_ip_info.province+'市');
                alert('国家：' + remote_ip_info.country + '省：' + remote_ip_info.province + '市：' + remote_ip_info.city + '区：' + remote_ip_info.district + 'ISP：' + remote_ip_info.isp + '类型：' + remote_ip_info.type + '其他：' + remote_ip_info.desc);
            } else {
                alert('没有找到匹配的IP地址信息！');
            }
        });