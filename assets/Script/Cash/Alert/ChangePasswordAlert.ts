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

    @property(cc.EditBox)
    oldPasswordInput: cc.EditBox = null;

    @property(cc.EditBox)
    newPasswordInput: cc.EditBox = null;

    @property(cc.EditBox)
    repeatPasswordInput: cc.EditBox = null;

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
        this.parentComponent = data.parentComponent;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.getPublicInput(this.oldPasswordInput);
        this.getPublicInput(this.newPasswordInput);
        this.getPublicInput(this.repeatPasswordInput);
    }

    start () {

    }

    onClick(){

        if(this.oldPasswordInput.string == '' || this.newPasswordInput.string == ''|| this.repeatPasswordInput.string == ''){
            this.showAlert('密码不能为空!')
        }else if(this.newPasswordInput.string.length < 6 || this.newPasswordInput.string.length > 10){
            this.showAlert('请设置6-10位新密码！')
        }else if(this.newPasswordInput.string != this.repeatPasswordInput.string){
            this.showAlert('两次密码输入不一致！')
        }else{
            this.fetchBindAccountPay();
            this.node.removeFromParent();
        }
    }

    fetchBindAccountPay(){
        var url = `${this.UrlData.host}/api/user_funds_password/updatePassword`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.UrlData.user_id)
        this.FormData.append('old_password',this.oldPasswordInput.string)
        this.FormData.append('password',this.newPasswordInput.string)
        this.FormData.append('token',this.token);
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

    public getPublicInput(input){
        var PublicInputAlert = cc.instantiate(this.PublicInputAlert);
        var canvas = cc.find('Canvas');
        input.node.on('editing-did-began',(e)=>{
            canvas.addChild(PublicInputAlert);
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text:e.string,
                input:input
            })
        })
        input.node.on('text-changed',(e)=>{
            input.string = e.string;
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text:e.string,
                input:input
            })
        })
    }
    deleteOld(){
        this.oldPasswordInput.string = '';
    }

    deleteNew(){
        this.newPasswordInput.string = '';
    }

    deleteRepeat(){
        this.repeatPasswordInput.string = '';
    }
    
    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
