'use strict';

angular.module('BczUiApp')
  .controller('DemoCtrl', function () {
    $(window).scrollTop(1);

    var vm = this;


    var renderer, scene, camera, leftKey, rightKey, downKey, upKey,buildingMesh,cityMesh,spaceKey,
      geometry, wKey,aKey,sKey,dKey, zleftKey, zrightKey, audioListener, loader;

    leftKey = rightKey = downKey = upKey = aKey = dKey = wKey = sKey = spaceKey = false;

    var ap_aKey = 1;
    var ap_dKey = 1;
    var ap_upKey = 1;

    function init() {

      renderer = new THREE.WebGLRenderer({antialias : false});
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById('explore').appendChild(renderer.domElement);

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
      camera.position.set(0, 400, -50);

      loader = new THREE.JSONLoader();

      // renderer.shadowMapEnabled = true;
      // renderer.shadowMapSoft = true;
      //
      // renderer.shadowCameraNear = 3;
      // renderer.shadowCameraFar = camera.far;
      // renderer.shadowCameraFov = 50;
      //
      // renderer.shadowMapBias = 0.0039;
      // renderer.shadowMapDarkness = 0.5;
      // renderer.shadowMapWidth = 1024;
      // renderer.shadowMapHeight = 1024;


      audioListener = new THREE.AudioListener();
      camera.add( audioListener );

      // scene = new THREE.Scene();
      scene =  new Physijs.Scene({ fixedTimeStep: 1 / 120 });;
      scene.setGravity(new THREE.Vector3( 0, -90, 0 ));
      scene.fog	= new THREE.FogExp2( '#e2c7b8', 0.0005 );
      //
      //   var testObj = new THREE.CubeGeometry(4,4,4);
      // var testMesh = new Physijs.BoxMesh(testObj, new THREE.MeshNormalMaterial(), 0.1, { restitution: .8, friction: .4 });
      //
      // testMesh.position.x = -40;
      // testMesh.position.y = 100;
      // testMesh.position.z = 100;
      //
      // scene.add(testMesh);


      // Create ambient light and add to scene.
      var light = new THREE.AmbientLight('#d1c4a7'); // soft white light
      scene.add(light);

      // Create directional light and add to scene.
      var directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(1, 10, 1).normalize();
      // directionalLight.castShadow = true;
      // directionalLight.shadow.mapSize.height = 512;
      // directionalLight.shadow.mapSize.width = 512;


        // var d = 20000;
        //
        // directionalLight.shadow.camera.left = -d;
        // directionalLight.shadow.camera.right = d;
        // directionalLight.shadow.camera.top = d;
        // directionalLight.shadow.camera.bottom = -d;
        //
        // directionalLight.shadow.camera.far = 10000;
        // directionalLight.shadow.camera.near = 1;


        // var helper = new THREE.CameraHelper( directionalLight.shadow.camera );
        // scene.add( helper );


      scene.add(directionalLight);



      // ground


      var ground = new THREE.CubeGeometry(20000, 10, 20000);
      var material = new THREE.MeshPhongMaterial({ color: 0x555555, vertexColors : THREE.VertexColors });

      var groundMesh = new Physijs.BoxMesh(ground, material, 0, { restitution: 0.2 })
        groundMesh.receiveShadow = true;
        groundMesh.castShadow = true;
      groundMesh.position.x = -1000;
      groundMesh.position.z = -1000;

    //sky

      var skyGeo = new THREE.SphereGeometry(8000, 25, 25);

      var texture = THREE.ImageUtils.loadTexture( "images/grass.jpg" );
      var material = new THREE.MeshLambertMaterial({color : 0xaaaaaa, vertexColors : THREE.VertexColors});

      var skyMesh = new THREE.Mesh(skyGeo, material)
      skyMesh.material.side = THREE.BackSide;
      skyMesh.position.x = 0;
      skyMesh.position.z = 0;

      // camera.lookAt(skyMesh.position);

      createCity();
      createPlayer();
      updatePlayer();

      scene.add(skyMesh);
      scene.add(groundMesh);

    }





    function createCity() {
//
//       geometry = new THREE.CubeGeometry(1,1,1)
//       geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
//       buildingMesh= new THREE.Mesh( geometry );
//       var cityGeometry= new THREE.Geometry();
//
//         var material = new THREE.MeshLambertMaterial({color : 0xaaaaaa, vertexColors : THREE.VertexColors});
//
//       generateMap();
//
//       for(var xAxis in vm.mapData){
//         for(var zAxis in vm.mapData[xAxis]){
//           var mapObj = vm.mapData[xAxis][zAxis];
//           // var buildingMesh = new Physijs.BoxMesh(geometry, material, 10)
//           buildingMesh.position.x = mapObj.x;
//           buildingMesh.position.z = mapObj.z;
//
//           buildingMesh.scale.x = Math.random() * Math.random() * Math.random() * Math.random() * 80 + 30;
//           buildingMesh.scale.y = (Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) * 8 + 8;
//           buildingMesh.scale.z = buildingMesh.scale.x
//
//           buildingMesh.castShadow = true;
//           buildingMesh.receiveShadow = true;
//
//           // scene.add(buildingMesh);
//           buildingMesh.updateMatrix();
//           cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);
//         }
//       }
//
//
// // build the mesh
//
//       var th = 64;
//       var texture = new THREE.Texture( generateTexture() );
//       texture.anisotropy = renderer.getMaxAnisotropy();
//       texture.needsUpdate = true;
//
//       var material = new THREE.MeshLambertMaterial({map : texture, vertexColors : THREE.VertexColors});
//       cityMesh = new THREE.Mesh(cityGeometry, material );
//
//       function generateTexture() {
//         var canvas  = document.createElement( 'canvas' );
//         canvas.width = th;
//         canvas.height = th;
//         var context = canvas.getContext( '2d' );
//         context.fillStyle    = '#bbb';
//         context.fillRect( 0, 0, th, th );
//         for( var y = 2; y < th; y += 2 ){
//           for( var x = 0; x < th; x += 2 ){
//             var value   = Math.floor( Math.random() * 60 );
//             context.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
//             context.fillRect( x , y , 2, 1 );
//           }
//         }
//
//         // build a bigger canvas and copy the small one in it
//         // This is a trick to upscale the texture without filtering
//         var canvas2 = document.createElement( 'canvas' );
//         canvas2.width    = 512;
//         canvas2.height   = 1024;
//         var context = canvas2.getContext( '2d' );
//         // disable smoothing
//         context.imageSmoothingEnabled        = false;
//         context.webkitImageSmoothingEnabled  = false;
//         context.mozImageSmoothingEnabled = false;
//         // then draw the image
//         context.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );
//         // return the just built canvas2
//         return canvas2;
//       }
//
//       cityMesh.castShadow = true;
//       cityMesh.receiveShadow = true;
//
//       scene.add(cityMesh);

        var cityScale = 10;


        loader.load('models/city/city/city.js', function (geo, mat) {
            // console.log(mat);
            var geoMesh = new THREE.Mesh(geo, mat[0]);
            geoMesh.scale.x = cityScale;
            geoMesh.scale.y = cityScale;
            geoMesh.scale.z = cityScale;
            // geoMesh.rotation.y = -1.6;
            scene.add(geoMesh);
        })

    }


    function generateMap() {

      var mapWidth = 120;
      var mapDepth = 120;

      vm.mapData = {};

      var minUnit = 50;

      for(var xAxis=0; xAxis < mapWidth; xAxis++){
        if(!vm.mapData[xAxis]) vm.mapData[xAxis] = {}
        for(var zAxis=0; zAxis < mapDepth; zAxis++){
          vm.mapData[xAxis][zAxis] = {w:1, h:1, d:1, x:xAxis * minUnit, z:zAxis * minUnit}
        }
      }

    }

    var  playerMesh, player, playerRotor, playerTail, playerTailPart3, movingSound;

    function createPlayer() {

      var texture = THREE.ImageUtils.loadTexture( "images/explore/heli/metalShine.jpg" );
      var metalMaterial = new THREE.MeshPhongMaterial({
        // map : texture,
          color:0x222222,
        vertexColors : THREE.VertexColors,
        specular: 0x555555,
        shininess: 100,
      });

      player = new THREE.SphereGeometry(4, 30, 30);
      var texture = THREE.ImageUtils.loadTexture( "images/explore/heli/metalBody.jpg"  );
      var material = new THREE.MeshPhongMaterial({
        map : texture,
        color : 0xaa3300,
        vertexColors : THREE.VertexColors,
        specular: 0x555555,
        shininess: 10,
      });

      // var playerMeshT = new THREE.Mesh(player, material)
      // playerMeshT.scale.x = 2;
      // playerMeshT.rotation.y = 1.6;

      playerMesh = new THREE.Group();
      playerMesh.position.y = 250;
      playerMesh.position.x = 500;
      playerMesh.position.z = 500;

      playerRotor = { rotation : { y : 0 }}
      playerTailPart3 = { rotation : { y : 0 }}


      var engineSound = new THREE.Audio( audioListener );
      engineSound.load('sounds/loop.mp3');
      engineSound.loop = true;
      engineSound.autoplay = true;
      playerMesh.add( engineSound );

      movingSound = new THREE.Audio( audioListener );
      movingSound.load('sounds/moving.wav');
      movingSound.loop = true;
      movingSound.autoplay = true;
      movingSound.setVolume(0);
      playerMesh.add( movingSound );


      var playerScale = 9;

      loader.load('models/warheli/body.js', function (geo, mat) {
        // console.log(mat);
        var geoMesh = new THREE.Mesh(geo, mat[0]);
        geoMesh.scale.x = playerScale;
        geoMesh.scale.y = playerScale;
        geoMesh.scale.z = playerScale;
          // geoMesh.rotation.y = -1.6;
        playerMesh.add(geoMesh);
      })
      loader.load('models/warheli/mainprop.js', function (geo, mat) {
        playerRotor = new THREE.Mesh(geo, mat[0]);
        playerRotor.scale.x = playerScale;
        playerRotor.scale.y = playerScale;
        playerRotor.scale.z = playerScale;
        playerRotor.position.y = 1;
        playerMesh.add(playerRotor);
      })
      loader.load('models/warheli/backprop.js', function (geo, mat) {
        playerTailPart3 = new THREE.Mesh(geo, mat[0]);
        playerTailPart3.scale.x = playerScale;
        playerTailPart3.scale.y = playerScale;
        playerTailPart3.scale.z = playerScale;
        // playerTailPart3.position.z = -40.1;
        // playerTailPart3.position.y = -1.8;
        // playerTailPart3.position.x = 1.2;
        playerMesh.add(playerTailPart3);
      });

      playerMesh.rotation.order = 'YXZ'
      // playerMesh.rotation.order = 'YZX'

      scene.add(playerMesh);
    }


    function updatePlayer() {
      playerRotor.rotation.y += 0.8;
      playerTailPart3.rotation.x += 0.8;
      movingSound.setVolume(Math.min(speed / 250, 1));

    }












    function animate() {
      render();
      requestAnimationFrame(animate)
    }


    function render() {

      playerControls()
      setCamera();
        scene.simulate();
        renderer.render(scene, camera);
    }



    var speed = 0;
    var acceleration = 0.7;
    var maxSpeed = 90;
    var minSpeed = 2;
    var hAcc = 0;
    var defRotaion = 0.2;
    var rotationAcc = 0;
    var maxRotationAcc = 0.05;
    var moveRatio = 0.05;
    var rotateRatio = 0.02;
    var maxRotSpeed = 20;

    var rotXAxis = 0;
    var rotYAxis = 0;
    var rotZAxis = 0;

      var rotZRelease = 0.02;

    function playerControls() {
        if(spaceKey){
            if(speed>0){
                speed -= 3 * (speed / maxSpeed);
            }else if (speed < 0){
                speed += 3 * (speed / maxSpeed);
            }

        }else if(upKey){ // acceleration
            if(speed < maxSpeed){
              speed += acceleration;
            }
        } else if(downKey){ // reverse
            if(speed > -1 * ( maxSpeed / 2)){
              speed -= acceleration * 2;
            }
        } else if(speed > minSpeed){ // normal de acceleration
            speed -= 0.05;
        }

    if(aKey){
        if(rotYAxis > -1 * maxRotationAcc){
            rotYAxis-= 0.001 * ap_aKey;
        }
    }else if(dKey){
        if(rotYAxis < maxRotationAcc){
            rotYAxis+= 0.001 * ap_dKey;
        }
    }else{
        if(rotYAxis > 0){
            rotYAxis -= 0.001;
        }else if(rotYAxis < 0){
            rotYAxis += 0.001;
        }
    }

    if(rightKey){
        if(rotZAxis > -1 * maxRotationAcc){
            rotZAxis-= 0.0015;
        }
    }else if(leftKey){
        if(rotZAxis < maxRotationAcc){
            rotZAxis+= 0.0015;
        }
    }else{
        if(rotZAxis > 0){
            rotZAxis -= 0.002;
        }else if(rotZAxis < 0){
            rotZAxis += 0.002;
        }
        if(playerMesh.rotation.z > 0 ){
            playerMesh.rotation.z -= rotZRelease * Math.abs(playerMesh.rotation.z);
        }else if(playerMesh.rotation.z < 0){
            playerMesh.rotation.z += rotZRelease * Math.abs(playerMesh.rotation.z);
        }
    }

        if(wKey){
            if(rotXAxis > -1 * maxRotationAcc){
                rotXAxis-= 0.001;
            }
        }else if(sKey){
            if(rotXAxis < maxRotationAcc){
                rotXAxis+= 0.001;
            }
        }else{
            if(rotXAxis > 0){
                rotXAxis -= 0.001;
            }else if(rotXAxis < 0){
                rotXAxis += 0.001;
            }
            if(playerMesh.rotation.x > 0 ){
                playerMesh.rotation.x -= rotZRelease * Math.abs(playerMesh.rotation.x);
            }else if(playerMesh.rotation.x < 0){
                playerMesh.rotation.x += rotZRelease * Math.abs(playerMesh.rotation.x);
            }
        }

      applyPosition();
      applyRotation();
      updatePlayer();
    }

    function c(param) {
        return Math.round(param * 10) / 10;
    }

    function applyPosition() {

        var cosX = (Math.cos(playerMesh.rotation.x) );
        var sinX = (Math.sin(playerMesh.rotation.x) );
        var cosY = (Math.cos(playerMesh.rotation.y) );
        var sinY = (Math.sin(playerMesh.rotation.y) );
        var cosZ = (Math.cos(playerMesh.rotation.z) );
        // var sinZ = (Math.sin(playerMesh.rotation.z) );
;

        var x = (sinY * cosX)// + ( sinZ * -1 * cosY );
        var y = (sinX * -1 * cosZ);
        var z = (cosY * cosX)// + ( sinZ * sinY );

        // console.log(c(x), c(y), c(z));
        // console.log(c(sinZ * -1 * sinY));
        // console.log(c(1 - sinX));

        // if(hAcc != 0) playerMesh.position.y +=  0.05 * hAcc;
        if(speed != 0) playerMesh.position.x += speed * moveRatio * x * ap_upKey;
        if(speed != 0) playerMesh.position.y += speed * moveRatio * y * ap_upKey;
        if(speed != 0) playerMesh.position.z += speed * moveRatio * z * ap_upKey;

        playerMesh.position.y += (1 - sinX) + -1; // gravity + anti gravity
        playerMesh.position.x += ((1 - sinX) + -1) * sinY * -1;
        playerMesh.position.z += ((1 - sinX) + -1) * cosY * -1;

        autoPilot();
    }

    function applyRotation() {
        var sinZ = (Math.sin(playerMesh.rotation.z) );
        playerMesh.rotation.x -= rotXAxis
        playerMesh.rotation.y -= rotYAxis + (sinZ * 0.04);
        // if(playerMesh.rotation.z > -1.5 && playerMesh.rotation.z < 1.5 ||
        //     rotZAxis > 0 && playerMesh.rotation.z >= 1.5 ||
        //     rotZAxis < 0 && playerMesh.rotation.z <= -1.5)
            playerMesh.rotation.z -= rotZAxis;
        // if(playerMesh.rotation.z > -1.5 && playerMesh.rotation.z < 1.5) playerMesh.rotation.z -= rotZAxis
    }

    // var playerRotation = {x:0, y:0, z:0}


    var camX = 0,
        camZ = 0,
        camError = 0.005,
        camTempX = 0,
        camTempZ = 0,
        camRatioX = 0.1,
        camRatioZ = 0.1,
        camDistance = 60;


    function setCamera() {
      camera.lookAt(playerMesh.position);
      camera.position.y = playerMesh.position.y + (  40 + (acceleration / 5));
      camTempX = playerMesh.position.z - (( camDistance + (acceleration / 5)) * Math.cos(playerMesh.rotation.y));
      camTempZ = playerMesh.position.x - (( camDistance + (acceleration / 5)) * Math.sin(playerMesh.rotation.y));


      camRatioX = (Math.abs((camTempX - camX) / 15))
      camRatioZ = (Math.abs((camTempZ - camZ) / 15))
      if((camX - camTempX) > camError){
        camX -= camRatioX;
      }else if((camX - camTempX) < -1 * camError){
        camX += camRatioX;
      }
      if((camZ - camTempZ) > camError){
        camZ -= camRatioZ;
      }else if((camZ - camTempZ) < -1 * camError){
        camZ += camRatioZ;
      }

      camera.position.z = camX;
      camera.position.x = camZ;
    }

    var targetList = [{x:800, z : 2000, y : 500}, {x:2000, z : 2000, y : 500}, {x:2000, z : 3000, y : 500}, {x:800, z : 2000, y : 500},]
    var target = null;
    var missionStarted = false;
    var reachedSafeZone = false;
    var reachedDestination = false;
    var initialPosition;
    var initialDistance;
    var initialRotation;
    var initialYaw;
    var destinationId = null;
    var initialPitch;

    var safeZone = 200;
    var pitchZone = 600;
    var pitchEnable = false;

    var pitchRI = 0;
    var pitchRD = 0;
    var yawRI = 0;
    var yawRD = 0;

    var rotRRatio = 0.5;

    function autoPilot() {
        // console.log(isKeyPressed())
        if(!reachedDestination && !isKeyPressed() && target) {
            var yawRadians = Math.atan2(target.z - playerMesh.position.x, target.x - playerMesh.position.z);
            var pitchRadians = Math.atan2(target.y - playerMesh.position.y, target.x - playerMesh.position.z);
            var distance = getDistance(playerMesh.position, target);


            if (!missionStarted) {
                missionStarted = true;
                initialPosition = angular.copy(playerMesh.position);
                initialDistance = angular.copy(distance);
                initialYaw = angular.copy(yawRadians);
                initialRotation = angular.copy(playerMesh.rotation);
            }

            if (playerMesh.rotation.y < yawRadians) {
                if(yawRD < 1) yawRD += rotRRatio;
                // if(yawRI > 0) yawRI -= rotRRatio;
                yawRI = 0;
                playerMesh.rotation.y += 0.02 * Math.abs(playerMesh.rotation.y - yawRadians) * yawRD;
            } else if (playerMesh.rotation.y > yawRadians) {
                if(yawRI < 1) yawRI += rotRRatio;
                // if(yawRD > 0) yawRD -= rotRRatio;
                yawRD = 0;
                playerMesh.rotation.y -= 0.02 * Math.abs(playerMesh.rotation.y - yawRadians) * yawRI;
            }
            //
            // if(playerMesh.rotation.x < pitchRadians){
            //     if(pitchRD < 1) pitchRD += rotRRatio;
            //     if(pitchRI > 0) pitchRI -= rotRRatio;
            //     pitchRI = 0;
            //     playerMesh.rotation.x -= 0.02 * Math.abs(playerMesh.rotation.x - pitchRadians) / 4 * pitchRD;
            // }else if(playerMesh.rotation.y > pitchRadians){
            //     if(pitchRI < 1) pitchRI += rotRRatio;
            //     // if(pitchRD > 0) pitchRD -= rotRRatio;
            //     pitchRD = 0;
            //     playerMesh.rotation.x += 0.02 * Math.abs(playerMesh.rotation.x - pitchRadians) / 4 * pitchRI;
            // }


            if (distance > pitchZone) {
                upKey = true;
            } else if (distance < pitchZone && distance > safeZone) {
                pitchEnable = true;
            } else if (distance < safeZone && distance > 10) {
                if (!reachedSafeZone) {
                    reachedSafeZone = true;
                    console.log('reached safe zone!')
                    initialDistance = angular.copy(distance);
                }
                ap_upKey = (distance / initialDistance / 2) + 0.5;
            } else {
                applyBreak();
                upKey = false
                console.log('Reached!')
                reachedDestination = true;
            }
            console.log(c(distance), c(pitchRadians));
        }
    }

    function applyBreak() {
        spaceKey = true;
        var breakInterval = setInterval(function () {
            if(speed <= 3){
                clearInterval(breakInterval);
                spaceKey = false;
                missionStarted = false;
                ap_upKey = 1;
                target = null;
                nextDestination();
            }
        },20)
    }

    function getDistance(from, to) {
        return Math.sqrt(
            ((from.x - to.z) * (from.x - to.z)) +
            // ((from.y - to.y) * (from.y - to.y)) +
            ((from.z - to.x) * (from.z - to.x)));
    }

    function nextDestination() {
        if(targetList.length > 0){
            if(destinationId == null){
                destinationId = 0;
            }else {
                destinationId++;
            }
            if(targetList.length - destinationId > 0){
                target = targetList[destinationId];
                reachedDestination = false;
                var distance = getDistance(playerMesh.position, target);
                console.log('setting destination : ' + c(distance) + 'm')
            }
        }
    }



    init();
    animate();

    // nextDestination();




    $(window).keydown(function (event) {
      handleKeyboard(event, true)
    })
    $(window).keyup(function (event) {
      handleKeyboard(event, false)
    })

    // w87 , s83, a65, d68

    function handleKeyboard(event, isActive) {
      var key = event.keyCode;
      if(key == 32 || key == 37 || key == 38 || key == 39 || key == 40){
        event.preventDefault();
      }
      if(missionStarted) return;
      if(key == 32) spaceKey = isActive;

      if(key == 37) leftKey = isActive;
      if(key == 38) upKey = isActive;
      if(key == 39) rightKey = isActive;
      if(key == 40) downKey = isActive;

      if(key == 87) wKey = isActive;
      if(key == 83) sKey = isActive;
      if(key == 65) aKey = isActive;
      if(key == 68) dKey = isActive;

      if(key == 188) zleftKey = isActive;
      if(key == 190) zrightKey = isActive;

    }
    function isKeyPressed() {
        if(!leftKey && !rightKey && !downKey && !wKey && !sKey && !dKey && !spaceKey && !aKey && !downKey){
            return false;
        }else{
            return true;
        }
    }


  })
