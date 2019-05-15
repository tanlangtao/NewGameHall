// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Config from "../../Config";

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

    @property(cc.Prefab)
    Dc: cc.Prefab = null;

    @property(cc.Label)
    statusLabel: cc.Label = null;

    @property(cc.Label)
    saleGoldLabel: cc.Label = null;

    @property(cc.Label)
    restGoldLabel: cc.Label = null;


    @property(cc.EditBox)
    amountInput: cc.EditBox = null;

    @property(cc.EditBox)
    ContactInput: cc.EditBox = null;

    @property(cc.Label)
    contactLabel: cc.Label = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    czArea: cc.Label = null;

    @property(cc.Label)
    selectLabel: cc.Label = null;

    @property(cc.Label)
    applayBtnLabel:cc.Label = null;

    @property(cc.Prefab)
    SelectItem: cc.Prefab = null;

    @property(cc.Node)
    selectContent: cc.Node = null;

    @property(cc.Label)
    passwordLabel: cc.Label = null;

    @property(cc.Node)
    btn1: cc.Node = null;

    @property(cc.Node)
    applayBtn: cc.Node = null;

    @property(cc.Node)
    titleBg: cc.Node = null;

    @property
    showSelect = false;
    results = null;
    current = 0;
    action = 'add';
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
        var url = `${this.UrlData.host}/api/sell_gold/index?user_id=${this.UrlData.user_id}&token=${this.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.results = data;
                this.init();
            } else {
                this.showAlert(data.msg);
            }
        }).catch((error)=>{
            this.showAlert(`错误${error}`)
        })
    }

    init() {
         this.applayBtnLabel.string = '申请上架';
        let data = this.results.data;

        //is_apply为1,表示提交过卖分
        if(data.is_apply == 1){
            //提交方式改为编辑
            this.action = 'edit';
            let status = data.user_info.status;
            //根据status判断界面显示
            this.statusLabel.string = status == 1 || status == 2 ? "审核中" :(status == 4 ? '挂单中':'' );
            if(status == 1|| status == 2 || status == 4){
                //根据状态决定是否显示头部文字
                this.titleBg.opacity = 255;

                this.saleGoldLabel.string = this.config.toDecimal(data.user_info.now_up_last_gold);
                //禁用input输入
                this.amountInput.node.active = false;
                this.ContactInput.node.active = false;
                //出售金币额度
                this.amountLabel.string = this.config.toDecimal(data.user_info.now_up_gold);
                this.current = Number(data.user_info.contact_type)-1;
                this.selectLabel.string = this.data[this.current];
                this.contactLabel.string = data.user_info.contact_info;
                //status == 4,审核通过
                if(status == 4){
                    this.applayBtnLabel.string = '撤销上架';
                }
            }else{
                //根据状态决定是否显示头部文字
                this.titleBg.opacity = 0;

                this.saleGoldLabel.string = this.config.toDecimal(data.user_info.now_up_last_gold);
                this.amountInput.node.active = true;
                this.ContactInput.node.active = true;
                //非上架或等待上架，销售金额为0
                this.saleGoldLabel.string = '0';
                this.amountLabel.string = '';
                this.contactLabel.string = '';
                this.current = Number(data.user_info.contact_type)-1;
                this.ContactInput.string = data.user_info.contact_info;
            }

        }
        //可用金币
        this.restGoldLabel.string = this.config.toDecimal(data.game_gold);
        //密码是否已设置显示
        this.passwordLabel.string = data.is_password == 0 ? '未设置' : '已设置';
        //设置密码按钮是否启用
        this.btn1.active = data.is_password == 0 ? true :false;
        // 出售范围
        this.czArea.string = `出售范围(${data.min_amount}-${data.max_amount})`;
    }

    //selectItem回调,切换联系方式
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

    public getPublicInput2() {
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

    //验证密码弹窗
    showTestPassword(type) {
        var node = cc.instantiate(this.TestPasswordAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('TestPasswordAlert').init({
            parentComponent: this,
            type: type
        })
    }

    //验证密码回调type=4
    public fetchSell_gold() {
        var url = `${this.UrlData.host}/api/sell_gold/submitSellGoldInfo`;
        this.FormData = new FormData();
        this.FormData.append('user_id', this.UrlData.user_id);
        this.FormData.append('user_name', decodeURI(this.UrlData.user_name));
        this.FormData.append('gold', this.amountInput.string);
        this.FormData.append('contact_type', `${this.current+1}`);
        this.FormData.append('contact_info', this.ContactInput.string);
        this.FormData.append('action_type', this.action);
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
                this.showAlert('申请成功！');
                this.initRender();
            } else {
                this.showAlert(data.msg)
            }
        })
    }
    //撤销上架
    public fetchDownSellGold() {
        var url = `${this.UrlData.host}/api/sell_gold/downSellGold`;
        this.FormData = new FormData();
        this.FormData.append('user_id', this.UrlData.user_id);
        this.FormData.append('token', this.token);
        fetch(url, {
            method: 'POST',
            body: this.FormData
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.showAlert('撤销成功！');
                this.initRender()
            } else {
                this.showAlert(data.msg)
            }
        })
    }
    //点击事件回调


    deleteAmount() {
        this.amountInput.string = '';
    }

    deleteContact() {
        this.ContactInput.string = '';
    }

    myOrderClick() {
        if(this.results!= null) {
            this.node.destroy();
            let node = cc.instantiate(this.MyOrder);
            let content = cc.find('Canvas/Recharge/Content');
            content.addChild(node);
        }

    }

    removeSelf() {
        this.node.destroy();
        let node = cc.instantiate(this.Dc);
        let content = cc.find('Canvas/Recharge/Content');
        content.addChild(node);
    }

    setPassword() {
        let node = cc.instantiate(this.SetPasswordAlert);
        let canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('SetPasswordAlert').init({
            parentComponent:this
        })
    }

    historyClick() {
        let node = cc.instantiate(this.SaleGoldHistory);
        let content = cc.find('Canvas/Recharge/Content');
        content.removeAllChildren();
        content.addChild(node);
    }

    onClick() {
        let amount = Number(this.amountInput.string);
        let min_amount = Number(this.results.data.min_amount) || 1;
        let max_amount = Number(this.results.data.max_amount) || 1;
        let game_gold = Number(this.results.data.game_gold);
        let status = this.results.data.is_apply == 0 ? 0 :this.results.data.user_info.status;
        if (status == 1 || status == 2){
            this.showAlert('请等待审核完成！')
        }else if(status == 4){
            this.fetchDownSellGold();
        }else if(this.results.data.is_password == 0) {
            this.showAlert('请先设置资金密码！')
        }else if(this.amountInput.string == '') {
            this.showAlert('出售金币数量不能为空！')
        }else if(amount > game_gold ){
            this.showAlert('上架金币大于可用金币余额！')
        }else if(amount > max_amount || amount < min_amount){
            this.showAlert('不符合出售范围！')
        }else if (this.ContactInput.string == '') {
            this.showAlert('请填写联系方式！')
        }else{
            this.showTestPassword(4);
        }
    }

    // update (dt) {}
}
