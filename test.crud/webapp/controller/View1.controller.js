sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
    /** 어디에서 데이터 가져오는지 직관적으로 확인하는 용도
     * @param {sap.ui.core.mvc.Controller} Controller
     * @param {sap.ui.model.json.JSONModel} JSONModel
     * @param {sap.ui.core.Fragment} Framgent
     * @param {sap.m.MessageBox} MessageBox
     **/
    function (Controller, JSONModel, Fragment, MessageBox) {
        "use strict";

        return Controller.extend("sync.c14.test.crud.controller.View1", {
            onInit: function () {
                // 생성시 사용할 Model 데이터
                var oData = {
                    carrier: {
                        Carrid: "",
                        Carrname:"",
                        Currcode:"",
                        Url:""
                    }
                };
                // 생성시 fragment에서 사용할 데이터 모델
                var oModel = new JSONModel( oData );
                var oView = this.getView();
                oView.setModel(oModel,"new");

                var oModel= new JSONModel( oData );
                oView.setModel(oModel, "edit");
            },

            onCreate: function () {
                // new 모델의 데이터 초기화
                var oView = this.getView();
                var oModel = oView.getModel("new");
                // 이 작업을 안해주면 팝업창 열었을 때 이전값이 그대로 화면에 뜸
                // 입력필드를 빈값으로 세팅
                oModel.setProperty("/carrier/Carrid","");
                oModel.setProperty("/carrier/Carrname","");
                oModel.setProperty("/carrier/Currcode","");
                oModel.setProperty("/carrier/Url","");
                
                // 팝업창 호출
                this._openDialog("idNewDialog", "sync.c14.test.crud.view.New");
            },

            // private method
            _openDialog : function (sId, sName) {
                var oView = this.getView();
                var oDialog = oView.byId(sId);

                if (oDialog) {
                    // 이미 해당 다이얼로그가 로드되어 있으면 곧바로 오픈
                    oDialog.open(); // 다시 읽어오지 않고 바로 open
                } else {
                    // 해당 다이얼로그가 화면에 로드되어 있지 않은 경우
                    // 화면에 먼저 로드 -> fragment.load -> 쓰기 위해 sap/ui/core/Fragment 기능
                    // Fragment.load({}).then(function() {});
                    Fragment.load({
                        id          : oView.getId(),
                        name        : sName,
                        controller  : this
                    }).then(function(oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });  
                }
            },

            onCloseDialog: function() {
                this.getView().byId("idNewDialog").close();
            },


            onSave: function () {
                // 화면에 모델정보 가져오고, 모델에 create하기 위해 new 모델에서 데이터 가져옴
                var oModel = this.getView().getModel();
                var oNewModel = this.getView().getModel("new");

                // 화면에 입력한 값이 들어있음
                var oInputData = oNewModel.getData();
 
                // controller가 명령한 로직이 아니라
                // odata가 실행된 결과에 따라 로직이 실행돼서 this를 쓸 수가 없음
                var that = this;

                debugger;
                // gateway에서 entityset 경로를 지정하고 post 던져서 데이터 줬던 것처럼
                // 1)누구에게 생성 명령을 내릴건지 경로 지정, 2)생성할 데이터 전달, 3)실행된 결과
                oModel.create(
                    "/CarrierSet",
                    {
                        Carrid   : oInputData.carrier.Carrid,
                        Carrname : oInputData.carrier.Carrname,
                        Currcode : oInputData.carrier.Currcode,
                        Url      : oInputData.carrier.Url
                    },
                    {
                        success: function (oData, oResponse) {
                            MessageBox.success("신규 항공사" + oData.Carrid + " 가 생성되었습니다.");
                            // 모델에 대한 데이터를 게이트웨이에서 가져와서 강제 refresh
                            // 모델 데이터 변경되면 자동 refresh 되는데, 강제로 refresh 꺼버렸을 때 쓸 수 있다
                            // oModel.setRefreshAfterChange(false);
                            // oModel.refresh();
                            that.onCloseDialog(); 
                        },
                        error: function (oError) {
                            MessageBox.error("생성실패:" + oError.responsieText);
                        }
                    }


                );

            },

            onDelete: function () {
                // 체크박스를 선택한 아이템만 알기 위해 테이블의 id 조회
                // 어떤 라인을 클릭했는지 알아오기 위해 테이블을 controller에서 취급하기 위해 id를 부여\
                var oTable = this.byId("idTable");
                var oItems = oTable.getSelectedItems(); // 배열

                if (!oItems || oItems.length === 0 ) {
                    // 사용자가 한 줄도 선택하지 않고, [삭제] 버튼을 눌렀을 때
                    MessageBox.information("라인을 먼저 선택하세요.");
                    return; // onDelete를 그만 중단한다.
                }

                // 이 문장부터는 oItems에 데이터가 있는 경우를 의미한다.

                // oData Model을 가져와 Delete 명령을 보낸다.
                var oModel = this.getView().getModel();

                var nSuccessCount = 0;
                
                for ( var i=0 ; i < oItems.length ; i++) {
                    var oItem = oItems[i];
                    // 선택된 각 라인별 엔티티 경로를 가져와서
                    var path = oItem.getBindingContext().getPath();

                    // oModel.remove(삭제하고 싶은 엔트리 경로, { 성공했을 때, 실패했을 때})
                    // 엔티티 삭제 요청 -> 구동되기 위해서는 sap 에서 기능 구현
                    oModel.remove( path , {
                        success: function (oData, oResponse) {
                            // 요청된 결과가 성공적으로 진행되었을 때
                            nSuccessCount ++ ;
                            //  성공횟수(nSuccessCount) === 반복된 횟수(i) -> 마지막 횟수에 같도록
                            if (nSuccessCount == i) {
                                // 마지막에 딱 한번 성공메세지를 출력한다.
                                MessageBox.success("삭제가 완료되었습니다.");
                            }
                        },
                        error: function (oError) {
                            // 요청된 내용이 오류로 이어졌을 때
                            MessageBox.error("삭제실패" + oError.responsieText);
                        }
                    });
                };
                    
            },

            onOpenDialogEdit: function ( oEvent ) {

                // 이벤트가 발생한 출처
                var oSource = oEvent.getSource();

                // 출처의 연결된 데이터
                var oContext = oSource.getBindingContext();

                // 그 데이터의 속성값 조회
                var carrid = oContext.getProperty("Carrid");
                var carrname = oContext.getProperty("Carrname");
                var currcode = oContext.getProperty("Currcode");
                var url = oContext.getProperty("Url");

                var oEditModel = this.getView().getModel("edit");
                oEditModel.setData({
                    carrier: {
                        Carrid: carrid,
                        Carrname: carrname,
                        Currcode: currcode,
                        Url: url
                    }
                })
                this._openDialog("idEditDialog", "sync.c14.test.crud.view.Edit");
            },

            onCloseDialogEdit: function () {
                this.getView().byId("idEditDialog").close();
            },

            onEditComplete: function () {
                var oView = this.getView();

                var oEditModel = oView.getModel("edit"); 
                /*  carrier: {
                    Carrid: carrid,
                    Carrname: carrname,
                    Currcode: currcode,
                    Url: url }  */
                var sCarrier = oEditModel.getData().carrier;

                var oModel = oView.getModel();
                oModel.update(  // 특정 경로, 어떻게 값 변경할건지 데이터 전달, { 성공, 실패 }
                    // 경로 ex) /CarrierSet('AA'),
                    "/CarrierSet('" + sCarrier.Carrid + "')",
                    // 데이터 전달
                    sCarrier,
                    {
                        success: function() {
                            MessageBox.success("항공사" + sCarrier.Carrid + "가 성공적으로 수정되었습니다.")
                        },
                        error : function( oError ) {
                            MessageBox.error("수정실패:" + oError.message);
                        }
                    }
                )
            }

        });
    });
