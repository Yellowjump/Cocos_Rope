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
var myPoint = /** @class */ (function () {
    worldPos:cc.Vec2;
    normal:cc.Vec2;
    column:cc.Node;
    function myPoint(p:cc.Vec2,n:cc.Vec2 ,co:cc.Node) {

        this.worldPos=p;
        this.normal=n;
        this.column=co;
    }
    return myPoint;
}());

var myColumn=(function(){
    
    column:cc.Node;
    columnWorldPos:cc.Vec2;
    startWorldPos:cc.Vec2;
    preTangentWorldPos:cc.Vec2;//前一个点
    rad:cc.Float;//绕柱子的弧度值  带方向
    function myColumn(c:cc.Node,swp:cc.Vec2){
        this.column=c;
        this.columnWorldPos=this.column.parent.convertToWorldSpaceAR(this.column.position);
        this.startWorldPos=swp;
        this.preTangentWorldPos=this.startWorldPos;
        this.rad=0;
    }
    function toString(){
        
        return this.column.name+this.columnWorldPos+this.startWorldPos+"\n"+this.preTangentWorldPos+"\t"+this.rad;
    }
    return myColumn;
}())
@ccclass
export default class ropeScr_001 extends cc.Component {
    @property(cc.Node)PointArea=null;
    @property(cc.Node)ropeEnd=null;
    @property(cc.Node)ci=null;
    @property(cc.Label)dis=null;
    @property(cc.Float)lineWidth:number=0;
    mouseWorldPos:cc.Vec2=new cc.Vec2(0,0);
    points=[];
    columns=[];
    flag:boolean;
    // LIFE-CYCLE CALLBACKS:
    ctx=null;
    newTangentP=new cc.Vec2(0,1);
    c0=null;
    onLoad () {
        
        this.ctx = this.getComponent(cc.Graphics);
        this.PointArea.on('touchstart',this.touchstart,this);
        this.PointArea.on('touchmove',this.touchmove,this);
        this.PointArea.on('touchend',this.touchup,this);
        this.PointArea.on('touchcancel',this.touchup,this);
        cc.director.getPhysicsManager().enabled=true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |cc.PhysicsManager.DrawBits.e_jointBit |cc.PhysicsManager.DrawBits.e_shapeBit;
        //cc.director.getPhysicsManager().enabledAccumulator = true;
        //cc.PhysicsManager.FIXED_TIME_STEP = 1/1000;
        // 物理步长，默认 FIXED_TIME_STEP 是 1/60
        
        this.points.push(new myPoint( this.node.parent.convertToWorldSpaceAR(this.node.position),new cc.Vec2(0,0),this.node));
        this.columns.push(new myColumn(this.node,this.node.parent.convertToWorldSpaceAR(this.node.position)));
        //this.columns[0].preTangentWorldPos;
        this.flag=false;
        
    }
    touchstart(e:cc.Event.EventTouch){
        this.flag=true;
        this.mouseWorldPos=e.getLocation().add(new cc.Vec2(0,30));
        //this.ctx.moveTo(this.node.convertToNodeSpaceAR(e.getLocation()).x,this.node.convertToNodeSpaceAR(e.getLocation()).y);
    }
    touchmove(e:cc.Event.EventTouch){
        this.mouseWorldPos=e.getLocation().add(new cc.Vec2(0,30));   
    }
    touchup(e:cc.Event.EventTouch){
        this.flag=false;
    }
    start () {
        //this.ctx.moveTo(0,0);
    }

    update (dt) {
        
        this.ctx.clear();
        this.ctx.strokeColor=cc.Color.BLUE;
        this.ctx.LineJoin= cc.Graphics.LineJoin.ROUND;
        this.ctx.lineCap = cc.Graphics.LineCap.ROUND;
        this.dis.string=this.c0+this.columns[this.columns.length-1].preTangentWorldPos.sub(this.columns[this.columns.length-1].columnWorldPos).normalize()+this.newTangentP.sub(this.columns[this.columns.length-1].columnWorldPos).normalize();
        if(this.flag){
            this.ropeEnd.getComponent(cc.RigidBody).linearVelocity=this.mouseWorldPos.sub(this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position)).mul(5);
        }
        else{
            if(this.ropeEnd.convertToNodeSpaceAR(this.columns[this.columns.length-1].preTangentWorldPos).mag()<10){
                this.ropeEnd.getComponent(cc.RigidBody).linearVelocity=(this.ropeEnd.convertToNodeSpaceAR(this.columns[this.columns.length-1].preTangentWorldPos)).mul(10);
            }
            else{
                this.ropeEnd.getComponent(cc.RigidBody).linearVelocity=(this.ropeEnd.convertToNodeSpaceAR(this.columns[this.columns.length-1].preTangentWorldPos)).normalize(). mul(1000);
            }
        }
        //获取上一个切点
        if(this.columns.length>1){
            
            //获取上一个柱子切点
            var p=this.CalcQieDian(this.columns[this.columns.length-1].columnWorldPos,this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position),this.columns[this.columns.length-1].column.width/2,this.columns[this.columns.length-1].preTangentWorldPos);
            //this.columns[this.columns.length-1].preTangentWorldPos=p;

            var results=cc.director.getPhysicsManager().rayCast(this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position),this.columns[this.columns.length-1].preTangentWorldPos,cc.RayCastType.Closest);
        }
        else{
            var results = cc.director.getPhysicsManager().rayCast(this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position),this.columns[this.columns.length-1].startWorldPos,cc.RayCastType.Closest);
        }
        //朝切点发射射线检测
        this.c0="asd";
        if(results.length>=1){
        
        
            this.c0=results[0].collider.node.name;
            var col = results[0].collider.node;
            if(col!=this.columns[this.columns.length-1].column){
                var sp=this.CalcQieDian(col.parent.convertToWorldSpaceAR(col.position),this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position),col.width/2,results[0].point);
                var nc=new myColumn(col,sp);
                this.columns.push(nc);
            }
            else{
                //再次碰到原来的column
                this.newTangentP=this.CalcQieDian(this.columns[this.columns.length-1].columnWorldPos,this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position),this.columns[this.columns.length-1].column.width/2,this.columns[this.columns.length-1].preTangentWorldPos);
                this.ctx.strokeColor=cc.Color.RED;
                this.ctx.circle(this.node.convertToNodeSpaceAR(this.newTangentP).x,this.node.convertToNodeSpaceAR(this.newTangentP).y,10);
                this.ctx.stroke();
                this.ctx.strokeColor=cc.Color.BLUE;
                
                
                if(this.columns[this.columns.length-1].rad*(this.columns[this.columns.length-1].rad+this.radTwoPOnR(this.columns[this.columns.length-1].preTangentWorldPos,this.newTangentP,this.columns[this.columns.length-1].columnWorldPos))<0){
                    console.log("!!!!!pop");
                    this.columns.pop();
                }
                else{
                    this.columns[this.columns.length-1].rad+=this.radTwoPOnR(this.columns[this.columns.length-1].preTangentWorldPos,this.newTangentP,this.columns[this.columns.length-1].columnWorldPos);
                    this.columns[this.columns.length-1].preTangentWorldPos=this.newTangentP;
                }
            }
            
        
        }
        else{
            if(this.columns.length>1){

                this.newTangentP=this.CalcQieDian(this.columns[this.columns.length-1].columnWorldPos,this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position),this.columns[this.columns.length-1].column.width/2,this.columns[this.columns.length-1].preTangentWorldPos);
                this.ctx.strokeColor=cc.Color.RED;
                this.ctx.circle(this.node.convertToNodeSpaceAR(this.newTangentP).x,this.node.convertToNodeSpaceAR(this.newTangentP).y,10);
                this.ctx.stroke();
                this.ctx.strokeColor=cc.Color.BLUE;
                if(this.columns[this.columns.length-1].rad*(this.columns[this.columns.length-1].rad+this.radTwoPOnR(this.columns[this.columns.length-1].preTangentWorldPos,this.newTangentP,this.columns[this.columns.length-1].columnWorldPos))<0){
                    console.log("!!!!!pop");
                    this.columns.pop();
                }
                else{
                    
                    this.columns[this.columns.length-1].rad+=this.radTwoPOnR(this.columns[this.columns.length-1].preTangentWorldPos,this.newTangentP,this.columns[this.columns.length-1].columnWorldPos);
                    this.columns[this.columns.length-1].preTangentWorldPos=this.newTangentP;
                }
            }
        }
            
        this.ctx.lineWidth=this.lineWidth;
        
        
        this.ctx.moveTo(this.node.convertToNodeSpaceAR(this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position)).x,this.node.convertToNodeSpaceAR(this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position)).y);
        for(var i=this.columns.length-1;i>0;i--){
            
            if(this.columns.length!=1)
                
                
                var nor=this.columns[i].preTangentWorldPos.sub(this.columns[i].columnWorldPos).normalize();
                var po=this.node.convertToNodeSpaceAR(this.columns[i].preTangentWorldPos.add(nor.mul(this.lineWidth/2)));
                this.ctx.lineTo(po.x,po.y);
            
            
            //对第i个柱子画弧
            if(this.columns[i].rad>=Math.PI*2){
                this.ctx.circle(this.node.convertToNodeSpaceAR(this.columns[i].columnWorldPos).x,this.node.convertToNodeSpaceAR(this.columns[i].columnWorldPos).y,this.columns[i].column.width/2+ this.lineWidth/2);
                this.ctx.moveTo(this.node.convertToNodeSpaceAR(this.columns[i].preTangentWorldPos).x,this.node.convertToNodeSpaceAR(this.columns[i].preTangentWorldPos).y);
            }
            else{
                var strad=this.radOnePointOnCircle(this.columns[i].startWorldPos,this.columns[i].columnWorldPos);
                this.ctx.arc(this.node.convertToNodeSpaceAR(this.columns[i].columnWorldPos).x,this.node.convertToNodeSpaceAR(this.columns[i].columnWorldPos).y,this.columns[i].column.width/2+ this.lineWidth/2,strad,strad+this.columns[i].rad,this.columns[i].rad>0);
            }
            var norSt=this.columns[i].startWorldPos.sub(this.columns[i].columnWorldPos).normalize();
            var poSt=this.node.convertToNodeSpaceAR(this.columns[i].startWorldPos.add(norSt.mul(this.lineWidth/2)));
            this.ctx.moveTo(poSt.x,poSt.y);
        }
        this.ctx.lineTo(0,0);

        //this.ctx.fillColor = cc.Color.YELLOW;
        var q=this.CalcQieDian(this.ci.parent.convertToWorldSpaceAR(this.ci.position),this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position),20);
        //this.ctx.circle(this.node.convertToNodeSpaceAR(q).x,this.node.convertToNodeSpaceAR(q).y,5);
        this.ctx.stroke();
        //this.ctx.fill();
        //console.log(this.ctx.lineWidth);
    }
    
    CalcQieDian(ptCenter:cc.Vec2,ptOutside:cc.Vec2,dbRadious:number,alignP:cc.Vec2=new cc.Vec2(0,0)) :cc.Vec2
    { 
        
        var E=new cc.Vec2(0,0);
        var F=new cc.Vec2(0,0);
        var G=new cc.Vec2(0,0);
        var H=new cc.Vec2(0,0);
        var r=dbRadious;
        //1. 坐标平移到圆心ptCenter处,求园外点的新坐标E
        E=ptOutside.sub(ptCenter);//平移变换到E
        //2. 求园与OE的交点坐标F, 相当于E的缩放变换
        var t= r /E.mag();  //得到缩放比例
        F= E.mul(t);   //缩放变换到F
        
        //3. 将E旋转变换角度a到切点G，其中cos(a)=r/OF=t, 所以a=arccos(t);
        if(this.radTwoPOnR(ptOutside,alignP,ptCenter)<0){
            var a= -Math.acos(t);   //得到旋转角度 角度为负
        }else{
            var a= Math.acos(t);   //得到旋转角度  角度为正
        }
        G=F.rotate(a);//旋转变换到G
        
        //4. 将G平移到原来的坐标下得到新坐标H
         H=G.add(ptCenter)           //平移变换到H

        //5. 返回H
        return H;
        //6. 实际应用过程中，只要一个中间变量E,其他F,G,H可以不用。
    }
    /**
     * 计算圆上A到B法线夹角弧度
     * 位置全为世界坐标
     * @param pA 起点
     * @param pB 终点
     * @param pR 圆心
     */
    radTwoPOnR(pA:cc.Vec2,pB:cc.Vec2,pR:cc.Vec2):number{
        var ra=0;
        var va=pA.sub(pR);
        var vb=pB.sub(pR);
        ra=va.signAngle(vb);
        return ra;
    }
    /**
     * 计算1，0)到圆上一点的夹角弧度
     * 位置全为世界坐标
     * @param p 圆上点
     * @param pR 圆心
     */
    radOnePointOnCircle(p:cc.Vec2,pR:cc.Vec2):number{
        var ra=0;
        var va=p.sub(pR);
        var vb=new cc.Vec2(1,0);
        ra=vb.signAngle(va);
        return ra;
    }
}
