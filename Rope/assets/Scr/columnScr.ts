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
export default class columnScr extends cc.Component {
    ifLight;

    onLoad () {
        this.ifLight=false;
        this.node.color=cc.Color.WHITE;
    }
    public onLight(){
        if(!this.ifLight){

            this.node.color=cc.Color.ORANGE;
            this.ifLight=true;
        }
    }
    public cancelLight(){
        if(this.ifLight){
            this.ifLight=false;
            this.node.color=cc.Color.WHITE;
        }
    }
    start () {

    }

    // update (dt) {}
}
