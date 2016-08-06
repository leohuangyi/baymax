# Baymax智能汽车机器人

Baymax是一款模拟未来汽车的虚拟机器人，他具备以下优点：

* 拥有三套指令响应模块，可以响应用户各种常见的指令、问题
* 具备完善的管理、训练系统，可以通过[Baymax智能管理、训练系统](http://baymax-bot.xwlj.net)来训练你的专属智能汽车机器人

# 使用方法

目前Baymax主要通过[Slack](http://clevercar.slack.com) Bot User来进行交互

由于开发时间仓促，还没来得及将它上架成公用bot。您需要使用我的slack team中的账号来进行测试。

1. 登录[Slack](http://clevercar.slack.com)，账户密码请向leohuangyi@foxmail.com索取。
2. 使用指令`#create#车牌#密码`绑定您的车牌
3. 现在就可以直接进行交互啦

# 预定义指令

* `#create#车牌#密码` 该指令用来进行车牌绑定，您可以通过再次发送该指令来更新车牌或密码。车牌(4-10字符组合，不能含有特殊字符如#、*等) 密码(4-16字符组合，不能含有特殊字符)
* `#show#` 该指令会返回您绑定的车牌，以及关于您的Baymax智能机器人的统计信息，如为您服务的次数

# Baymax响应流程图

![Bayma响应流程](http://pubassets.oss-cn-shanghai.aliyuncs.com/img/Baymax2.png)
