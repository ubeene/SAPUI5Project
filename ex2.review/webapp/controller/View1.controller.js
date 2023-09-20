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

        return Controller.extend("sync.c14.ex2.review.controller.View1", {
            onInit: function () {

            },

            onOpenDialog: function(oEvent) {
                // 선택한 테이블
                // var oTable = oEvent.getSource();

                // id가 idTable인 테이블 (id로 찾는 방법)
                var oTable = this.byId("idTable");
                var aIndex = oTable.getSelectedIndices();

                // 현재 테이블의 선택모드는 반드시 한개만 선택이 가능하므로,
                // 선택된 항목번호 목록을 가져온다 해도, 그 목록에는 하나만 있다.
                var index = aIndex[0]; // 인덱스 번호가져와서 테이블에서 내용 찾기
                var oContext = oTable.getContextByIndex(index);
                var path = oContext.getPath(); // 내용의 경로를 찾기

                // 현재 화면에 선택한 라인의 경로를 현재위치로 지정한다.
                var oView = this.getView();
                oView.bindElement(path);
                // 여기까지 association 데이터를 띄울 준비 끝

                /** oData에서 특정 데이터를 조회하는 방법 */
                var oModel = oView.getModel();

                // 경로를 만드는 방법 2가지
                //첫번째 경로: /FlightSet(Carrid='AA',Connid='0017',Fldate=datetime'2023-03-02T00%3A00%3A00')/toConnection
                var path1 = path + "/toConnection";
                
                oModel.read( path1, 
                    {
                        success: function(oData, oResponse){
                            var oJSONModel = new JSONModel(oData);
                            oView.setModel(oJSONModel,"conn");
                        }, error: function(){
                        }
                    });
                
                //두번째 경로: /ConnectionSet(Carrid='AA',Connid='0017')
                var carrid = oContext.getProperty("Carrid"); // 내가 선택한 라인의 Carrid
                var connid = oContext.getProperty("Connid"); // 내가 선택한 라인의 Connid
                var path2 = "/ConnectionSet(Carrid='" + carrid + "',Connid='" + connid + "')";
                // 변수의 값 앞뒤로 '" "' 있어야 함 -> 'AA'
                // 이런 과정이 복잡하기 때문에 association 쓰는 것

                oModel.read( path2, 
                    {
                        success: function(oData, oResponse){
                            var oJSONModel = new JSONModel(oData);
                            oView.setModel(oJSONModel,"conn2");
                        }, error: function(){
                        }
                    });

                // 다이얼로그 호출
                var oDialog = this.byId("idDialog");
                if (oDialog) {
                    oDialog.open();
                } else {
                    Fragment.load({
                        id:oView.getId(),
                        name:"sync.c14.ex2.review.view.Conn",
                        controller:this
                        }
                    ).then(function(oDialog){
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                }
            },

            onClose: function() {
                this.byId('idDialog').close();
            }
        });
    });
