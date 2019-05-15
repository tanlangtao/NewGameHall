import Config from "../Config";
import ClientMessage from "../ClientMessage";
import error = cc.error;

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    NavToggle: cc.Prefab = null;

    @property(cc.Prefab)
    CashHistory: cc.Prefab = null;

    @property(cc.Node)
    ToggleContainer: cc.Node = null;

    @property(cc.Node)
    Content:cc.Node = null;

    @property()
    public UrlData : any = [];
    public token : string = '';
    public results : any = {};
    public zfbResults : any = {};
    public app : any = {};

    //请求次数
    public idx  = 0;

    onLoad () {
        
        var config = new Config();
        this.UrlData =config.getUrlData();
        this.token = config.token;
        this.fetchIndex();

    }

    start () {
        this.app = cc.find('Canvas/Main').getComponent('Main');
        this.app.Client.send('__done',{},()=>{})
    }
    public exitBtnClick(){
        this.app.Client.send('__backtohall',{},()=>{})
    }

    public fetchIndex(){
        this.idx  = this.idx +1 ;

        var url = `${this.UrlData.host}/api/with_draw/index?user_id=${this.UrlData.user_id}&token=${this.token}`;
        fetch(url,{
            method:'get'
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.results = data;
                this.addNavToggle()
            }else{
                this.app.showAlert(data.msg)
            }
        }).catch((error)=>{
            if(this.idx>=5){
                this.app.showAlert(' 网络错误，请重试！');
                let self = this;
                //3秒后自动返回大厅
                setTimeout(()=>{self.app.Client.send('__backtohall',{},()=>{})},2000)
            }else{
                //重新请求数据
                this.fetchIndex();
            }
        })
    }

    public historyBtnClick(){
        var node = cc.instantiate(this.CashHistory);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
    }

    public addNavToggle(){
        var arr = [];
        if(!this.results.data.withDraw_info) return;
        if(this.results.data.withDraw_info.replace_withdraw.is_close == 0){
            arr.push('人工兑换')
        }
        if(this.results.data.withDraw_info.bankcard.is_close == 0){
            arr.push('支付宝兑换')
        }
        if(this.results.data.withDraw_info.alipay.is_close == 0){
            arr.push('银行卡兑换')
        }
        if(this.results.data.withDraw_info.given.is_close == 0){
            arr.push('赠送')
        }
        for(let i:number = 0; i< arr.length; i++){
            var node = cc.instantiate(this.NavToggle);
            this.ToggleContainer.addChild(node);
            node.getComponent('DhToggle').init({
                text:arr[i]
            })
        }
    }
    
}
