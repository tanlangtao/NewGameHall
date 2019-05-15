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
    AlipayAccountAlert : cc.Prefab = null;

    @property(cc.Prefab)
    SetPasswordAlert : cc.Prefab = null;

    @property(cc.Prefab)
    ChangePasswordAlert : cc.Prefab = null;

    @property(cc.Prefab)
    TestPasswordAlert : cc.Prefab =null;

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

    @property
    public config  = null;
    public UrlData : any = [];
    public token : string = '';
    public data : any = {};
    public FormData = new FormData();
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
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
                
            }
        })
    }
    
    init(){
        var data = this.data.data;
        let channel = this.data.data.withDraw_info.alipay.channel[0];
        this.amountLabel.string = this.config.toDecimal(data.game_gold);
        this.czArea.string = `兑换范围:(${channel.min_amount} - ${channel.max_amount})`;
        this.accountLabel.string = data.alipay_account != '' ? this.config.testBankNum(data.alipay_account) :'未绑定';

        this.passworldLabel.string = data.is_password == 1 ? '已设置' : '未设置';
        this.btn1.string = data.alipay_account != ''? '去修改' : '去绑定';
        this.btn2.string = data.is_password == 1 ? '去修改' : '去设置';
    }

    //selectItem回调
    public initRender(){
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
        var node = cc.instantiate(this.AlipayAccountAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('AlipayAccountAlert').init({
            text:this.btn1.string == '去修改' ?'修改账户'  : '绑定账户',
            parentComponent:this
        })

    }
    //验证密码回调type=2
    public fetchwithDrawApply(){
        var url = `${this.UrlData.host}/api/with_draw/withDrawApply`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.UrlData.user_id)
        this.FormData.append('user_name',decodeURI(this.UrlData.user_name))
        this.FormData.append('amount',this.amountInput.string)
        this.FormData.append('order_type',`1`);
        this.FormData.append('withdraw_type',`1`);
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
        let channel = this.data.data.withDraw_info.alipay.channel[0];
        var minAmount = Number(channel.min_amount);
        var maxAmount = Number(channel.max_amount);
        if(this.data.data.is_password == 0){
            this.showAlert('请先设置资金密码!')
        }else if(this.data.data.alipay_account == ''){
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
