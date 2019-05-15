// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Config from "../../Config"
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    statusLabel: cc.Label = null;

    @property(cc.Label)
    typeLabel: cc.Label = null;

    @property(cc.Label)
    firstTimeLabel: cc.Label = null;

    @property(cc.Label)
    lastTimeLabel: cc.Label = null;

    @property(cc.Node)
    orderBtn: cc.Node = null;

    @property(cc.Prefab)
    publicOrderAlert: cc.Prefab = null;

    @property
    public results = {};
    public config = null;

    onLoad () {
        this.config = new Config();
    }

    public init(data){
        this.amountLabel.string = this.config.toDecimal(data.amount);
        this.statusLabel.string = data.status ==6 ?'已完成' :(data.status == 4 ? '已撤销' : '未完成' );
        this.typeLabel.string = data.type == 1 ? '支付宝充值' :(data.type == 2 ? '银行卡转账' :(data.type == 3?'人工代充值':(data.type == 4?'人工兑换':'赠送')));
        this.firstTimeLabel.string = this.config.getTime(data.firstTime);
        this.lastTimeLabel.string = data.lastTime == 0 ? '无' : this.config.getTime(data.lastTime);
        this.results = data.results;
        if(data.status != 6 && data.type == 2){

        }else{
            this.orderBtn.removeFromParent()
        }
    }

    start () {

    }

    onClick(){
        var node = cc.instantiate(this.publicOrderAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        var data = {
            data : this.results
        }
        node.getComponent('PublicOrderAlert').init(data)
    }
    // update (dt) {}
}
