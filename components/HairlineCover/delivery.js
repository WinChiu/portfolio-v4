import HL from './kernel.js?v=a41f71cc';

/** An automatic delivery loop: dispatch, unload, store, return and reload. */
const { Cam, fit, proj, facing, rrect, ringAt, prism, poly, open, hull, fillet, seg, run,
  mk, solid, put, clamp, lerp, tween, tset, tval, tdone, pointer, register, disposer, reducedMotion } = HL;
function mount({ stage, svg, read }, value) {
  const bag = disposer(), C = Cam(45, 0.5, 1.48);
  fit(C, [[-6, -6, 0], [186, -6, 0], [-6, 96, 0], [186, 96, 0], [145, 0, 63]], 200, 166);
  const P = proj(C), front = facing(C), root = mk("g", { "data-delivery": "ready" }, svg);
  let state = 0, busy = false, over = -1, travel = value, motion = tween(0), last = "", layer = "", order = "";
  let dwell = 0, part = 0;
  const tempo = 1.3;
  // Every physical action gets its own clock; one eased clock compresses early steps.
  const sequences={3:[[0.2,900],[0.55,1400],[0.8,1100],[1,700]],5:[[0.22,900],[0.8,2200],[1,900]],
    7:[[0.3,1100],[0.6,900],[1,1000]],9:[[0.12,1000],[0.22,900],[0.31,1100],[0.47,1400],[0.6,1000],[0.72,1200],[0.82,1100],[0.92,1400],[1,900]]};
  const labels = ["ready", "delivering", "parked", "unloading", "unloaded", "storing", "received", "closing", "returning", "loading"];
  function block(el, box, r, z0, z1, Q = P, keep = front) {
    const [a,b,c,d] = box, e = 0.7;
    put(el, prism(Q, keep, rrect(a,b,c,d,r,10), rrect(a+e,b+e,c-e,d-e,Math.max(0.4,r-e),10), z0,z1));
  }
  function fixed(g, box, r, z0, z1) { const el = solid(g); block(el,box,r,z0,z1); return el; }
  function face(g, Q, box, r, cls = "lo") { return mk("path", { d:poly(rrect(...box,r,10).map(q=>Q(q.u,q.v))),class:cls },g); }
  function building(back,name,foot,height,opening,box){
    const front=mk("g",{"data-building":name},root),el=solid(front),[x0,x1,fy,top]=opening;
    const ring=rrect(...foot,3.5,14),outer=hull(ringAt(P,ring,0).concat(ringAt(P,ring,height)));
    const hole=rrect(x0,3,x1,top,0.6,10).map(q=>P(q.u,fy,q.v));
    const area=a=>a.reduce((s,p,i)=>{const q=a[(i+1)%a.length];return s+p[0]*q[1]-q[0]*p[1];},0);
    if(area(outer)*area(hole)>0)hole.reverse();
    const inner=rrect(foot[0]+0.8,foot[1]+0.8,foot[2]-0.8,foot[3]-0.8,2.7,14);
    put(el,{sil:poly(outer)+poly(hole),crease:open(ringAt(P,run(inner,frontFacing),height))});
    mk("path",{d:poly(hole),class:"fo","data-interior":name},back);
    return {front,door:mk("path",{class:"sil","data-part":name+"-door"},front),box,opening};
  }
  fixed(root,[-6,-6,186,96],10,-3,0);
  face(root,(x,y)=>P(x,y,0.1),[0,50,180,88],14,"nf lo");
  const factory = mk("g",{},root);
  const frontFacing=front;
  const factoryBay=building(factory,"factory",[6,4,48,43],29,[15,40,43.1,24],[18,35,29,41]),factoryFront=factoryBay.front,factoryDoor=factoryBay.door;
  const chimney=mk("g",{"data-part":"chimney"},root);
  fixed(chimney,[9,8,16,15],1.8,29,44);
  face(chimney,(u,v)=>P(u,v,44.1),[10.2,9.2,14.8,13.8],0.8,"nf lo");
  [11,25].forEach(y=>face(factoryFront,(u,z)=>P(48.1,u,z),[y,17,y+8,23],1.3));
  const hospital = mk("g",{},root);
  const hospitalBay=building(hospital,"hospital",[105,0,174,44],29,[110,135,44.1,24],[113,36,124,42]),hospitalFront=hospitalBay.front,hospitalDoor=hospitalBay.door;
  const wards=mk("g",{"data-part":"hospital-wards"},root);
  fixed(wards,[141,0,174,28],3.5,29,62);
  for(let row=0;row<3;row++) for(let col=0;col<3;col++)
    face(wards,(x,z)=>P(x,28.1,z),[146+col*8,34+row*9,151+col*8,40+row*9],1.3);
  face(hospitalFront,(x,z)=>P(x,44.1,z),[156,3,168,22],1.5);
  const previews=[{id:2,name:"factory",...factoryBay},{id:3,name:"hospital",...hospitalBay}].map(p=>{
    const g=mk("g",{"data-stock":p.name},root);p.front.before(g);
    return {...p,g,el:solid(g),band:mk("path",{class:"nf lo"},g),tw:tween(0),phase:0,v:0,held:0};
  });
  const reserved=p=>p.id===2?state===8||state===9:state>=1&&state<=6;
  function updatePreviews(dt,now){previews.forEach(p=>{
    if(reserved(p)&&(p.phase===1||p.phase===2)){p.phase=3;tset(p.tw,0,now,0);}
    if(p.phase===1&&tdone(p.tw,now)){p.phase=2;p.held=0;}
    if(p.phase===2){p.held+=dt;if(p.held>1.1){p.phase=3;tset(p.tw,0,now,0);}}
    if(p.phase===3&&tdone(p.tw,now))p.phase=0;p.v=tval(p.tw,now);
  });}
  const truck = mk("g",{"data-part":"truck"},root);
  const chassis = solid(truck), bed = solid(truck), farBoard = solid(truck);
  const cargo = mk("g",{"data-part":"cargo"},truck), crate = solid(cargo), straps = mk("path",{class:"nf lo"},cargo);
  const cab = solid(truck);
  const windshield = mk("path",{class:"lo","data-part":"windshield"},cab.g), sideWindow = mk("path",{class:"lo","data-part":"side-window"},cab.g);
  const nearBoard = solid(truck), tailGroup=mk("g",{"data-piece":"tailgate"},truck), tail = mk("path",{class:"sil","data-part":"tailgate"},tailGroup);
  [[chassis,"chassis"],[bed,"bed"],[farBoard,"far-board"],[cab,"cab"],[nearBoard,"near-board"],[crate,"crate"]].forEach(([el,id])=>el.g.setAttribute("data-piece",id));
  const wheels = Array.from({length:4},(_,i)=>{const g=mk("g",{"data-piece":"wheel-"+i},truck);return {g,el:solid(g),hub:mk("path",{class:"nf lo"},g)};});
  const hold = (v,a,b)=>clamp((v-a)/(b-a),0,1);
  function pose(s,p) {
    let x=38, angle=0, gate=0, lift=12, cx=31, cy=67, cz=12, f=0, h=0, visible=true;
    if(s===1) { x=lerp(38,145,p); cx=x-7; }
    if(s>=2&&s<=7) { x=145; cx=138; }
    if(s===3||s===4||s===5||s===6) {
      gate=s===3?hold(p,0,0.2):1;
      const roll=s===3?hold(p,0.2,0.55):1, lower=s===3?hold(p,0.55,0.8):1, exit=s===3?hold(p,0.8,1):1;
      cx=138-18*roll-4*exit; lift=12-8*lower; cz=lift;
    }
    if(s===5) { h=hold(p,0,0.22)*(1-hold(p,0.8,1)); cy=lerp(67,31,hold(p,0.22,0.8)); }
    if(s===6||s===7||s===8) visible=false;
    if(s===7) { lift=4+8*hold(p,0,0.3); gate=1-hold(p,0.3,0.6); angle=Math.PI*hold(p,0.6,1); }
    if(s===8) { x=lerp(145,38,p); angle=Math.PI; }
    if(s===9) {
      angle=Math.PI+Math.PI*hold(p,0,0.12);
      f=hold(p,0.22,0.31)*(1-hold(p,0.92,1)); gate=hold(p,0.12,0.22)*(1-hold(p,0.92,1));
      const out=hold(p,0.31,0.47), align=hold(p,0.47,0.6), approach=hold(p,0.6,0.72), raise=hold(p,0.72,0.82), bed=hold(p,0.82,0.92);
      cx=26-13*align+18*bed; cy=30+20*out+17*approach; cz=4+8*raise;
      lift=12-8*hold(p,0.22,0.31)+8*raise;
    }
    return {x,angle,gate,lift,cx,cy,cz,f,h,visible};
  }
  function door(el,x0,x1,y,height,o) {
    el.setAttribute("d",poly(rrect(x0,3+(height-4)*o,x1,height,0.6,8).map(q=>P(q.u,y,q.v))));
  }
  function inventory(v){
    const [x0,y0,x1,y1]=v.box;block(v.el,v.box,1.4,4,14);
    v.band.setAttribute("d",seg(P(x0,(y0+y1)/2,14.1),P(x1,(y0+y1)/2,14.1))+
      seg(P((x0+x1)/2,y0,14.1),P((x0+x1)/2,y1,14.1)));
  }
  function paint(parts) {
    const behind=(a,b)=>[0,1,2].some(i=>a.box[i+3]<=b.box[i]+0.01), pending=parts.slice(), sorted=[];
    while(pending.length){
      const ready=pending.filter(b=>!pending.some(a=>a!==b&&behind(a,b)&&!behind(b,a)));
      const next=(ready.length?ready:pending).slice().sort((a,b)=>a.depth-b.depth)[0];
      sorted.push(next);pending.splice(pending.indexOf(next),1);
    }
    const key=layer+":"+sorted.map(p=>p.id).join();
    if(key!==order){sorted.forEach(p=>truck.append(p.g));order=key;}
  }
  function draw(p) {
    const key=state+":"+p+":"+over+":"+previews.map(v=>v.v+"/"+v.phase).join(); if(key===last)return; last=key;
    const a=pose(state,p), c=Math.cos(a.angle), s=Math.sin(a.angle);
    const Q=(x,y,z)=>P(a.x+x*c-y*s,67+x*s+y*c,z);
    const W=(x,y,z)=>[a.x+x*c-y*s,67+x*s+y*c,z], parts=[];
    function add(g,id,points){const box=[0,1,2].map(i=>Math.min(...points.map(p=>p[i]))).concat([0,1,2].map(i=>Math.max(...points.map(p=>p[i]))));parts.push({g,id,box,depth:(box[0]+box[3]+box[1]+box[4]+0.82*(box[2]+box[5]))/2});}
    const keep=q=>front({...q,nu:q.nu*c-q.nv*s,nv:q.nu*s+q.nv*c});
    function vehicle(el,id,b,r,z0,z1){block(el,b,r,z0,z1,Q,keep);add(el.g,id,[W(b[0],b[1],z0),W(b[2],b[1],z1),W(b[0],b[3],z1),W(b[2],b[3],z0)]);}
    vehicle(chassis,"chassis",[-19,-10,21,10],3,5,9);vehicle(bed,"bed",[-18,-9,7,9],2,9,12);
    vehicle(farBoard,"far-board",[-18,-9,7,-7],0.8,12,17);vehicle(nearBoard,"near-board",[-18,7,7,9],0.8,12,17);
    vehicle(cab,"cab",[7,-9,21,9],3,9,28);
    windshield.setAttribute("d",c+s>0?poly(rrect(-6,17,6,24,1.5,8).map(q=>Q(21.1,q.u,q.v))):"");
    sideWindow.setAttribute("d",poly(rrect(10,18,18,24,1.4,8).map(q=>Q(q.u,(c-s>=0?1:-1)*9.1,q.v))));
    const theta=a.gate*Math.PI/2;
    tail.setAttribute("d",poly(rrect(-9,0,9,13,1.2,8).map(q=>Q(-18-q.v*Math.sin(theta),q.u,a.lift+q.v*Math.cos(theta)))));
    add(tailGroup,"tailgate",[-9,9].flatMap(u=>[0,13].map(v=>W(-18-v*Math.sin(theta),u,a.lift+v*Math.cos(theta)))));
    wheels.forEach((w,i)=>{
      const x=i%2?14:-12, y=i<2?-11:11, V=(u,v,z)=>Q(x+u,y+z,5+v);
      block(w.el,[-3.6,-3.6,3.6,3.6],3.6,-0.8,0.8,V);
      const spin=(a.x-38)/3.6; w.hub.setAttribute("d",seg(V(-2*Math.cos(spin),-2*Math.sin(spin),0.9),V(2*Math.cos(spin),2*Math.sin(spin),0.9)));
      add(w.g,"wheel-"+i,[-3.6,3.6].flatMap(u=>[-0.8,0.8].flatMap(v=>[1.4,8.6].map(z=>W(x+u,y+v,z)))));
    });
    const nextLayer=!a.visible?"stored":state===9&&a.cy<41?"factory":state===5&&a.cy+5<44?"hospital":"road";
    if(layer!==nextLayer) {
      if(nextLayer==="factory")factoryFront.before(cargo);
      else if(nextLayer==="hospital"||nextLayer==="stored")hospitalFront.before(cargo);
      else truck.append(cargo); layer=nextLayer;
    }
    if(a.visible) {
      block(crate,[a.cx-6,a.cy-5,a.cx+6,a.cy+5],1.8,a.cz,a.cz+12);
      straps.setAttribute("d",seg(P(a.cx-6,a.cy,a.cz+12.1),P(a.cx+6,a.cy,a.cz+12.1))+
        seg(P(a.cx,a.cy-5,a.cz+12.1),P(a.cx,a.cy+5,a.cz+12.1)));
    } else { crate.sil.setAttribute("d","");crate.cr.setAttribute("d","");straps.setAttribute("d",""); }
    if(layer==="road"&&a.visible)add(cargo,"cargo",[[a.cx-6,a.cy-5,a.cz],[a.cx+6,a.cy+5,a.cz+12]]);
    paint(parts);
    previews.forEach(v=>{const show=v.v>0&&!(v.id===2?state===9:state===5);
      if(show)inventory(v);
      else{v.el.sil.setAttribute("d","");v.el.cr.setAttribute("d","");v.band.setAttribute("d","");}
      v.g.setAttribute("data-preview",String(v.phase));
    });
    door(factoryDoor,...factoryBay.opening,Math.max(a.f,previews[0].v)); door(hospitalDoor,...hospitalBay.opening,Math.max(a.h,previews[1].v));
    const chosen=over>1?over:state===3||state===4?1:state===5||state===6?3:state===9?2:0;
    chassis.sil.classList.toggle("hi",chosen===0); crate.sil.classList.toggle("hi",chosen===1);
    factoryDoor.classList.toggle("hi",chosen===2); hospitalDoor.classList.toggle("hi",chosen===3);
    root.setAttribute("data-delivery",labels[state]); root.setAttribute("data-busy",String(busy));
    const inspect=previews.find(v=>v.id===over);
    read.textContent=over<0?"rest":inspect?inspect.name+" · "+(reserved(inspect)?"busy":"stock"):labels[state];
  }
  const sequence=()=>sequences[state]||[[1,travel*700]];
  function segment(now) {
    motion=tween(0,sequence()[part][1]/tempo);
    tset(motion,1,now,0); last="";
  }
  function progress(now) {
    const steps=sequence(), from=part?steps[part-1][0]:0, p=tval(motion,now);
    const eased=sequences[state]?p*p*(3-2*p):p;
    return lerp(from,steps[part][0],eased);
  }
  function enter(next,now) { state=next; busy=true; dwell=0; part=0; segment(now); }
  const loop=register(stage,(dt,now)=>{
    updatePreviews(dt,now);
    if(reducedMotion()){state=0;busy=false;dwell=0;draw(0);return previews.some(p=>p.phase>0);}
    if(busy&&tdone(motion,now)) {
      if(part+1<sequence().length){part++;segment(now);}
      else {
        const next={1:2,3:4,5:6,7:8,8:9,9:0}[state];
        if(state===7||state===8)enter(next,now); else {state=next;busy=false;dwell=0;last="";}
      }
    }
    if(!busy){dwell+=dt;if(dwell>0.7/tempo)enter({0:1,2:3,4:5,6:7}[state],now);}
    draw(busy?progress(now):state===0?0:1);
    return true;
  }); bag.add(loop.unregister);
  const areas=[[2,6,4,48,43,44],[3,105,0,174,44,62]].map(([id,x0,y0,x1,y1,z])=>({id,poly:hull([x0,x1].flatMap(x=>[y0,y1].flatMap(y=>[0,z].map(h=>P(x,y,h)))))}));
  function hit([x,y]){for(const a of areas){const crosses=a.poly.map((p,i)=>{const q=a.poly[(i+1)%a.poly.length];return(q[0]-p[0])*(y-p[1])-(q[1]-p[1])*(x-p[0]);});if(crosses.every(c=>c>=0)||crosses.every(c=>c<=0))return a.id;}return x>45&&x<355&&y>65&&y<270?0:-1;}
  bag.add(pointer(stage,{ move:p=>{over=hit(p);last="";draw(busy?progress(performance.now()):state===0?0:1);loop.wake();},
    down:point=>{over=hit(point);const p=previews.find(p=>p.id===over);if(p&&!reserved(p)){p.phase=1;p.held=0;tset(p.tw,1,performance.now(),0);last="";loop.wake();}},
    leave:()=>{over=-1;last="";draw(busy?progress(performance.now()):state===0?0:1);} }));
  bag.add(()=>svg.replaceChildren());draw(0);loop.wake();
  return {set:v=>{travel=v;},destroy:bag.dispose};
}
export { mount };
export { HL };
