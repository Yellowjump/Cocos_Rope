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
    material: cc.Material;
    mov:cc.Vec3;
    rotateMat:cc.Mat4;
    onLoad () {
        this.material=this.getComponent(cc.Sprite).getMaterial(0);
        this.mov=new cc.Vec3(1,1,0);
        this.rotateMat=new cc.Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        
    }

    update (dt) {
        //this.mov.addSelf(new cc.Vec3(1,0,0));
        this.rotateMat.translate(this.mov,this.rotateMat);
        //this.rotateMat.rotate(1,new cc.Vec3(0,0,1),this.rotateMat);
        
        this.material.effect.setProperty('rotateMat',this.rotateMat);
        console.log(this.material.effect.getProperty('a_position'));
        //this.material.effect.setProperty('ropeLength',2);
        this.material.effect.setProperty('movement',this.mov);
    }
}
