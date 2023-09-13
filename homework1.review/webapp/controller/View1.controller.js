sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, Fragment) {
        "use strict";

        return Controller.extend("ui5.C14.homework1.review.controller.View1", {
            onInit: function () {

            },

            _showMessage: function( oEvent ) {
                 // getSource()를 통해서 선택된 라인의 데이터를 가져오는 방법
                 var oSource = oEvent.getSource();
                
                 // 첫번째 Selected Context를 찾아서 해당 Context의 Property를 가져오는 방법
                 var oSelectedContext = oSource.getSelectedContexts()[0]; // 선택된 라인의 데이터, contexets라 배열이 와서 첫번째꺼만  
                 var carrid = oSelectedContext.getProperty("Carrid"); // 해당 데이터의 Carrid 값
                 var connid = oSelectedContext.getProperty("Connid"); // 해당 데이터의 Connid 값
 
                 // MessageToast.show("항공사:" + carrid + " / 항공편번호:" + connid);
 
                 // 두번째 Selected Item 을 찾아서 해당 아이템의 Context의 Property를 가져오는 방법
                 var oSelectedItem = oSource.getSelectedItem();
                 var oContext = oSelectedItem.getBindingContext("abcd"); // () : 모델명 
                 var carrid = oContext.getProperty("Carrid");
                 var connid = oContext.getProperty("Connid");
                 
                 // MessageToast.show("항공사:" + carrid + " / 항공편번호:" + connid);
                 
                 
                 var oParam = oEvent.getParameters();
                 
                 // listItem은 선택한 라인 정보고, 해당 라인에서 Context를 가져와 Property로 
                 // 특정 컬럼의 데이터를 조회할 수 있다.
                 var oItem  = oParam.listItem;
                 var oContext = oItem.getBindingContext("abcd"); // 모델명
                 var carrid = oContext.getProperty("Carrid");
                 var connid = oContext.getProperty("Connid");
 
                //  MessageToast.show("항공사:" + carrid + " / 항공편번호:" + connid);
 
                 var oItems = oParam.listItems;
 
                 // oItems 라는 배열에서 첫번째 위치의 데이터를 oItem에 기록한다.
                 // READ TABLE oItems INTO oItem INDEX 1.
                 var oItem = oItems[0];
 
                 var oContext = oItem.getBindingContext("abcd"); // 모델명
                 var carrid = oContext.getProperty("Carrid");
                 var connid = oContext.getProperty("Connid");
 
                 MessageToast.show("항공사:" + carrid +  "\n" +  "항공편번호:" + connid);
 
            },
            
            onSelectionChange: function ( oEvent ) {
                this._showMessage( oEvent );
                this._openDialog( oEvent );
            },

            _openDialog: function ( oEvent ) {
                // 선택한 경로가 화면의 현재위치로 지정되도록 설정
                var oSource = oEvent.getSource();
                var oItem = oSource.getSelectedItem();
                var sPath = oItem.getBindingContextPath();
                var oView = this.getView();
                oView.bindElement({
                    path: sPath,
                    model: 'abcd'
                }); // 선택된 경로가 화면의 경로로 지정이 됐다

                // 팝업 호출
                var oDialog = oView.byId("idInfoDialog");

                if ( oDialog ) {
                    // View1.view.xml에서 이미 idInfoDialog를 사용한 적이 있으면,
                    // 해당 다이얼로그를 바로 open() 한다.
                    oDialog.open();
                } else {
                    // 없으면 메모리 바로 불러와야 한다
                    // Fragment.load({}).then(function(oDialog){});
                    
                    // 이 컨트롤러의 onCloseDialog를 사용하기 위해 이 컨트롤러(this)를 전달한다.
                    Fragment.load({
                        id          : oView.getId(), // id 이름 지을 때 더 붙이고 싶은 텍스트가 뭐냐
                        name        :"ui5.C14.homework1.review.view.Info",
                        controller  :this // 다른 기능이 또 있기 때문에 적어줌
                    }).then(function(oDialog){
                        oView.addDependent(oDialog); // Dialog가 Model에 접근하기 위해
                        oDialog.open(); // Dialog 호출
                    });
                }
            },  

            onCloseDialog: function() {
                // 팝업 닫기
                this.byId("idInfoDialog").close();
            },

            onItemPress: function () {
                //alert('아이템 프레스')
                // this._showMessage( oEvent );
                // this._openDialog( oEvent );
            }
        });
    });
