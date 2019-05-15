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
    recoveryHistory: cc.Prefab = null;

    @property(cc.Prefab)
    MyOrder: cc.Prefab = null;

    @property(cc.Prefab)
    RgDh: cc.Prefab = null;

    @property(cc.Label)
    statusLabel: cc.Label = null;

    @property(cc.Label)
    saleGoldLabel: cc.Label = null;

    @property(cc.Label)
    restGoldLabel: cc.Label = null;

    @property(cc.EditBox)
    amountInput: cc.EditBox = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.EditBox)
    scaleInput: cc.EditBox = null;

    @property(cc.Label)
    scaleLabel: cc.Label = null;

    @property(cc.EditBox)
    ContactInput: cc.EditBox = null;

    @property(cc.Label)
    contactLabel: cc.Label = null;

    @property(cc.Label)
    czArea: cc.Label = null;

    @property(cc.Label)
    scaleArea: cc.Label = null;

    @property(cc.Label)
    selectLabel: cc.Label = null;

    @property(cc.Prefab)
    SelectItem: cc.Prefab = null;

    @property(cc.Node)
    selectContent: cc.Node = null;

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

        this.getPublicInput3();
    }

    start() {

    }

    selectClick() {
        if (!this.showSelect) {
            for (var i = 0; i < this.data.length; i++) {
                var node = cc.instantiate(this.SelectItem);
                this.selectContent.addChild(node);
                node.getComponent('RecoveryGoldSelectItem').init({
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
        var url = `${this.UrlData.host}/api/recycle_gold/index?user_id=${this.UrlData.user_id}&token=${this.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.results = data;
                this.init();
            } else {

            }
        })
    }

    init() {
        this.applayBtn.children[0].getComponent(cc.Label).string = '申请回收';
        //当前金币余额
        this.restGoldLabel.string = this.config.toDecimal(this.results.data.game_gold);
        this.czArea.string = `回收范围:(${this.results.data.min_amount}-${this.results.data.max_amount})`;
        this.scaleArea.string = `%  (${this.config.toDecimal1(this.results.data.min_rate*100)}-${this.config.toDecimal1(this.results.data.max_rate*100)})`;
        let data = this.results.data;
        //is_apply为1,表示提交过回收订单
        if (data.is_apply == 1) {
            //提交方式改为编辑
            this.action = 'edit';
            let status = data.user_info.status;
            //根据status判断界面显示
            this.statusLabel.string = status == 1 ? "审核中" : (status == 2 ? '挂单中' : '');
            this.saleGoldLabel.string = this.config.toDecimal(data.user_info.now_last_gold);

            if(status == 1 || status == 2){
                //根据状态决定是否显示头部文字
                this.titleBg.opacity = 255;
                //禁用input输入
                this.amountInput.node.active = false;
                this.ContactInput.node.active = false;
                this.scaleInput.node.active = false;
                //设置出售金币额度的值
                this.amountLabel.string = this.config.toDecimal(data.user_info.now_gold);
                this.current = Number(data.user_info.contact_type) - 1;
                this.selectLabel.string = this.data[this.current];
                this.scaleLabel.string = this.config.toDecimal1(data.user_info.handling_fee*100);
                this.contactLabel.string = data.user_info.contact_info;
                if(status == 2){
                    this.applayBtn.children[0].getComponent(cc.Label).string = '撤销回收';
                }
            }else {
                //根据状态决定是否显示头部文字
                this.titleBg.opacity = 0;

                this.amountInput.node.active = true;
                this.ContactInput.node.active = true;
                this.scaleInput.node.active = true;
                this.amountLabel.string = '';
                this.contactLabel.string = '';
                this.scaleLabel.string = '';
                this.ContactInput.string = data.user_info.contact_info;
            }
        }

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
        this.ContactInput.string = '';
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

    //验证密码回调type=5
    public fetchsubmitRecycleGoldInfo() {
        var url = `${this.UrlData.host}/api/recycle_gold/submitRecycleGoldInfo`;
        this.FormData = new FormData();
        this.FormData.append('user_id', this.UrlData.user_id);
        this.FormData.append('user_name', decodeURI(this.UrlData.user_name));
        this.FormData.append('gold', this.amountInput.string);
        this.FormData.append('handling_fee', this.scaleInput.string);
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
    public fetchDownRecycleGold() {
        var url = `${this.UrlData.host}/api/recycle_gold/downRecycleGold`;
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

    myOrderClick() {
        if(this.results!=null){
            this.node.destroy();
            let node = cc.instantiate(this.MyOrder);
            let content = cc.find('Canvas/Cash/Content');
            content.addChild(node);
        }


    }

    removeSelf() {
        this.node.destroy();
        let node = cc.instantiate(this.RgDh);
        let content = cc.find('Canvas/Cash/Content');
        content.addChild(node);
    }

    setPassword() {
        let node = cc.instantiate(this.SetPasswordAlert);
        let canvas = cc.find('Canvas');
        canvas.addChild(node);

    }

    historyClick() {
        let node = cc.instantiate(this.recoveryHistory);
        let content = cc.find('Canvas/Cash/Content');
        content.removeAllChildren();
        content.addChild(node);
    }

    onClick() {
        var min_amount = Number(this.results.data.min_amount);
        var max_amount = Number(this.results.data.max_amount);
        var min_rate = Number(this.results.data.min_rate)*100;
        var max_rate = Number(this.results.data.max_rate)*100;
        var amount = Number(this.amountInput.string);
        let scale = Number(this.scaleInput.string);
        let status = this.results.data.is_apply == 0 ? 0 :this.results.data.user_info.status;
        if (status == 1){
            this.showAlert('请等待审核完成！')
        }else if(status == 2){
            this.fetchDownRecycleGold();
        }else if (this.amountInput.string == '') {
            this.showAlert('回收金币不能为空！')
        } else if (this.scaleInput.string == '') {
            this.showAlert('请填写回收手续费！')
        }else if (this.ContactInput.string == '') {
            this.showAlert('请填写联系方式！')
        }else if(amount > max_amount || amount < min_amount){
            this.showAlert('回收金币超出系统范围！')
        }else if(scale > max_rate || scale < min_rate){
            this.showAlert('手续费超出系统范围！')
        }else{
            // this.showTestPassword(5);
            // 直接发出申请，不要输入密码
            this.fetchsubmitRecycleGoldInfo()
        }
    }

    // update (dt) {}
}
