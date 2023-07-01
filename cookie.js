function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  // 读取cookie并显示至网页
  document.getElementById('host').value = getCookie('host');
  // 如果存在port，就执行从cookie获取
  if (getCookie('port') !== '') {
    document.getElementById('port').value = getCookie('port');
  }
  document.getElementById('username').value = getCookie('username');
  // 如果勾选了记住密码，就执行从cookie获取密码
  if (getCookie('rempwd') === 'true') {
    document.getElementById('password').value = getCookie('password');
    //如果上次勾选了记住密码，就继续勾选
    document.getElementById('rempwd').checked = true;
  }
  
  document.getElementById('url').value = getCookie('url');
  document.getElementById('duration').value = getCookie('duration');
  //如果存在startpy，就执行从cookie获取
  if (getCookie('startpy') !== '') {
    document.getElementById('startpy').value = getCookie('startpy');
  }
  //如果存在method，就执行从cookie获取
  if (getCookie('method') !== '') {
    document.getElementById('method').value = getCookie('method');
  }
  //如果存在proxytype，就执行从cookie获取
  if (getCookie('proxytype') !== '') {
    document.getElementById('proxytype').value = getCookie('proxytype');
  }
  //如果存在threads，就执行从cookie获取
  if (getCookie('threads') !== '') {
    document.getElementById('threads').value = getCookie('threads');
  }
  //如果存在proxies，就执行从cookie获取
  if (getCookie('proxies') !== '') {
    document.getElementById('proxies').value = getCookie('proxies');
  }
  //如果存在rpc，就执行从cookie获取
  if (getCookie('rpc') !== '') {
    document.getElementById('rpc').value = getCookie('rpc');
  }
  
  // 从网页输入写入cookie
  document.getElementById('host').onchange = () => {
    setCookie('host', document.getElementById('host').value, 365);
  };
  document.getElementById('port').onchange = () => {
    setCookie('port', document.getElementById('port').value, 365);
  };
  document.getElementById('username').onchange = () => {
    setCookie('username', document.getElementById('username').value, 365);
  };
  // 如果勾选了记住密码，就保存密码
  document.getElementById('password').onchange = () => {
    if (document.getElementById('rempwd').checked) {
      setCookie('password', document.getElementById('password').value, 365);
    }
  };
  // 如果刚刚勾选了记住密码，就先保存密码
  document.getElementById('rempwd').onchange = () => {
    if (document.getElementById('rempwd').checked) {
      //二次确认弹窗
      mdui.confirm('<p class="mdui-text-color-red">请注意，密码将以明文形式存储在本地cookie中，如果您的设备被他人使用，您的密码可能会泄露。</p>', '确认记住密码？', () => {}, 
        () => {
          // 选择取消则取消打勾
          document.getElementById('rempwd').checked = false;
          setCookie('rempwd', 'false', 365);
          setCookie('password', '', 365);
        }, {confirmText: '确认', cancelText: '取消'
      });
  
      setCookie('rempwd', 'true', 365);
      setCookie('password', document.getElementById('password').value, 365);
    } else {
      setCookie('rempwd', 'false', 365);
      setCookie('password', '', 365);
    }
  };
  
  document.getElementById('url').onchange = () => {
    setCookie('url', document.getElementById('url').value, 365);
  };
  document.getElementById('duration').onchange = () => {
    setCookie('duration', document.getElementById('duration').value, 365);
  };
  document.getElementById('startpy').onchange = () => {
    setCookie('startpy', document.getElementById('startpy').value, 365);
  };
  document.getElementById('method').onchange = () => {
    setCookie('method', document.getElementById('method').value, 365);
  };
  document.getElementById('proxytype').onchange = () => {
    setCookie('proxytype', document.getElementById('proxytype').value, 365);
  };
  document.getElementById('threads').onchange = () => {
    setCookie('threads', document.getElementById('threads').value, 365);
  };
  document.getElementById('proxies').onchange = () => {
    setCookie('proxies', document.getElementById('proxies').value, 365);
  };
  document.getElementById('rpc').onchange = () => {
    setCookie('rpc', document.getElementById('rpc').value, 365);
  };
  
  
  
  