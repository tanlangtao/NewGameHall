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
    ListItem: cc.Prefab = null;

    @property(cc.Node)
    List: cc.Node = null;
    
    @property()
    results :any = {};
    parentComponent = null;
    // LIFE-CYCLE CALLBACKS:

    public init(data){
        this.results = data.results;
        this.parentComponent = data.parentComponent;
        for(var i = 0; i< this.results.data.list.length ; i++){
            var node = cc.instantiate(this.ListItem);
            this.List.addChild(node);
            var data = this.results.data.list[i];
            node.getComponent('Listitem').init({
                id:data.id,
                name:data.nick_name,
                type:data.type == 1?'微信' :'QQ',
                number:data.contact
            });
        }
    }
    // onLoad () {}

    start () {

    }

    fanhuiClick(){
        this.node.removeFromParent();
        this.parentComponent.fetchIndex()
    }
    // update (dt) {}
}
