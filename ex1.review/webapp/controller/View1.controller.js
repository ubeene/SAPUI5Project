sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("sync.c14.ex1.review.controller.View1", {
            onInit: function () {
                var oData = {
                    inputNum1: 0,
                    inputNum2: 0
                };

                // 이런 데이터를 화면에 저장하기 위해 화면의 모델을 지정
                var oModel = new JSONModel(oData);
                var oView = this.getView();
                oView.setModel(oModel);
            },

            onAdd: function () {
                var oModel = this.getView().getModel();
                var num1 = parseFloat(oModel.getProperty("/inputNum1")); // 문자로 가져와서 산술계산 불가 -> 입력필드 조건 걸어줌
                var num2 = parseFloat(oModel.getProperty("/inputNum2"));
                
                var result = num1 + num2;
                oModel.setProperty("/outputAdd",result);
            },

            onSubtract: function () {
                var oModel = this.getView().getModel();
                var num1 = parseFloat(oModel.getProperty("/inputNum1")); // 문자로 가져와서 산술계산 불가 -> 입력필드 조건 걸어줌
                var num2 = parseFloat(oModel.getProperty("/inputNum2"));
                
                
                var result = num1 - num2;
                oModel.setProperty("/outputSubtract",result);
            },

            onMultiple: function () {
                var oModel = this.getView().getModel();
                var num1 = parseFloat(oModel.getProperty("/inputNum1")); // 문자로 가져와서 산술계산 불가 -> 입력필드 조건 걸어줌
                var num2 = parseFloat(oModel.getProperty("/inputNum2"));
                
                var result = num1 * num2;
                oModel.setProperty("/outputMultiple",result);
            },

            onDivide: function () {
                var oModel = this.getView().getModel();
                var num1 = parseFloat(oModel.getProperty("/inputNum1")); // 문자로 가져와서 산술계산 불가 -> 입력필드 조건 걸어줌
                var num2 = parseFloat(oModel.getProperty("/inputNum2"));
                
                var result = num1 / num2;
                oModel.setProperty("/outputDivide",result);
            }            
        });
    });
