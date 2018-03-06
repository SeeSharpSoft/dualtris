/* eslint-disable */

import EventHandler from '@/EventHandler.js';

import * as TE from '@/TrisEngine.js'

class DualtrisEngine extends EventHandler {

    constructor(iNoOfColumns, iNoOfRows) {
        super()
        
        this.teNormal = new TE.TrisEngine(iNoOfColumns, iNoOfRows)
        this.teNormal.subscribe("propertyChanged", this.onPropertyChanged, this)

        this.teInverse = new TE.TrisEngine(iNoOfColumns, iNoOfRows, true)
        this.teInverse.subscribe("propertyChanged", this.onPropertyChanged, this)
    }

    getNormalTE() {
        return this.teNormal;
    }

    getInverseTE() {
        return this.teInverse;
    }

    onPropertyChanged(oEvent) {
        switch (oEvent.data.property) {
            case "board":
                if (oEvent.sender === this.teNormal) {
                    this.teInverse.setProperty("/board", oEvent.data.value, true)
                } else {
                    this.teNormal.setProperty("/board", oEvent.data.value, true)
                }
        }
        this.notify("propertyChanged", oEvent.data)
    }

    startGame() {
        this.teNormal.startGame()
        var oBoard = this.teNormal.getBoard(true)
        this.teInverse.startGame(oBoard)
    }

    endGame() {
        this.teNormal.endGame()
        this.teInverse.endGame()
    }

    pauseGame() {
        this.teNormal.pauseGame()
        this.teInverse.pauseGame()
    }

    unpauseGame() {
        this.teNormal.unpauseGame()
        this.teInverse.unpauseGame()
    }
}

export default DualtrisEngine
