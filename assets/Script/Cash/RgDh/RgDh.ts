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
    SetPasswordAlert : cc.Prefab = null;

    @property(cc.Prefab)
    ChangePasswordAlert : cc.Prefab = null;

    @property(cc.Prefab)
    TestPasswordAlert : cc.Prefab =null;

    @property(cc.Prefab)
    RecoveryGold : cc.Prefab =null;

    @property(cc.Prefab)
    service : cc.Prefab =null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.EditBox)
    amountInput: cc.EditBox = null;

    @property(cc.EditBox)
    scaleInput: cc.EditBox = null;

    @property(cc.Label)
    czArea: cc.Label = null;

    @property(cc.Label)
    passworldLabel: cc.Label = null;

    @property(cc.Label)
    btn1: cc.Label = null;


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

        this.getPublicInput();
        this.getPublicInput2();

        this.fetchIndex();

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
        }).catch((error)=>{
            this.showAlert(`错误${error}`)
        })
    }

    init(){
        var data = this.data.data;
        if(!this.data.data.withDraw_info) return;
        var replace_withdraw = this.data.data.withDraw_info.replace_withdraw;
        this.amountLabel.string = this.config.toDecimal(data.game_gold);
        this.czArea.string = `兑换范围:(${replace_withdraw.min_amount} - ${replace_withdraw.max_amount})`;
        this.passworldLabel.string = data.is_password == 1 ? '已设置' : '未设置';
        this.btn1.string = data.is_password == 1 ? '去修改' : '去设置';
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


    public showAlert(data){
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data)
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
    //验证密码回调type=3
    public fetchRgDh(){
        var url = `${this.UrlData.host}/api/with_draw/withDrawReplaceApply`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.UrlData.user_id)
        this.FormData.append('user_name',decodeURI(this.UrlData.user_name))
        this.FormData.append('amount',this.amountInput.string)
        this.FormData.append('handling_fee',this.scaleInput.string)
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
                this.showAlert('申请成功！')
                var node = cc.instantiate(this.service);
                var content = cc.find('Canvas/Cash/Content');
                content.addChild(node);
                node.getComponent('Service').init({
                    results: data,
                    parentComponent: this
                })
            }else{
                this.showAlert(data.msg)
            }
        })
    }

    passwordClick(){
        if(this.data.data.is_password == 1){
            var node = cc.instantiate(this.ChangePasswordAlert);
            var canvas = cc.find('Canvas');
            canvas.addChild(node);
            node.getComponent('ChangePasswordAlert').init({
                parentComponent:this
            });
        }else{
            var node = cc.instantiate(this.SetPasswordAlert);
            var canvas = cc.find('Canvas');
            canvas.addChild(node);
            node.getComponent('SetPasswordAlert').init({
                parentComponent:this
            })
        }
    }

    deleteAmount(){
        this.amountInput.string = '';
    }

    deleteScale() {
        this.scaleInput.string = '';
    }

    recoveryClick(){
        if(this.data.data.is_password == 0){
            this.showAlert('请先设置资金密码！')
        }else{
            var node = cc.instantiate(this.RecoveryGold);
            var content = cc.find('Canvas/Cash/Content');
            content.removeAllChildren();
            content.addChild(node);
        }

    }
    onClick(){
        var amount = Number(this.amountInput.string);
        var gold = Number(this.amountLabel.string);
        var scale = Number(this.scaleInput.string);
        var replace_withdraw = this.data.data.withDraw_info.replace_withdraw;
        var minAmount = Number(replace_withdraw.min_amount);
        var maxAmount = Number(replace_withdraw.max_amount);

        if(this.data.data.is_password == 0){
            this.showAlert('请先设置资金密码!')
        }else if(this.amountInput.string == ''){
            this.showAlert('兑换金额不能为空！')
        }else if(this.scaleInput.string ==''){
            this.showAlert('兑换手续费不能为空！')
        }else if(amount > gold){
            this.showAlert('兑换金额大于账户余额！')
        }else if(amount % minAmount != 0){
            this.showAlert(`兑换金额必须是${minAmount}的倍数!`)
        }else if(amount < minAmount || amount >maxAmount){
            this.showAlert('超出兑换范围!')
        }else if(scale < 0.1 ){
            this.showAlert('手续费不能小于等于0!')
        }else if(scale > 99.9 ){
            this.showAlert('手续费不能大于99.9%!')
        }else{
            this.showTestPassword(3);
        }
    }
    // update (dt) {}
}
