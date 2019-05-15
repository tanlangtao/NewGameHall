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
    finishTimeLabel: cc.Label = null;

    @property(cc.Label)
    statusLabel: cc.Label = null;

    @property
    public results = {};
    public config = null;
    public parentComponent = null;
    onLoad () {
        this.config = new Config();
    }

    public init(data,parentComponent){
        this.parentComponent = parentComponent;
        this.IdLabel.string = data.user_id;
        this.amountLabel.string = this.config.toDecimal(data.amount);
        this.finishTimeLabel.string = data.arrival_at == 0 ? "无" :this.config.getTime(data.arrival_at);
        this.statusLabel.string = data.status == 8 ?'已完成' :'未完成';
    }

    start () {

    }

    onClick(){
    }
    // update (dt) {}
}
