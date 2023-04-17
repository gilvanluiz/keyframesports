import * as THREE from 'three';

export class Field3DManager {
    initialize = function (width, height) {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true,
        });
        this.canvas = this.renderer.domElement;

        this.initCamera();
        this.initLights();
        this.initRaycaster();
        this.canvasResize(width, height);
        this.initField();
    };

    initField = function () {
        let planeWidth = 40;

        let geometry = new THREE.PlaneGeometry(
            2.5 * planeWidth,
            planeWidth,
            32
        );
        let material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            opacity: 1,
            side: THREE.DoubleSide,
            transparent: true,
        });

        this.field = new THREE.Mesh(geometry, material);

        this.field.rotation.x = -1.03;
        this.field.rotation.y = -0.05;
        this.field.rotation.z = -0.08;

        this.field.position.z = -planeWidth / 2 - 1.4;
        this.field.position.y = -1;


        this.scene.add(this.field);
    };

    setTextureCanvas = function (canvas) {
        let texture = new THREE.Texture(canvas);
        this.field.material.map = texture;
    };

    updateTextureCanvas = function () {
        this.field.material.map.needsUpdate = true;
    };

    render = function () {
        this.renderer.render(this.scene, this.camera);
    };

    initCamera = function () {
        this.camera = new THREE.PerspectiveCamera(75, 1, 1, 5000);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 0;
        this.camera.rotation.x = 0;
        this.camera.rotation.y = 0;
        this.camera.rotation.z = 0;

        this.scene.add(this.camera);
    };

    initRaycaster = function () {
        this.raycaster = new THREE.Raycaster();
    };

    normalizePosition = function (position, width, height) {
        let normMousePosition = new THREE.Vector2();
        normMousePosition.x = (position.x / width) * 2 - 1;
        normMousePosition.y = -(position.y / height) * 2 + 1;
        return normMousePosition;
    };

    getTelestrationCoordinates = function (position, width, height) {
        // receives normalized position
        let normalizedMousePosition = this.normalizePosition(
            position,
            width,
            height
        );

        this.raycaster.setFromCamera(normalizedMousePosition, this.camera);
        let intersects = this.raycaster.intersectObjects([this.field], true);
        if (intersects.length > 0) {
            return intersects[0].uv;
        } else {
            return null;
        }
    };

    initLights = function () {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(this.ambientLight);
    };

    canvasResize = function (width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.camera.aspect = this.canvas.width / this.canvas.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.width, this.canvas.height);
    };
}
