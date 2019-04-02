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

    @property()
    public app : any = ''
    public params : any = ''
    public client : any = ''
    public listenHandler : any = ''
    public eventMap : any = ''
    public ok : any = ''
    public queue : any = ''
    public _t : any = ''
    ctro(app){
        this.app = app
        this.params = this.getParams()
        this.client = this.params.os === 'android' ? window['__REACT_WEB_VIEW_BRIDGE'] : window['ReactNativeWebView'] || window
        this.listenHandler = this.params.os === 'android' ? window.document : window.document
        this.eventMap = {}
        this.onMessage()
        this.wait()
        this.ok = false
        this.queue = []
   }
    // onLoad () {}

    start () {

    }
    getParams() {

        let p = {}
        let params = window.location.search.slice(1)
        params.split('&').forEach(e => {
            let v = e.split('=')
            p[v[0]] = v[1]
        })
        return p
    }
    
    wait() {
        this._t = setInterval(() => {
            if (window.postMessage.length !== 2) {
                clearInterval(this._t)
                this.ready()
            }
        }, 50)
    }
    
    ready() {
        this.ok = true
        while (this.queue.length > 0) {
            let message = this.queue.shift()
            this.send(message.type, message.data, message.fn)
        }
    }

    addEventListener(eventName, fn) {
        this.eventMap[eventName] = fn
    }
    
    removeEventListener(eventName) {
        delete this.eventMap[eventName]
    }
    
    send(eventName, data, fn) {
        if (!this.ok) {
            this.queue.push({
                type: eventName,
                data: data,
                fn: fn
            })
            return false
        }

        let message = {
            type: eventName,
            data: data
        }

        // IOS __REACT_WEB_VIEW_BRIDGE
        // this.client.ReactNativeWebView.postMessage(JSON.stringify(message))

        this.client.postMessage(JSON.stringify(message))

        fn && fn()
    }
    
    onMessage() {
        this.listenHandler.addEventListener('message', e => {
            cc.log("recive a message~!",e)
            let message = JSON.parse(e.data)
            if (this.eventMap[message.type]) return this.eventMap[message.type](message, this.app)
        }, false)
    }
    // update (dt) {}
}
