'use strict';

angular.module('BczUiApp')
.controller('WhoweareCtrl', function (loginService, paraService) {

    var vm = this;

    function tickerMe(params) {
      var tm = this;
      tm.element = $(params.element);
      tm.text = tm.element.text();
      tm.element.empty();

      tm.textArray = tm.text.split('');
      tm.tempText = "";
      tm.counter = 0;
      tm.speed = params.speed;

      function setText() {
        if(tm.textArray[tm.counter] != null){
          tm.tempText += tm.textArray[tm.counter];
          putText(tm.tempText);
          if(tm.counter <= tm.textArray.length){
            tm.counter++;
            setTimeout(function () {
              setText();
            },tm.speed)
          }else{
            if(params.callback) params.callback();
          }
        }
      }

      setText();

      function putText(text) {
        tm.element.text(text);
      }
    }

    // new tickerMe({element :'#wwaHead', speed : 50,  callback : initItems});
    // new tickerMe({element :'#wwaMotto', speed : 20});

    function initItems() {

    }

    paraService.addPara('whoweare', 'wwa-cont', { id:'#wwa-cont', translate : -0.2 })
    // paraService.addPara('whoweare', 'wwa-img', { id:'#wwa-img', translate : 0.2 })
    paraService.addPara('whoweare', 'wwa-head-set', { id:'#wwa-head-set', translate : -0.6 })

    vm.items = [
        {id:0, name : 'Bhamidimarri Bharati Swaroop',  img: 'images/wwa/team/swaroop.jpg',
            domain:'Founder – CEO – HEAD: Helicopter Development',
            details: [
                'M.Tech, Aerospace Engg. – IITK (2012)',
                'EXPERTISE IN HELICOPTER CONTROLS AND AVIONICS',
                '13 years of industrial experience'
            ]},
        {id:1, name : 'Vishnu Prasad',  img: 'images/wwa/team/vishnu.jpg',
            domain: 'Co-Founder – CFO – HEAD : Servo Development',
            details: [
                'M.Tech, Aerospace Engg. – IITK (2011)',
                'EXPERTISE IN SERVOS, AVIONICS',
                '5 years of industrial experience'
            ]
        },
        {id:2, name : 'Divyajyoti Guchait', img: 'images/wwa/team/divyajyoti.jpg',
            domain: 'SENIOR ENGINEER Mechanical Design & Manufacturing',
            details: [
                'M.Tech, Aerospace Engg. – IITK (2012)',
                'EXPERTISE IN MODELING, MANUFACTURING',
                '4 years of industrial experience'
            ]
        },
        {id:3, name : 'Rishi Bajpai',  img: 'images/wwa/team/rishi.jpg',
            domain: 'ENGINEER - Helicopter Pilot, Setup and Testing',
            details: [
                'B.Tech, Electronics. – UPTU, Kanpur (2013)',
                'EXPERTISE IN HELICOPTER PILOTING,ASSEMBLY, INTEGRATION, FLIGHT'
            ]
        },
        {id:4, name : 'Sriram',  img: 'images/wwa/team/sriram.jpg',
            // domain: 'ASSOCIATE ENGINEER – Mechanical Design & Manufacturing',
            // details: [
            //     'B.Tech, Mechanical Engg. – JNTU,Hyderabad (2016)'
            // ]
        },
        {id:5, name : 'Spandana Bopparaju',  img: 'images/wwa/team/spandana.jpg',
            domain: 'ASSOCIATE ENGINEER',
            details: [
                'Control System Simulation and Programming',
                'B.Tech, Electronics Engg. – JNTU, Hyderabad (2016)'
            ]
        },
        {id:6, name : 'Pubali',  img: 'images/wwa/team/pubali.jpg',
            domain: '',
            details: null,
        },
        {id:7, name : 'Sai Kiran',  img: 'images/wwa/team/saikiran.jpg',
          domain: 'ASSOCIATE ENGINEER – Mechanical Design & Manufacturing',
          details: [
              'B.Tech, Mechanical Engg. – JNTU,Hyderabad (2016)'
          ]
        },
    ]



    vm.selectItem = function (item) {
        if(vm.selectedItem == null && item.details){
            vm.selectedItem = item;
        }else{
            vm.selectedItem = null;
        }
    }


    $(window).scrollTop(1);
})
