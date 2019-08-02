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
@ccclass
export default class ropeScr extends cc.Component {
    @property(cc.Node)PointArea=null;
    @property(cc.Node)ropeEnd=null;
    @property(cc.Node)ci=null;
    @property(cc.Label)dis=null;
    mouseWorldPos:cc.Vec2=new cc.Vec2(0,0);
    points=[];
    flag:boolean;
    // LIFE-CYCLE CALLBACKS:
    ctx=null;
    
    onLoad () {
        
        this.ctx = this.getComponent(cc.Graphics);
        this.PointArea.on('touchstart',this.touchstart,this);
        this.PointArea.on('touchmove',this.touchmove,this);
        this.PointArea.on('touchend',this.touchup,this);
        this.PointArea.on('touchcancel',this.touchup,this);
        cc.director.getPhysicsManager().enabled=true;
        this.points.push(new myPoint( this.node.parent.convertToWorldSpaceAR(this.node.position),new cc.Vec2(0,0),this.node));
        this.flag=false;
        
    }
    touchstart(e:cc.Event.EventTouch){
        this.flag=true;
        this.mouseWorldPos=e.getLocation().add(new cc.Vec2(0,100));
        //this.ctx.moveTo(this.node.convertToNodeSpaceAR(e.getLocation()).x,this.node.convertToNodeSpaceAR(e.getLocation()).y);
    }
    touchmove(e:cc.Event.EventTouch){
        this.mouseWorldPos=e.getLocation().add(new cc.Vec2(0,100));   
    }
    touchup(e:cc.Event.EventTouch){
        this.flag=false;
    }
    start () {
        //this.ctx.moveTo(0,0);
    }

    update (dt) {
        if(this.flag){
            this.ropeEnd.getComponent(cc.RigidBody).linearVelocity=this.mouseWorldPos.sub(this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position)).mul(5);
        }
        else{
            if(this.ropeEnd.convertToNodeSpaceAR(this.points[this.points.length-1].worldPos).mag()<10){
                this.ropeEnd.getComponent(cc.RigidBody).linearVelocity=(this.ropeEnd.convertToNodeSpaceAR(this.points[this.points.length-1].worldPos)).mul(10);
            }
            else{
                this.ropeEnd.getComponent(cc.RigidBody).linearVelocity=(this.ropeEnd.convertToNodeSpaceAR(this.points[this.points.length-1].worldPos)).normalize(). mul(1000);
            }
        }
        var results = cc.director.getPhysicsManager().rayCast(this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position),this.points[this.points.length-1].worldPos,cc.RayCastType.Any);
        

        this.ctx.lineWidth=10;
        
        this.ctx.clear();
        this.ctx.LineJoin= cc.Graphics.LineJoin.ROUND;
        this.ctx.lineCap = cc.Graphics.LineCap.ROUND;
        if(results.length>=1){
            if(results[0].collider.node.name!="ropeEnd"){

                var point = results[0].point;
                
                point=point;

                //this.ctx.circle(this.node.convertToNodeSpaceAR(point).x,this.node.convertToNodeSpaceAR(point).y,10);
                var np=new myPoint(point,results[0].normal,results[0].collider.node);
                this.points.push(np);
            }
        }
        while(this.points.length>1){
            var curVec=this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position).sub(this.points[this.points.length-1].worldPos);
            var angl=curVec.angle(this.points[this.points.length-1].normal);
            if(angl<Math.PI/2-0.5){
                this.points.pop();
            }
            else{
                break;
            }
        }
        this.ctx.moveTo(this.node.convertToNodeSpaceAR(this.points[0].worldPos).x,this.node.convertToNodeSpaceAR(this.points[0].worldPos).y);
        var prenode=this.points[0].column;
        var radAdd=0;//在一个柱子上绕圈的弧度值pi 带方向
        var radStart=0;//一个柱子上起始弧度相对与1，0
        var clockwise=true;//方向
        for(var i=1;i<this.points.length;i++){
            if(this.points[i].column==prenode){
                radAdd+=this.radTwoPOnR(this.points[i-1].worldPos,this.points[i].worldPos,this.points[i].column.parent.convertToWorldSpaceAR( this.points[i].column.position));
            }
            if(this.points[i].column!=prenode||i==this.points.length-1){
                //解决之前的圆弧
                this.dis.string=radStart.toString()+"\n"+ radAdd.toString();
                if(radAdd!=0){
                    if(Math.abs( radAdd)>Math.PI*2){
                        //绕了一圈
                        this.ctx.circle(this.node.convertToNodeSpaceAR(prenode.parent.convertToWorldSpaceAR( prenode.position)).x,this.node.convertToNodeSpaceAR(prenode.parent.convertToWorldSpaceAR( prenode.position)).y,prenode.width/2+5);
                        this.ctx.moveTo(this.node.convertToNodeSpaceAR(this.points[i-1].worldPos.add(this.points[i-1].normal.normalize().mul(5))).x,this.node.convertToNodeSpaceAR(this.points[i-1].worldPos.add(this.points[i-1].normal.normalize().mul(5))).y);
                    }
                    else{
                        //绕了一个弧
                        if(radAdd>0)clockwise=true;
                        else clockwise=false;
                        
                        this.ctx.arc(this.node.convertToNodeSpaceAR(prenode.parent.convertToWorldSpaceAR( prenode.position)).x,this.node.convertToNodeSpaceAR(prenode.parent.convertToWorldSpaceAR( prenode.position)).y,prenode.width/2+5,radStart,radStart+radAdd,clockwise);
                        this.ctx.moveTo(this.node.convertToNodeSpaceAR(this.points[i-1].worldPos.add(this.points[i-1].normal.normalize().mul(5))).x,this.node.convertToNodeSpaceAR(this.points[i-1].worldPos.add(this.points[i-1].normal.normalize().mul(5))).y);
                    }
                    
                }

                //新的直线
                this.ctx.lineTo(this.node.convertToNodeSpaceAR(this.points[i].worldPos.add(this.points[i].normal.normalize().mul(5))).x,this.node.convertToNodeSpaceAR(this.points[i].worldPos.add(this.points[i].normal.normalize().mul(5))).y);
                radStart=this.radOnePointOnCircle(this.points[i].worldPos,this.points[i].column.parent.convertToWorldSpaceAR( this.points[i].column.position));
                prenode=this.points[i].column;
                radAdd=0;
            }
            
        }
        this.ctx.lineTo(this.node.convertToNodeSpaceAR(this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position)).x,this.node.convertToNodeSpaceAR(this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position)).y);
        //this.ctx.moveTo(this.node.convertToNodeSpaceAR(e.getLocation()).x,this.node.convertToNodeSpaceAR(e.getLocation()).y);
        //this.ctx.fillColor = cc.Color.YELLOW;
        var q=this.CalcQieDian(this.ci.parent.convertToWorldSpaceAR(this.ci.position),this.ropeEnd.parent.convertToWorldSpaceAR(this.ropeEnd.position),20);
        this.ctx.circle(this.node.convertToNodeSpaceAR(q).x,this.node.convertToNodeSpaceAR(q).y,5);
        this.ctx.stroke();
        //this.ctx.fill();
        //console.log(this.ctx.lineWidth);
    }
    
    CalcQieDian(ptCenter:cc.Vec2,ptOutside:cc.Vec2,dbRadious:number) :cc.Vec2
    { 
        
        var E=new cc.Vec2(0,0);
        var F=new cc.Vec2(0,0);
        var G=new cc.Vec2(0,0);
        var H=new cc.Vec2(0,0);
        var r=dbRadious;
        //1. 坐标平移到圆心ptCenter处,求园外点的新坐标E
        E.x= ptOutside.x-ptCenter.x;
        E.y= ptOutside.y-ptCenter.y; //平移变换到E
        
        //2. 求园与OE的交点坐标F, 相当于E的缩放变换
        var t= r / Math.sqrt (E.x * E.x + E.y * E.y);  //得到缩放比例
        F.x= E.x * t;   F.y= E.y * t;   //缩放变换到F
        
        //3. 将E旋转变换角度a到切点G，其中cos(a)=r/OF=t, 所以a=arccos(t);
        var a=-Math.acos(t);   //得到旋转角度
        G.x=F.x*Math.cos(a) -F.y*Math.sin(a);
        G.y=F.x*Math.sin(a) +F.y*Math.cos(a);    //旋转变换到G
        
        //4. 将G平移到原来的坐标下得到新坐标H
        H.x=G.x+ptCenter.x;
        H.y=G.y+ptCenter.y;             //平移变换到H

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
