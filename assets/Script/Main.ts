import Config from "./Config";
import ClientMessage from "./ClientMessage"
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    publicAlert: cc.Prefab = null;

    @property(cc.Prefab)
    Recharge: cc.Prefab = null;

    @property(cc.Prefab)
    Cash: cc.Prefab = null;

    @property(cc.Prefab)
    AlipayAccountAlert: cc.Prefab = null;

    @property(cc.Prefab)
    BankAccountAlert: cc.Prefab = null;

    @property()
    public UrlData : any = [];
    public Client  = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var config = new Config();
        this.UrlData =config.getUrlData();
        this.Client = new ClientMessage();
        //根据path来决定渲染充值或兑换
        if(this.UrlData.path == '/cash'){
            var node = cc.instantiate(this.Cash);
            var canvas = cc.find('Canvas');
            canvas.addChild(node);
        }else{
            var node = cc.instantiate(this.Recharge);
            var canvas = cc.find('Canvas');
            canvas.addChild(node);
        }


    }
    public showAlert(data){
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data)
    }
    // 添加支付宝账号弹窗
    public showAlipayAccountAlert(data){
        var canvas = cc.find('Canvas');
        var node = cc.instantiate(this.AlipayAccountAlert);
        canvas.addChild(node);
        let AlipayAccountAlert = node.getComponent('AlipayAccountAlert');
        AlipayAccountAlert.init({
            text:data.text,
            action:data.action,
            itemId:data.itemId
        });
        if(data.changeData){
            AlipayAccountAlert.changeContent(data.changeData);
        }

    }
    // 添加银行卡类型弹窗
    public showBankAccountAlert(data){
        var canvas = cc.find('Canvas');
        var node = cc.instantiate(this.BankAccountAlert);
        canvas.addChild(node);
        let BankAccountAlert = node.getComponent('BankAccountAlert');
        BankAccountAlert.init({
            text:data.text,
            action:data.action,
            itemId:data.itemId
        })
        if(data.changeData){
            BankAccountAlert.changeContent(data.changeData);
        }
    }
}
