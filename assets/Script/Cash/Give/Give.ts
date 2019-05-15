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
    GiveHistory : cc.Prefab =null;

    @property(cc.Prefab)
    ReceiveHistory : cc.Prefab =null;

    @property(cc.Prefab)
    GiveUserAlert : cc.Prefab =null;

    @property(cc.Label)
    goldLabel: cc.Label = null;

    @property(cc.EditBox)
    idInput: cc.EditBox = null;

    @property(cc.EditBox)
    amountInput: cc.EditBox = null;

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
    public searchData : any = {};
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

            }
        })
    }


    init(){
        var data = this.data.data;
        let given = data.withDraw_info.given;
        this.goldLabel.string = this.config.toDecimal(data.game_gold);
        this.czArea.string = `赠送范围:(${given.min_amount} - ${given.max_amount})`;
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
        this.idInput.node.on('editing-did-began',(e)=>{
            canvas.addChild(PublicInputAlert);
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text:e.string,
                input:this.idInput
            })
        })
        this.idInput.node.on('text-changed',(e)=>{
            //验证input 不能以0开头的整数
            this.idInput.string = e.string.replace(/[^\d]/g,'').replace(/^0{1,}/g,'');
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text:e.string,
                input:this.idInput
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
    //验证密码回调type=6
    public fetchGive(){
        var url = `${this.UrlData.host}/api/give/giveAmount`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.UrlData.user_id)
        this.FormData.append('user_name',decodeURI(this.UrlData.user_name))
        this.FormData.append('amount',this.amountInput.string)
        this.FormData.append('by_id',this.idInput.string)
        this.FormData.append('by_name',this.searchData.data.game_nick)
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
                this.showAlert('赠送成功！');
                this.fetchIndex();
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
    giveHistoryClick(){
        let node = cc.instantiate(this.GiveHistory);
        let content = cc.find('Canvas/Cash/Content');
        content.addChild(node);
    }

    receiveHistoryClick(){
        let node = cc.instantiate(this.ReceiveHistory);
        let content = cc.find('Canvas/Cash/Content');
        content.addChild(node);
    }

    deleteAmount(){
        this.amountInput.string = '';
    }

    deleteId() {
        this.idInput.string = '';
    }

    showGiveUserAlert(){
        var node = cc.instantiate(this.GiveUserAlert);
        var canvas = cc.find('Canvas');

        var url = `${this.UrlData.host}/api/give/searchByUser?by_id=${this.idInput.string}&token=${this.token}`;
        fetch(url,{
            method:'get'
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.searchData = data;
                canvas.addChild(node);
                node.getComponent('GiveUserAlert').init({
                    data:data.data,
                    gold:this.amountInput.string,
                    parentComponent:this
                })
            }else{
                this.showAlert(data.msg)
            }
        })

    }

    onClick(){
        var amount = Number(this.amountInput.string);
        let given = this.data.data.withDraw_info.given;
        var minAmount = Number(given.min_amount);
        var maxAmount = Number(given.max_amount);
        if(this.data.data.is_password == 0){
            this.showAlert('请先设置资金密码!')
        }else if(this.idInput.string ==''){
            this.showAlert('赠送ID不能为空！')
        }else if(this.amountInput.string == ''){
            this.showAlert('赠送金额不能为空！')
        }else if(amount % minAmount != 0){
            this.showAlert(`赠送金额必须是${minAmount}的倍数!`)
        }else if(amount > this.data.data.game_gold){
            this.showAlert(`赠送金额不能大于金币余额!`)
        }else if(amount < minAmount || amount >maxAmount){
            this.showAlert('超出赠送范围!')
        }else{
            this.showGiveUserAlert();
        }
    }
    // update (dt) {}
}
