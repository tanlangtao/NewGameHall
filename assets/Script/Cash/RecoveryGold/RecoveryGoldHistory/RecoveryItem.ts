// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Config from "../../../Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    created_atLabel: cc.Label = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    handling_feeLabel: cc.Label = null;

    @property(cc.Label)
    cancleTimeLabel: cc.Label = null;

    @property(cc.Label)
    cancleAmountLabel: cc.Label = null;

    @property(cc.Label)
    traded_goldLabel:cc.Label = null;

    @property(cc.Label)
    statusLabel: cc.Label = null;

    @property
    public results = null;
    public config = null;
    onLoad () {
        this.config = new Config();
    }

    public init(data){
        this.results = data;
        this.created_atLabel.string = this.config.getTime(data.created_at);
        this.amountLabel.string = this.config.toDecimal(data.gold);
        this.handling_feeLabel.string = this.config.toDecimal1(data.handling_fee*100)+"%";
        this.cancleTimeLabel.string = data.down_at == 0 ? '无': this.config.getTime(data.down_at);
        this.cancleAmountLabel.string = data.status == 3 || data.status == 4 ?  this.config.toDecimal(data.last_gold):`0.00`;
        this.traded_goldLabel.string = this.config.toDecimal(data.traded_gold);
        this.statusLabel.string = data.status == 1 ? "待审核"  : (data.status == 2 ? '挂单中':(data.status == 4 ? "已下架" :"已拒绝"));
    }

    start () {

    }

    onClick(){

    }
    // update (dt) {}
}
