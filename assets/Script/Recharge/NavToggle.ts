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

    @property(cc.Prefab)
    Dc : cc.Prefab = null;

    @property(cc.Prefab)
    Zfb : cc.Prefab = null;

    @property(cc.Prefab)
    ZfbToBank : cc.Prefab = null;

    public init(data){
        this.label.string =data.text;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {

    }

    onClick(){
        var content = cc.find('Canvas/Recharge/Content');
        if(this.label.string == '人工代充值'){
            var node = cc.instantiate(this.Dc);
        }else if(this.label.string == '支付宝'){
            var node = cc.instantiate(this.Zfb);
        }else if(this.label.string == '银行卡转账'){
            var node = cc.instantiate(this.ZfbToBank);
        }
        content.removeAllChildren();
        content.addChild(node);
    }
    // update (dt) {}
}
