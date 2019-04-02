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
    typeLabel: cc.Label = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    handling_feeLabel: cc.Label = null;

    @property(cc.Label)
    exchangeLabel: cc.Label = null;

    @property(cc.Label)
    arrival_amountLabel: cc.Label = null;

    @property(cc.Label)
    statusLabel: cc.Label = null;
    
    @property(cc.Label)
    created_atLabel: cc.Label = null;

    @property(cc.Label)
    arrival_atLabel: cc.Label = null;

    @property(cc.Label)
    admin_remarkLabel: cc.Label = null;
    
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
        this.typeLabel.string = data.type == 1 ? '支付宝' :(data.type == 2 ? '银行卡提现1' :(data.type == 3 ? '银行卡提现' :"人工提现"));
        this.amountLabel.string = this.config.toDecimal(data.amount);
        this.handling_feeLabel.string = `${this.config.toDecimal1(data.handling_fee*100)}%`;
        this.exchangeLabel.string  = `${this.config.toDecimal1(data.exchange*100)}%`;
        this.arrival_amountLabel.string  = this.config.toDecimal1(data.arrival_amount);
        this.statusLabel.string = data.status == 6 ?'已完成':'未成功';
        this.created_atLabel.string = this.config.getTime(data.created_at);
        this.arrival_atLabel.string = data.arrival_at == 0 ? '无' : this.config.getTime(data.arrival_at);
        this.admin_remarkLabel.string = data.admin_remark;
        this.results = data.results;
        data.status == 6 ? '' : this.orderBtn.removeFromParent();
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
