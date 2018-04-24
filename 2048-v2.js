(function () {
    'use strict';
  
    var isMobile = navigator.userAgent.search(/Android|webOS|iPhone|iPod|BlackBerry/i) === -1 ? false : true;
  
    createPage();
  
    if (!isMobile) {
        document.addEventListener('keyup', function (e) {
        var curKey = e.keyCode || e.which || e.charCode;
        var direct;
        if (curKey === 37) direct = 'left';
        else if (curKey === 38) direct = 'up';
        else if (curKey === 39) direct = 'right';
        else if (curKey === 40) direct = 'down';
        // console.log(curKey)
    
        if (direct) updateTable(direct);
      }, false)
    }
  
    // 创建页面，包括分数块、新游戏按钮、和4x4表格
    function createPage() {
      var frag = document.createDocumentFragment();
  
      // 非首次进入页面, 删除所有元素，重新添加
      while (document.body.firstElementChild) frag.appendChild(document.body.firstElementChild);
      while (frag.firstChild) frag.removeChild(frag.firstChild);
  
      // 创建得分块
      frag.appendChild(createScoreDiv());
  
      // 创建新游戏按钮
      frag.appendChild(createNewGameButton());
  
      // 创建表格
      frag.appendChild(createTable());
  
      // 创建-1层静止表格
      frag.appendChild(createStaticTable());
  
      // 初始化表格
      randomAssign(frag, 2)
  
      // frag插入body，构建页面
      document.body.appendChild(frag);
  
      // 监听用户事件，更新分数和表格
      listeners();
    }
  
    // 创建分数块
    function createScoreDiv() {
      var div_score = document.createElement('div');
      div_score.appendChild(document.createTextNode('当前得分: '));
      var span = document.createElement('span');
      span.appendChild(document.createTextNode('0'));
      div_score.appendChild(span);
      return div_score;
    }
  
    // 创建新游戏按钮
    function createNewGameButton() {
      var button_newGame = document.createElement('button');
      button_newGame.appendChild(document.createTextNode('New Game'));
      button_newGame.addEventListener('click', createPage, false);
      return button_newGame;
    }
  
    // 创建4x4表格
    function createTable() {
      var table = document.createElement('table');
      table.setAttribute('id', 'game')
      for (var i = 0; i < 4; i++) {
        var tr = document.createElement('tr')
        for (var j = 0; j < 4; j++) {
          var div = document.createElement('div')
          var td = document.createElement('td')
          td.classList.add('empty')
          div.appendChild(td)
          if (!isMobile) {
            div.style.top = 105 * i + 'px';
            div.style.left = 105 * j + 'px';
          } else {
            div.style.top = 91 * i + 'px';
            div.style.left = 91 * j + 'px';
          }
          tr.appendChild(div);
          // tr.appendChild(td);
        }
        table.appendChild(tr);
      }
      return table;
    }
  
    // 创建-1层静止表格
    function createStaticTable() {
      var table = document.createElement('table');
      table.setAttribute('id', 'down')
      for (var i = 0; i < 4; i++) {
        var tr = document.createElement('tr')
        for (var j = 0; j < 4; j++) {
          var div = document.createElement('div')
          var td = document.createElement('td')
          var td = document.createElement('td')
          td.classList.add('static')
          div.appendChild(td)
          if (!isMobile) {
            div.style.top = 105 * i + 'px';
            div.style.left = 105 * j + 'px';
          } else {
            div.style.top = 91 * i + 'px';
            div.style.left = 91 * j + 'px';
          }
          tr.appendChild(div);
          // tr.appendChild(td);
        }
        table.appendChild(tr);
      }
      return table;
    }
  
    // 在空的单元格里插入num个2或4
    function randomAssign(frag, num) {
      var tds = [...frag.querySelectorAll('td.empty')];
      for (var i = 0; i < num; i++) {
        var tf;
        for (var j = 0; j < 2; j++) {
          tf = Math.ceil(Math.random() * 2) * 2;
        }
        var rNum = Math.floor(Math.random() * tds.length);
        if (tds[rNum].classList.contains('add2') || tds[rNum].classList.contains('add4-begin')) {
          i -= 1;
          continue;
        }
        tds[rNum].classList.add('add' + tf + (tf === 4 ? '-begin' : ''));
        tds[rNum].appendChild(document.createTextNode(tf));
        // console.log(rNum)
      }
    }
  
    // 捕捉鼠标或手指事件, 区分移动端和网页端
    function listeners() {
      var direct;
      var table = document.getElementById('game');
      var startPosX, startPosY, endPosX, endPosY;
      // 移动端监听touchstart, touchmove 和 touchend三个事件
      if (isMobile) {
        table.addEventListener('touchstart', function (e) {
          var touch = e.targetTouches[0];
          startPosX = touch.pageX;
          startPosY = touch.pageY;
          console.log(startPosX, startPosY);
        }, false)
        table.addEventListener('touchmove', function (e) {
          var touch = e.targetTouches[0];
          endPosX = touch.pageX;
          endPosY = touch.pageY;
          console.log(endPosX, endPosY);
          // 判断方向
          var angle = trace(Math.atan2(startPosY - endPosY, endPosX - startPosX))
          if (angle > 45 && angle < 135) direct = 'up';
          if (angle < 45 && angle > -45) direct = 'right';
          if (angle > 135 || angle < -135) direct = 'left';
          if (angle < -45 && angle > -135) direct = 'down';
          // console.log(angle, direct);
        }, false)
  
        table.addEventListener('touchend', function (e) {
          // 更新表格
          // console.log(direct)
          updateTable(direct)
        }, false)
      }
      // PC端监听mousedown、mouseup事件和keyup事件
      else {
        table.addEventListener('mousedown', function (e) {
          startPosX = e.pageX;
          startPosY = e.pageY;
          // console.log(startPosX, startPosY);
        }, false)
        table.addEventListener('mouseup', function (e) {
          endPosX = e.pageX;
          endPosY = e.pageY;
          // console.log(endPosX, endPosY);
          // 判断方向
          var angle = trace(Math.atan2(startPosY - endPosY, endPosX - startPosX))
          if (angle > 45 && angle < 135) direct = 'up';
          if (angle < 45 && angle > -45) direct = 'right';
          if (angle > 135 || angle < -135) direct = 'left';
          if (angle < -45 && angle > -135) direct = 'down';
          // console.log(angle, direct);
  
          // 更新表格
          // console.log(direct)
          updateTable(direct)
        }, false)
      }
    }
  
    // 弧度值 to 角度值
    function trace(x) {
      //弧度=角度*Math.PI/180
      return 180 * x / Math.PI
    }
  
    // 更新表格和分数
    function updateTable(direct) {
      var frag = document.createDocumentFragment();
      frag.appendChild(document.getElementById('game'));
      var frag_span = document.createDocumentFragment();
      frag_span.appendChild(document.querySelector('div span'));
  
      var tds = [...frag.querySelectorAll('td')];
      var result = [];
      var row, pushOrUnshift, order;
      var isMove = false,
        isSum = false;
      var score = parseInt(frag_span.firstElementChild.innerHTML);
  
      if (direct === 'up') {
        row = false;
        pushOrUnshift = 'push';
        order = false;
      } else if (direct === 'down') {
        row = false;
        pushOrUnshift = 'unshift';
        order = true;
      } else if (direct === 'left') {
        row = true;
        pushOrUnshift = 'push';
        order = false
      } else if (direct === 'right') {
        row = true;
        pushOrUnshift = 'unshift';
        order = true;
      }
  
      // 移动后结果存入result，isMove和isSum分别记录是否有移动和有求和操作, adds数组存储有求和操作的单元格，用来添加动画
      var adds = [];
      var move = [];
      var addMove = [];
      var isMove = false;
      for (var i = 0; i < 4; i++) {
        var tc = [];
        var adds_rc = [];
        for (var j = 0; j < 4; j++) {
          tc.push(tds[row ? i * 4 + j : j * 4 + i].innerHTML);
        }

        // 求addMove
        if (order) {
          var j = 3;
          while (j >= 0) {
            if (!tc[j]) j -= 1;
            else {
              var temp = tc[j];
              for (j -= 1; j >= 0; j--) {
                if (tc[j]) {
                  if (temp === tc[j]) addMove[row ? i * 4 + j : j * 4 + i] = 1;
                  else break;
                }
              }
            }
          }
        }
        else {
          var j = 0;
          while (j < 4) {
            if (!tc[j]) j += 1;
            else {
              var temp = tc[j];
              for (j += 1; j < 4; j++) {
                if (tc[j]) {
                  if (temp === tc[j]) addMove[row ? i * 4 + j : j * 4 + i] = 1;
                  else break;
                }
              }
            }
          }
        }

        // 先按方向把所有非empty元素移到一起
        var _tc = tc;
        tc = tc.filter(elem => elem);
        for (var j = tc.length; j < 4; j++) {
          tc[pushOrUnshift]('');
        }

        // 求一次和
        if (order) {
          for (var j = 3; j >= 0; j--) {
            if (tc[j]) {
              if (j - 1 >= 0) {
                var next = j - 1;
                if (tc[next] === tc[j]) {
                  // tc[j + 1].classList.remove('num' + tc[j])
                  tc[next] *= 2;
                  tc[next] = tc[next].toString();
                  isSum = true;
                  adds_rc[next] = true;
                  score += parseInt(tc[next]);
                  tc[j] = '';
                  j -= 1;
                }
              }
            }
          }
        }
        else {
          for (var j = 0; j < 4; j++) {
            if (tc[j]) {
              if (j + 1 !== 4) {
                var next = j + 1;
                if (tc[next] === tc[j]) {
                  // tc[j + 1].classList.remove('num' + tc[j])
                  tc[next] *= 2;
                  tc[next] = tc[j + 1].toString();
                  isSum = true;
                  adds_rc[next] = true;
                  score += parseInt(tc[next]);
                  tc[j] = '';
                  j += 1;
                }
              }
            }
          }
        }

        // 计算移动距离
        var empty = 0;
         if (!order) {
          for (var j = 0; j < 4; j++) {
            if (!tds[row ? i * 4 + j : j * 4 + i].innerHTML) empty += 1;
            else {
              move[row ? i * 4 + j : j * 4 + i] = empty;
              // 判断是否有单元格移动，若有设置isMove为true
              if (empty) isMove = true;
            }
          }
         }
         else {
          for (var j = 3; j >= 0; j--) {
            if (!tds[row ? i * 4 + j : j * 4 + i].innerHTML) empty += 1;
            else {
              move[row ? i * 4 + j : j * 4 + i] = empty;
              if (empty) isMove = true;
              if (addMove[row ? i * 4 + j : j * 4 + i]) empty += 1;
            }
          }
        }
  
        // 把有加法操作的单元格，最终位置存入adds_rc数组
        var tc_obj = [];
        tc.forEach((elem, index) => tc_obj.push({
          elem: elem,
          isAdd: adds_rc[index]
        }))
        tc_obj = tc_obj.filter(elem => elem.elem)
        for (var j = tc_obj.length; j < 4; j++) tc_obj[pushOrUnshift]({
          elem: '',
          isAdd: false
        });
        adds_rc.forEach((elem, index) => adds_rc[index] = false);
        tc_obj.forEach((elem, index) => {
          if (elem.isAdd) adds_rc[index] = true;
        })
  
        // 把有数字的单元格移到一面，剩下的单元格填充empty
        tc = tc.filter(elem => elem);
        for (var j = tc.length; j < 4; j++) tc[pushOrUnshift]('');
        tc.forEach((elem, index) => {
          result[row ? i * 4 + index : index * 4 + i] = elem;
          if (adds_rc[index]) adds[row ? i * 4 + index : index * 4 + i] = true;
        });
      }

      // 计算动画的具体方式
      for (var i = 0; i < 16; i++) {
        while (tds[i].classList.length !== 1) {
          for (var j = 0; j < tds[i].classList.length; j++) {
            if (tds[i].classList[j] !== 'empty') {
              tds[i].classList.remove(tds[i].classList[j]);
              break;
            }
          }
        }
        if (tds[i].innerHTML) {
          tds[i].classList.add('num' + tds[i].innerHTML);
        }
      }
      // console.log(addMove)
      // 添加移动动画
      if (isMove || isSum) {
        for (var i = 0; i < 16; i++) {
          if (move[i] || addMove[i]) {
            // tds[i].classList.add('move' + direct + move[i]);
            tds[i].classList.add('move' + direct + move[i] + '-addMove' + (addMove[i] ? addMove[i] : 0));
          }
          // if (move[i]) {
          //   tds[i].classList.add('move' + direct + move[i] + '-addMove0');
          // } 
        }
      }
      // 添加放大动画
      if (isSum) {
        for (var i = 0; i < 16; i++) {
          if (adds[i]) {
            tds[i].innerHTML = result[i];
            tds[i].classList.add('num' + result[i]);
            tds[i].classList.add('add' + result[i]);
          }
        }
      }
  
      //将改变后的score应用到DOM
      frag_span.firstElementChild.innerHTML = score;
      document.querySelector('div').appendChild(frag_span);
  
      // 如果出现change，那么在empty的位置随机添加一个2
      var random2Pos = -1;
      if (isMove || isSum) {
        while (true) {
          var addNum = 2;
          var position = Math.floor(Math.random() * 16);
          if (!result[position]) {
            result[position] = addNum.toString();
            random2Pos = position;
            break;
          }
        }
      }

      // 移动动画加入DOM
      document.body.appendChild(frag);
  
      // 判断终局，每个单元格和周围单元格都不相同
      var isEnd = judgeEnd(result);
  
      if (isMove || isSum) {
        setTimeout(function () {
          var frag = document.createDocumentFragment();
          frag.appendChild(document.getElementById('game'));
          tds = [...frag.querySelectorAll('td')];

          // 将移动后的表格数据result应用到DOM中
          tds.forEach((elem, index) => {
            // 先删除所有除empty的class，再根据结果添加对应的num class
            while (tds[index].classList.length !== 1) {
              for (var j = 0; j < tds[index].classList.length; j++) {
                if (tds[index].classList[j] !== 'empty') {
                  tds[index].classList.remove(tds[index].classList[j]);
                  break;
                }
              }
            }
            elem.innerHTML = result[index];
            if (elem.innerHTML) {
              elem.classList.add('num' + elem.innerHTML);
              // 新插入的2结点添加动画
              if (index === random2Pos) {
                elem.classList.add('add2');
                return;
              }
              else {
                elem.classList.add('num' + elem.innerHTML);
              }
            }
          });
          document.body.appendChild(frag);
        }, 120)
      }
  
      //终局时的操作
      if (isEnd) {
        setTimeout(function () {
          alert('Game Over. Please begin a new game.')
        }, !isMove && !isSum ? 0 : 200)
      }
    }
  
    // 判断是否终局，返回布尔值
    function judgeEnd(result) {
      var isEnd = true;
      if (result.filter(elem => elem).length === 16) {
        // 把result变成二维数组
        var _result = [
          [],
          [],
          [],
          []
        ];
        for (var i = 0; i < 16; i++) {
          _result[Math.floor(i / 4)][i % 4] = result[i];
        }
        // console.log(_result);
        for (var i = 0; i < 4; i++) {
          for (var j = 0; j < 4; j++) {
            if (i - 1 >= 0 && _result[i][j] === _result[i - 1][j]) {
              isEnd = false;
              break;
            }
            if (i + 1 <= 3 && _result[i][j] === _result[i + 1][j]) {
              isEnd = false;
              break;
            }
            if (j - 1 >= 0 && _result[i][j] === _result[i][j - 1]) {
              isEnd = false;
              break;
            }
            if (j + 1 <= 3 && _result[i][j] === _result[i][j + 1]) {
              isEnd = false;
              break;
            }
          }
          if (!isEnd) break;
        }
      } else {
        isEnd = false;
      }
  
      return isEnd;
    }
  })()
  