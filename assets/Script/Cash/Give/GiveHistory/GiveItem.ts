// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Config from "../../../Config"
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    IdLabel: cc.Label = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    creteTimeLabel: cc.Label = null;

    @property(cc.Label)
    finishTimeLabel: cc.Label = null;

    @property(cc.Label)
    statusLabel: cc.Label = null;

    @property(cc.Label)
    remarkLabel: cc.Label = null;

    @property
    public results = {};
    public config = null;

    onLoad () {
        this.config = new Config();
    }

    public init(data){
        this.IdLabel.string = data.replace_id;
        this.amountLabel.string = this.config.toDecimal(data.amount);
        this.creteTimeLabel.string = this.config.getTime(data.created_at);
        this.finishTimeLabel.string = data.arrival_at == 0? '无' :this.config.getTime(data.arrival_at);
        this.statusLabel.string = data.status == 8 ? '已完成' :(data.status == 3 || data.status == 5 ?'已拒绝':'未完成');
        this.remarkLabel.string = !data.user_remark ?'':data.user_remark.substring(0,14);
    }

    start () {

    }

    onClick(){
    }
    // update (dt) {}
}
