var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000, 1);
document.body.appendChild(renderer.domElement);

var light = new THREE.DirectionalLight(0xfffff, 1.5);
light.position.set(0, 0, 1);
scene.add(light);
camera.position.z = 50;

var mesh_size = 15;
var mesh_radius = mesh_size / 2;

var shapes = []
var material = new THREE.MeshPhongMaterial({color: 0xe0ffff});
shapes.push(new THREE.Mesh(new THREE.BoxGeometry(mesh_size, mesh_size, mesh_size), material));
shapes.push(new THREE.Mesh(new THREE.CylinderGeometry(mesh_radius, mesh_radius, 10, 20), material));
shapes.push(new THREE.Mesh(new THREE.DodecahedronGeometry(mesh_radius, 0), material));
shapes.push(new THREE.Mesh(new THREE.IcosahedronGeometry(mesh_radius, 0), material));
shapes.push(new THREE.Mesh(new THREE.SphereGeometry(mesh_radius, 20, 20), material));
shapes.push(new THREE.Mesh(new THREE.TorusGeometry(mesh_radius, mesh_radius / 3, 16, 50), material));

var max_y = Math.floor(Math.tan((camera.fov / 2) * (Math.PI / 180)) * camera.position.z)
var max_x = Math.floor(max_y * camera.aspect);

var size = mesh_size / 2;
var paddin_x = 10;
var paddin_y = 15;
var t1 = max_x - size - paddin_x;
var t2 = max_y - size - paddin_y;
var px = -t1
var py = t2

shapes.forEach(element => {
    if(px > max_x){
        px = -t1;
        py = -t2;
    }
    element.position.x = px;
    element.position.y = py; 
    px += t1;
    scene.add(element)
});

var x_rot = 0.02;
var y_rot = 0.01;

animate();


function animate(){
    requestAnimationFrame(animate)
    shapes.forEach(element => {
        element.rotation.x += x_rot;
        element.rotation.y += y_rot;
    })
    renderer.render(scene, camera);
}


