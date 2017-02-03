'use strict';

angular.module('BczUiApp')
    .controller('ExploreCtrl', function (loginService, paraService, $state) {
        $(window).scrollTop(1);
        var vm = this;
        paraService.pageLoaded();

        if(!paraService.selectedTab) {
            vm.selectedTab = { id:0, camId : 0 };
            paraService.selectedTab = vm.selectedTab;
        }else{
            vm.selectedTab = paraService.selectedTab;
        }

        vm.selectTab = function (id) {
            vm.selectedTab.id = id;
            vm.selectedTab.camId = 0;
            paraService.selectedTab = vm.selectedTab;
        }

        vm.selectTab(0);

        if($state.current.name == 'explore'){
            vm.selectTab(0);
        }else if($state.current.name == 'exploreServo'){
            vm.selectTab(1);
        }else if($state.current.name == 'exploreSoftware'){
            vm.selectTab(2);
        }





        // WebGL

        var renderer, camera, loader, viewportHeight, viewportWidth, scene, viewportId = 'explore', geoMesh, world, mainprop, backprop, directionalLight,screenMaterial;
        var maxRotSpeed = 0.25, imacScreen;

        if(paraService.screenMaterial){
            screenMaterial = paraService.screenMaterial;
        }else{
            var texture = THREE.ImageUtils.loadTexture( "images/home/software/1.png" );
            screenMaterial = new THREE.MeshPhongMaterial({map : texture,color:0xdddddd, vertexColors : THREE.VertexColors, specular: 0x555555, shininess: 100});
            paraService.screenMaterial = screenMaterial;
        }



        var camLookAt = [
            {
                lookAt: {x:0, y:0, z:0},
                position:[
                    {x: 4, y: 4, z: 6},
                    {x: 2.1, y: 0.8, z: 3},
                    {x: 8, y: 1, z: 8},
                    // {x: 5, y: 5, z: 3},
                    {x: 4, y: 9, z: 4}
                ]
            },
            {
                lookAt: {x:0, y:0, z:0},
                zoom:0.5,
                position:[
                    {x: 4, y: 4, z: 6},
                    {x: 3.5, y: 0.8, z: 3.5},
                    {x: 8, y: 1, z: 8},
                    {x: 4, y: 11, z: 4},
                    // {x: 5, y: 5, z: 3}
                ]
            },
            {
                lookAt: {x:0, y:0, z:0},
                dontRotate: true,
                position:[
                    {x: 2.4, y:0.2, z: 2.4},
                ]
            },
        ]




        function initThree(){
            var threeInter = setInterval(function () {
                if($('#'+viewportId).length > 0){
                    viewportHeight = $('#'+viewportId).height();
                    viewportWidth = $('#'+viewportId).width();
                    init();
                    clearInterval(threeInter);
                }
            },20)
        }

        function init() {
            if(paraService.rendererE){
                renderer = paraService.rendererE;
            } else{
                renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
                paraService.rendererE = renderer;
            }


            renderer.setSize(viewportWidth, viewportHeight);
            // to antialias the shadow
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowCameraFar = 40000;
            renderer.shadowCameraNear = 0.05;


            renderer.sortObjects = false;
            renderer.shadowMapWidth = 3072;
            renderer.shadowMapHeight = 3072
            renderer.shadowCameraNear = 2;
            renderer.shadowCameraFar = 40;
            renderer.shadowMapBias = -0.00022;
            renderer.shadowMapDarkness = 0.55;
            renderer.shadowMapSoft      = true;
            renderer.physicallyBasedShading = true;


            renderer.setClearColor( 0x000000, 0 ); // the default
            document.getElementById(viewportId).appendChild(renderer.domElement);

            if(paraService.exploreCamera) delete paraService.exploreCamera;

            camera = new THREE.PerspectiveCamera(45, viewportWidth / viewportHeight, 0.01, 1000);

            if(!paraService.exploreScene){

                scene   = new THREE.Scene();
                scene.fog	= new THREE.FogExp2( '#777777', 0.04 );
                loader  = new THREE.JSONLoader();
                world   = new THREE.Group();
                paraService.exploreScene = scene;

                var material = new THREE.MeshPhongMaterial({
                    color : 0x444444,
                    vertexColors : THREE.VertexColors,
                    specular: 0x555555,
                    shininess: 5,
                });
                var geometry = new THREE.CubeGeometry(1000, 0.01, 1000);
                var ground = new THREE.Mesh(geometry, material);

                ground.position.y = -0.54;
                ground.receiveShadow = true;

                var material = new THREE.MeshPhongMaterial({color : 0x550000, vertexColors : THREE.VertexColors, specular: 0x555555, shininess: 100,});
                var materialProp = new THREE.MeshPhongMaterial({color : 0x111111, vertexColors : THREE.VertexColors, specular: 0x555555, shininess: 10,});
                var materialGlass = new THREE.MeshPhongMaterial({color : 0x080808, vertexColors : THREE.VertexColors, specular: 0xffffff, shininess: 200});

                //sky

                var skyGeo = new THREE.SphereGeometry(500, 25, 25);

                var skyMat = new THREE.MeshLambertMaterial({color : 0xaaaaaa, vertexColors : THREE.VertexColors});

                var skyMesh = new THREE.Mesh(skyGeo, skyMat)
                skyMesh.material.side = THREE.BackSide;
                skyMesh.position.x = 0;
                skyMesh.position.z = 0;


                world.add(skyMesh)
                world.add(ground);
                scene.add(world);

                if(!paraService.droneBody){
                    if(!geoMesh) geoMesh = new THREE.Group();
                    geoMesh.rotation.x = 0.03;
                    geoMesh.position.x = 6;
                    camLookAt[0].lookAt = geoMesh.position;
                    var scale = 0.5;
                    geoMesh.scale.set(scale,scale,scale);
                    paraService.droneBody = geoMesh;

                    loader.load('models/drone1/bodynaked.js', function (geo, mat) {
                        geo.computeVertexNormals();
                        var gMesh = new THREE.Mesh(geo, material);
                        gMesh.shadowCameraFar  = 10000;
                        gMesh.castShadow = true;
                        geoMesh.add(gMesh);
                        // gMesh.receiveShadow = true;
                    },onProgress)

                    loader.load('models/drone1/mainprop.js', function (geo, mat) {
                        geo.computeVertexNormals();
                        mainprop = new THREE.Mesh(geo, materialProp);
                        mainprop.castShadow = true;
                        // gMesh.receiveShadow = true;
                        mainprop.shadowCameraFar  = 10000;
                        geoMesh.add(mainprop);
                        paraService.droneBody = geoMesh;
                        startAnimation();
                    },onProgress)

                    loader.load('models/drone1/backprop.js', function (geo, mat) {
                        // geo.computeVertexNormals();
                        backprop = new THREE.Mesh(geo, materialProp);
                        backprop.castShadow = true;
                        // gMesh.receiveShadow = true;
                        backprop.shadowCameraFar  = 10000;
                        backprop.position.z = 0.10;
                        backprop.position.y = -0.4;
                        backprop.position.x = -3.62;
                        geoMesh.add(backprop);
                        paraService.droneBody = geoMesh;
                        startAnimation();
                    },onProgress)

                    loader.load('models/drone1/glass.js', function (geo, mat) {
                        geo.computeVertexNormals();
                        var gMesh = new THREE.Mesh(geo, materialGlass);
                        gMesh.castShadow = true;
                        // gMesh.receiveShadow = true;
                        gMesh.shadowCameraFar  = 10000;
                        gMesh.position.z = 0;
                        gMesh.position.y = -0.15;
                        gMesh.position.x = 0.50;
                        geoMesh.add(gMesh);
                        paraService.droneBody = geoMesh;
                        startAnimation();
                    },onProgress)

                    loader.load('models/servo/servo.js', function (geo, mat) {
                        geo.computeVertexNormals();
                        var Smat = new THREE.MeshPhongMaterial({color : 0x440000, vertexColors : THREE.VertexColors, specular: 0x555555, shininess: 100,});
                        var gMesh = new THREE.Mesh(geo, Smat);
                        gMesh.castShadow = true;
                        // gMesh.receiveShadow = true;
                        gMesh.shadowCameraFar  = 10000;
                        gMesh.position.z = 6;
                        gMesh.position.y = -0.3;
                        gMesh.position.x = -6;
                        camLookAt[1].lookAt = gMesh.position;
                        var scale = 0.35;
                        gMesh.scale.set(scale,scale,scale);
                        scene.add(gMesh);
                        startAnimation();
                    },onProgress)

                    loader.load('models/imac/imac.js', function (geo, mat) {
                        geo.computeVertexNormals();
                        var Smat = new THREE.MeshPhongMaterial({color : 0x111111, vertexColors : THREE.VertexColors, specular: 0x555555, shininess: 100,});
                        var gMesh = new THREE.Mesh(geo, Smat);
                        gMesh.castShadow = true;
                        // gMesh.receiveShadow = true;
                        gMesh.shadowCameraFar  = 10000;
                        gMesh.position.z = -6;
                        gMesh.position.y = -0.53;
                        gMesh.position.x = -6;
                        camLookAt[2].lookAt = angular.copy(gMesh.position);
                        camLookAt[2].lookAt.y = 0.25;
                        var scale = 0.0025;


                        imacScreen = new THREE.Mesh(new THREE.CubeGeometry(1.55/scale,0.95/scale,0.01/scale), screenMaterial);
                        imacScreen.position.y = 0.78/scale;
                        imacScreen.position.z = 0.120/scale;
                        imacScreen.rotation.x = -0.18;
                        paraService.imacScreen = imacScreen;
                        gMesh.add(imacScreen);
                        gMesh.scale.set(scale,scale,scale);
                        scene.add(gMesh);
                        startAnimation();
                    },onProgress)

                    var light = new THREE.AmbientLight('#ccc'); // soft white light
                    scene.add(light);
                    createSpotlight(80, 120, 0, true);
                }else{
                    geoMesh = paraService.droneBody;
                    camera.lookAt(geoMesh.position);
                    $('.exp-progress').hide();
                }
            }else{
                scene = paraService.exploreScene;
                $('.exp-progress').fadeOut(500);
            }

            var totalObjects = 6;
            var totalLoaded = 0;

            function onProgress(event) {
                var progress = (event.loaded / event.total * 100);
                var totalProgress = (progress * ((totalLoaded+1)/totalObjects));
                setTimeout(function () {
                    $('.expp-loaded').css({width: totalProgress+'%'})
                },100)
                if(progress >= 100) checkIsLoaded( totalProgress);
            }

            function checkIsLoaded(totalProgress) {
                totalLoaded++;
                if(totalProgress >= 100){
                    setTimeout(function () {
                        world.add(geoMesh);
                        $('.exp-progress').fadeOut(500);
                    }, 2000)
                }
            }

            renderer.render(scene, camera)
        }

        var imacMapId = 0;

        function changeIMacScreen() {
            if(imacMapId < 9) imacMapId++
            else imacMapId = 1;
            var texture = THREE.ImageUtils.loadTexture( "images/home/software/"+imacMapId+".png" );
            screenMaterial.map = texture;
        }


        function createSpotlight(x, y, z, shadow) {

            directionalLight = new THREE.DirectionalLight(0xffffff);
            // directionalLight = new THREE.PointLight(0xffffff);
            directionalLight.position.set(x, y, z);
            if(shadow){
                directionalLight.castShadow = true;
                directionalLight.shadow.camera.far = 1000;
                directionalLight.shadow.camera.near = 0.1;
                directionalLight.intensity = 1.7;
                directionalLight.shadow.camera.visible = true;
                directionalLight.shadow.camera.right    =  7;
                directionalLight.shadow.camera.left     = -7;
                directionalLight.shadow.camera.top      =  7;
                directionalLight.shadow.camera.bottom   = -7;
                // directionalLight.shadowBias = 0.0001;
                directionalLight.shadowDarkness = 0.2;
                directionalLight.shadowMapWidth = 3048;
                directionalLight.shadowMapHeight = 3048;
            }

            geoMesh.add(directionalLight);
        }

        function startAnimation() {
            cancelAnimationFrame(paraService.exploreAnimId);
            animate();
        }

        function animate() {
            paraService.exploreAnimId = requestAnimationFrame( animate );
            render();
        }


        // CAMERA SETTINGS AND FUNCTION



        var camRotation = 0;
        var camSettings = {lookAt: {x:0, y:0, z:0}, offset: {x:10, y:10, z:10}};

        vm.changeCameraAngle = function () {
            if(camLookAt[vm.selectedTab.id].dontRotate){
                changeIMacScreen();
            }else{
                if(vm.selectedTab.camId < camLookAt[vm.selectedTab.id].position.length - 1){
                    vm.selectedTab.camId++;
                }else{
                    vm.selectedTab.camId = 0;
                }
            }
        }

        function rotateCamera() {

            if(!camLookAt[vm.selectedTab.id].dontRotate){
                camRotation += 0.01;
            }else{
                if(camRotation % 6.28319 > 0.01){
                    camRotation -= 0.01 + (0.1 * camRotation % 1.56);
                }
            }
            camera.position.y = camSettings.offset.y + camSettings.lookAt.y ;
            camera.position.x = (Math.sin(camRotation) * camSettings.offset.x) + camSettings.lookAt.x ;
            camera.position.z = (Math.cos(camRotation) * camSettings.offset.z) + camSettings.lookAt.z  ;
            camera.lookAt( camSettings.lookAt ); // the origin

        }

        function porcessCamera() {
            campareVector3(camSettings.offset, camLookAt[vm.selectedTab.id].position[vm.selectedTab.camId], camLookAt[vm.selectedTab.id].zoom);
            campareVector3(camSettings.lookAt, camLookAt[vm.selectedTab.id].lookAt);
        }

        function campareVector3(vFrom, vTo, zoom) {

            if(!zoom) zoom = 1;
            var cxDiff = vFrom.x - (vTo.x * zoom);
            var cyDiff = vFrom.y - (vTo.y * zoom);
            var czDiff = vFrom.z - (vTo.z * zoom);

            if(cxDiff < 0){
                vFrom.x += Math.min(Math.abs(cxDiff) / 10, maxRotSpeed);
            }else if(cxDiff > 0) {
                vFrom.x -= Math.min(Math.abs(cxDiff) / 10, maxRotSpeed);
            }

            if(cyDiff < 0){
                vFrom.y += Math.min(Math.abs(cyDiff) / 10, maxRotSpeed);
            }else if(cyDiff > 0) {
                vFrom.y -= Math.min(Math.abs(cyDiff) / 10, maxRotSpeed);
            }

            if(czDiff < 0){
                vFrom.z += Math.min(Math.abs(czDiff) / 10, maxRotSpeed);
            }else if(czDiff > 0) {
                vFrom.z -= Math.min(Math.abs(czDiff) / 10, maxRotSpeed);
            }

        }

        function render() {
            // world.rotation.y -= 0.010;
            porcessCamera();
            rotateCamera();

            if(backprop) backprop.rotation.z += 0.2;
            if(mainprop) mainprop.rotation.y -= 0.03;

            renderer.render(scene, camera);
        }

        initThree();

        window.addEventListener( 'resize', onWindowResize, false );

        function onWindowResize(){

            if(camera) camera.aspect = (window.innerWidth * 0.55) / window.innerHeight;
            if(camera) camera.updateProjectionMatrix();

            if(renderer) renderer.setSize((window.innerWidth * 0.55), window.innerHeight );

        }


    })
