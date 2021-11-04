#version 440 core
out vec4 vertColour;	//output colour of vertex
in vec2 textureCoordinate; //tex coords from vertex shader
in vec3 normals;
in vec3 fragmentPosition;
in vec3 lightColour;
in vec3 lightPosition;
in vec3 viewPosition;
in float time;
in vec3 position;

uniform sampler2D aTex;		//uniform holding texture info from main programme


float random(vec2 st)
{
return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.543123);
}




float noiseFunction(vec2 st){
vec2 d = vec2(0.0,1.0);
vec2 b = floor(st);
vec2 f = smoothstep(vec2(0.0),vec2(1.0), fract(st));
return mix(mix(random(b), random(b + d.yx), f.x), mix(random(b + d.xy), random(b +
d.yy), f.x), f.y);
}

// Classic Perlin 2D Noise
// by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
float cnoise(vec2 P){
 vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
 vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
 Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
 vec4 ix = Pi.xzxz;
 vec4 iy = Pi.yyww;
 vec4 fx = Pf.xzxz;
 vec4 fy = Pf.yyww;
 vec4 i = permute(permute(ix) + iy);
 vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
 vec4 gy = abs(gx) - 0.5;
 //vec4 tx = sin(floor(gx + 0.5)+ iTime/7.0); // animate with time and rotate with sin
 vec4 tx = floor(gx + 0.5);
 gx = gx - tx;
 vec2 g00 = vec2(gx.x,gy.x); 
 vec2 g10 = vec2(gx.y,gy.y);
 vec2 g01 = vec2(gx.z,gy.z);
 vec2 g11 = vec2(gx.w,gy.w);
 vec4 norm = 1.79284291400159 - 0.85373472095314 *
 vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
 g00 *= norm.x;
 g01 *= norm.y;
 g10 *= norm.z;
 g11 *= norm.w;
 float n00 = dot(g00, vec2(fx.x, fy.x));
 float n10 = dot(g10, vec2(fx.y, fy.y));
 float n01 = dot(g01, vec2(fx.z, fy.z));
 float n11 = dot(g11, vec2(fx.w, fy.w));
 vec2 fade_xy = fade(Pf.xy);
 vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
 float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
 return 2.3 * n_xy;
} 


void main()
{	//LIGHTING
	//ambient component
	//********************************
	//set the ambient coeff from material
	float lightAmbientStrength = 0.3f;
	vec3 objectAmbientReflectionCoeff = vec3(1.0f, 1.0f, 1.0f);
	vec3 ambient = (lightAmbientStrength * objectAmbientReflectionCoeff) * lightColour;
	
	//diffuse component
	//********************************
	//normalise normal vectors (reset them as unit vectors)
	vec3 nNormal = normalize(normals);
	//calculate the light direction from the light position and the fragment position
    vec3 lightDirection = normalize(lightPosition - fragmentPosition);
	
	//determine the dot product of normal direction and light direction
	float diffuseStrength = max(dot(nNormal, lightDirection), 0.0f);
	
	//combine this with the light colour
	//set the diffuse coeff from material
	vec3 objectDiffuseReflectionCoeff = vec3(1.0f, 1.0f, 1.0f);
    vec3 diffuse = (diffuseStrength * objectDiffuseReflectionCoeff) * lightColour;
	
	//specular component
	//**********************************
	float specularStrength = 0.4f;
	vec3 viewDirection = normalize(viewPosition - fragmentPosition);
    vec3 reflectDirection = reflect(-lightDirection, nNormal); 
	float sp = pow(max(dot(viewDirection, reflectDirection), 0.0), 8);
    vec3 specular = specularStrength * sp * lightColour; 
	//**************************************
	//
	



	vec2 uv = textureCoordinate;

	vec3 col = 0.5 + 0.5*cos(((time/1000)+uv.xyx+vec3(0,2,4)));
	//uv.y = 0.5+0.5*cos((time + uv.y));

	//vec4 textureColour = texture(aTex, uv);
	//vec4 textureColour = vec4(col,1.0);

	

	vec4 textureColour = texture(aTex, textureCoordinate)+vec4((step(0.00, position.y+(sin(time/2000.0)))*vec3(1.0,1.0,1.0)),1.0);
	
	


	vertColour = vec4((ambient+diffuse+specular),1.0) * textureColour;
	
	//apply no lighting, ambient and diffuse components with colour contributed by texture
	//vertColour = (textureColour);
	//vertColour = textureColour;
	//vertColour = (vec4((lightColour), 1.0) * textureColour);
	//vertColour = (vec4((ambient),1.0) * textureColour);
	//vertColour = (vec4((ambient+diffuse),1.0) * textureColour);
	//vertColour = (vec4((ambient+diffuse+specular),1.0) * textureColour);
	
}