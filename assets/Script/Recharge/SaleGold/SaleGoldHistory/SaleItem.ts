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
    goldLabel: cc.Label = null;

    @property(cc.Label)
    down_atLabel: cc.Label = null;

    @property(cc.Label)
    last_goldLabel: cc.Label = null;

    @property(cc.Label)
    consume_goldLabel: cc.Label = null;

    @property(cc.Label)
    statusLabel: cc.Label = null;

    @property
    public results = {};
    public config = null;

    onLoad () {
        this.config = new Config();
    }

    public init(data){
        this.created_atLabel.string =  this.config.getTime(data.created_at);
        this.goldLabel.string = this.config.toDecimal(data.gold);
        this.down_atLabel.string = data.down_at==0?"无": this.config.getTime(data.down_at);
        this.last_goldLabel.string = this.config.toDecimal(data.last_gold);
        this.consume_goldLabel.string =data.status == 3|| data.status == 5|| data.status == 6
            ? this.config.toDecimal(data.consume_gold) :'0.00';
        this.statusLabel.string = data.status == 1|| data.status == 2 ? '审核中'
            : (data.status == 4 ?'挂单中' :(data.status == 6?'已下架':'已拒绝'));
    }

    start () {

    }

    onClick(){

    }
    // update (dt) {}
}
