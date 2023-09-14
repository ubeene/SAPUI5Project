sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, JSONModel) {
        "use strict";

        return Controller.extend("sync.c14.test.fragment.controller.View1", {
            onInit: function () {

            },

            onItemPress: function(oEvent) {
                var oSource= oEvent.getSource();
                var oItem = oSource.getSelectedItem();
                var oContext = oItem.getBindingContext();
                var path = oContext.getPath();
                
                this.getView().bindElement(path);


                //oData read 기능 이용
                var oSupplieruuid = oContext.getProperty("Supplieruuid");
                var oView = this.getView();
                var oModel = oView.getModel();
                oModel.read(
                    "/SupplierSet(guid'"+ oSupplieruuid + "')",
                    {
                        success: function(oData) {
                        // oData는 read하여 조회된 데이터
                        // sap.ui.model.json.JSONModel
                        var oSupplierModel = new JSONModel(oData);
                        oView.setModel(oSupplierModel, "bp");
                        },
                        error: function() {
                            alert("조회 실패");
                        }
                    }
                ) // 이 경로에서 데이터를 읽어와라

                this._openDialog();

            },

            _openDialog: function() {
                var oView = this.getView(); // 현재화면 정보 불러옴
                var oDialog = oView.byId("idDialog"); 
                
                if (oDialog) { // 다이얼로그 화면에 불러온 적 있다면
                    oDialog.open();
                } else {
                    Fragment.load({
                        id: oView.getId(),
                        name: "sync.c14.test.fragment.view.Supplier",
                        controller: this
                    }).then(function(oDialog) {// 로드가 완료되면
                        oView.addDependent(oDialog);// 라인 클릭했을 때 조회하겠다
                        oDialog.open();
                    }) 
                }
            },

            onCloseDialog: function() {
                this.byId("idDialog").close();
            }
        });
    });
