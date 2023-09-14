sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("sync.c14.test.student.controller.View1", {
            onInit: function () {
                var oData = {
                    info:{
                        Stdno:"",
                        Name:"",
                        Gender:""
                    }
                };

                var oModel = new JSONModel(oData);
                var oView = this.getView();
                oView.setModel(oModel, "new");
            },

            // 새로고침 버튼
            onModelRefresh: function() {
                var oModel = this.getView().getModel();
                oModel.refresh();
            },

            onCreate: function () {
                var oView = this.getView();
                var oNewModel = oView.getModel("new");
                var oData = oNewModel.getProperty("/info");

                // 라디오 버튼은 모델과 binding하지 않아서 몇번째 선택했는지 알아옴
                // 성별을 가진 라디오 버튼이 남/여 중 어느 것을 선택했는지?
                var index = oView.byId("idRBG").getSelectedIndex(); // 첫번째는 0, 두번째는 1
                if ( index === 0 ) {
                    // 남자를 선택
                    oData.Gender = '남';
                } else {
                    // 여자를 선택
                    oData.Gender = '여';
                }

                // 구별된 정보로 SAP에 생성요청을 보냄
                var oModel = oView.getModel();
                oModel.create("/StudentSet", oData, {
                    success: function (oData, onResponseText) {
                        sap.m.MessageBox.success("생성완료");
                    },
                    error: function (oError) {
                        sap.m.MessageBox.error("생성실패:" + oError.message,{
                            detail: oError.responseText
                        });
                    }
                });
            }
        });
    });
