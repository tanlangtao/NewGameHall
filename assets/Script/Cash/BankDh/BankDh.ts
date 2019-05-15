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
    PublicInputAlert : cc.Prefab = null;

    @property(cc.Prefab)
    publicAlert : cc.Prefab = null;

    @property(cc.Prefab)
    BankAccountAlert :cc.Prefab = null;

    @property(cc.Prefab)
    SetPasswordAlert : cc.Prefab = null;

    @property(cc.Prefab)
    ChangePasswordAlert : cc.Prefab = null;

    @property(cc.Prefab)
    TestPasswordAlert : cc.Prefab =null;

    @property(cc.Prefab)
    SelectItem : cc.Prefab =null;

    @property(cc.Label)
    SelectLabel : cc.Label = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;
    
    @property(cc.EditBox)
    amountInput: cc.EditBox = null;

    @property(cc.Label)
    czArea: cc.Label = null;
    @property(cc.Label)
    accountLabel: cc.Label = null;

    @property(cc.Label)
    passworldLabel: cc.Label = null;

    @property(cc.Label)
    btn1: cc.Label = null;

    @property(cc.Label)
    btn2: cc.Label = null;

    @property(cc.Node)
    selectContent :cc.Node = null;

    @property(cc.Node)
    selectBankContent: cc.Node = null;

    @property(cc.Prefab)
    sellSelectItem : cc.Prefab = null;

    @property
    public config  = null;
    public UrlData : any = [];
    public token : string = '';
    public data : any = {};
    public FormData = new FormData();
    public showSelect = false;
    public results= null ;
    public current = {channel_name: "银行卡1",
        channel_type: "2",
        max_amount: "40000",
        min_amount: "1"};
    //当前选择的银行卡信息
    public Info = null;
    public bankData = [];
    public showBankSelect = false;
    public bankId = null;
    public action = 'add';
    app = null;
    onLoad () {
        this.app = cc.find('Canvas/Main').getComponent('Main');
        this.config = new Config();
        this.UrlData = this.config.getUrlData();
        this.token = this.config.token;
        this.initRender();
        this.getPublicInput();
    }

    start () {

    }

    public fetchIndex(){
        var url = `${this.UrlData.host}/api/with_draw/index?user_id=${this.UrlData.user_id}&token=${this.token}`;
        fetch(url,{
            method:'get'
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.data = data;
                this.init();
            }else{
                this.showAlert(data.msg)
            }
        })
    }
    
    init(){
        this.bankData = [] ;
        var data = this.data.data;
        for(let i = 0 ;i < data.list.length ;i++){
            let data = this.data.data.list[i];
            if (data.type == 3){
                this.bankData.push(data)
            }
        }
        if(this.bankData.length>0){
            this.Info =JSON.parse(this.bankData[0].info)
            this.bankId = this.bankData[0].id;
        }
        this.action = this.bankData.length != 0 ? 'edit' :'add'
        this.results = this.data.data.withDraw_info.bankcard.channel;
        this.amountLabel.string = this.config.toDecimal(data.game_gold);
        this.czArea.string = `兑换范围:(${this.current.min_amount} - ${this.current.max_amount})`;
        this.accountLabel.string = this.bankData.length != 0 ? this.config.testBankNum(this.Info.card_num) :'未设置';
        this.passworldLabel.string = data.is_password == 1 ? '已设置' : '未设置';
        this.btn1.string = this.bankData.length != 0  ? '去修改' : '未设置';
        this.btn2.string = data.is_password == 1 ? '去修改' : '去设置';
    }
    selectBankClick(){
        if(this.bankData.length == 0) {
            this.app.showAlert('未设置银行卡');
            return;
        }
        this.selectContent.removeAllChildren();
        if(!this.showBankSelect ){
            for( var i = 0 ; i < this.bankData.length ; i++){
                var node = cc.instantiate(this.sellSelectItem);
                this.selectBankContent.addChild(node);
                node.getComponent('SellSelectItem').init({
                    text:JSON.parse(this.bankData[i].info).card_num,
                    Label:this.accountLabel,
                    showSelect:this.showBankSelect,
                    selectContent:this.selectBankContent,
                    data:this.bankData[i],
                    parentCom:this
                })
            }
            this.showBankSelect = true;
        }else{
            this.selectBankContent.removeAllChildren();
            this.showBankSelect = false;
        }
    }

    //selectItem回调
    public initRender(){
        this.SelectLabel.string = this.current.channel_name;
        this.fetchIndex();
    }

    public getPublicInput(){
        var PublicInputAlert = cc.instantiate(this.PublicInputAlert);
        var canvas = cc.find('Canvas');
        this.amountInput.node.on('editing-did-began',(e)=>{
            canvas.addChild(PublicInputAlert);
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text:e.string,
                input:this.amountInput
            })
        })
        this.amountInput.node.on('text-changed',(e)=>{
            //验证input 不能以0开头的整数
            this.amountInput.string = e.string.replace(/[^\d]/g,'').replace(/^0{1,}/g,'');
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text:e.string,
                input:this.amountInput
            })
        })
    }

    public showAlert(data){
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data)
    }

    deleteAmount(){
        this.amountInput.string = '';
    }
    //验证密码
    showTestPassword(type){
        var node = cc.instantiate(this.TestPasswordAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('TestPasswordAlert').init({
            parentComponent:this,
            type : type
        })
    }
    //验证密码回调type=1
    showAccountAlert(){
        this.app.showBankAccountAlert({
            text:this.bankData.length != 0  ?'修改银行卡' : '设置银行卡',
            action:this.action,
            itemId:this.bankId,
            parentComponent:this,
            //修改界面初始数据
            changeData:this.Info
        });
    }
    //验证密码回调type=2
    public fetchwithDrawApply(){
        var url = `${this.UrlData.host}/api/with_draw/withDrawApply`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.UrlData.user_id)
        this.FormData.append('user_name',decodeURI(this.UrlData.user_name))
        this.FormData.append('account_id',this.bankId);
        this.FormData.append('amount',this.amountInput.string)
        this.FormData.append('order_type',this.current.channel_type);
        this.FormData.append('withdraw_type',`2`);
        this.FormData.append('client',this.UrlData.client)
        this.FormData.append('proxy_user_id',this.UrlData.proxy_user_id)
        this.FormData.append('proxy_name',decodeURI(this.UrlData.proxy_name))
        this.FormData.append('package_id',this.UrlData.package_id)
        this.FormData.append('token',this.token)
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.showAlert('申请成功！');
                this.fetchIndex();
            }else{
                this.showAlert(data.msg)
            }
        })
    }
    selectClick(){
        if(!this.showSelect){
            for( var i = 0 ; i < this.results.length ; i++){
                var node = cc.instantiate(this.SelectItem);
                this.selectContent.addChild(node);
                node.getComponent('SelectItem').init({
                    text:this.results[i].channel_name,
                    parentComponent:this,
                    index:i
                })
            }
            this.showSelect = true;
        }else{
            this.selectContent.removeAllChildren();
            this.showSelect = false;
        }
    }
    btn1Click(){
        if(this.data.data.is_password == 1){
            this.showTestPassword(1);
        }else{
            this.showAlert('请先设置资金密码!')
        }
        
    }

    btn2Click(){
        if(this.data.data.is_password == 1){
            var node = cc.instantiate(this.ChangePasswordAlert);
            var canvas = cc.find('Canvas');
            canvas.addChild(node);
            node.getComponent('ChangePasswordAlert').init({
                parentComponent:this
            })
        }else{
            var node = cc.instantiate(this.SetPasswordAlert);
            var canvas = cc.find('Canvas');
            canvas.addChild(node);
            node.getComponent('SetPasswordAlert').init({
                parentComponent:this
            })
        }
    }

    onClick(){
        var amount = Number(this.amountInput.string);
        var minAmount = Number(this.current.min_amount);
        var maxAmount = Number(this.current.max_amount);

        if(this.data.data.is_password == 0){
            this.showAlert('请先设置资金密码!')
        }else if(this.data.data.bank_num == ''){
            this.showAlert('请先绑定账户!')
        }else if(this.amountInput.string == ''){
            this.showAlert('兑换金额不能为空！')
        }else if(amount % minAmount != 0){
            this.showAlert(`兑换金额必须是${minAmount}的倍数!`)
        }else if(amount < minAmount || amount >maxAmount){
            this.showAlert('超出兑换范围!')
        }else{
            this.showTestPassword(2);
        }
    }
    // update (dt) {}
}
