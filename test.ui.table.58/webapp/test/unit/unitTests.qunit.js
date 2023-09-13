/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"syncc14/test.ui.table.58/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
