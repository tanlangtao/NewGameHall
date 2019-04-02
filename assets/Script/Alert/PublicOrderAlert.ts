// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Config from "../Config"
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Prefab)
    helpAlert: cc.Prefab = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    bank_nameLabel: cc.Label = null;

    @property(cc.Label)
    card_nameLabel: cc.Label = null;

    @property(cc.Label)
    card_numLabel: cc.Label = null;

    @property(cc.Label)
    nickNameLabel: cc.Label = null;

    @property(cc.Prefab)
    publicAlert : cc.Prefab = null;

    @property
    public results = {};
    public token = null;
    public config = null;
    public UrlData : any = [];

    public init(data){
        this.results =data;
        this.amountLabel.string = this.config.toDecimal(data.data.amount);
        this.bank_nameLabel.string = data.data.bank_name;
        this.card_nameLabel.string = data.data.card_name;
        this.card_numLabel.string = data.data.card_num;
        this.nickNameLabel.string = decodeURI(this.UrlData.user_name);
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.config = new Config();
        this.UrlData = this.config.getUrlData();
        this.token = this.config.token;
    }

    start () {

    }

    copyCard_num(){
        this.config.copyToClipBoard(this.card_numLabel.string);
        this.showAlert(`复制成功！${this.card_numLabel.string}`);
    }

    copyCard_name(){
        this.config.copyToClipBoard(this.card_nameLabel.string);
        this.showAlert(`复制成功！${this.card_nameLabel.string}`);
    }

    copyAmount(){
        this.config.copyToClipBoard(this.amountLabel.string);
        this.showAlert(`复制成功！${this.amountLabel.string}`);
    }

    removeSelf(){
        this.node.removeFromParent()
    }

    onClick(){
        var node = cc.instantiate(this.helpAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
    }

    public showAlert(data){
        var node = cc.instantiate(this.publicAlert);
        var canvas = cc.find('Canvas');
        canvas.addChild(node);
        node.getComponent('PublicAlert').init(data)
    }
    // update (dt) {}
}
