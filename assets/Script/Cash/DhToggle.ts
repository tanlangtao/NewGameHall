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
    Dh : cc.Prefab = null;

    @property(cc.Prefab)
    BankDh : cc.Prefab = null;

    @property(cc.Prefab)
    RgDh : cc.Prefab = null;

    @property(cc.Prefab)
    Give : cc.Prefab = null;

    public init(data){
        this.label.string =data.text;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {

    }

    onClick(){
        var content = cc.find('Canvas/Cash/Content');
        if(this.label.string == '人工兑换'){
            var node = cc.instantiate(this.RgDh);
        }else if(this.label.string == '支付宝兑换'){
            var node = cc.instantiate(this.Dh);
        }else if(this.label.string == '银行卡兑换'){
            var node = cc.instantiate(this.BankDh);
        }else if(this.label.string == '赠送'){
            var node = cc.instantiate(this.Give);
        }
        content.removeAllChildren();
        content.addChild(node);
    }
    // update (dt) {}
}
