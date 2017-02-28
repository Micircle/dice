## 骰子🎲
    var dice = new Dice([elem], [elem]);

生成一个骰子，可以传入两个参数，第一个为插入骰子节点的母元素默认为body，第二个为输出骰子点数的元素。

调用dice.randomRoll()可以随机roll一个1-6的点数

调用dice.rollTo(num)可以获取想要的点数（1-6）
