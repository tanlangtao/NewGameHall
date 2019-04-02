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
    PublicInputAlert: cc.Prefab = null;

    @property(cc.Prefab)
    publicAlert: cc.Prefab = null;

    @property(cc.Prefab)
    SaleGold: cc.Prefab = null;

    @property(cc.EditBox)
    IdInput: cc.EditBox = null;

    @property(cc.Label)
    selectLabel: cc.Label = null;

    @property(cc.Label)
    pageLabel: cc.Label = null;

    @property(cc.Prefab)
    SelectItem: cc.Prefab = null;

    @property(cc.Node)
    selectContent: cc.Node = null;

    @property(cc.Node)
    MyOrderList: cc.Node = null;

    @property
    public showSelect = false;
    public results = null;
    public current = 1;
    public config = null;
    public UrlData: any = [];
    public token: string = '';
    public data: any = {};
    public FormData = new FormData();
    public page = 1;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.config = new Config();
        this.UrlData = this.config.getUrlData();
        this.token = this.config.token;

        this.data = ['全部','未完成','已完成'];

        this.initRender();

        this.getPublicInput();

        this.fetchIndex();
    }

    start() {

    }

    selectClick() {
        if (!this.showSelect) {
            for (var i = 0; i < this.data.length; i++) {
                var node = cc.instantiate(this.SelectItem);
                this.selectContent.addChild(node);
                node.getComponent('GoldSelectItem').init({
                    text: this.data[i],
                    parentComponent: this,
                    index: i
                })
            }
            this.showSelect = true;
        } else {
            this.selectContent.removeAllChildren();
            this.showSelect = false;
        }
    }

    public fetchIndex() {
        this.pageLabel.string = `${this.page} / 10`;
        var url = `${this.UrlData.host}/api/order/orderList?replace_id=${this.UrlData.user_id}&user_id=${this.IdInput.string}&order_status=${this.current}&token=${this.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.results = data;
                cc.log(data);
            } else {

            }
        })
    }


    //selectItem回调
    public initRender() {
        this.selectLabel.string = this.data[this.current];
    }

    public getPublicInput() {
        var PublicInputAlert = cc.instantiate(this.PublicInputAlert);
        var canvas = cc.find('Canvas');
        this.IdInput.node.on('editing-did-began', (e) => {
            canvas.addChild(PublicInputAlert);
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text: e.string,
                input: this.IdInput
            })
        })
        this.IdInput.node.on('text-changed', (e) => {
            //验证input 不能以0开头的整数
            this.IdInput.string = e.string.replace(/[^\d]/g, '').replace(/^0{1,}/g, '');
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text: e.string,
                input: this.IdInput
            })
        })
    }

    public showAlert(data) {
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data);
    }

    saleGoldClick() {
        this.node.removeFromParent();
        let node = cc.instantiate(this.SaleGold);
        let content = cc.find('Canvas/Recharge/Content');
        content.addChild(node);

    }

    updataList(){
        this.MyOrderList.removeAllChildren();
        this.fetchIndex();
    }

    deleteId(){
        this.IdInput.string = '';
    }

    pageUp(){
        if(this.page > 1){
            this.page = this.page - 1;
            this.updataList();
        }
    }

    pageDown(){
        if(this.page < 10){
            this.page = this.page + 1;
            this.updataList();
        }
    }

    removeSelf() {
        this.node.removeFromParent();
    }

    onClick() {

    }

    // update (dt) {}
}
