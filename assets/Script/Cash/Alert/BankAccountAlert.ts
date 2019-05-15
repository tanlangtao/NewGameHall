// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Config from '../../Config'

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    publicAlert: cc.Prefab = null;

    @property(cc.Prefab)
    PublicInputAlert: cc.Prefab = null;

    @property(cc.Prefab)
    BankSelectItem: cc.Prefab = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.EditBox)
    nameInput: cc.EditBox = null;

    @property(cc.EditBox)
    accountInput: cc.EditBox = null;

    @property(cc.EditBox)
    bankNameInput: cc.EditBox = null;

    @property(cc.Label)
    selectLabel: cc.Label = null;

    @property(cc.Node)
    selectContent: cc.Node = null;

    @property()
    public UrlData: any = [];
    public token: string = '';
    FormData = new FormData();
    showSelect = false;
    action = 'add';
    itemId = null;
    app = null;

    public init(data) {
        var config = new Config();
        this.UrlData = config.getUrlData();
        this.token = config.token;
        this.label.string = data.text;
        this.action = data.action;
        this.itemId = data.itemId;
    }

    changeContent(data){
        this.accountInput.string = data.card_num;
        this.nameInput.string = data.card_name;
        this.selectLabel.string = data.bank_name;
        this.bankNameInput.string = data.branch_name;
    }

    onLoad() {
        this.app = cc.find('Canvas/Main').getComponent('Main');
        this.getPublicInput();
        this.getPublicInput2(this.nameInput);
        this.getPublicInput2(this.bankNameInput);
    }

    onClick() {

        if (this.accountInput.string == '' || this.nameInput.string == '') {
            this.showAlert('姓名和卡号不能为空!')
        } else if (this.selectLabel.string == '请选择银行') {
            this.showAlert('请选择银行！')
        } else if (this.bankNameInput.string == '') {
            this.showAlert('开户行不能为空！')
        } else {
            this.fetchBindAccountPay();
            this.node.removeFromParent();
        }
    }

    fetchBindAccountPay() {
        var url = `${this.UrlData.host}/api/payment_account/saveAccount`;
        let obj = {
            card_num:this.accountInput.string,
            card_name:this.nameInput.string,
            bank_name:this.selectLabel.string,
            branch_name:this.bankNameInput.string,
        };
        let info = JSON.stringify(obj);
        this.FormData= new FormData();
        this.FormData.append('user_id',this.UrlData.user_id);
        this.FormData.append('user_name',decodeURI(this.UrlData.user_name));
        this.FormData.append('action',this.action);
        this.FormData.append('type','3');
        this.FormData.append('info',info);
        this.FormData.append('client', this.UrlData.client);
        this.FormData.append('proxy_user_id', this.UrlData.proxy_user_id);
        this.FormData.append('proxy_name', decodeURI(this.UrlData.proxy_name));
        this.FormData.append('package_id', this.UrlData.package_id);
        this.FormData.append('token',this.token);
        if(this.action == 'edit'){
            this.FormData.append('id',this.itemId);
        }

        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                let bankCom = cc.find('Canvas/Cash/Content/BankDh').getComponent('BankDh');
                bankCom.fetchIndex();
                this.app.showAlert('操作成功!')
            }else{
                this.app.showAlert(data.msg)
            }
        })
    }

    public showAlert(data) {
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data)
    }

    public getPublicInput() {
        var PublicInputAlert = cc.instantiate(this.PublicInputAlert);
        var canvas = cc.find('Canvas');
        this.accountInput.node.on('editing-did-began', (e) => {
            canvas.addChild(PublicInputAlert);
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text: e.string,
                input: this.accountInput
            })
        })
        this.accountInput.node.on('text-changed', (e) => {
            //验证input 不能以0开头的整数
            this.accountInput.string = e.string.replace(/[^\d]/g, '').replace(/^0{1,}/g, '');
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text: e.string,
                input: this.accountInput
            })
        })
    }

    public getPublicInput2(input) {
        var PublicInputAlert = cc.instantiate(this.PublicInputAlert);
        var canvas = cc.find('Canvas');
        input.node.on('editing-did-began', (e) => {
            canvas.addChild(PublicInputAlert);
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text: e.string,
                input: input
            })
        })
        input.node.on('text-changed', (e) => {
            //验证input 不能输入特殊字符
            var patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
            input.string = e.string.replace(patrn, '');
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text: e.string,
                input: input
            })
        })
    }

    selectClick() {
        var results = ['中国农业银行', '交通银行', '中国建设银行', '兴业银行', '民生银行', '中信银行', '华夏银行', '中国工商银行', '浦发银行', '招商银行', '中国银行']
        if (!this.showSelect) {
            for (var i = 0; i < results.length; i++) {
                var node = cc.instantiate(this.BankSelectItem);
                this.selectContent.addChild(node);
                node.getComponent('BankSelectItem').init({
                    text: results[i],
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

    deleteName() {
        this.nameInput.string = '';
    }

    deleteAccount() {
        this.accountInput.string = '';
    }

    deleteBankName() {
        this.bankNameInput.string = '';
    }

    removeSelf() {
        this.node.destroy();
    }

    // update (dt) {}
}
