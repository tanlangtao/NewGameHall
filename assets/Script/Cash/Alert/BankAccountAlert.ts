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
    publicAlert : cc.Prefab = null;

    @property(cc.Prefab)
    PublicInputAlert : cc.Prefab = null;

    @property(cc.Prefab)
    BankSelectItem : cc.Prefab = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.EditBox)
    nameInput: cc.EditBox = null;

    @property(cc.EditBox)
    accountInput: cc.EditBox = null;

    @property(cc.Label)
    selectLabel: cc.Label = null;

    @property(cc.Node)
    selectContent: cc.Node = null;

    @property()
    public UrlData : any = [];
    public token : string = '';
    FormData = new FormData();
    parentComponent  = null;
    showSelect = false;

    public init(data){
        var config = new Config();
        this.UrlData = config.getUrlData();
        this.token = config.token;
        this.label.string = data.text;
        this.parentComponent = data.parentComponent;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.getPublicInput();
        this.getPublicInput2();
    }

    start () {

    }

    onClick(){

        if(this.accountInput.string == '' || this.nameInput.string == ''){
            this.showAlert('姓名和卡号不能为空!')
        }else if(this.selectLabel.string == '请选择开户行'){
            this.showAlert('请选择开户行！')
        }else{
            this.fetchBindAccountPay();
            this.node.removeFromParent();
        }
    }

    fetchBindAccountPay(){
        var url = `${this.UrlData.host}/api/with_draw/bindAccountPay`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.UrlData.user_id)
        this.FormData.append('user_name',decodeURI(this.UrlData.user_name))
        this.FormData.append('withdraw_type','2')
        this.FormData.append('bank_num',this.accountInput.string)
        this.FormData.append('card_name',this.nameInput.string)
        this.FormData.append('bank_name',this.selectLabel.string)
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
                this.parentComponent.fetchIndex();
                this.parentComponent.showAlert('操作成功！')
            }else{
                this.parentComponent.showAlert(data.msg)
            }
        })
    }
    
    public showAlert(data){
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data)
    }

    public getPublicInput(){
        var PublicInputAlert = cc.instantiate(this.PublicInputAlert);
        var canvas = cc.find('Canvas');
        this.accountInput.node.on('editing-did-began',(e)=>{
            canvas.addChild(PublicInputAlert);
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text:e.string,
                input:this.accountInput
            })
        })
        this.accountInput.node.on('text-changed',(e)=>{
            //验证input 不能以0开头的整数
            this.accountInput.string = e.string.replace(/[^\d]/g,'').replace(/^0{1,}/g,'');
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text:e.string,
                input:this.accountInput
            })
        })
    }

    public getPublicInput2(){
        var PublicInputAlert = cc.instantiate(this.PublicInputAlert);
        var canvas = cc.find('Canvas');
        this.nameInput.node.on('editing-did-began',(e)=>{
            canvas.addChild(PublicInputAlert);
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text:e.string,
                input:this.nameInput
            })
        })
        this.nameInput.node.on('text-changed',(e)=>{
            //验证input 不能输入特殊字符
            var patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
            this.nameInput.string = e.string.replace(patrn,'');
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text:e.string,
                input:this.nameInput
            })
        })
    }

    selectClick(){
        var results = ['中国银行','中国农业银行','中国工商银行','中国建设银行']
        if(!this.showSelect){
            for( var i = 0 ; i < results.length ; i++){
                var node = cc.instantiate(this.BankSelectItem);
                this.selectContent.addChild(node);
                node.getComponent('BankSelectItem').init({
                    text:results[i],
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

    deleteName(){
        this.nameInput.string = '';
    }

    deleteAccount(){
        this.accountInput.string = '';
    }
    
    removeSelf(){
        this.node.removeFromParent();
    }
    // update (dt) {}
}
