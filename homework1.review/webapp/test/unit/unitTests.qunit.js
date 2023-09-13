/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ui5C14/homework1.review/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
