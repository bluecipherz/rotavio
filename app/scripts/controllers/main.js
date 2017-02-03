'use strict';

/**
 * @ngdoc function
 * @name alFjrApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the alFjrApp
 */

angular.module('BczUiApp')
    .controller('HeaderCtrl', function ($state) {
        var vm = this;
        vm.state = $state;
        setTimeout(function () {
            $('.landingLoader').fadeOut(1000);
        },3000);


    })
    .controller('MainCtrl', function (paraService) {
        $(window).scrollTop(1);

        var video = document.getElementById("hm-video");

        var videoInter = setInterval(function () {
            if ( video.readyState === 4 ) {
                // it's loaded
                paraService.pageLoaded();
                console.log('im loaded');
            }
        })

        var windowHeight = $(window).height();
        // var header = $('#header');


        paraService.addPara('home', 'hm-building', { id:'#hm-building',
            callback:function (element) {
                element.el.css({
                    'transform': 'translateY('+ -1 * (element.scrollTop / 2.8) + 'px)'
                })
            }
        })


        paraService.addPara('home', 'hm-header', { id:'#hmt1-svgBg',
            callback:function (element) {
                if(element.progressPX - 200 - windowHeight > 0){
                    $('#header').removeClass('NormalHomeHeader');
                    $('#header').addClass('homeHeader');
                }else{
                    $('#header').addClass('NormalHomeHeader');
                    $('#header').removeClass('homeHeader');
                }
            }
        })

        paraService.addPara('home', 'hmt3-img', { id:'#hmt3-img',
            callback:function (element) {
                var tempWidth = ((element.scrollTop / 2.8) / windowHeight) * 20;
                element.el.css({
                    'width': (100 + tempWidth )+ 'vw',
                    'left' :(-1 * tempWidth / 2) + 'vw',
                    // 'bottom' : ( tempWidth / 2 * -1) +'vh'
                })
            }
        })

        var dontRenderList = ['hmt3-img','cloud-1','cloud-2','cloud-3','cloud-4','hm1-drone','hm1-dleaf-1','hm1-dleaf-2','hm1-dleaf-3','hm1-dleaf-4',]

        paraService.addPara('home', 'hmt2', { id:'#hmt2',
            callback:function (element) {
                if($(window).height() + 233 - element.progressPX < 0){
                    $('#hmt3-img').css({'z-index':1});
                    $('#hmt3-imgC').css({'z-index':1});
                    for(var idx in dontRenderList){
                        if(!paraService.paraList['home'][dontRenderList[idx]]) return;
                        paraService.paraList['home'][dontRenderList[idx]].dontRender = false;
                    }
                }else{
                    $('#hmt3-imgC').css({'z-index':-1});
                    $('#hmt3-img').css({'z-index':-1});
                    for(var idx in dontRenderList){
                        if(!paraService.paraList['home'][dontRenderList[idx]]) return;
                        paraService.paraList['home'][dontRenderList[idx]].dontRender = false;
                    }
                }
            }
        })

        paraService.addPara('home', 'hmp-1', { id:'#hmp-1', translate : -0.8, scale:-0.02 })
        paraService.addPara('home', 'cloudSet', { id:'#cloudSet', translate : 0.6 })
        paraService.addPara('home', 'cloud-1', { id:'#cloud-1', translate : -0.3, rotate:-0.01 })
        paraService.addPara('home', 'cloud-2', { id:'#cloud-2', translate : 0.7, rotate:0.02 })
        paraService.addPara('home', 'cloud-3', { id:'#cloud-3', translate : 0.8, rotate:-0.05 })
        paraService.addPara('home', 'cloud-5', { id:'#cloud-5', translate : -1})
        paraService.addPara('home', 'hm1-drone', { id:'#hm1-drone', translate : -0.6, translateX : -0.3, rotate:-0.01 })
        paraService.addPara('home', 'hm1-dleaf-1', { id:'#hm1-dleaf-1', translate : 0, rotate:5.1})
        // paraService.addPara('home', 'hm1-dleaf-2', { id:'#hm1-dleaf-2', translate : 0, rotate:4.9})
        // paraService.addPara('home', 'hm1-dleaf-3', { id:'#hm1-dleaf-3', translate : 0, rotate:4.8})
        // paraService.addPara('home', 'hm1-dleaf-4', { id:'#hm1-dleaf-4', translate : 0, rotate:5})
        // paraService.addPara('home', 'hmt3-img', { id:'#hmt3-img', translate : -0.4})
        paraService.addPara('home', 'hmt1-svg', { id:'#hmt1-svg',
            callback: function (element) {
                var dashoff = 1000 - ( element.progressPX / 3 ) ;
                var dashoff2 = element.progressPX ;
                if(dashoff < 0) dashoff = 0;
                element.el.find('path').css({
                    'stroke-dashoffset' : dashoff
                });
                $('.hmt1-svgBg path').css({
                    'stroke-dashoffset' : dashoff2
                })
            }
        });


        var renderer, camera, loader, viewportHeight, viewportWidth, scene, viewportId = 'hmt2-servo', geoMesh;

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
            if(paraService.renderer){
                renderer = paraService.renderer;
            } else{
                renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
                paraService.renderer = renderer;
            }
            renderer.setSize(viewportWidth, viewportHeight);
            renderer.setClearColor( 0x000000, 0 ); // the default
            document.getElementById(viewportId).appendChild(renderer.domElement);

            camera = new THREE.PerspectiveCamera(45, viewportWidth / viewportHeight, 1, 500);
            camera.position.set(2.5, 2.5, 2.5);

            loader = new THREE.JSONLoader();

            scene = new THREE.Scene();

            var material = new THREE.MeshPhongMaterial({
                // map : texture,
                color : 0x333333,
                vertexColors : THREE.VertexColors,
                specular: 0x555555,
                shininess: 100,
            });

            if(!paraService.servoBody){
                loader.load('models/servo/servo.js', function (geo, mat) {
                    geoMesh = new THREE.Mesh(geo, material);
                    paraService.servoBody = geoMesh;
                    camera.lookAt(geoMesh.position);
                    animate();
                    scene.add(geoMesh);
                    loadText();
                })
            }else{
                geoMesh = paraService.servoBody;
                cancelAnimationFrame(paraService.servoAnimId);
                animate();
                camera.lookAt(geoMesh.position);
                scene.add(geoMesh);
            }

            var floader = new THREE.FontLoader();

            function loadText() {

                floader.load( 'fonts/Gotham/Gotham_Book.json', function ( font ) {

                    // your code here

                    var material = new THREE.MeshPhongMaterial({
                        // map : texture,
                        color : 0x991111,
                        vertexColors : THREE.VertexColors,
                        specular: 0x550000,
                        shininess: 100,
                    });

                    var height = 0.5, size = 1, hover = 30, curveSegments = 4,
                        bevelThickness = 0.05, bevelSize = 0.05, bevelSegments = 3, bevelEnabled = true,
                        weight = "bold", // normal bold
                        style = "normal"; // normal italic

                    var textGeo = new THREE.TextGeometry( 'ROTAVIO', {

                        size: size,
                        height: height,
                        curveSegments: curveSegments,

                        font: font,
                        weight: weight,
                        style: style,

                        bevelThickness: bevelThickness,
                        bevelSize: bevelSize,
                        bevelEnabled: bevelEnabled,

                    });
                    var rotavioText = new THREE.Mesh(textGeo, material);
                    var rotavioText2 = new THREE.Mesh(textGeo, material);


                    rotavioText.position.y =0.2;
                    rotavioText.position.x =-0.40;
                    rotavioText.position.z =0.38;
                    rotavioText.scale.x =0.13;
                    rotavioText.scale.y =0.13;
                    rotavioText.scale.z =0.13;


                    rotavioText2.position.y =0.2;
                    rotavioText2.position.x =0.43;
                    rotavioText2.position.z =-0.325;
                    rotavioText2.rotation.y =3.14159;
                    rotavioText2.scale.x =0.13;
                    rotavioText2.scale.y =0.13;
                    rotavioText2.scale.z =0.13;
                    // camera.lookAt(rotavioText.position);

                    geoMesh.add(rotavioText);
                    geoMesh.add(rotavioText2);

                } );


            }





            var light = new THREE.AmbientLight('#d1c4a7'); // soft white light
            scene.add(light);

            // Create directional light and add to scene.
            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(-3, 20, 100).normalize();
            scene.add(directionalLight);

            renderer.render(scene, camera)
        }

        function animate() {
            paraService.servoAnimId = requestAnimationFrame( animate );
            render();
        }

        function render() {
            geoMesh.rotation.y += 0.015;
            renderer.render(scene, camera);
        }

        initThree();



    })
