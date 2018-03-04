/* eslint-disable */

"use strict";

export default class EventHandler {

    constructor() {
        this._mEventMap = {};
    }

    subscribe(sEvent, fnCallback, oThis) {
        this.unsubscribe(sEvent, fnCallback, oThis);

        var aHandler = this._mEventMap[sEvent];
        if (!Array.isArray(aHandler)) {
            aHandler = [];
            this._mEventMap[sEvent] = aHandler;
        }
        aHandler.push({
            "fnCallback": fnCallback,
            "oThis": oThis
        });
    }

    unsubscribe(sEvent, fnCallback, oThis) {
        var aHandler = this._mEventMap[sEvent];
        if (!Array.isArray(aHandler)) {
            return;
        }
        this._mEventMap[sEvent] = aHandler.filter(function(oEntry) {
            return oEntry.fnCallback !== fnCallback || oEntry.oThis !== oThis;
        });
    }

    notify(sEvent, oEvent) {
        var aHandler = this._mEventMap[sEvent];
        if (!Array.isArray(aHandler)) {
            return;
        }
        aHandler.forEach(function(oEntry) {
            try {
                if (oEntry.oThis) {
                    oEntry.fnCallback.call(oEntry.oThis, oEvent);
                } else {
                    oEntry.fnCallback(oEvent);
                } 
            } catch (exc) {
                console.log(exc);
            }
        });
    }
}