sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /** 
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("sync.test.datatype.controller.View1", {
            onInit: function () {
                var oData = {
                    employee: {
                        salary: 0,
                        birthday: "1965/11/23"
                    },
                    company: {
                        numOfEmployees: 0
                    }
                };
                var oModel = new JSONModel( oData );
                this.getView().setModel( oModel );

                var oCore = sap.ui.getCore();
                oCore.attachParseError( this.onError ); // 입력값이 이상하면 onError를 호출
                oCore.attachValidationError( this.onError ); // 입력값이 이상하면 onError를 호출
                oCore.attachValidationSuccess( this.onSuccess ); // 입력값이 정상이면 onSuccess를 호출
            },
            onSuccess: function ( oEvent ) {
                var oElement = oEvent.getParameter("element");
                oElement.setValueState(sap.ui.core.ValueState.None);    // 입력필드 상태를 정상으로
            },
            onError: function ( oEvent ) {
                var oElement = oEvent.getParameter("element");
                var oException = oEvent.getParameter("exception");

                // 입력필드 상태를 오류 상태로 만든다
                oElement.setValueState(sap.ui.core.ValueState.Error);

                // 메시지 토스트 기능을 이용해 오류가 발생한 입력필드의 이름과
                // 해당 오류 내용을 출력한다.
                sap.m.MessageToast.show( oException.name + " : " + oException.message );

            }
        });
    });

    