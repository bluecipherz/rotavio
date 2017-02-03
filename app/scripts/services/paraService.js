'use strict';

/**
 * @ngdoc service
 * @name bluroeApp.powerprogress
 * @description
 * # powerprogress
 * Service in the bluroeApp.
 */
angular.module('BczUiApp')
    .service('paraService', function ($state) {

      var vm = this;

      vm.paraList = {};

      vm.addPara = function (state, key, prop) {
        if(!vm.paraList[state]) vm.paraList[state] = {};
        var tempInter = setInterval(function () {
          if($(prop.id).length > 0){
            prop.el = $(prop.id);
            vm.paraList[state][key] = prop;
            processPara();
            clearInterval(tempInter);
          }
        },10)
      }


      $(window).scroll(function () {
        processPara();
      })

      function processPara() {
        vm.scrollTop = $(window).scrollTop();
        for(var idx in vm.paraList[$state.current.name]){
          var element = vm.paraList[$state.current.name][idx];
          if(!element.dontRender) {
            element.scrollTop = vm.scrollTop;
            element.offset = element.el.offset();
            element.top = element.offset.top - vm.scrollTop;
            element.progressPX = element.offset.top - $(window).height() - ( vm.scrollTop - element.offset.top ) * -1;
            // if (element.top < $(window).height() + ($(window).height() / 2) && element.top + element.el.height() > - ($(window).height() / 2)) {
            //   element.isOnScreen = true;
            // } else {
            //   element.isOnScreen = false;
            // }
            renderPara(element);
          }
        }
      }

      function renderPara(element) {
        // if(element.isOnScreen){
          var str = '';
          if(element.callback){
            element.callback(element);
          }else{
            if(element.translate) str += 'translateY('+ (( element.progressPX  )  * element.translate * -1)  +'px) ';
            if(element.translateX) str += 'translateX('+ (( element.progressPX  )  * element.translateX * -1)  +'px) ';
            if(element.rotate) str += 'rotateZ('+ (vm.scrollTop * element.rotate) +'deg)';
            if(element.scale){
              str += ' scale('+(( element.progressPX)  * element.scale * -1 / $(window).height() + 1)+')';
            }
            element.el.css({
              'transform': str
            })
          }
        // }
      }

      vm.pageLoaded = function () {
          setTimeout(function () {
              $('.landingLoader').fadeOut(1000);
          },3000);
      }

    });
