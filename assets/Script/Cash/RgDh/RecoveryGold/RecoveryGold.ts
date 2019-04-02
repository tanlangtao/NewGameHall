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
    @property(cc.Prefab)
    PublicInputAlert: cc.Prefab = null;

    @property(cc.Prefab)
    publicAlert: cc.Prefab = null;

    @property(cc.Prefab)
    SetPasswordAlert: cc.Prefab = null;

    @property(cc.Prefab)
    TestPasswordAlert: cc.Prefab = null;

    @property(cc.Prefab)
    SaleGoldHistory: cc.Prefab = null;

    @property(cc.Prefab)
    MyOrder: cc.Prefab = null;

    @property(cc.Label)
    saleGoldLabel: cc.Label = null;

    @property(cc.Label)
    restGoldLabel: cc.Label = null;

    @property(cc.EditBox)
    amountInput: cc.EditBox = null;

    @property(cc.EditBox)
    scaleInput: cc.EditBox = null;

    @property(cc.EditBox)
    ContactInput: cc.EditBox = null;

    @property(cc.Label)
    czArea: cc.Label = null;

    @property(cc.Label)
    selectLabel: cc.Label = null;

    @property(cc.Prefab)
    SelectItem: cc.Prefab = null;

    @property(cc.Node)
    selectContent: cc.Node = null;

    @property(cc.Node)
    btn1: cc.Node = null;

    @property
    showSelect = false;
    results = null;
    current = 1;
    public config = null;
    public UrlData: any = [];
    public token: string = '';
    public data: any = {};
    public FormData = new FormData();

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.config = new Config();
        this.UrlData = this.config.getUrlData();
        this.token = this.config.token;

        this.data = ['微信', 'QQ'];

        this.initRender();

        this.getPublicInput();

        this.getPublicInput2();

        this.getPublicInput3();
    }

    start() {

    }

    selectClick() {
        if (!this.showSelect) {
            for (var i = 0; i < this.data.length; i++) {
                var node = cc.instantiate(this.SelectItem);
                this.selectContent.addChild(node);
                node.getComponent('GoldSelectItem').init({
                    text: this.data[i],
                    parentComponent: this,
                    index: i
                })
            }
            this.showSelect = true;
        } else {
            this.selectContent.removeAllChildren();
            this.showSelect = false;
        }
    }

    public fetchIndex() {
        var url = `${this.UrlData.host}/api/with_draw/index?user_id=${this.UrlData.user_id}&withdraw_type=${this.current}&token=${this.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.results = data;
                cc.log(data);
                this.init();
            } else {

            }
        })
    }

    init() {
    }

    //selectItem回调
    public initRender() {
        this.selectLabel.string = this.data[this.current];
        this.fetchIndex();
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

    public getPublicInput2(){
        var PublicInputAlert = cc.instantiate(this.PublicInputAlert);
        var canvas = cc.find('Canvas');
        this.scaleInput.node.on('editing-did-began',(e)=>{
            canvas.addChild(PublicInputAlert);
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text:e.string,
                input:this.scaleInput
            })
        })
        this.scaleInput.node.on('text-changed',(e)=>{
            //验证input,可以输入一位小数
            let reg = /^\d{0,8}\.{0,1}(\d{0,1})?$/;
            this.scaleInput.string = !reg.test(e.string) ? '' :e.string ;
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text:e.string,
                input:this.scaleInput
            })
        })
    }

    public getPublicInput3() {
        var PublicInputAlert = cc.instantiate(this.PublicInputAlert);
        var canvas = cc.find('Canvas');
        this.ContactInput.node.on('editing-did-began', (e) => {
            canvas.addChild(PublicInputAlert);
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text: e.string,
                input: this.ContactInput
            })
        })
        this.ContactInput.node.on('text-changed', (e) => {
            //验证input 不能以0开头的整数
            this.ContactInput.string = e.string.replace(/[^\d]/g, '').replace(/^0{1,}/g, '');
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text: e.string,
                input: this.ContactInput
            })
        })
    }


    public showAlert(data) {
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data)
    }

    deleteAmount() {
        this.amountInput.string = '';
    }

    deleteScale() {
        this.scaleInput.string = '';
    }

    deleteContact() {
        this.amountInput.string = '';
    }

    //验证密码
    showTestPassword(type) {
        var node = cc.instantiate(this.TestPasswordAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('TestPasswordAlert').init({
            parentComponent: this,
            type: type
        })
    }

    //验证密码回调type=3
    public fetchwithDrawApply(pay_password) {
        var url = `${this.UrlData.host}/api/with_draw/withDrawApply`;
        this.FormData = new FormData();
        this.FormData.append('user_id', this.UrlData.user_id);
        this.FormData.append('user_name', decodeURI(this.UrlData.user_name));
        this.FormData.append('amount', this.amountInput.string);
        this.FormData.append('withdraw_type', `${this.current}`);
        this.FormData.append('pay_password', pay_password);
        this.FormData.append('client', this.UrlData.client);
        this.FormData.append('proxy_user_id', this.UrlData.proxy_user_id);
        this.FormData.append('proxy_name', decodeURI(this.UrlData.proxy_name));
        this.FormData.append('package_id', this.UrlData.package_id);
        this.FormData.append('token', this.token);
        fetch(url, {
            method: 'POST',
            body: this.FormData
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.showAlert('申请成功！')
            } else {
                this.showAlert(data.msg)
            }
        })
    }

    myOrderClick() {
        this.node.removeFromParent();
        let node = cc.instantiate(this.MyOrder);
        let content = cc.find('Canvas/Cash/Content');
        content.addChild(node);

    }

    removeSelf() {
        this.node.removeFromParent();
    }

    setPassword() {
        let node = cc.instantiate(this.SetPasswordAlert);
        let canvas = cc.find('Canvas');
        canvas.addChild(node);

    }

    historyClick() {
        let node = cc.instantiate(this.SaleGoldHistory);
        let canvas = cc.find('Canvas');
        canvas.addChild(node);
    }

    onClick() {
        if (this.amountInput.string == '') {
            this.showAlert('出售金币数量不能为空！')
        } else if (this.scaleInput.string == '') {
            this.showAlert('请填写回收手续费！')
        }else if (this.ContactInput.string == '') {
            this.showAlert('请填写联系方式！')
        }else{
            this.showTestPassword(3);
        }
    }

    // update (dt) {}
}
