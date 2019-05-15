// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Config from "../../Config"
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    NavToggle : cc.Prefab = null;

    @property(cc.Prefab)
    publicAlert : cc.Prefab = null;

    @property(cc.Node)
    ToggleContainer : cc.Node = null;

    @property(cc.Prefab)
    ListItem : cc.Prefab = null;

    @property(cc.Node)
    List : cc.Node = null;

    @property(cc.Label)
    pageLabel : cc.Label = null;

    @property()
    public UrlData : any = [];
    public token = '';
    public results : any = {};
    public order_status = 0;
    public page = 1;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var config = new Config();
        this.UrlData =config.getUrlData();
        this.token = config.token;

        this.addNavToggle()

        this.fetchIndex();
    }

    start () {

    }

    public fetchIndex(){
        var url = `${this.UrlData.host}/api/payment/payHistory?user_id=${this.UrlData.user_id}&token=${this.token}&order_status=${this.order_status}&page=${this.page}&page_set=8`;
        fetch(url,{
            method:'get'
        }).then((data)=>data.json()).then((data)=>{
            //结果返回之前先清空列表
            this.List.removeAllChildren();
            if(data.status == 0){
                this.results = data;
                this.pageLabel.string = `${this.page} / ${data.data.total_page == 0 ? '1' : data.data.total_page}`;
                var listArr = data.data.list;
                for(var i = 0; i < listArr.length; i++){
                    var data = listArr[i];
                    var node = cc.instantiate(this.ListItem);
                    this.List.addChild(node);
                    node.getComponent('RechargeHistoryListItem').init({
                        amount : data.amount,
                        status : data.status,
                        type : data.type,
                        firstTime : data.created_at,
                        lastTime : data.arrival_at,
                        results:data
                    })
                }
            }else{
                this.showAlert(data.msg);
            }
        })
    }

    public showAlert(data) {
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data);
    }

    public addNavToggle(){
        var arr = ['全部','已完成','未完成','已撤销'];
        for(let i:number = 0; i< arr.length; i++){
            var node = cc.instantiate(this.NavToggle);
            this.ToggleContainer.addChild(node);
            node.getComponent('RechargeHistoryToggle').init({
                text : arr[i],
                index : i,
                parentComponet:this
            })
        }
    }

    removeSelf(){
        this.node.destroy();
        //刷新Dc的数据
        let Dc = cc.find('Canvas/Recharge/Content/Dc');
        if(Dc){
            Dc.getComponent('Dc').fetchIndex()
        }
    }

    pageUp(){
        if(this.page > 1){
            this.page = this.page - 1;
            this.fetchIndex();
        }
    }

    pageDown(){
        if(this.page < this.results.data.total_page ){
            this.page = this.page + 1;
            this.fetchIndex();
        }
    }
    // update (dt) {}
}
