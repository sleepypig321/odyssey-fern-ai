export const BLACKHOLE_SCRIPT = `// Cinematic Creative Universe black hole (native WebGL; no external runtime dependency).
// Visual is an artistic, scientifically inspired shader, not a physical GR simulation.
(() => {
  const canvas = document.getElementById('blackhole-space');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', {alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'low-power'});
  if (!gl) { document.documentElement.classList.add('no-blackhole-webgl'); return; }
  const vertex = \`
attribute vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}
\`;
  const fragment = \`
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float travel;
uniform float hover;
#define PI 3.14159265359
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 x){
 vec2 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
}
vec3 tone(vec3 c){return 1.0-exp(-c);}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*resolution)/max(1.,resolution.y);
 uv.y -= .018;
 float zoom=1.0+travel*5.6;
 uv/=zoom;
 float r=length(uv);
 float angle=atan(uv.y,uv.x);
 float horizon=.185;
 // Approximate photon trajectories near a black-hole silhouette.
 float bending=.012/(r*r+.0035);
 float warpedAngle=angle + bending*.24;
 vec2 lensed=vec2(cos(warpedAngle),sin(warpedAngle))*(r+.046/(r+.055));
 vec3 col=vec3(0.);
 // Dim, bent starlight behind the black hole.
 vec2 tile=floor(lensed*150.);
 float star=step(.996,hash(tile))*pow(max(0.,1.-length(fract(lensed*150.)-.5)*2.),6.);
 col+=vec3(.56,.68,1.)*star*.55;
 // Near-face accretion disk: elliptical projection gives depth and perspective.
 float tilt=.27;
 vec2 disk=vec2(uv.x,(uv.y+.008)/tilt);
 float diskRadius=length(disk);
 float phi=atan(disk.y,disk.x);
 float turbulent=noise(vec2(phi*5.4+time*.12,diskRadius*20.-time*.14));
 float turbulent2=noise(vec2(phi*11.-time*.18,diskRadius*33.));
 float spiral=sin(phi*8.-diskRadius*28.+time*.33)*.5+.5;
 float ringShape=exp(-pow((diskRadius-.43)/.125,2.));
 float middle=exp(-pow((diskRadius-.39)/.047,2.));
 float diskTexture=.48+.35*turbulent+.18*turbulent2+.25*spiral;
 float behind=uv.y>0.0?1.0:.84;
 vec3 hot=vec3(1.8,1.02,.45);
 vec3 cold=vec3(.53,.59,.98);
 vec3 diskLight=mix(cold,hot,clamp(.2+.78*turbulent+.18*spiral,0.,1.));
 // Posterior disk sits behind the silhouette; anterior disk remains visible.
 float diskMask=ringShape*diskTexture*behind;
 col+=diskLight*diskMask*1.8;
 col+=vec3(2.5,1.3,.65)*middle*diskTexture*.42;
 // Gravitationally lensed upper and lower arcs above the shadow.
 float arc=exp(-pow((r-.255)/.026,2.))*smoothstep(-.12,.24,uv.y/max(r,.001));
 col+=vec3(1.75,1.15,.77)*arc*.85;
 float lowerArc=exp(-pow((r-.257)/.034,2.))*(1.-smoothstep(-.8,.1,uv.y/max(r,.001)));
 col+=vec3(.7,.48,.76)*lowerArc*.26;
 // The photon ring is unevenly bright, like light beamed toward an observer.
 float photon=exp(-pow((r-.197)/.012,2.))*(.4+.6*smoothstep(-.9,.8,cos(angle+1.2)));
 col+=vec3(2.2,1.67,1.1)*photon*.78;
 // Absolute event horizon. No radial-gradient circle or bright central star.
 float swallowed=1.-smoothstep(horizon-.007,horizon+.008,r);
 col*=1.-swallowed;
 // Surrounding plasma scatter makes the object part of the scene.
 float atmosphere=exp(-pow((r-.34)/.25,2.))*.035;
 col+=vec3(.75,.38,.22)*atmosphere*(1.-swallowed);
 col*=1.+hover*.16;
 float coverage=clamp(max(max(diskMask*.9,arc*.8),max(photon*.9,atmosphere*2.)),0.,1.);
 // The dark silhouette must occlude the WebGL starfield behind it.
 float alpha=max(coverage,swallowed);
 col=tone(col);
 gl_FragColor=vec4(col,alpha);
}
\`;
  function compile(kind,source) {
    const shader=gl.createShader(kind);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
      console.error('Black hole shader compile failed:',gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);return null;
    }
    return shader;
  }
  const vert=compile(gl.VERTEX_SHADER,vertex),frag=compile(gl.FRAGMENT_SHADER,fragment);
  if(!vert||!frag){document.documentElement.classList.add('no-blackhole-webgl');return}
  const program=gl.createProgram();gl.attachShader(program,vert);gl.attachShader(program,frag);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
    console.error('Black hole program link failed:',gl.getProgramInfoLog(program));
    document.documentElement.classList.add('no-blackhole-webgl');return;
  }
  gl.useProgram(program);
  document.documentElement.classList.add('has-blackhole-webgl');
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(program,'position');
  gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const res=gl.getUniformLocation(program,'resolution'), tloc=gl.getUniformLocation(program,'time');
  const travel=gl.getUniformLocation(program,'travel'),hover=gl.getUniformLocation(program,'hover');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const entry=document.getElementById('portal-star');
  let progress=0,glow=0,last=0;
  function draw(ts){
    requestAnimationFrame(draw);
    if(document.hidden||document.getElementById('auth-wall')?.hidden)return;
    const w=canvas.clientWidth,h=canvas.clientHeight;
    if(!w||!h)return;
    const ratio=Math.min(window.devicePixelRatio||1,window.innerWidth<700?1:1.4);
    const cw=Math.floor(w*ratio),ch=Math.floor(h*ratio);
    if(canvas.width!==cw||canvas.height!==ch){canvas.width=cw;canvas.height=ch;gl.viewport(0,0,cw,ch)}
    const delta=Math.min(.05,(ts-last)/1000||0);last=ts;
    const target=document.body.classList.contains('entering-universe')?1:0;
    progress=reduce?target:progress+(target-progress)*Math.min(1,delta*2.2);
    const hovered=!!entry?.matches(':hover');
    glow=reduce?0:glow+((hovered?1:0)-glow)*Math.min(1,delta*3);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(res,cw,ch);gl.uniform1f(tloc,reduce?0:ts/1000);
    gl.uniform1f(travel,progress);gl.uniform1f(hover,glow);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLES,0,6);
  }
  requestAnimationFrame(draw);
})();
`;
