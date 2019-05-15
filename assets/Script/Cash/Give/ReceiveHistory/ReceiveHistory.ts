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
    GiveHistory: cc.Prefab = null;

    @property(cc.Prefab)
    ReceiveItem: cc.Prefab = null;

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
    GiveHistoryList: cc.Node = null;

    @property
    public showSelect = false;
    public results = null;
    public current = 0;
    public config = null;
    public UrlData: any = [];
    public token: string = '';
    public data: any = {};
    public FormData = new FormData();
    public page = 1;
    public isReceive = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.config = new Config();
        this.UrlData = this.config.getUrlData();
        this.token = this.config.token;

        this.data = ['已完成'];

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
                node.getComponent('GiveSelectItem').init({
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

        var url = `${this.UrlData.host}/api/give/myGiveList?type=2&user_id=${this.UrlData.user_id}&given_id=${this.IdInput.string == '' ? '0' :this.IdInput.string}&page=${this.page}&page_set=5&token=${this.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.results = data;
                this.init()

            } else {
                this.showAlert(data.msg)
            }
            //收到结果后才能点击搜索，上下翻页，避免页面错乱
            this.isReceive = true;
        })
    }

    init(){
        this.pageLabel.string = `${this.page} / ${this.results.data.total_page == 0 ?'1' :this.results.data.total_page}`;
        for(let i = 0 ;i < this.results.data.list.length ;i++){
            let data = this.results.data.list[i];
            let node = cc.instantiate(this.ReceiveItem);
            this.GiveHistoryList.addChild(node);
            node.getComponent('ReceiveItem').init(data,this);
        }
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

    ReceiveClick() {
        if(this.isReceive){
            this.node.destroy();
            let node = cc.instantiate(this.GiveHistory);
            let content = cc.find('Canvas/Cash/Content');
            content.addChild(node);
            this.isReceive = false;
        }

    }

    updataList(){
        this.GiveHistoryList.removeAllChildren();
        this.fetchIndex();
    }

    deleteId(){
        this.IdInput.string = '';
    }

    pageUp(){
        if(this.isReceive){
            if(this.page > 1){
                this.page = this.page - 1;
                this.updataList();
                this.isReceive = false;
            }
        }
    }

    pageDown(){
        if(this.isReceive){
            if(this.page < this.results.data.total_page){
                this.page = this.page + 1;
                this.updataList();
                this.isReceive = false;
            }
        }
    }

    removeSelf() {
        this.node.destroy();
    }

    onClick() {
        if(this.isReceive){
            this.page = 1;
            this.updataList();
            this.isReceive = false;
        }
    }

    // update (dt) {}
}
