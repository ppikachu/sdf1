import * as THREE from "three";
import vertex from "./glsl/default.vert";
import fragment from "./glsl/sdf1.frag";

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    //this.renderer.antialias = true;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      100
    );

    this.camera.position.set(0, 0, 2);
    this.time = 0;

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    this.setupMouse();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  
  setupMouse() {
    window.addEventListener('mousemove', this.mousePos.bind(this));
  }

  mousePos(e) {
    this.material.uniforms.u_mouse.value = {
      x: e.screenX,
      y: e.screenY,
    };
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.material.uniforms.u_resolution.value.x = this.width;
    this.material.uniforms.u_resolution.value.y = this.height;

    const dist = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

    if (this.width / this.height > 1) {
      this.plane.scale.x = this.camera.aspect;
    } else {
      this.plane.scale.y = 1 / this.camera.aspect;
    }

    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    const loader = new THREE.TextureLoader();
    this.img_danny = loader.load("assets/danny.png");

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        u_tex0: { value: this.img_danny },
        u_time: { value: 0 },
        u_mouse: { value: new THREE.Vector2() },
        u_resolution: { value: new THREE.Vector2() },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  render() {
    this.time += 0.05;
    this.material.uniforms.u_time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container"),
});