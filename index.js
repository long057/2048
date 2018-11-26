
var colorsList = { "0": "#ccc0b3", "2": "#eee4da", "4": "#ede0c8", "8": "#f2b179", "16": "#f59563", "32": "#f67e5f", "64": "#f65e3b", "128": "#edcf72", "256": "#edcc61", "512": "#9c0", "1024": "#33b5e5", "2048": "#09c" };

var my2048;
var newGameBtn = document.getElementsByClassName('newGame')[0];
var chooseBtn = document.getElementsByClassName('choose')[0];
var rows = 4;
var cols = 4;
var squareWidth = 100;
var spacing = 12;
var boardSet = [];
var squareSet = [];
var valueMap = [];
var directionNum = { left: { key: 'left' }, right: { key: 'left' }, up: { key: 'top' }, down: { key: 'top' } };
var lock = true;
var isChange = false;

window.onload = function () {
    init();
}

// 初始化游戏
function init() {
    // 初始化面板
    initBoard();
    // 随机生成有值的小方块
    randGenerateSquare();
    randGenerateSquare();
    // 键盘事件
    document.addEventListener('keydown', function (e) {
        e = e || window.event;
        if (lock) {
            lock = false;
            switch (e.key) {
                case 'ArrowLeft':
                    move(directionNum.left);
                    break;
                case 'ArrowRight':
                    move(directionNum.right);
                    break;
                case 'ArrowUp':
                    move(directionNum.up);
                    break;
                case 'ArrowDown':
                    move(directionNum.down);
                    break;
                defalut: {
                    lock = true;
                }
            }
        }
    })
    // 点击事件
    bindEvent();
}

function bindEvent () {
    newGameBtn.addEventListener('click', function () {
        init();
    })
    chooseBtn.addEventListener('click', function (e) {
        if(e.target.className == 'low') {
            rows = 4;
            cols = 4;
            squareWidth = 100;
        } else if (e.target.className == 'middle') {
            rows = 6;
            cols = 6;
            squareWidth = 80;
        } else if (e.target.className == 'high') {
            rows = 8;
            cols = 8;
            squareWidth = 50;
        }
        my2048.innerHTML = '';
        
        init();
    })
}

function initBoard() {
    my2048 = document.getElementById('my2048');
    my2048.style.width = squareWidth * cols + (cols + 1) * spacing + 'px';
    my2048.style.height = squareWidth * rows + (rows + 1) * spacing + 'px';
    for (var i = 0; i < rows; i++) {
        boardSet[i] = [];
        squareSet[i] = [];
        valueMap[i] = [];
        for (var j = 0; j < cols; j++) {
            var left = j * squareWidth + (j + 1) * spacing;
            var top = i * squareWidth + (i + 1) * spacing;
            var temp = createSquare(0, left, top, i, j);
            boardSet[i][j] = temp;
            squareSet[i][j] = null;
            valueMap[i][j] = 0;
            my2048.appendChild(temp);
        }
    }
}

function createSquare(value, left, top, row, col) {
    var temp = document.createElement('div');
    temp.style.width = squareWidth + 'px';
    temp.style.height = squareWidth + 'px';
    temp.style.left = left + 'px';
    temp.style.top = top + 'px';
    temp.style.background = colorsList[value];
    temp.style.lineHeight = squareWidth + 'px';
    temp.style.fontSize = squareWidth * 0.4 + 'px';
    temp.num = value;
    temp.row = row;
    temp.col = col;
    if (value > 0) {
        temp.innerHTML = '' + value;
    }
    return temp;
}

function randGenerateSquare() {
    for (; ;) {
        var randRow = Math.floor(Math.random() * rows);
        var randCol = Math.floor(Math.random() * cols);
        if (valueMap[randRow][randCol] == 0) {
            var newLeft = randCol * squareWidth + (randCol + 1) * spacing;
            var newTop = randRow * squareWidth + (randRow + 1) * spacing;
            var temp = createSquare(randSquareNum(), newLeft, newTop, randRow, randCol);
            my2048.appendChild(temp);
            squareSet[randRow][randCol] = temp;
            valueMap[randRow][randCol] = temp.num;
            return;
        }
    }
}

function randSquareNum() {
    return Math.random() > 0.5 ? 2 : 4;
}

function move(direction) {
    if(isOver()) {
        alert('Game Over!');
        lock = true;
    }
    var newSquareSet = analysisAction(direction);
    console.log(newSquareSet)
    setTimeout(function () {
        refresh(newSquareSet);
        if(isChange) {
            randGenerateSquare();
        }
        lock = true;
        isChange =false;
    }, 300)
}

function analysisAction(direction) {
    var newSquareSet = generateNullMap();
    if (direction == directionNum.left) {//向左
        for (var i = 0; i < squareSet.length; i++) {
            var temp = [];
            for (var j = 0; j < squareSet[i].length; j++) {
                if (squareSet[i][j] != null) {
                    temp.push(squareSet[i][j]);
                }
            }
            temp = getNewLocation(temp);
            for (var k = 0; k < squareSet[i].length; k++) {
                if (temp[k]) {
                    newSquareSet[i][k] = temp[k];
                }
            }
            // console.log(newSquareSet);
        }
    } else if (direction == directionNum.right) {// 向右
        for(var i = 0; i < squareSet.length; i ++) {
            var temp = [];
            for(var j = squareSet[i].length - 1; j >= 0; j --) {
                if(squareSet[i][j]) {
                    temp.push(squareSet[i][j]);
                }
            }
            temp = getNewLocation(temp);
            for(var k = squareSet[i].length - 1; k >= 0; k --) {
                if(temp[squareSet[i].length - 1 - k]) {
                    newSquareSet[i][k] = temp[squareSet[i].length - 1 - k];
                }
            }
        }

    } else if (direction == directionNum.up) {//向上
        for(var j = 0; j < cols; j ++) {
            var temp = [];
            for(var i = 0; i < rows; i ++) {
                if(squareSet[i][j]) {
                    temp.push(squareSet[i][j]);
                }
            }
            temp = getNewLocation(temp);
            for(var k = 0; k < rows; k ++) {
                if(temp[k]) {
                    newSquareSet[k][j] = temp[k];
                }
            }
        }
    } else if( direction == directionNum.down) {//向下
        for(var j = 0; j < cols; j ++) {
            var temp = [];
            for(var i = rows - 1; i >= 0; i --) {
                if(squareSet[i][j]) {
                    temp.push(squareSet[i][j])
                }
            }
            temp = getNewLocation(temp);
            for(var k = rows - 1; k >= 0; k --) {
                if(temp[rows - 1 - k]) {
                    newSquareSet[k][j] = temp[rows - 1 - k];
                }
            }
        }
    }

    // 运动
    for (var i = 0; i < newSquareSet.length; i++) {
        for (var j = 0; j < newSquareSet[i].length; j++) {
            if(newSquareSet[i][j] != null) {
                newSquareSet[i][j].style.transition = direction.key + ' 0.3s';
                newSquareSet[i][j].style.top = i * squareWidth + (i + 1) * spacing + 'px';
                newSquareSet[i][j].style.left = j * squareWidth + (j + 1) * spacing + 'px';
                if(newSquareSet[i][j].nextSquare) {
                    newSquareSet[i][j].nextSquare.style.transition = direction.key +' 0.3s';
                    newSquareSet[i][j].nextSquare.style.top = i * squareWidth + (i + 1) * spacing + 'px';
                    newSquareSet[i][j].nextSquare.style.left = j * squareWidth + (j + 1) * spacing + 'px';
                }
            }
        }
    }
    return newSquareSet;
}

function generateNullMap() {
    var newSet = [];
    for (var i = 0; i < rows; i++) {
        newSet[i] = [];
        for (var j = 0; j < cols; j++) {
            newSet[i][j] = null;
        }
    }
    return newSet;
}

// 获取新的位置信息
function getNewLocation(arr) {
    if (arr.length == 0) {
        return [];
    }
    var temp = [];
    temp.push(arr[0]);
    for (var i = 1; i < arr.length; i++) {
        if (arr[i].num == temp[temp.length - 1].num && (!temp[temp.length - 1].nextSquare || temp[temp.length - 1].nextSquare == null)) {
            temp[temp.length - 1].nextSquare = arr[i];
        } else {
            temp.push(arr[i]);
        }
    }
    return temp;
}

// 刷新数据
function refresh (newSquareSet) {
    squareSet = generateNullMap();
    var newValueMap = generateNullMap();
    for(var i = 0; i < rows; i ++) {
        for(var j = 0; j < cols; j ++) {
            if(newSquareSet[i][j]) {
                if(newSquareSet[i][j].nextSquare) {
                    var temp = createSquare(newSquareSet[i][j].num * 2, newSquareSet[i][j].offsetLeft, newSquareSet[i][j].offsetTop, i, j);
                    squareSet[i][j] = temp;
                    my2048.removeChild(newSquareSet[i][j].nextSquare);
                    my2048.removeChild(newSquareSet[i][j]);
                    my2048.appendChild(temp);
                } else {
                    var temp = createSquare(newSquareSet[i][j].num, newSquareSet[i][j].offsetLeft, newSquareSet[i][j].offsetTop, i, j);
                    squareSet[i][j] = temp;
                    my2048.removeChild(newSquareSet[i][j]);
                    my2048.appendChild(temp);
                }
                if(valueMap[i][j] !== squareSet[i][j].num) {
                    isChange = true;
                }
                newValueMap[i][j] = squareSet[i][j].num;
            } else {
                newValueMap[i][j] = 0;
            }
        }
    }
    valueMap = newValueMap;
}

// 判断是否结束
function isOver () {
    for(var i = 0;i < rows; i ++) {
        for(var j = 0; j < cols; j ++) {
            if(squareSet[i][j] == null) {
                return false;
            }
            if(squareSet[i][j + 1] && squareSet[i][j].num == squareSet[i][j + 1].num || (squareSet[i + 1] && squareSet[i + 1][j] && squareSet[i + 1][j].num == squareSet[i][j].num)) {
                return false;
            }

        }
    }
    return true;
}