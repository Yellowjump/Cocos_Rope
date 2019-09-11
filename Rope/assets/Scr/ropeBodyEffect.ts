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
    modelMat:cc.Mat4;
    onLoad () {
        var gl = cc._renderContext;
        var glProgram = new cc.GLProgram();
        var a_position = gl.getAttribLocation( glProgram.programObj, 'aposition' )
        var a_texCoord = gl.getAttribLocation( glProgram.programObj, 'atexCoord' )
        console.log( 'a_position', a_position);
        console.log( 'a_texCoord', a_texCoord);
    }

    update (dt) {
        
        
        
    }
    
}
