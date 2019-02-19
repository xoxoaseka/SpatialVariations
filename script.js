var container;
    var balls = 1;
    var ballGap = 800;
    var tableLength = balls * ballGap;
    var camera, scene, renderer, group;
    var stringTopY = 1000,
        stringDec = 20,
        omegaBase = 4,
        omegaInc = 0.15,
        swingWidth = 400,
        swingHeight = 50,
        tableZ = -balls * ballGap / 2;
    var cubes = [],
        lines = [],
        mouseX,
        mouseY,
        windowHalfX = window.innerWidth / 2,
        windowHalfY = window.innerHeight / 2;
    init();
    animate();

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(470, window.innerWidth / window.innerHeight, 1, 20000);
        camera.position.z = 1100;
        camera.position.y = 1000;
        camera.position.x = 500;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(camera);
      
        var pointLight;
        pointLight = new THREE.PointLight(0xffffff, 1, 25500);
        pointLight.position.x = 2500;
        pointLight.position.y = stringTopY + 1500;
        pointLight.position.z = 2000;
        scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffffff, 1, 15500);
        pointLight.position.x = -5000;
        pointLight.position.y = -5500;
        pointLight.position.z = 500;
        scene.add(pointLight);


        var tableMaterial = new THREE.MeshLambertMaterial({
            color: 0x000000
        });
        var topBar = new THREE.CubeGeometry(100, 100, tableLength);
        var mesh = new THREE.Mesh(topBar, tableMaterial);
        mesh.position.y = stringTopY + 50;
        mesh.position.z = tableZ;
        scene.add(mesh);
      
        var geometry = new THREE.SphereGeometry(300, 300, 300);
        var ballMaterial = new THREE.MeshLambertMaterial({
            color: 0xffff00,
            overdraw: true,
            fog: false,
            shading: THREE.FlatShading
        });

        var stringMaterial = new THREE.LineBasicMaterial({
            vertexColors: true
        });

        for (i = 0; i < balls; i++) {
            mesh = new THREE.Mesh(geometry, ballMaterial);
            cubes.push(mesh)
            mesh.position.z = -i * ballGap;
            var xy = pendulumXY(i, 0);
            mesh.position.x = xy[0];
            mesh.position.y = xy[1];
            scene.add(mesh);

            var lineGeometry = new THREE.Geometry();

            var color1 = new THREE.Color(0xffff00),
                color2 = new THREE.Color(0xffff00);
            var v1 = new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z);
            var v2 = new THREE.Vector3(0, stringTopY, mesh.position.z);
            lineGeometry.vertices.push(v1);
            lineGeometry.vertices.push(v2);
            lineGeometry.colors.push(color1, color2);
            var line = new THREE.Line(lineGeometry, stringMaterial, THREE.LineSegments);
            lines.push(line);
            scene.add(line);
        }
        var geometry = new THREE.PlaneGeometry(20000, 2000);
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometry, material);
        scene.add(plane);
        plane.rotation.y = Math.PI / 2;
        
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        });
        renderer.setClearColor(0x000000, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container = document.getElementById('container');
        container.appendChild(renderer.domElement);

        this.controls = new THREE.OrbitControls(camera, renderer.domElement);
        this.controls.target = new THREE.Vector3(0, 0, 0);

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * 10;
        mouseY = (event.clientY - windowHalfY) * 10;

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
    }

    function pendulumXY(i, t) {
        var stringLen = stringTopY - i * stringDec;
        var omega = omegaBase + i * omegaInc;
        var x = Math.sin(t * omega) * swingWidth;
        var y = stringTopY - Math.sqrt(stringLen * stringLen - x * x);
        return [x, y];
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        var timer = Date.now() * 0.00025;
        for(var i = 0; i < cubes.length; i++) {
            var xy = pendulumXY(i, timer);
            cubes[i].position.x = xy[0];
            cubes[i].position.y = xy[1];
            cubes[i].rotation.z = Math.atan(cubes[i].position.x / (stringTopY + cubes[i].position.y));
            lines[i].geometry.vertices[0].x = cubes[i].position.x;
            lines[i].geometry.vertices[0].y = cubes[i].position.y;
            lines[i].geometry.verticesNeedUpdate = true;
        }
        renderer.render(scene, camera);
    }
