'use strict';

angular.module('BczUiApp')
  .controller('ExploreCtrl', function (loginService, paraService) {
      $(window).scrollTop(1);
      var vm = this;
    vm.selectedTab = 0;

    var renderer, camera, loader, viewportHeight, viewportWidth, scene, viewportId = 'explore', geoMesh, world, mainprop, backprop;
    var maxRotSpeed = 0.25;

    var camPos = [
      {lookAt: new THREE.Vector3(1.5,0,0), position:{x: 4, y: 4, z: 6}},
      {lookAt: new THREE.Vector3(1.5,0,0), position:{x: 8, y: 1, z: 8}},
      {lookAt: new THREE.Vector3(1.5,0,0), position:{x: 4, y: 11, z: 4}},
      {lookAt: new THREE.Vector3(1.5,0,0), position:{x: 5, y: 5, z: 3}},
      {lookAt: new THREE.Vector3(1.5,0,0), position:{x: 2.1, y: 0.8, z: 3}},
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

      camera = new THREE.PerspectiveCamera(45, viewportWidth / viewportHeight, 1, 1000);
      camera.position.set(4, 4, 6);
      paraService.exploreCamera = camera;

      loader = new THREE.JSONLoader();
      if(!paraService.exploreScene){
        scene = new THREE.Scene();
        paraService.exploreScene = scene;

        world = new THREE.Group();


        var material = new THREE.MeshPhongMaterial({
          // map : texture,
          color : 0x550000,
          vertexColors : THREE.VertexColors,
          specular: 0x555555,
          shininess: 10,
        });

        var geometry = new THREE.CubeGeometry(1000, 0.01, 1000);
        var ground = new THREE.Mesh(geometry, material);
        // ground.position.x = -50;
        ground.position.y = -1.1;
        ground.receiveShadow = true;
        world.add(ground);
        scene.add(world);

        material = new THREE.MeshPhongMaterial({
          // map : texture,
          color : 0x444444,
          vertexColors : THREE.VertexColors,
          specular: 0x555555,
          shininess: 100,
        });
        var materialProp = new THREE.MeshPhongMaterial({
          // map : texture,
          color : 0x111111,
          vertexColors : THREE.VertexColors,
          specular: 0x555555,
          shininess: 10,
        });

        var materialGlass = new THREE.MeshPhongMaterial({
          // map : texture,
          color : 0x080808,
          vertexColors : THREE.VertexColors,
          specular: 0xffffff,
          shininess: 200,
        });

        if(!paraService.droneBody){
          if(!geoMesh) geoMesh = new THREE.Group();
          loader.load('models/drone1/bodynaked.js', function (geo, mat) {
            geo.computeVertexNormals();
            var gMesh = new THREE.Mesh(geo, material);
            gMesh.castShadow = true;
            // gMesh.receiveShadow = true;
            gMesh.shadowCameraFar  = 10000;
            geoMesh.add(gMesh);
            paraService.droneBody = geoMesh;
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

          var light = new THREE.AmbientLight('#ccc'); // soft white light
          scene.add(light);
          createSpotlight(5, 4, 5, true);

        }else{
          geoMesh = paraService.droneBody;
          camera.lookAt(geoMesh.position);
          $('.exp-progress').hide();


        }
      }else{
        scene = paraService.exploreScene;
        $('.exp-progress').fadeOut(500);
      }


      var totalObjects = 4;
      var totalLoaded = 0;

      function onProgress(event) {
        var progress = (event.loaded / event.total * 100);
        setTimeout(function () {
          $('.expp-loaded').css({width: (progress * ((totalLoaded)/totalObjects))+'%'})
        },100)
        if(progress >= 100) checkIsLoaded();
      }

      function checkIsLoaded() {
        totalLoaded++;
        if(totalObjects == totalLoaded){
          setTimeout(function () {
            world.add(geoMesh);
            $('.exp-progress').fadeOut(500);
          }, 2000)
        }
      }

      renderer.render(scene, camera)
    }

    function createSpotlight(x, y, z, shadow) {

      // Create directional light and add to scene.
      var directionalLight = new THREE.SpotLight(0xffffff);
      directionalLight.position.set(x, y, z);
      if(shadow){
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.intensity = 2;
        directionalLight.shadow.camera.visible = true;
        directionalLight.shadow.camera.right     =  2;
        directionalLight.shadow.camera.reft     = -2;
        directionalLight.shadow.camera.top      =  2;
        directionalLight.shadow.camera.bottom   = -2;
        // directionalLight.shadowBias = 0.0001;
        directionalLight.shadowDarkness = 0.2;
        directionalLight.shadowMapWidth = 2048;
        directionalLight.shadowMapHeight = 2048;
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

    function render() {
      world.rotation.y -= 0.010;
      if(backprop) backprop.rotation.z += 0.2;
      if(mainprop) mainprop.rotation.y -= 0.03;

      // camera.position.x += 0.2;
      //
      if(camPos[vm.selectedTab]){
        camera.lookAt(camPos[vm.selectedTab].lookAt)
        var cxDiff = camera.position.x - camPos[vm.selectedTab].position.x;
        var cyDiff = camera.position.y - camPos[vm.selectedTab].position.y;
        var czDiff = camera.position.z - camPos[vm.selectedTab].position.z;
        console.log(cxDiff)
        if(cxDiff < 0){
          camera.position.x += Math.min(Math.abs(cxDiff) / 10, maxRotSpeed);
        }else if(cxDiff > 0) {
          camera.position.x -= Math.min(Math.abs(cxDiff) / 10, maxRotSpeed);
        }

        if(cyDiff < 0){
          camera.position.y += Math.min(Math.abs(cyDiff) / 10, maxRotSpeed);
        }else if(cyDiff > 0) {
          camera.position.y -= Math.min(Math.abs(cyDiff) / 10, maxRotSpeed);
        }

        if(czDiff < 0){
          camera.position.z += Math.min(Math.abs(czDiff) / 10, maxRotSpeed);
        }else if(czDiff > 0) {
          camera.position.z -= Math.min(Math.abs(czDiff) / 10, maxRotSpeed);
        }
      }

      renderer.render(scene, camera);
    }

    initThree();


  })
