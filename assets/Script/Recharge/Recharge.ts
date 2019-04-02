import Config from "../Config";

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
    NavToggle: cc.Prefab = null;

    @property(cc.Prefab)
    RechargeHistory: cc.Prefab = null;

    @property(cc.Node)
    ToggleContainer: cc.Node = null;

    @property(cc.Node)
    Content: cc.Node = null;

    @property()
    public UrlData: any = [];
    public token: string = '';
    public results: any = {};
    public zfbResults: any = {};

    // LIFE-CYCLE CALLBACKS:


    onLoad() {

        var config = new Config();
        this.UrlData = config.getUrlData();
        this.token = config.token;
        //请求支付宝
        this.fetchZfb()
    }

    start() {


    }

    public exitBtnClick() {

    }

    public historyBtnClick() {
        var node = cc.instantiate(this.RechargeHistory);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
    }

    public fetchZfb() {
        var url = `${this.UrlData.host}/api/payment/aliPayPaymentIndex?user_id=${this.UrlData.user_id}&token=${this.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.zfbResults = data;
                //动态渲染左侧导航
                this.addNavToggle()
            } else {

            }
        })
        let total = ''
    }

    public addNavToggle() {
        var arr = [];
        if (this.zfbResults.data.alipay.length == 0 && this.zfbResults.data.alipay2bank.length == 0) {
            arr = ['人工代充值']
        } else if (this.zfbResults.data.alipay.length == 0) {
            arr = ['人工代充值', '支付宝转银行卡']
        } else if (this.zfbResults.data.alipay2bank.length == 0) {
            arr = ['人工代充值', '支付宝']
        } else {
            arr = ['人工代充值', '支付宝', '支付宝转银行卡']
        }
        for (let i: number = 0; i < arr.length; i++) {
            var node = cc.instantiate(this.NavToggle);
            this.ToggleContainer.addChild(node);
            node.getComponent('NavToggle').init({
                text: arr[i]
            })
        }
    }

}
