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
	

<<<<<<< HEAD:Assets/Shaders/shader_projection_lighting_ADS.frag

	vec2 uv = textureCoordinate;

	vec3 col = 0.5 + 0.5*cos(((time/1000)+uv.xyx+vec3(0,2,4)));
	//uv.y = 0.5+0.5*cos((time + uv.y));

	//vec4 textureColour = texture(aTex, uv);
	vec4 textureColour = vec4(col,1.0);

=======
	vec4 textureColour = texture(aTex, textureCoordinate);
	vertColour = vec4((ambient+diffuse+specular),1.0) * textureColour;
	
	
>>>>>>> eadba4c6cdb3cfbe10f4f8b65f82635a061e9c3b:Assets/Shaders/shader_projection_lighting_ADS_PLANE.frag
	//apply no lighting, ambient and diffuse components with colour contributed by texture
	//vertColour = (textureColour);
	//vertColour = textureColour;
	//vertColour = (vec4((lightColour), 1.0) * textureColour);
	//vertColour = (vec4((ambient),1.0) * textureColour);
	//vertColour = (vec4((ambient+diffuse),1.0) * textureColour);
	//vertColour = (vec4((ambient+diffuse+specular),1.0) * textureColour);
	
}