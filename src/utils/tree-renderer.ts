import {
  createTree,
  rotateTree,
  treeBounds,
  treeKinds,
  type TreeFace,
} from "./tree-geometry";
export interface TreeRenderer {
  resize(width: number, height: number): void;
  draw(progress: number, time: number, wind: number): void;
  dispose(): void;
}
const vertex = `#version 300 es
precision highp float;
in vec3 aPosition;
in vec3 aNormal;
in vec3 aAnchor;
in vec4 aMeta;
in vec2 aUv;
uniform vec4 uFrame;
uniform float uProgress;
uniform float uTime;
uniform float uWind;
out vec4 vColor;
out vec2 vUv;
out float vKind;
float ease(float a,float b,float p){float t=clamp((p-a)/(b-a),0.,1.);return t*t*(3.-2.*t);}
vec3 turn(vec3 p){float y=-.38,x=.07;float z=-p.x*sin(y)+p.z*cos(y);return vec3(p.x*cos(y)+p.z*sin(y),p.y*cos(x)-z*sin(x),p.y*sin(x)+z*cos(x));}
void main(){
 float kind=aMeta.x,tone=aMeta.y,phase=aMeta.z;
 float envelope=ease(0.,.06,uProgress)*(1.-ease(.94,1.,uProgress));
 float p=uProgress+((phase-.5)*.08-(kind>2.5&&kind<3.5?aMeta.w*.018:0.))*envelope;
 float flush=1.-ease(.07,.28,p),bloom=ease(.14,.31,p)*(1.-ease(.42,.57,p));
 float fruit=ease(.41,.58,p)*(1.-ease(.85,.99,p)),ripe=ease(.57,.8,p),size=.18+.82*ease(.43,.72,p);
 float alpha=kind>2.5&&kind<4.5?bloom:kind>4.5?fruit:1.;
 vUv=aUv;vKind=kind;vColor=vec4(0.);
 if(alpha<.004){gl_Position=vec4(2.,2.,2.,1.);return;}
 vec3 local=aPosition-aAnchor,n=aNormal;
 if(kind>4.5&&kind<5.5){
  vec3 growth=vec3(.48+.52*size,.24+.76*size,.5+.5*size);local*=growth;n=normalize(n/growth);
  float angle=sin(uTime*.65-phase*2.)*uWind*.025,c=cos(angle),s=sin(angle);
  local.xy=mat2(c,s,-s,c)*local.xy;n.xy=mat2(c,s,-s,c)*n.xy;
 }
 if(kind>.5&&kind<2.5){float flutter=sin(uTime*3.4+phase*6.)*uWind*.035*clamp(length(local)/.35,0.,1.);local.y+=flutter;local.z+=flutter*.45;n=normalize(n+vec3(0.,flutter*.2,flutter*.7));}
 vec3 position=aAnchor+local;float weight=pow(max(0.,position.y+.7),1.5);
 position.x+=weight*.018*uWind*(sin(uTime*.8)+.24*sin(uTime*1.7+position.z));position.z+=weight*.009*uWind*cos(uTime*.75);
 vec3 view=turn(position);float k=7./(7.-view.z);
 gl_Position=vec4((view.x*k-uFrame.x)*uFrame.z,(view.y*k+uFrame.y)*uFrame.w+.02,-view.z*.12,1.);
 bool leaf=kind>.5&&kind<2.5;n=normalize(turn(n));vec3 key=normalize(vec3(-.65,1.1,1.8));
 float diffuse=leaf?abs(dot(n,key)):max(0.,dot(n,key)),fill=max(0.,dot(n,normalize(vec3(1.,.5,-.6))));
 float shine=pow(max(0.,dot(n,normalize(vec3(-.3,.9,2.)))),leaf?28.:20.),shade=.27+diffuse*.64+fill*.11;
 vec3 color=vec3(165.,131.,92.);
 if(kind<.5){color*=1.+.025*sin(aPosition.x*110.+aPosition.z*47.+aPosition.y*3.);}
 if(leaf){vec3 mature=vec3(72.+tone*35.,119.+tone*37.,58.+tone*24.);color=kind>1.5?mix(mature,vec3(165.,82.,62.),flush):mature;}
 if(kind>2.5&&kind<3.5)color=vec3(246.,229.,197.);
 if(kind>3.5&&kind<4.5)color=vec3(151.,111.,82.);
 if(kind>4.5&&kind<5.5){float r=ripe*(.86+.14*aMeta.w);color=mix(vec3(89.,142.,57.),vec3(234.,173.-tone*33.,53.),r);color=mix(color,vec3(204.,99.,46.),max(0.,n.x*.6+n.z*.4)*tone*r*.18);}
 if(kind>5.5)color=vec3(123.,118.,62.);
 float haze=clamp((.55-view.z)*.13,0.,1.),specular=shine*(kind>4.5&&kind<5.5?.25:leaf?.12:.1);
 color=mix(color*shade+vec3(230.,222.,192.)*specular,vec3(17.,23.,16.),haze)/255.;
 vColor=vec4(color,alpha);
}`;
const fragment = `#version 300 es
precision highp float;
in vec4 vColor;
in vec2 vUv;
in float vKind;
out vec4 outColor;
void main(){
 if(vColor.a<.004)discard;
 vec3 color=vColor.rgb;
 if(vKind>.5&&vKind<2.5){color*=1.+.07*max(0.,1.-abs(vUv.x)*22.)-.035*smoothstep(.82,1.,abs(vUv.x));if(!gl_FrontFacing)color*=.86;}
 outColor=vec4(color*vColor.a,vColor.a);
}`;

export function createTreeRenderer(
  canvas: HTMLCanvasElement,
  mesh: TreeFace[] = createTree(3),
): TreeRenderer | null {
  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  if (!gl) return null;
  const shaders: WebGLShader[] = [];
  const program = gl.createProgram(),
    buffer = gl.createBuffer(),
    vao = gl.createVertexArray();
  if (!program || !buffer || !vao) return null;
  const cleanup = () => {
    gl!.deleteBuffer(buffer);
    gl!.deleteVertexArray(vao);
    gl!.deleteProgram(program);
    shaders.forEach((s) => gl!.deleteShader(s));
  };
  try {
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
      const shader = gl.createShader(type);
      if (!shader) {
        cleanup();
        return null;
      }
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      cleanup();
      return null;
    }
    // Front-to-back opaque geometry uses depth rejection; developing organs
    // are a separate back-to-front transparency pass. Two bounded draw calls.
    const withDepth = mesh.map((face) => ({
      face,
      depth:
        face.vertices.reduce((sum, p) => sum + rotateTree(p)[2], 0) /
        face.vertices.length,
    }));
    const solid = (face: TreeFace) =>
      face.kind === "branch" || face.kind === "leaf" || face.kind === "flush";
    const opaque = withDepth
      .filter((item) => solid(item.face))
      .sort((a, b) => b.depth - a.depth);
    const transparent = withDepth
      .filter((item) => !solid(item.face))
      .sort((a, b) => a.depth - b.depth);
    const ordered = [...opaque, ...transparent].map((item) => item.face);
    const opaqueCount = opaque.reduce(
      (sum, item) => sum + (item.face.vertices.length - 2) * 3,
      0,
    );
    const data: number[] = [];
    for (const f of ordered)
      for (let i = 1; i < f.vertices.length - 1; i++)
        for (const j of [0, i, i + 1])
          data.push(
            ...f.vertices[j],
            ...f.normals[j],
            ...(f.anchor || [0, 0, 0]),
            treeKinds.indexOf(f.kind),
            f.tone,
            f.phase,
            f.development,
            ...f.uv[j],
          );
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    for (const [name, size, offset] of [
      ["aPosition", 3, 0],
      ["aNormal", 3, 3],
      ["aAnchor", 3, 6],
      ["aMeta", 4, 9],
      ["aUv", 2, 13],
    ] as const) {
      const location = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(
        location,
        size,
        gl.FLOAT,
        false,
        15 * 4,
        offset * 4,
      );
    }
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    const frame = gl.getUniformLocation(program, "uFrame"),
      progress = gl.getUniformLocation(program, "uProgress"),
      time = gl.getUniformLocation(program, "uTime"),
      wind = gl.getUniformLocation(program, "uWind"),
      bounds = treeBounds(mesh),
      count = data.length / 15;
    return {
      resize(width, height) {
        const scale = Math.min(
          (width * 0.92) / bounds.width,
          (height * 0.88) / bounds.height,
        );
        gl!.useProgram(program);
        gl!.viewport(0, 0, canvas.width, canvas.height);
        gl!.uniform4f(
          frame,
          bounds.cx,
          bounds.cy,
          (scale * 2) / width,
          (scale * 2) / height,
        );
      },
      draw(p, t, w) {
        gl!.useProgram(program);
        gl!.bindVertexArray(vao);
        gl!.depthMask(true);
        gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
        gl!.uniform1f(progress, p);
        gl!.uniform1f(time, t);
        gl!.uniform1f(wind, w);
        gl!.disable(gl!.BLEND);
        gl!.drawArrays(gl!.TRIANGLES, 0, opaqueCount);
        gl!.enable(gl!.BLEND);
        gl!.depthMask(false);
        gl!.drawArrays(gl!.TRIANGLES, opaqueCount, count - opaqueCount);
      },
      dispose: cleanup,
    };
  } catch {
    cleanup();
    return null;
  }
}
