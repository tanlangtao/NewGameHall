// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property()
    timer = null;

    // LIFE-CYCLE CALLBACKS:
    public init(data){
        this.label.string = data.substring(0,30)
    }

    onLoad () {
        var self = this;
        this.timer = setTimeout(() => {
            self.node.removeFromParent()
        }, 1500)
    }

    removeSelf(){
        this.node.removeFromParent()
    }

    onDestroy(){
        clearTimeout(this.timer);
    }

    start () {

    }

    // update (dt) {}
}
