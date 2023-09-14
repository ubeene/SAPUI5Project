sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("sync.c14.test.jsonmodel.controller.View1", {
            onInit: function () {
                // structure 형태
                // var oData = {
                //     text1: '문자', text2: '문자',
                //     text3: '문자', text4: '문자',
                //     int: 1, 
                //     float: 1.1,
                //     list: [{key:'KRW'},
                //            {key:'USD'}]
                // };
            
            // JSONModel : sap/ui/model/json/JSONModel로 쓰겠다
            var oModel = new JSONModel({
                text1: '문자', text2: '문자',
                text3: '문자', text4: '문자',
                int: 1, 
                float: 1.1,
                list: [{key:'KRW'},
                       {key:'USD'}]
            });
            // this는 이 환경에서는 Controller를 의미한다.
            // Controller의 onInit 안에서만 this가 Controller 의미, 다른 때는 that으로 선언해줘야 함 
            var oView = this.getView(); 
            oView.setModel(oModel);
            },

            onAdd: function() {
                // 1) id 기준으로 찾아서 거기에 값을 세팅
                // 2) 모델의 데이터를 변경

                // 1)의 방식
                var oInput1 = this.byId("idInput1"); // id를 찾아서 
                var num1 = parseInt(oInput1.getValue()); // getValue는 문자를 가져와서 숫자로 바꿔줌

                // 2)의 방식 - JSON 모델일 때만 가능
                var oModel = this.getView().getModel(); // 모델을 가져옴
                var oData = oModel.getData(); // 모델의 데이터를 가져옴
                var num2 = parseFloat(oData.float); // oData의 float 프로퍼티

                // 일반적으로 Model은 getProperty() 사용해서 값을 가져온다.
                var num2 = oModel.getProperty("/float"); // '/'을 사용해서 첫번째 최상위에서 float이라는 값을 가져오겠다.

                // 계산된 결과
                var result = 0;
                var result = num1 + num2;

                // text에게 결과를 주기 ( 1) id로 찾기, 2) model로 접근 가능)
                // 2) 모델로 접근하는 방식
                oModel.setProperty("/result", result); //get은 가져오기 set은 저장하기
                // 모델에 초기값이 있을 경우에 위에서 작성해준거고 만약 빈 값이면 안 써줘도 /result 하면 result 값이 

            }
        });
    });
