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

    @property(cc.Node)
    querenBtn: cc.Node = null;

    @property(cc.Prefab)
    publicAlert: cc.Prefab = null;

    @property
    public results = null;
    public config = null;
    public UrlData = null;
    public FormData = new FormData();
    public token = '';
    public parentComponent = null ;
    onLoad () {
        this.config = new Config();
        this.UrlData = this.config.getUrlData();
        this.token = this.config.token;
    }

    public init(data,parentComponent){
        this.OrderLabel.string = data.order_id.substr(-6);
        this.IdLabel.string = data.user_id;
        this.statusLabel.string = data.status == 8 ?'已成功':(data.status == 7 || data.status == 10 ? '已付款':(data.status == 11 || data.status ==13?'交易失败':'未完成'));
        this.amountLabel.string = this.config.toDecimal(data.amount);
        this.firstTimeLabel.string = this.config.getTime(data.created_at);
        this.results = data;

        this.parentComponent = parentComponent
    }

    start () {

    }
    // 确认已付款点击事件，目前不需要展示此功能
    // onClick(){
    //     var url = `${this.UrlData.host}/api/order/paidOrder`;
    //     this.FormData = new FormData();
    //     this.FormData.append('user_id', this.results.user_id);
    //     this.FormData.append('type','1');
    //     this.FormData.append('order_id', this.results.order_id);
    //     this.FormData.append('replace_id', this.UrlData.user_id);
    //     this.FormData.append('token', this.token);
    //     fetch(url, {
    //         method: 'POST',
    //         body: this.FormData
    //     }).then((data) => data.json()).then((data) => {
    //         if (data.status == 0) {
    //             this.showAlert('确认成功！');
    //             this.parentComponent.updataList()
    //         } else {
    //             this.showAlert(data.msg)
    //         }
    //     })
    // }
    public showAlert(data) {
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data)
    }
    // update (dt) {}
}
