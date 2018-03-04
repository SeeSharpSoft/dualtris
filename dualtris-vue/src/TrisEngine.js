/* eslint-disable */

import '@/assets/jquery-3.3.1.min.js';

import EventHandler from '@/EventHandler.js';

"use strict";

if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimationFrame =  window.webkitRequestAnimationFrame ||
                                    window.mozRequestAnimationFrame    ||
                                    window.oRequestAnimationFrame      ||
                                    window.msRequestAnimationFrame     ||
                                    function(callback) {
                                        window.setTimeout(callback, 1000 / 60);
                                    }
};

const Constants = {
    NO_OF_ROWS: 20,
    NO_OF_COLUMNS: 10,

    INITIAL_SPEED: 1000.0,

    GAME_STATE: {
        NEW: "New",
        RUNNING: "Running",
        PAUSED: "Paused",
        ENDED: "Ended"
    },

    BLOCK: {
        EMPTY: "0",
        I: "I",
        O: "O",
        T: "T",
        J: "J",
        L: "L",
        S: "S",
        Z: "Z"
    },

    BLOCK_POSITION: {
        I: {
            0: 0x159D,
            1: 0x4567,
            2: 0x159D,
            3: 0x4567,
        },
        O: {
            0: 0x569A,
            1: 0x569A,
            2: 0x569A,
            3: 0x569A,
        },
        T: {
            0: 0x1456,
            1: 0x1569,
            2: 0x4569,
            3: 0x1459,
        },
        J: {
            0: 0x1589,
            1: 0x0456,
            2: 0x0148,
            3: 0x0126,
        },
        L: {
            0: 0x0489,
            1: 0x0124,
            2: 0x0159,
            3: 0x2456,
        },
        S: {
            0: 0x1245,
            1: 0x0459,
            2: 0x1245,
            3: 0x0459,
        },
        Z: {
            0: 0x0156,
            1: 0x1458,
            2: 0x0156,
            3: 0x1458,
        }
    },
};

export default class TrisEngine extends EventHandler {

    constructor(iNoOfColumns, iNoOfRows) {
        super();
        this._mValueMap = {};
        this.noOfColumns = iNoOfColumns || Constants.NO_OF_COLUMNS;
        this.noOfRows = iNoOfRows || Constants.NO_OF_ROWS;
        this.init();
    }

    get noOfColumns() {
        return this._noOfColumns;
    }
    set noOfColumns(iValue) {
        this._noOfColumns = iValue;
    }
    get noOfRows() {
        return this._noOfRows;
    }
    set noOfRows(iValue) {
        this._noOfRows = iValue;
    }

    getProperty(sKey) {
        return this._mValueMap[sKey.substring(1)];
    }

    setProperty(sKey, mValue) {
        this._mValueMap[sKey.substring(1)] = mValue;
        this.notify("propertyChanged", { property: sKey.substring(1), value: mValue });
    }

    setData(oData) {
        this._mValueMap = oData;
    }

    init() {
        var oData = {
            board: {
                rows: []
            },
            score: 0,
            lines: 0,
            block: this.createNewBlock(),
            state: Constants.GAME_STATE.NEW
        };

        for(var rows = 0; rows < this.noOfRows; ++rows) {
            oData.board.rows.push({ columns: this._getEmptyRow() });
        }

        this.setData(oData);
    }

    _getEmptyRow() {
        var aResult = [];
        for(var columns = 0; columns < this.noOfColumns; ++columns) {
            aResult.push({
                type: Constants.BLOCK.EMPTY
            });
        }
        return aResult;
    }

    getBoard(bOriginal) {
        var oBoard = this.getProperty("/board");
        if(!bOriginal) {
            oBoard = jQuery.extend(true, {}, oBoard);
        }
        return oBoard;
    }

    getBlock(bOriginal) {
        var oBlock = this.getProperty("/block");
        if(!bOriginal) {
            oBlock = jQuery.extend(true, {}, oBlock);
        }
        return oBlock;
    }

    createNewBlock() {
        var oBlock = {
            type: Constants.BLOCK[Object.keys(Constants.BLOCK)[Math.floor(Math.random() * 7 + 1)]],
            posX: this.noOfColumns / 2 - 1,
            posY: 0,
            rotation: 0
        };

        return oBlock;
    }

    removeFullLines() {
        var oBoard = this.getBoard(),
            iRemovedLines = 0;

        for(var rows = 0; rows < this.noOfRows; ++rows) {
            var oRow = oBoard.rows[rows],
                bHasGap = false;
            for(var columns = 0; columns < this.noOfColumns; ++columns) {
                if(oRow.columns[columns].type == Constants.BLOCK.EMPTY) {
                    bHasGap = true;
                    break;
                };
            }
            // full line
            if(!bHasGap) {
                oBoard.rows.splice(rows, 1);
                oBoard.rows.unshift({ columns: this._getEmptyRow()});
                ++iRemovedLines;
            }
        }

        this.setProperty("/board", oBoard);
        this.setProperty("/lines", this.getProperty("/lines") + iRemovedLines);
        // it is better to remove more lines at once
        // if no line was removed, still give score for placing a stone
        this.setProperty("/score", this.getProperty("/score") + Math.pow(5, iRemovedLines));

        this._fSpeed-= 10*iRemovedLines;
    }

    _tick() {
        var iTick = Date.now();
        if(!this._iLastTick) {
            this._iLastTick = iTick;
        }
        if((iTick - this._iLastTick) > this._fSpeed) {
            this._iLastTick = iTick;
            if(!this.blockDown()) {
                if(!this.nextBlock()) {
                    this.endGame();
                    return;
                }
            }
        }
        if(!this._bStop) {
            window.requestAnimationFrame(this._tick.bind(this));
        }
    }

    nextBlock() {
        this.removeFullLines();
        var oBoard = this.getBoard(),
            oBlock = this.createNewBlock();

        if(!this._setBlockOnBoard(oBoard, oBlock)) {
            return false;
        }

        this.setProperty("/board", oBoard);
        this.setProperty("/block", oBlock);
        return true;
    }

    startGame() {
        this._bStop = false;
        this.init();
        this.setProperty("/state", Constants.GAME_STATE.RUNNING);
        this.nextBlock();
        this._fSpeed = Constants.INITIAL_SPEED;
        this._tick();
    }

    endGame() {
        this._bStop = true;
        this.setProperty("/state", Constants.GAME_STATE.ENDED);
    }

    pauseGame() {
        if(this.getProperty("/state") !== Constants.GAME_STATE.RUNNING) {
            return;
        }
        this._bStop = true;
        this.setProperty("/state", Constants.GAME_STATE.PAUSED);
    }

    unpauseGame() {
        if(this.getProperty("/state") !== Constants.GAME_STATE.PAUSED) {
            return;
        }
        this._bStop = false;
        this.setProperty("/state", Constants.GAME_STATE.RUNNING);
        this._tick();
    }

    _removeBlockFromBoard(oBoard, oBlock) {
        if(!oBlock || oBlock.type == Constants.BLOCK.EMPTY) {
            return false;
        }
        var x, y, iBlockRotation, iSingleBlockPosition;
        for(var i=0; i < 4; ++i) {
            iBlockRotation = Constants.BLOCK_POSITION[oBlock.type][oBlock.rotation];
            iSingleBlockPosition = (0xF & (iBlockRotation >> 4*i));
            x = oBlock.posX + (iSingleBlockPosition % 4);
            y = oBlock.posY + Math.floor(iSingleBlockPosition / 4);

            if(x < 0 || x >= this.noOfColumns ||
                y < 0 || y >= this.noOfRows ||
                oBoard.rows[y].columns[x].type != oBlock.type)
            {
                console.log("inconsistent board in _removeBlockFromBoard");
                return false;
            }

            oBoard.rows[y].columns[x].type = Constants.BLOCK.EMPTY;
        }
        return true;
    }

    _setBlockOnBoard(oBoard, oBlock) {
        if(!oBlock || oBlock.type == Constants.BLOCK.EMPTY) {
            console.log("block is EMPTY");
            return false;
        }
        var x, y, iBlockRotation, iSingleBlockPosition;
        for(var i=0; i < 4; ++i) {
            iBlockRotation = Constants.BLOCK_POSITION[oBlock.type][oBlock.rotation];
            iSingleBlockPosition = (0xF & (iBlockRotation >> 4*i));
            x = oBlock.posX + (iSingleBlockPosition % 4);
            y = oBlock.posY + Math.floor(iSingleBlockPosition / 4);

            if(x < 0 || x >= this.noOfColumns ||
                y < 0 || y >= this.noOfRows ||
                oBoard.rows[y].columns[x].type != Constants.BLOCK.EMPTY)
            {
                console.log("field " + x + ";" + y + " outside range or occupied");
                return false;
            }

            oBoard.rows[y].columns[x].type = oBlock.type;
        }
        return true;
    }

    _tryChangeBlock(fnBlockCallback) {
        var oBlock = this.getBlock();

        if(oBlock == Constants.BLOCK.EMPTY) {
            return false;
        }

        var oBoard = this.getBoard();

        if(!this._removeBlockFromBoard(oBoard, oBlock)) {
            return false;
        }

        fnBlockCallback(oBlock);

        if(!this._setBlockOnBoard(oBoard, oBlock)) {
            return false;
        }

        this.setProperty("/board", oBoard);
        this.setProperty("/block", oBlock);

        return true;
    }

    blockDown() {
        return this._tryChangeBlock(function(oBlock) {
            oBlock.posY++;
        });
    }

    blockRotateLeft() {
        return this._tryChangeBlock(function(oBlock) {
            oBlock.rotation = (oBlock.rotation + 1) % 4;
        });
    }

    blockRotateRight() {
        return this._tryChangeBlock(function(oBlock) {
            oBlock.rotation = (oBlock.rotation -1) % 4;
        });
    }

    blockLeft() {
        return this._tryChangeBlock(function(oBlock) {
            oBlock.posX--;
        });
    }

    blockRight() {
        return this._tryChangeBlock(function(oBlock) {
            oBlock.posX++;
        });
    }
}
