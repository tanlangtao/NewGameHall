// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Config from "../../../../Config"
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    NavToggle : cc.Prefab = null;

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

        this.updataList()
    }

    start () {

    }

    updataList(){
        this.List.removeAllChildren();
        this.fetchIndex();
    }

    public fetchIndex(){
        var url = `${this.UrlData.host}/api/order/payOrderList?user_id=${this.UrlData.user_id}&token=${this.token}&order_status=${this.order_status}&page=${this.page}&page_set=8`;
        fetch(url,{
            method:'get'
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.results = data;
                this.pageLabel.string = `${this.page} / ${data.data.total_page == 0 ? '1' : data.data.total_page}`;
                var listArr = data.data.list;
                for(var i = 0; i < listArr.length; i++){
                    var data = listArr[i];
                    var node = cc.instantiate(this.ListItem);
                    this.List.addChild(node);
                    node.getComponent('RecoveryGoldHistoryItem').init({
                        amount : data.amount,
                        status : data.status,
                        type : data.type,
                        firstTime : data.created_at,
                        lastTime : data.arrival_at,
                        results:data
                    })
                }
            }else{

            }
        })
    }

    public addNavToggle(){
        var arr = ['全部','审核中','挂单中','已拒绝'];
        for(let i:number = 0; i< arr.length; i++){
            var node = cc.instantiate(this.NavToggle);
            this.ToggleContainer.addChild(node);
            node.getComponent('RecoveryGoldHistoryToggle').init({
                text : arr[i],
                index : i,
                parentComponet:this
            })
        }
    }

    removeSelf(){
        this.node.removeFromParent();
    }

    pageUp(){
        if(this.page > 1){
            this.page = this.page - 1;
            this.updataList()
        }
    }

    pageDown(){
        if(this.page < this.results.data.total_page ){
            this.page = this.page + 1;
            this.updataList()
        }
    }
    // update (dt) {}
}
