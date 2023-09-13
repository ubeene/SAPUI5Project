sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {sap.m.MessageBox} MessageBox
     */
    function (Controller, MessageBox, JSONModel, Fragment) {
        "use strict";

        return Controller.extend("sync.c14.test.ui.table.58.controller.View1", {
            onInit: function () {
                // // 화면이 전부 그려지기 전에 onInit이 호출됨
                // var oRouter = this.getOwnerComponent().getRouter();
                // //getRoute(Manifest.json의 경로이름)
                // oRouter.getRoute("RouteView1").attachMatched(this._onRouterMatched, this);

                // // getRoute(Manifest.json의 경로이름)
                // var oTable = this.byId("idCarrierTable");
                // this.oBusyIndicator = oTable.getNoData();
            
                var oData = {
                    edit : false,
                    currency: [
                        {key:'KRW'},
                        {key:'USD'},
                        {key:'JPY'},
                        {key:'EUR'},
                        {key:'CNY'}
                    ]
                }; // edit라는 경로의 false라는 기본값 가지고 모델에 저장

                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel,"view");
            },

            _onRouterMatched: function ( oEvent ) {
                // onInit 에서는 테이블의 바인딩 정보가 없으므로,(안됨)
                // 라우터의 경로가 일치할 때 이 메소드가 호출되도록 로직을 추가
                // 이 메소드가 호출되는 시점은 화면이 전부 로드가 끝난 뒤이므로,
                // 테이블의 바인딩 정보를 가져올 수 있다.
                
                // 가져온 바인딩 정보를 이용하여 화면에 데이터를 새로고침 시켜 No Data 현상을 방지한다.
                // List Binding 정보를 가져온다

                var oTable = this.byId("idCarrierTable");
                // this.oBusyIndicator = oTable.getNoData();
                // 전역변수 , this는 oBusyIndicator: null과 똑같다

                // List Binding 정보를 가져온다.
                var oBinding = oTable.getBinding("rows");

                // 데이터를 요청했을 때 로직 - 로딩 과정을 보여주기 위한 작업
                oBinding.attachDataRequested(function () {
                    oTable.setNoData(this.oBusyIndicator);
                });

                // 데이터를 전달받았을 때 로직 (setnodata 는 없다) - 로딩 과정을 중단한다.
                oBinding.attachDataReceived(function () {
                    oTable.setNoData(null);
                });

                // 연결된 OData Service에서 데이터를 새로고침
                oBinding.refresh();
            },

            // 읽어온 데이터가 화면에 제대로 뜨도록 함 
            onModelRefresh: function () {
                this.byId("idCarrierTable").getBinding().refresh(true);
            },

            onDelete: function () {
                // 테이블 정보 가져오기 -> 선택된 항목 찾기 -> 삭제 명령
                var oView = this.getView();
                var oModel = oView.getModel(); // sap와 연결된 모델

                // sap.ui.table.Table의 ID를 전달해서 해당 객체를 oTable에 저장한다.
                // oTable에 담긴 정보를 이용해서 선택된 항목들을 찾고,
                // 선택된 항목들만 삭제되도록 이 메소드에서 구현한다.
                var oTable = this.byId("idCarrierTable");
                
                // sap.m.list나 sap.m.table에서만 items을 다룸 여기서는 rows로 경로를 받음
                // 선택된 라인들의 개수(번호) 가져옴
                var aIndex = oTable.getSelectedIndices();
                
                var nSuccessCount = 0;
                for( var i=0; i<aIndex.length ; i++) {
                // 배열이라서 반복문을 돌릴 수 있음
                // 해당하는 숫자의 라인에 context를 가져옴
                    var oContext = oTable.getContextByIndex(aIndex[i]);
                    var sPath = oContext.getPath(); // "/CarrierSet("B")"
                    oModel.remove(
                        sPath,
                        {
                            success: function() {
                                nSuccessCount++;
                                if(nSuccessCount === i){
                                MessageBox.success("데이터가 삭제되었습니다.");
                                // 삭제되고 선택된 그 자리 체크해제 해주기 위해서
                                oTable.clearSelection(); 
                                }
                            }, 
                            error: function( oError ) {
                                MessageBox.error("삭제실패:" + oError.responeText);
                            }
                        }
                    )
                }

            },

            onOpenDialogNew: function () {
                var oData={
                    carrier: {
                        Carrid:"",
                        Carrname:"",
                        Currcode:"",
                        Url:""
                    }
                }

                var oModel = new JSONModel(oData);
                var oView = this.getView();
                this.getView().setModel(oModel,'new');

                var oDialog = this.byId("idNewDialog");
                if(oDialog) {
                    oDialog.open();
                } else {
                    var loadData = {
                        id: oView.getId(),
                        name: "sync.c14.test.ui.table.58.view.New",
                        controller: this
                    };

                    Fragment.load(loadData).then(function(oDialog){
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                }
            },

            // oEvent : 발생한 곳 가져와서
            onCloseDialog: function (oEvent) {
                
                // 버튼의 상위가 dialog라서 id 없이도 가져올 수 있다
                // oEvent.getSource().getParent().close();
                // 닫기 버튼의 상위 객체 = dialog 팝업창
                var  oDialog = oEvent.getSource().getParent();
                oDialog.close();
            },

            onSave: function () {
                var oView = this.getView();

                // new 모델
                var oNewModel = oView.getModel("new");
                var sCarrier = oNewModel.getData().carrier;

                // 기본 모델
                var oModel = oView.getModel();
                oModel.create(
                    "/CarrierSet",
                    sCarrier,
                    {
                        success: function (oData, oResponse) {
                            MessageBox.success("항공사"+ oData.Carrid + " 가 생성되었습니다.");
                        },
                        error: function (oError) {
                            MessageBox.error("생성실패:" + oError.responseText);
                        }
                    }
                )
            },
            
            onChangeMode: function () {
                var oModel = this.getView().getModel("view");
                var oData = oModel.getData(); // {edit: false}
                debugger;
                if ( oData.edit ) { // oData.edit : false
                    oData.edit = false;
                } else {
                    oData.edit = true;
                }
                oModel.setData(oData);
                // 여기까지 쓰면 버튼 눌렀을 때 조회, 수정모드 계속 바뀜
                
            },

            onUpdate : function () {
                var that = this;
                // 뷰를 가져온다음 뷰의 모델 가져옴
                var oView = this.getView();
                // SAP Gateway로 Update 하기 위한 oData Model
                var oModel = oView.getModel();

                // 테이블에서 선택한 라인 가져오기 위해 oTable, 선택된 라인들의 번호 가져옴
                var oTable = this.byId("idCarrierTable");
                // 선택된 라인정보를 가져와 해당 라인들의 변경사항을 서버로 전송한다.
                var aIndex = oTable.getSelectedIndices();

                // 배열에 대해서 반복을 돌려서 펑션 안에 내용이 세개의 파라미터 받음
                // vIndex는 몇번째 줄에 해당하는 데이터를 가져오는 (read table index)
                // 가져온 데이터에 대한 경로를 oModel의 update에게 전달
                // 경로와 함께 네개의 필드 현재 내가 선택한 라인의 프로퍼티(속성) 가지고 감
                aIndex.forEach(function(vIndex, number, array) {
                    // vIndex 숫자에 해당되는 행번호의 데이터를 가져온다.
                    // 내가 선택한 줄에 대한 데이터
                    var oContext = oTable.getContextByIndex(vIndex);
                    // s = string
                    var sPath = oContext.getPath();

                    // 경로, 변경된 데이터, 
                    oModel.update( sPath,
                        {   Carrid: oContext.getProperty("Carrid"),
                            Carrname: oContext.getProperty("Carrname"),
                            Currcode: oContext.getProperty("Currcode"),
                            Url: oContext.getProperty("Url")
                        },
                        {
                            success: function (oData, oResponse){
                                if (number + 1 === array.length){
                                    MessageBox.success(
                                        array.length + " 건이 수정되었습니다.");

                                    // 선택된 라인 해제
                                    oTable.clearSelection();

                                    //view 모델의 /edit의 값에 따라 수정모드/조회모드로 관리된다.
                                    // /edit = true 면 수정모드, false면 조회
                                    // 수정되면 조회모드로 바뀌고 값도 변경, 선택도 해제됨
                                    that.onChangeMode();
                                    
                                }
                            },
                            error: function (oError) {
                                MessageBox.error("수정실패:"+ oError.responseText);
                            }
                        });
                })
            }
        });
    });
