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
    RecoveryGold: cc.Prefab = null;

    @property(cc.Prefab)
    RecoveryItem: cc.Prefab = null;

    @property(cc.Label)
    pageLabel: cc.Label = null;

    @property(cc.Node)
    RecoveryGoldList: cc.Node = null;

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
        var url = `${this.UrlData.host}/api/recycle_gold/recycleGoldHistory?user_id=${this.UrlData.user_id}&
        page=${this.page}&page_set=8&token=${this.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.results = data;
                this.init();
            } else {

            }
        })
    }

    init(){
        for(let i = 0; i<this.results.data.list.length; i++){
            var data = this.results.data.list[i];
            let node = cc.instantiate(this.RecoveryItem);
            this.RecoveryGoldList.addChild(node);
            node.getComponent('RecoveryItem').init(data)
        }
        this.pageLabel.string = `${this.page} / ${this.results.data.total_page == 0 ? '1' :this.results.data.total_page}`;
    }

    public showAlert(data) {
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data);
    }

    updataList(){
        this.RecoveryGoldList.removeAllChildren();
        this.fetchIndex();
    }

    pageUp(){
        var total_page = Number(this.results.data.total_page);
        if(this.page > 1){
            this.page = this.page - 1;
            this.updataList();
        }
    }

    pageDown(){
        var total_page = Number(this.results.data.total_page);
        if(this.page < total_page){
            this.page = this.page + 1;
            this.updataList();
        }
    }

    removeSelf() {
        this.node.destroy();
        var node = cc.instantiate(this.RecoveryGold);
        var content = cc.find('Canvas/Cash/Content');
        content.addChild(node);
    }

    onClick() {

    }

    // update (dt) {}
}
