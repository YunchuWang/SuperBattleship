// JavaScript Document

function togglecheat(checkbox){
    if(!startmode) return;
    if(checkbox.checked) {
        paintBoard($("#leftcanvas"),p2fleets,brown,darkblue);
    } else {
        unpaintBoard($("#leftcanvas"),p2fleets,originblue);
        paintBoard($("#leftcanvas"),p1fleets,"red",darkblue);
    }
}
function currrentMode(evt, tabName) {
  var i,tablinks;
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" red", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " red";
}
function startGame() {
    myGameArea.start();
}
var myGameArea = {
    $lcanvas : $("#leftcanvas"),
    start : function() {
        drawBoard(this.$lcanvas);
        var res = initLocation();
        //console.log(res);
        p1fleets = res[0];
        p2fleets = res[1];
        //initLocation();
        for (var i = 0; i < p2fleets.ships.length;i++) {
            for (var j = 0; j < p2fleets.ships[i].locations.length; j++) {
                compselection.add(p2fleets.ships[i].locations[j][0] + "," + p2fleets.ships[i].locations[j][1]);
                compshipcollection.add(p2fleets.ships[i].locations[j][0] + "," + p2fleets.ships[i].locations[j][1]);
            }
        }
        for (var i = 0; i < p1fleets.ships.length;i++) {
            for (var j = 0; j < p1fleets.ships[i].locations.length; j++) {
                p1shipcollection.add(p1fleets.ships[i].locations[j][0] + "," + p1fleets.ships[i].locations[j][1]);
            }
        }
        commands.displayres();
    }
}
var diffx;
var diffy;
var grd1;
var rowmax,colmax;
var rowmin = 0;
var colmin = 0;
function drawBoard(canvas){
    canvas[0].width = window.innerWidth * 0.7;
    canvas[0].height = window.innerHeight * 0.7;
    rowmax = Math.floor(canvas[0].height / GRIDVAL);
    colmax = Math.floor(canvas[0].width / GRIDVAL);
    diffx = canvas[0].width - colmax * GRIDVAL;
    diffy = canvas[0].height - rowmax * GRIDVAL;
    var context2D = canvas[0].getContext("2d");
    var x,y;
    for (var row = 0; row < rowmax; row ++)
    {
        for (var column = 0; column < colmax; column ++)
        {
            x = column * GRIDVAL + diffx / 2;
            y = row * GRIDVAL + diffy / 2;
            grd1 = "#66C4F8";
            context2D.fillStyle = grd1;
            context2D.strokeStyle = "#FF0000";
            context2D.fillRect(x, y, GRIDVAL, GRIDVAL);
            context2D.strokeRect(x, y, GRIDVAL, GRIDVAL);
        }
    }
}
function handleClickP1(e) {
    e.preventDefault();
    if(!startmode) return;
    if(result) return;
    if(!myturn) {
        handleClickP2(e);
        return;
    }
    var board = p1fleets;
    var context2D = $("#" + e.target.id)[0].getContext("2d");
    var tempx = e.offsetX - (diffx / 2);
    var tempy = e.offsetY - (diffy / 2);
    tempx = Math.floor(tempx/GRIDVAL)*GRIDVAL + (diffx / 2);
    tempy = Math.floor(tempy/GRIDVAL)*GRIDVAL + (diffy / 2);
    var index = commands.findship(tempx,tempy);
    if(index < 0 && userselection.has(tempx + "," + tempy)) {
        alert("Please select a new grid!");
        return;
    }
    if(index < 0) {
        compselection.add(tempx + "," + tempy);
        userselection.add(tempx + "," + tempy);
    }
    if(index === -1) {
        context2D.fillStyle = cyan;
        context2D.fillRect(tempx,tempy,GRIDVAL, GRIDVAL);
        context2D.beginPath();
        context2D.strokeStyle = "white";
        context2D.moveTo(tempx,tempy);
        context2D.lineTo(tempx + GRIDVAL,tempy + GRIDVAL);
        context2D.moveTo(tempx + GRIDVAL,tempy);
        context2D.lineTo(tempx,tempy + GRIDVAL);
        context2D.stroke();
        context2D.strokeStyle = "red";
        context2D.lineWidth = 1;
        context2D.strokeRect(tempx,tempy,GRIDVAL,GRIDVAL);
        currentship.index = -1;
        commands.checkwin(index,"You");
        myturn = false;
        if(!myturn) {
            handleClickP2(e);
            return;
        }
    } else if(index === -2) {
        context2D.fillStyle = brown;
        context2D.fillRect(tempx,tempy,GRIDVAL, GRIDVAL);
        context2D.beginPath();
        context2D.strokeStyle = "white";
        context2D.moveTo(tempx,tempy);
        context2D.lineTo(tempx + GRIDVAL,tempy + GRIDVAL);
        context2D.moveTo(tempx + GRIDVAL,tempy);
        context2D.lineTo(tempx,tempy + GRIDVAL);
        context2D.stroke();
        context2D.strokeStyle = "red";
        context2D.lineWidth = 1;
        context2D.strokeRect(tempx,tempy,GRIDVAL,GRIDVAL);
        currentship.index = -2;
        commands.checkwin(index,"You");
        myturn = false;
        var compind = commands.findCompShip(p2fleets,tempx,tempy);
        p2fleets.ships[compind[0]].size--;
        if(p2fleets.ships[compind[0]].size <=0) {
            p2fleets.ships[compind[0]].alive = "destroyed";
        } else {
            p2fleets.ships[compind[0]].alive = "broken";
        }
        p2fleets.ships[compind[0]].checked.push(compind[1]);
        $("#shipname").text("Comp" + " " + p2fleets.ships[compind[0]].name);
        if(!myturn) {
            handleClickP2(e);
            return;
        }
    } else {
        if(board.ships[index].alive !== "full") {
            alert("Please move a healthy ship!");
            return;
        }
        for(var sindex = 0; sindex < board.ships.length; sindex++) {
            var xmin = 1000,ymin = 1000;
            if(index === sindex) {
                context2D.strokeStyle = "white";
                context2D.lineWidth = 2;
                context2D.fillStyle = "red";
                for(var i = 0; i < board.ships[sindex].locations.length; i++) {
                    if(board.ships[sindex].locations[i][0] < xmin) {
                        xmin = board.ships[sindex].locations[i][0];
                    }
                    if(board.ships[sindex].locations[i][1] < ymin) {
                        ymin = board.ships[sindex].locations[i][1];
                    }
					currentship = board.ships[sindex];
                    currentship.xmin = xmin;
                    currentship.ymin = ymin;
                    currentship.dir = board.ships[sindex].dir;
                }
                switch(board.ships[sindex].dir) {
                    case SBConstants.NORTH:
                        context2D.fillRect(xmin, ymin, GRIDVAL, GRIDVAL * board.ships[sindex].locations.length);
                        context2D.strokeRect(xmin, ymin, GRIDVAL, GRIDVAL * board.ships[sindex].locations.length);
                        break;
                    case SBConstants.SOUTH:
                        context2D.fillRect(xmin, ymin, GRIDVAL, GRIDVAL * board.ships[sindex].locations.length);
                        context2D.strokeRect(xmin, ymin, GRIDVAL, GRIDVAL * board.ships[sindex].locations.length);
                        break;
                    case SBConstants.WEST:
                        context2D.fillRect(xmin, ymin, GRIDVAL * board.ships[sindex].locations.length, GRIDVAL);
                        context2D.strokeRect(xmin, ymin, GRIDVAL * board.ships[sindex].locations.length, GRIDVAL);
                        break;
                    case SBConstants.EAST:
                        context2D.fillRect(xmin, ymin, GRIDVAL * board.ships[sindex].locations.length, GRIDVAL);
                        context2D.strokeRect(xmin, ymin, GRIDVAL * board.ships[sindex].locations.length, GRIDVAL);
                        break;
                }
            } else {
                context2D.strokeStyle = "#FF0000";
                context2D.lineWidth=1;
                for(var loc = 0; loc < board.ships[sindex].locations.length; loc++) {
                    context2D.strokeRect(board.ships[sindex].locations[loc][0], board.ships[sindex].locations[loc][1], GRIDVAL, GRIDVAL);
                    context2D.strokeStyle = "#FF0000";
                }
            }
        }
        context2D.strokeStyle = "white";
        context2D.lineWidth=2;
        context2D.fillStyle = "red";
        for(var i = 0; i < board.ships[index].locations.length; i++) {
            if(board.ships[index].locations[i][0] < xmin) {
                xmin = board.ships[index].locations[i][0];
            }
            if(board.ships[index].locations[i][1] < ymin) {
                ymin = board.ships[index].locations[i][1];
            }
			currentship = board.ships[index];
            currentship.xmin = xmin;
            currentship.ymin = ymin;
            currentship.dir = board.ships[index].dir;
        }
        switch(board.ships[index].dir) {
            case SBConstants.NORTH:
                context2D.fillRect(xmin, ymin, GRIDVAL, GRIDVAL * board.ships[index].locations.length);
                context2D.strokeRect(xmin, ymin, GRIDVAL, GRIDVAL * board.ships[index].locations.length);
                break;
            case SBConstants.SOUTH:
                context2D.fillRect(xmin, ymin, GRIDVAL, GRIDVAL * board.ships[index].locations.length);
                context2D.strokeRect(xmin, ymin, GRIDVAL, GRIDVAL * board.ships[index].locations.length);
                break;
            case SBConstants.WEST:
                context2D.fillRect(xmin, ymin, GRIDVAL * board.ships[index].locations.length, GRIDVAL);
                context2D.strokeRect(xmin, ymin, GRIDVAL * board.ships[index].locations.length, GRIDVAL);
                break;
            case SBConstants.EAST:
                context2D.fillRect(xmin, ymin, GRIDVAL * board.ships[index].locations.length, GRIDVAL);
                context2D.strokeRect(xmin, ymin, GRIDVAL * board.ships[index].locations.length, GRIDVAL);
                break;
        }
		currentship = board.ships[index];
        currentship.index = index;
        currentship.fleet = board;
        currentship.locations = board.ships[index].locations;
        context2D.strokeStyle = "#FF0000";
        context2D.lineWidth=1;
        $("#shipname").text(board.ships[index].name);
    }
    commands.displayres();
}
function handleClickP2(e) {
    e.preventDefault();
    if(result) return;
    if(!startmode) return;
    if(myturn) return;
    var board = p2fleets;
    var context2D = $("#leftcanvas")[0].getContext("2d");
    var tempx;
    var tempy;
    tempx = Math.floor(Math.random() * colmax)*GRIDVAL + (diffx / 2);
    tempy = Math.floor(Math.random() * rowmax)*GRIDVAL + (diffy / 2);
    while(compselection.has(tempx + "," + tempy)) {
        tempx = Math.floor(Math.random() * colmax)*GRIDVAL + (diffx / 2);
        tempy = Math.floor(Math.random() * rowmax)*GRIDVAL + (diffy / 2);
    }
    compselection.add(tempx + "," + tempy);
    userselection.add(tempx + "," + tempy);
    var index = commands.findship(tempx,tempy);
    if(index === -1) {
        context2D.fillStyle = lime;
        context2D.fillRect(tempx,tempy,GRIDVAL, GRIDVAL);
        context2D.beginPath();
        context2D.strokeStyle = "white";
        context2D.moveTo(tempx,tempy);
        context2D.lineTo(tempx + GRIDVAL,tempy + GRIDVAL);
        context2D.moveTo(tempx + GRIDVAL,tempy);
        context2D.lineTo(tempx,tempy + GRIDVAL);
        context2D.stroke();
        context2D.strokeStyle = "red";
        context2D.lineWidth = 1;
        context2D.strokeRect(tempx,tempy,GRIDVAL,GRIDVAL);
        myturn = true;
        commands.checkwin(index,"Comp");
    } else if(index === -2) {
    } else {
        context2D.fillStyle = "red";
        context2D.fillRect(tempx,tempy,GRIDVAL, GRIDVAL);
        context2D.beginPath();
        context2D.strokeStyle = "white";
        context2D.moveTo(tempx,tempy);
        context2D.lineTo(tempx + GRIDVAL,tempy + GRIDVAL);
        context2D.moveTo(tempx + GRIDVAL,tempy);
        context2D.lineTo(tempx,tempy + GRIDVAL);
        context2D.stroke();
        context2D.strokeStyle = "red";
        context2D.lineWidth = 1;
        context2D.strokeRect(tempx,tempy,GRIDVAL,GRIDVAL);
        myturn = true;
        p1fleets.ships[index].size--;
		var playerind = commands.findCompShip(p1fleets,tempx,tempy);
		p1fleets.ships[playerind[0]].checked.push(playerind[1]);
		currentship = p1fleets.ships[playerind[0]];
        if(p1fleets.ships[index].size <= 0) {
            p1fleets.ships[index].alive = "destroyed";
        } else {
            p1fleets.ships[index].alive = "broken";
        }
        commands.checkwin(index,"Comp");
    }
	unpaintBoard($("#leftcanvas"),p1fleets,originblue);
	paintBoard($("#leftcanvas"),p1fleets,"red",darkblue);
    commands.displayres();
}
function paintBoard(canvas,fleets,color,viewcolor) {
    var context2D = canvas[0].getContext("2d");
    for (var index = 0; index < fleets.ships.length; index++) {
        paintshipview(index,fleets.ships[index].dir,fleets,context2D,viewcolor);
        for (var loc = 0; loc < fleets.ships[index].locations.length; loc++) {
            var tempx = fleets.ships[index].locations[loc][0];
            var tempy = fleets.ships[index].locations[loc][1];
            context2D.fillStyle = color;
            context2D.fillRect(tempx,tempy,GRIDVAL, GRIDVAL);
            if(fleets.ships[index].checked.indexOf(loc) >= 0){
                context2D.beginPath();
                context2D.strokeStyle = "white";
                context2D.moveTo(tempx,tempy);
                context2D.lineTo(tempx + GRIDVAL,tempy + GRIDVAL);
                context2D.moveTo(tempx + GRIDVAL,tempy);
                context2D.lineTo(tempx,tempy + GRIDVAL);
                context2D.stroke();
            }
        }
    }
}
function paintshipview(index,dir,fleets,context2D,viewcolor){
    var originx,originy,endx,endy,rows,cols;
    switch(fleets.ships[index].dir) {
        case SBConstants.NORTH:
            originx = fleets.ships[index].locations[0][0] - fleets.ships[index].sideview * GRIDVAL;
            originy = fleets.ships[index].locations[0][1] - fleets.ships[index].frontview * GRIDVAL;
            endx = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][0] + (1 + fleets.ships[index].sideview) * GRIDVAL;
            endy = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][1] + (1 + fleets.ships[index].rearview) * GRIDVAL;
            cols = (endx - originx) / GRIDVAL;
            rows = (endy - originy) / GRIDVAL;
             break;
           case SBConstants.SOUTH:
             originx = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][0] - fleets.ships[index].sideview * GRIDVAL;
            originy = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][1] - fleets.ships[index].rearview * GRIDVAL;
            endx = fleets.ships[index].locations[0][0] + (1 + fleets.ships[index].sideview) * GRIDVAL;
            endy = fleets.ships[index].locations[0][1] + (1 + fleets.ships[index].frontview) * GRIDVAL;
            cols = (endx - originx) / GRIDVAL;
            rows = (endy - originy) / GRIDVAL;
             break;
            case SBConstants.EAST:
             originx = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][0] - fleets.ships[index].rearview * GRIDVAL;
            originy = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][1] - fleets.ships[index].sideview * GRIDVAL;
            endx = fleets.ships[index].locations[0][0] + (1 + fleets.ships[index].frontview) * GRIDVAL;
            endy = fleets.ships[index].locations[0][1] + (1 + fleets.ships[index].sideview) * GRIDVAL;
            cols = (endx - originx) / GRIDVAL;
            rows = (endy - originy) / GRIDVAL;
             break;
         case SBConstants.WEST:
             originx = fleets.ships[index].locations[0][0] - fleets.ships[index].frontview * GRIDVAL;
            originy = fleets.ships[index].locations[0][1] - fleets.ships[index].sideview * GRIDVAL;
            endx = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][0] + (1 + fleets.ships[index].rearview) * GRIDVAL;
            endy = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][1] + (1 + fleets.ships[index].sideview) * GRIDVAL;
            cols = (endx - originx) / GRIDVAL;
            rows = (endy - originy) / GRIDVAL;
             break;
    }
    context2D.fillStyle = viewcolor;
    for(var row = 0; row < rows;row++) {
        for(var col = 0; col < cols;col++) {
            var locstr = (originx + col * GRIDVAL) + "," + (originy + row * GRIDVAL);
            if(fleets !== p2fleets) {
                    if(compshipcollection.has(locstr)) {
                        context2D.fillStyle = brown;
                        context2D.fillRect(originx + col * GRIDVAL,originy + row * GRIDVAL,GRIDVAL,GRIDVAL);
                        context2D.fillStyle = viewcolor;
                        var gridindex = -1;
                        var locindex = -1;
                        for(var sindex = 0; sindex < p2fleets.ships.length; sindex++) {
                            for(var lindex = 0; lindex < p2fleets.ships[sindex].locations.length; lindex++) {
                                if(commands.arraysEqual(p2fleets.ships[sindex].locations[lindex],[originx + col * GRIDVAL,originy + row * GRIDVAL])) {
                                    gridindex = sindex;
                                    locindex = lindex;
                                    break;
                                }
                            }
                        }
                        if(p2fleets.ships[gridindex].checked.indexOf(locindex) >= 0) {
                            context2D.beginPath();
                            context2D.strokeStyle = "white";
                            context2D.moveTo(originx + col * GRIDVAL,originy + row * GRIDVAL);
                            context2D.lineTo(originx + GRIDVAL + col * GRIDVAL,originy + GRIDVAL + row * GRIDVAL);
                            context2D.moveTo(originx + GRIDVAL + col * GRIDVAL,originy + row * GRIDVAL);
                            context2D.lineTo(originx + col * GRIDVAL,originy + GRIDVAL + row * GRIDVAL);
                            context2D.stroke();
                        }
                        continue;
                    }
            } else {
				                    if(p1shipcollection.has(locstr)) {
                        context2D.fillStyle = "red";
                        context2D.fillRect(originx + col * GRIDVAL,originy + row * GRIDVAL,GRIDVAL,GRIDVAL);
                        context2D.fillStyle = viewcolor;
                        var gridindex = -1;
                        var locindex = -1;
                        for(var sindex = 0; sindex < p2fleets.ships.length; sindex++) {
                            for(var lindex = 0; lindex < p1fleets.ships[sindex].locations.length; lindex++) {
                                if(commands.arraysEqual(p1fleets.ships[sindex].locations[lindex],[originx + col * GRIDVAL,originy + row * GRIDVAL])) {
                                    gridindex = sindex;
                                    locindex = lindex;
                                    break;
                                }
                            }
                        }
                        if(p1fleets.ships[gridindex].checked.indexOf(locindex) >= 0) {
                            context2D.beginPath();
                            context2D.strokeStyle = "white";
                            context2D.moveTo(originx + col * GRIDVAL,originy + row * GRIDVAL);
                            context2D.lineTo(originx + GRIDVAL + col * GRIDVAL,originy + GRIDVAL + row * GRIDVAL);
                            context2D.moveTo(originx + GRIDVAL + col * GRIDVAL,originy + row * GRIDVAL);
                            context2D.lineTo(originx + col * GRIDVAL,originy + GRIDVAL + row * GRIDVAL);
                            context2D.stroke();
                        }
                        continue;
                    }
			}
            if(p1shipcollection.has(locstr) || userselection.has(locstr) || compselection.has(locstr)){
                continue;
            }
            context2D.fillRect(originx + col * GRIDVAL,originy + row * GRIDVAL,GRIDVAL,GRIDVAL);
        }
    }
}
function unpaintshipview(index,dir,fleets,context2D,viewcolor,collection) {
    var originx,originy,endx,endy,rows,cols;
    switch(fleets.ships[index].dir) {
        case SBConstants.NORTH:
            originx = fleets.ships[index].locations[0][0] - fleets.ships[index].sideview * GRIDVAL;
            originy = fleets.ships[index].locations[0][1] - fleets.ships[index].frontview * GRIDVAL;
            endx = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][0] + (1 + fleets.ships[index].sideview) * GRIDVAL;
            endy = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][1] + (1 + fleets.ships[index].rearview) * GRIDVAL;
            cols = (endx - originx) / GRIDVAL;
            rows = (endy - originy) / GRIDVAL;
            break;
         case SBConstants.SOUTH:
            originx = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][0] - fleets.ships[index].sideview * GRIDVAL;
            originy = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][1] - fleets.ships[index].rearview * GRIDVAL;
            endx = fleets.ships[index].locations[0][0] + (1 + fleets.ships[index].sideview) * GRIDVAL;
            endy = fleets.ships[index].locations[0][1] + (1 + fleets.ships[index].frontview) * GRIDVAL;
            cols = (endx - originx) / GRIDVAL;
            rows = (endy - originy) / GRIDVAL;
            break;
         case SBConstants.EAST:
            originx = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][0] - fleets.ships[index].rearview * GRIDVAL;
            originy = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][1] - fleets.ships[index].sideview * GRIDVAL;
            endx = fleets.ships[index].locations[0][0] + (1 + fleets.ships[index].frontview) * GRIDVAL;
            endy = fleets.ships[index].locations[0][1] + (1 + fleets.ships[index].sideview) * GRIDVAL;
            cols = (endx - originx) / GRIDVAL;
            rows = (endy - originy) / GRIDVAL;
            break;
         case SBConstants.WEST:
            originx = fleets.ships[index].locations[0][0] - fleets.ships[index].frontview * GRIDVAL;
            originy = fleets.ships[index].locations[0][1] - fleets.ships[index].sideview * GRIDVAL;
            endx = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][0] + (1 + fleets.ships[index].rearview) * GRIDVAL;
            endy = fleets.ships[index].locations[fleets.ships[index].locations.length - 1][1] + (1 + fleets.ships[index].sideview) * GRIDVAL;
            cols = (endx - originx) / GRIDVAL;
            rows = (endy - originy) / GRIDVAL;
            break;
    }
    context2D.fillStyle = viewcolor;
    for(var row = 0; row < rows;row++) {
        for(var col = 0; col < cols;col++) {
            var locstr = (originx + col * GRIDVAL) + "," + (originy + row * GRIDVAL);
            if(collection.has(locstr)) {
                context2D.fillRect(originx + col * GRIDVAL,originy + row * GRIDVAL,GRIDVAL,GRIDVAL);
                context2D.strokeRect(originx + col * GRIDVAL,originy + row * GRIDVAL,GRIDVAL,GRIDVAL);
            }
            if(p1shipcollection.has(locstr) || userselection.has(locstr)){
                continue;
            }
            context2D.fillRect(originx + col * GRIDVAL,originy + row * GRIDVAL,GRIDVAL,GRIDVAL);
            context2D.strokeRect(originx + col * GRIDVAL,originy + row * GRIDVAL,GRIDVAL,GRIDVAL);
        }
    }
}
function unpaintBoard(canvas,fleets,color) {
    var context2D = canvas[0].getContext("2d");
    context2D.strokeStyle = "red";
    for (var index = 0; index < fleets.ships.length; index++) {
        unpaintshipview(index,fleets.ships[index].dir,fleets,context2D,color,compshipcollection);
    }
}
function showTip(e){
    var tempx = e.offsetX - (diffx / 2);
    var tempy = e.offsetY - (diffy / 2);
    tempx = Math.floor(tempx/GRIDVAL)*GRIDVAL + (diffx / 2);
    tempy = Math.floor(tempy/GRIDVAL)*GRIDVAL + (diffy / 2);
    if(!p1shipcollection.has(tempx+","+tempy)) {
        if(!$("#tip").hasClass("tooltipoff")) {
            $("#tip").addClass("tooltipoff");
        }
        if($("#tip").hasClass("tooltipon")) {
            $("#tip").removeClass("tooltipon");
        }
    }
    var index = commands.findship(tempx,tempy);
    if(index < 0) return;
    var name = p1fleets.ships[index].name;
    var x = e.clientX,
        y = e.clientY;
    $("#tip").text("Select " + name + " to move");
    $("#tip").css('top',(y + GRIDVAL) + "px");
    $("#tip").css('left',(x + GRIDVAL) + "px");
    if(!$("#tip").hasClass("tooltipoff")) {
        $("#tip").removeClass("tooltipoff");
    }
    if(!$("#tip").hasClass("tooltipon")) {
        $("#tip").addClass("tooltipon");
    }
}
$(document).ready(function(){
    myGameArea.$lcanvas[0].addEventListener('click', handleClickP1);
    myGameArea.$lcanvas[0].addEventListener('mousemove', showTip);
    $("#startgame").click(function() {
          paintBoard($("#leftcanvas"),p1fleets,"red",darkblue);
        startmode = true;
    });
    $("#RotateCW").click(function(e) {
        if(!startmode) return;
        if(!myturn) return;
        if(currentship.index === -1) return;
        if(commands.rotateCW(currentship) !== false) myturn = false;
        if(!myturn) {
            handleClickP2(e);
            return;
        }
    });
    $("#RotateCWW").click(function(e) {
        if(!startmode) return;
        if(!myturn) return;
        if(currentship.index === -1) return;
        if(commands.rotateCCW(currentship) !== false) myturn = false;
        if(!myturn) {
            handleClickP2(e);
            return;
        }
    });
    $("#Moveforward").click(function(e) {
        if(!startmode) return;
        if(!myturn) return;
        if(currentship.index === -1) return;
          commands.moveForward(currentship);
        myturn = false;
        if(!myturn) {
            handleClickP2(e);
            return;
        }
    });
    $("#Movebackward").click(function(e) {
        if(!startmode) return;
        if(!myturn) return;
        if(currentship.index === -1) return;
          commands.moveBackward(currentship);
        myturn = false;
        if(!myturn) {
            handleClickP2(e);
            return;
        }
    });
    myGameArea.start();
});
