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
        this.label.string = `您有一笔代充订单未完成，金额${config.toDecimal(data.payment_amount)}，是否立即取消？`;
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onClick(){
        this.fetchReplacePayment();
        this.node.destroy();
    }

    fetchReplacePayment(){
        var url = `${this.UrlData.host}/api/order/cancelorder`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.UrlData.user_id)
        this.FormData.append('order_id',this.data.payment_order_id)
        this.FormData.append('token',this.token)
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            var dc = cc.find('Canvas/Recharge/Content/Dc').getComponent('Dc');
            if(data.status == 0){
                dc.fetchIndex();
                dc.showAlert('取消成功！')
            }else{
                dc.showAlert(data.msg)
            }
        })
    }

    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
