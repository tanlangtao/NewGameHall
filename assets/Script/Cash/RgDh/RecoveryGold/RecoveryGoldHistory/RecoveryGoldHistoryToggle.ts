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

    @property(cc.Label)
    label: cc.Label = null;

    @property
    index = null;
    parentComponet : any = ''

    public init(data){
        this.label.string =data.text;
        this.index = data.index;
        this.parentComponet = data.parentComponet;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    start () {

    }

    onClick(){
        if(this.index == 0){
            this.parentComponet.order_status = 0;
        }else if(this.index == 1){
            this.parentComponet.order_status = 2;
        }else if(this.index == 2){
            this.parentComponet.order_status = 1;
        }
        this.parentComponet.page = 1;
        this.parentComponet.updataList();
    }
    // update (dt) {}
}
