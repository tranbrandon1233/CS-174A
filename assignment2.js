import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Cube extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

class Cube_Outline extends Shape {
    constructor() {
        super("position", "color");
        //  TODO (Requirement 5).
        // When a set of lines is used in graphics, you should think of the list entries as
        // broken down into pairs; each pair of vertices will be drawn as a line segment.
        // Note: since the outline is rendered with Basic_shader, you need to redefine the position and color of each vertex
        this.arrays.position = (Vector3.cast( [-1, -1, -1], [-1,  1, -1], [-1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1, -1, -1],[ 1, -1, -1], [-1, -1, -1],
            [-1, -1,  1], [-1,  1,  1], [-1,  1,  1], [ 1,  1,  1], [ 1,  1,  1], [ 1, -1,  1], [ 1, -1,  1], [-1, -1,  1],
            [-1, -1, -1], [-1, -1,  1], [-1,  1, -1], [-1,  1,  1], [ 1,  1, -1], [ 1,  1,  1], [ 1, -1, -1], [ 1, -1,  1]));
        this.arrays.color = Array(24).fill(color(1, 1, 1, 1));
        this.indices = false;
        }
}

class Cube_Single_Strip extends Shape {
    constructor() {
        super("position", "normal");
        // TODO (Requirement 6)
        this.arrays.position = Vector3.cast(
            [1, -1, 1], [-1, -1, 1], [-1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [1, -1, 1], [-1, -1, 1], [-1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]);
        this.indices.push(1, 0, 5, 1, 2, 5, 1, 2, 4, 2, 4, 7, 2, 5, 7, 5, 7, 6, 1, 0, 4, 
                0, 4, 3, 0, 5, 3, 5, 3, 6, 4, 3, 6, 4, 7, 6);
    }
}


class Base_Scene extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.hover = this.swarm = false;
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'cube': new Cube(),
            'outline': new Cube_Outline(),
            'single_strip': new Cube_Single_Strip()
        };

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
        };
        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());
    
    }

    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(5, -10, -30));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}

export class Assignment2 extends Base_Scene {
    constructor() {
        super();
        this.outline = false;
        this.still = false;
        this.triangle = false;
        this.scale = false;

        /* Set up box colors. */
        this.colors = [color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1)];
        this.set_colors();
        this.maxAngle = 0.05 * Math.PI;
        this.swingCount = 1;
        this.n=0;
    }
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */
    set_colors() {
        // TODO:  Create a class member variable to store your cube's colors.
        // Hint:  You might need to create a member variable at somewhere to store the colors, using `this`.
        // Hint2: You can consider add a constructor for class Assignment2, or add member variables in Base_Scene's constructor.
        this.colors = [color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1),
            color(Math.random() , Math.random() , Math.random() , 1)
        ];
     }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Change Colors", ["c"], this.set_colors);
        // Add a button for controlling the scene.
        this.key_triggered_button("Outline", ["o"], () => {
            // TODO:  Requirement 5b:  Set a flag here that will toggle your outline on and off
            this.outline = !(this.outline);
        });
        this.key_triggered_button("Sit still", ["m"], () => {
            // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
            this.still = !(this.still);
        });
        this.key_triggered_button("Draw Triangle Strip", ["g"], () => {
            // TODO:  Requirement extra credit 1:  
            this.triangle = !(this.triangle);
        });
        this.key_triggered_button("Scale the Y axis of base box 1.5x", ["l"], () => {
            // TODO:  Requirement extra credit 2: Scale the box to 1.5x along the Y axis.
            this.scale = !(this.scale);
        });
    }

    draw_box(context, program_state, model_transform, boxNum) {
        // TODO:  Helper function for requirement 3 (see hint).
        //        This should make changes to the model_transform matrix, draw the next box, and return the newest model_transform.
        // Hint:  You can add more parameters for this function, like the desired color, index of the box, etc.
        
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override({color: this.colors[boxNum]}));
        return model_transform;
    
    }
    draw_outline(context, program_state, model_transform) {
        // TODO: Helperfunction for requirement 5 (see hint).
        //        This should make changes to the model_transform matrix, draw the next box, and return the newest model_transform.
        this.shapes.outline.draw(context, program_state, model_transform, this.white, "LINES");
        return model_transform;
    }

    draw_triangle_strip(context, program_state, model_transform, boxNum) {
        this.shapes.single_strip.draw(context, program_state, model_transform, this.materials.plastic.override({color: this.colors[boxNum]}), "TRIANGLE_STRIP");
        return model_transform;      
    }

    rotation_angle_function(frequency, t) {
        return ((this.maxAngle/2) + ((this.maxAngle/2) * Math.sin(frequency * Math.PI * t)));
    }

    display(context, program_state) {
        super.display(context, program_state);
        let model_transform = Mat4.identity();

        const t = this.still ? this.t=this.n : this.t = program_state.animation_time / 1000;
        const currAngle = this.rotation_angle_function(this.swingCount, t);
        if(!this.still)
            this.n+=t;
       
        // base box without rotation;
        let scaleFactor = this.scale? 1.5: 1;
        model_transform = model_transform.times(Mat4.translation(1, 1, 0))
             .times(Mat4.scale(1, scaleFactor, 1))
             .times(Mat4.translation(-1, 1, 0));
             for (let i = 0; i < 8; i++) {
                model_transform = model_transform.times(Mat4.translation(1, 1, 0))
                    .times(Mat4.rotation(currAngle, 0, 0, 1))
                    .times(Mat4.translation(-1, 1, 0));
                    if (this.outline){
                        if(this.triangle)
                            this.outline = false
                    }
                    else if (this.triangle){
                        if(this.outline)
                            this.triangle = false
                    }
                    if(!this.triangle && this.outline){
                        this.outline ? this.draw_outline(context, program_state, model_transform,i) : this.draw_box(context, program_state, model_transform, i);
                        continue;
                    }
                    else if(!this.outline && this.triangle){
                        this.triangle && i%2 !=0? this.draw_triangle_strip(context, program_state, model_transform, i) : this.draw_box(context, program_state, model_transform, i);
                    }
                    else
                        this.draw_box(context, program_state, model_transform, i);
                }                       
    }
}