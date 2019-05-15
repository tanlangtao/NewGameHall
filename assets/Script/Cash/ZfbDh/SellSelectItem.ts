// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Config from "../../Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    selectLabel = null;
    showSelect = null;
    selectContent= null;
    data = null;
    parentCom = null;
    config = null;
    // LIFE-CYCLE CALLBACKS:
    public init(data){
        this.label.string = data.text;
        this.selectLabel = data.Label;
        this.showSelect = data.showSelect;
        this.selectContent = data.selectContent;
        this.data = data.data;
        this.parentCom = data.parentCom;
    }
    onLoad () {
        this.config = new Config();
    }

    start () {

    }

    onClick(){
        this.showSelect = false;
        this.parentCom.bankId = this.data.id;
        this.selectLabel.string = this.config.testBankNum(this.label.string) ;
        this.selectContent.removeAllChildren();
        let info =JSON.parse(this.data.info);
        let type = this.data.type;
        info = {
            ...info,
            type
        };
            this.parentCom.Info = info;

    }
    // update (dt) {}
}
