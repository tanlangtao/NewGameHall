// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Config from "../../../Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Prefab)
    publicAlert: cc.Prefab = null;

    @property(cc.Prefab)
    SaleGold: cc.Prefab = null;

    @property(cc.Prefab)
    SaleItem: cc.Prefab = null;

    @property(cc.Label)
    pageLabel: cc.Label = null;

    @property(cc.Node)
    saleGoldList: cc.Node = null;

    @property
    public results = null;
    public config = null;
    public UrlData: any = [];
    public token: string = '';
    public FormData = new FormData();
    public page = 1;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.config = new Config();
        this.UrlData = this.config.getUrlData();
        this.token = this.config.token;

        this.fetchIndex();
    }

    start() {

    }


    public fetchIndex() {

        var url = `${this.UrlData.host}/api/sell_gold/sellGoldHistory?&user_id=${this.UrlData.user_id}&page=${this.page}&page_set=8&token=${this.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            this.saleGoldList.removeAllChildren();
            if (data.status == 0) {
                this.results = data;
                this.init();
            } else {
                this.showAlert(data.msg);
            }
        })
    }

    public  init(){
        this.pageLabel.string = `${this.page} / ${Number(this.results.data.total_page) == 0 ? '1' : this.results.data.total_page}`;
        for(let i = 0 ;i<this.results.data.list.length; i++){
            var node = cc.instantiate(this.SaleItem);
            this.saleGoldList.addChild(node);
            var data = this.results.data.list[i];
            node.getComponent('SaleItem').init({
                created_at : data.created_at,
                gold : data.gold,
                down_at : data.down_at,
                last_gold : data.last_gold,
                consume_gold : data.traded_gold,
                status : data.status
            })
        }
    }
    public showAlert(data) {
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data);
    }

    pageUp(){
        if(this.page > 1){
            this.page = this.page - 1;
            this.fetchIndex();
        }
    }

    pageDown(){
        let totalPage = Number(this.results.data.total_page);
        if(this.page < totalPage){
            this.page = this.page + 1;
            this.fetchIndex();
        }
    }

    removeSelf() {
        this.node.destroy();
        var node = cc.instantiate(this.SaleGold);
        var content = cc.find('Canvas/Recharge/Content');
        content.addChild(node);
    }

    onClick() {

    }

    // update (dt) {}
}
