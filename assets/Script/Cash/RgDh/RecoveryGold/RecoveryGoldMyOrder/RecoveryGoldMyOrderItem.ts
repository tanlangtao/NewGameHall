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
    OrderLabel: cc.Label = null;

    @property(cc.Label)
    IdLabel: cc.Label = null;

    @property(cc.Label)
    statusLabel: cc.Label = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    firstTimeLabel: cc.Label = null;

    @property
    public results = {};
    public config = null;

    onLoad () {
        this.config = new Config();
    }

    public init(data){
        this.statusLabel.string = data.status ==1 ?'已完成' :(data.status == 3 ? '已撤销' : '未完成' );
        this.amountLabel.string = this.config.toDecimal(data.amount);
        this.firstTimeLabel.string = this.config.getTime(data.firstTime);
        this.results = data.results;
    }

    start () {

    }

    onClick(){
    }
    // update (dt) {}
}
