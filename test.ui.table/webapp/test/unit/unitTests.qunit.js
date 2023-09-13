/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"syncc14/test.ui.table/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
