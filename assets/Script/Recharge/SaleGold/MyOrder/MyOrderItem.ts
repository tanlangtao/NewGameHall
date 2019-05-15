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
    order_idLabel: cc.Label = null;

    @property(cc.Label)
    user_idLabel: cc.Label = null;

    @property(cc.Label)
    statusLabel: cc.Label = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    created_atLabel: cc.Label = null;

    @property(cc.Node)
    querenBtn: cc.Node = null;

    @property(cc.Prefab)
    querenAlert: cc.Prefab = null;

    @property
    public results = null;
    public config = null;
    public UrlData = null;
    public token = null;
    public FormData = new FormData();

    onLoad () {
        this.config = new Config();
        this.UrlData = this.config.getUrlData();
        this.token = this.config.token;
    }

    public init(data){
        this.order_idLabel.string = data.order_id.substr(-6);
        this.user_idLabel.string = data.user_id;
        this.statusLabel.string = data.status == 6 ? "已完成":(data.status == 3 ?'未完成':(data.status == 5 ?'已付款':'交易失败'));
        this.amountLabel.string = this.config.toDecimal(data.amount);
        this.created_atLabel.string = this.config.getTime(data.created_at);
        this.results = data.results;
        if(data.status != 5){
            this.querenBtn.active = false;
        }
    }

    start () {

    }



    onClick(){
        let node = cc.instantiate(this.querenAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('CompleteOrderAlert').init(this.results)
    }
    // update (dt) {}
}
