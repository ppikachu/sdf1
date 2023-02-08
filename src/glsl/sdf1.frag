#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define SDF_MIX 0.1
#define U_SPEED .05
#define MAX_X .3
#define PLUS_X .5
#define RINGS 64.

#include "lygia/space/ratio.glsl"
#include "lygia/generative/snoise.glsl"
#include "lygia/math/smootherstep.glsl"
#include "lygia/draw/digits.glsl"
#include "lygia/sdf.glsl"

void main(){
  //init stuff:
  vec3 color = vec3(0.0);
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec2 st_b = ratio(st, u_resolution);

  //draw!
  vec2 poss1 = vec2(snoise(vec3(.00,.5,u_time*U_SPEED))*MAX_X+PLUS_X, snoise(vec3(.5,1.,u_time*U_SPEED))*MAX_X+PLUS_X);
  vec2 poss2 = vec2(snoise(vec3(.50,.5,u_time*U_SPEED))*MAX_X+PLUS_X, snoise(vec3(.5,.5,u_time*U_SPEED))*MAX_X+PLUS_X);
  vec2 poss3 = vec2(snoise(vec3(.75,.5,u_time*U_SPEED))*MAX_X+PLUS_X, snoise(vec3(.5,.0,u_time*U_SPEED))*MAX_X+PLUS_X);

  float c = circleSDF(st_b, poss1);
  c = opUnion(c, circleSDF(st_b, poss2), SDF_MIX);
  c = opUnion(c, circleSDF(st_b, poss3), SDF_MIX);
  c = (c<0.5) ? c : 1.0;

  // rings:
  c = smootherstep(0.4,0.6, (cos(RINGS * c)+1.0)/2.0);
  color = vec3(1.0-c);

  //debug
  // color += digits(st - 0.06, poss1.x);
  
  //output:
  gl_FragColor = vec4(vec3(color), 1.0);
}
