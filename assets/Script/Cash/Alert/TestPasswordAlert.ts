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
    passwordInput: cc.EditBox = null;

    @property()
    public UrlData : any = [];
    public token : string = '';
    FormData = new FormData();
    parentComponent  = null;
    showSelect = false;
    type  = null;

    public init(data){
        var config = new Config();
        this.UrlData = config.getUrlData();
        this.token = config.token;
        this.parentComponent = data.parentComponent;
        this.type = data.type;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.getPublicInput(this.passwordInput);
    }

    start () {

    }

    onClick(){

        if(this.passwordInput.string == '' ){
            this.showAlert('密码不能为空!')
        }else if(this.passwordInput.string.length < 6 || this.passwordInput.string.length > 10){
            this.showAlert('请设置6-10位新密码！')
        }else{
            this.node.removeFromParent();
            this.fetchcheckPassword();
        }
    }

    fetchcheckPassword(){
        var url = `${this.UrlData.host}/api/with_draw/checkPassword?user_id=${this.UrlData.user_id}&pay_password=${this.passwordInput.string}&token=${this.token}`;
        fetch(url,{
            method:'GET',
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                // type=1,弹出绑定帐户
                // type =2 , 确认兑换
                // type =3 , 申请人工兑换
                // type =4 , 确认出售金币
                if(this.type == 1){
                    var self = this;
                    var timer = setTimeout(()=>{
                        self.parentComponent.showAccountAlert()
                        clearTimeout(timer);
                    },500)
                }else if(this.type == 2){
                    this.parentComponent.fetchwithDrawApply(this.passwordInput.string);
                }else if(this.type == 3){
                    this.parentComponent.fetchRgDh();
                }else if(this.type == 4){
                    this.parentComponent.fetchSell_gold();
                }
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
    deletePassword(){
        this.passwordInput.string = '';
    }
    
    removeSelf(){
        this.node.removeFromParent();
    }
    // update (dt) {}
}
