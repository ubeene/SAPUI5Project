/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"syncc14/ex1.review/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
