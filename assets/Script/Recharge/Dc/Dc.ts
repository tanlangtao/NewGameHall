import Config from "../../Config";
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
    @property()
    public UrlData: any = [];
    public token: string = '';
    public results: any = {};

    @property(cc.Prefab)
    PublicInputAlert: cc.Prefab = null;

    @property(cc.Prefab)
    CancleOrderAlert: cc.Prefab = null;

    @property(cc.Prefab)
    publicAlert: cc.Prefab = null;

    @property(cc.Prefab)
    SaleGold: cc.Prefab = null;

    @property(cc.EditBox)
    amountInput: cc.EditBox = null;

    @property(cc.Label)
    btn2Label: cc.Label = null;

    @property(cc.Prefab)
    service: cc.Prefab = null;

    @property()
    FormData = new FormData();

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var config = new Config();
        this.UrlData = config.getUrlData();
        this.token = config.token;
        //初始请求
        this.fetchIndex()
        // input 输入监听
        this.getPublicInput()

    }

    start() {

    }

    public fetchIndex() {
        var url = `${this.UrlData.host}/api/replace_payment/index?user_id=${this.UrlData.user_id}&token=${this.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.results = data;
            } else {

            }
        })
    }

    public getPublicInput() {
        var PublicInputAlert = cc.instantiate(this.PublicInputAlert);
        var canvas = cc.find('Canvas');
        this.amountInput.node.on('editing-did-began', (e) => {
            canvas.addChild(PublicInputAlert);
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text: e.string,
                input: this.amountInput
            })
        })
        this.amountInput.node.on('text-changed', (e) => {
            //验证input 不能以0开头的整数
            this.amountInput.string = e.string.replace(/[^\d]/g, '').replace(/^0{1,}/g, '');
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text: e.string,
                input: this.amountInput
            })
        })
    }

    fetchReplacePayment() {
        var url = `${this.UrlData.host}/api/replace_payment/summitBuyPoints`;
        this.FormData = new FormData();
        this.FormData.append('user_id', this.UrlData.user_id)
        this.FormData.append('user_name', decodeURI(this.UrlData.user_name))
        this.FormData.append('amount', this.amountInput.string)
        this.FormData.append('client', this.UrlData.client)
        this.FormData.append('proxy_user_id', this.UrlData.proxy_user_id)
        this.FormData.append('proxy_name', decodeURI(this.UrlData.proxy_name))
        this.FormData.append('package_id', this.UrlData.package_id)
        this.FormData.append('token', this.token)
        fetch(url, {
            method: 'POST',
            body: this.FormData
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                var node = cc.instantiate(this.service);
                var content = cc.find('Canvas/Recharge/Content');
                content.addChild(node);
                node.getComponent('Service').init({
                    results: data,
                    parentComponent: this
                })
            } else {
                this.showAlert(data.msg)
            }
        })
    }

    public showAlert(data) {
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data)
    }

    public deleteAmount() {
        this.amountInput.string = '';
    }

    //确认充值按钮回调
    public btn1Click() {
        var amount = Number(this.amountInput.string);
        if (this.amountInput.string == '') {
            this.showAlert('充值金额不能为空!')
        } else if (amount < 1 || amount > 99999) {
            this.showAlert('不符合充值范围！')
        } else {
            if (this.results.data.is_undone == 1) {
                var node = cc.instantiate(this.CancleOrderAlert);
                var canvas = cc.find('Canvas');
                canvas.addChild(node);
                node.getComponent('CancleOrderAlert').init(this.results.data)
            } else {
                this.fetchReplacePayment()
            }

        }
    }

    //出售金币按钮回调
    btn2Click() {
        let node = cc.instantiate(this.SaleGold);
        var content = cc.find('Canvas/Recharge/Content');
        content.addChild(node);
    }

    // update (dt) {}
}
