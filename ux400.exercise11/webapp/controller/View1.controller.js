sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sync.ux400.exercise11.controller.View1", {
            onInit: function () {

            },

            onSelection: function( oEvent ) {
                // sap.m.Table에서 사용자가 선택한 라인 정보 가져옴
                var oItem = oEvent.getSource().getSelectedItem();

                // 라인 정보에서 연결된 Model의 데이터 정보를 가져옴
                var oContext = oItem.getBindingContext();
                
                // 연결된 Model의 데이터 경로를 가져옴
                var sPath = oContext.getPath();

                // 이 컨트롤러와 연결된 화면에 위의 경로를 현재 경로로 설정함
                // 현재 경로가 설정되면 view에서 상대경로를 사용할 수 있다.
                // var oView = this.getView();
                // oView.bindElement(sPath);

                // 연결된 화면에서 idConnTable으로 ID를 가진 컨트롤을 찾아서
                // 해당 컨트롤에 위의 경로를 현재 경로로 설정한다.
                var oList = this.byId("idConnTable");
                oList.bindElement(sPath);
            }
        });
    });
