// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Config from '../../../Config'
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Prefab)
    publicAlert: cc.Prefab = null;


    @property()
    public UrlData : any = [];
    public token : string = '';
    public data : any = {};
    FormData = new FormData();

    public init(data){
        var config = new Config();
        this.UrlData = config.getUrlData();
        this.token = config.token;
        this.data = data;
        this.label.string = `请确认收到转账信息后，再点击确认，完成订单`
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onClick(){
        this.fetchcompletedOrder();
        this.node.removeFromParent();
    }

    public fetchcompletedOrder() {
        var url = `${this.UrlData.host}/api/order/completedOrder`;
        this.FormData = new FormData();
        this.FormData.append('user_id', this.data.user_id);
        this.FormData.append('order_id',this.data.order_id);
        this.FormData.append('type','1');
        this.FormData.append('token', this.token);
        fetch(url, {
            method: 'POST',
            body: this.FormData
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.showAlert('确认成功！');
                let CashHistory = cc.find('Canvas/CashHistory').getComponent('CashHistory');
                CashHistory.updataList();
            } else {
                this.showAlert(data.msg)
            }
        })
    }

    public showAlert(data) {
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data);
    }


    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
