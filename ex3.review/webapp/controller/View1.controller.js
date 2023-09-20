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

        return Controller.extend("sync.c14.ex3.review.controller.View1", {
            onInit: function () {
                var oData = {
                    DistidList: [
                        {unit:"KM", text:"킬로미터"},
                        {unit:"MI", text:"마일"}
                    ] // 한 줄에 컬럼 두개(unit, text) , combobox를 위해 만들어줌
                };

                var oModel = new JSONModel(oData);
                var oView = this.getView();
                oView.setModel(oModel, "new");

                // update를 위한 모델 선언
                var oModel = new JSONModel({ edit: false });
                oView.setModel(oModel, "view");
            },

            onOpenCreateDialog: function() {
                var oView = this.getView();
                var oDialog = this.byId("idCreateDialog");
                if (oDialog) {
                    oDialog.open();
                } else {
                    Fragment.load({
                        id: oView.getId(),
                        name: "sync.c14.ex3.review.view.New",
                        controller:this
                    }).then( function (oDialog) {
                        oView.addDependent( oDialog ); // view의 model 정보를 공유
                        oDialog.open();
                    });
                }
            },

            onCreateCancel: function() {
                // ID가 "idCreateDialog"인 UI Element를 찾아서
                // 해당 Element에게 close() 메소드를 실행한다 <== 창을 닫는다.
                this.byId("idCreateDialog").close();
            },

            onCreateComplete: function () {
                var oView = this.getView(); // 현재 화면 가져오기
                var oNewModel = oView.getModel("new"); // 화면의 new 모델 가져오기
                var oData = oNewModel.getData(); // 화면의 모델에서 데이터 가져오기
                // JSONModel 이기 때문에 getData() 사용할 수 있음
                debugger;
                // 여기까지 적고 new에 어떤 값이 있는지 oData 확인해야 함

                // odata service와 연결된 view의 기본모델 가져오기
                // SAP Gateway와 연결된 Model 정보
                var oModel = oView.getModel();
                oModel.create( 
                    "/ConnectionSet", // 경로는 entityset, sap로 전달 돼서 저장됨
                    {   
                        // 여기에 어떤걸 적었냐에 따라 되고 안되고가 다름
                        // 프로퍼티와 데이터의 이름이 똑같아야 한다
                        Carrid: oData.Carrid,
                        Connid: oData.Connid,
                        Cityfrom: oData.Cityfrom,
                        Countryfr:oData.Countryfr,
                        Airpfrom: oData.Airpfrom,
                        Cityto: oData.Cityto,
                        Countryto: oData.Countryto,
                        Airpto: oData.Airpto,
                        Deptime: oData.Deptime,
                        Arrtime: oData.Arrtime,
                        Distance: oData.Distance,
                        Distid: oData.Distid,
                    },
                    {
                        success: function(oData, oResponse) {
                            sap.m.MessageBox.success("생성성공");
                            oView.byId("idCreateDialog").close();
                        },
                        error: function(oError) {
                            sap.m.MessageBox.error("생성실패");
                        }
                    }
                ); 
            },

            onChangeMode: function() {
                // view 모델의 경로 /edit가 토글되도록 한다.
                var oViewModel = this.getView().getModel("view");
                var edit = oViewModel.getProperty("/edit"); // json model에는 context 없고 data, property만 있음
                if ( edit ) {
                    // edit가 true 일 때는 false로 변경
                    oViewModel.setProperty("/edit", false);
                } else {
                    // edit가 true가 아닐 때는 true로 변경
                    oViewModel.setProperty("/edit", true);
                }
            },

            onSave: function() {
                // 선택한 라인을 대상으로 저장할 것
                // 선택한 라인 정보 받아오기
                var oView = this.getView();
                var oTable = oView.byId("idTable");
                var aIndex = oTable.getSelectedIndices();
                // 인덱스 어레이 가져온 것
                
                var maxLength = aIndex.length;
                var nSuccessCounter = 0;

                var oModel = oView.getModel();
                for(var i of aIndex) {
                    var oContext = oTable.getContextByIndex(i); // 경로 가져오기
                    oModel. update(
                        oContext.getPath(), // 어떤 경로의 데이터를
                        {   // 이렇게 변경하겠다
                            // SAP Gateway의 Data Model의 Property 이름 : 해당 Property에게 전달할 값
                            Carrid      : oContext.getProperty("Carrid"),
                            Connid      : oContext.getProperty("Connid"),
                            Cityfrom    : oContext.getProperty("Cityfrom"),
                            Countryfr   : oContext.getProperty("Countryfr")
                        },  
                        {
                            success: function() {
                                nSuccessCounter++;
                                if (maxLength === nSuccessCounter) {
                                    sap.m.MessageBox.success("수정완료");
                                }
                            },
                            error: function(oError) {
                                sap.m.MessageBox.error(
                                    "수정실패",
                                    {detail: oError.responseText}
                                )
                            }
                        }
                    );

                }
            }
        });
    });
