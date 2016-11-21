// JavaScript Document
var currentship = {
    name: "Carrier",
    locations:[],
    size:5,
    dir: SBConstants.NORTH,
    player: "p1",
    xmin: 1000,
    ymin: 1000,
	index: -1,
    fleets: " ",
	checked:[],
};
function setminmax(ship) {
    var xmin = 1000,ymin = 1000;
    for(var i = 0; i < ship.locations.length; i++) {
        if(ship.locations[i][0] < xmin) {
            xmin = ship.locations[i][0];
        }
        if(ship.locations[i][1] < ymin) {
            ymin = ship.locations[i][1];
        }
        ship.xmin = xmin;
        ship.ymin = ymin;
    }
}
var commands = {
    rotateCW:function(ship) {
        if(ship.index === -1) {
			alert("No selection!");
            return false;
        } else {
			if(ship.checked.length !== 0) {
           	    alert("Can't move!");
                return;
       		}
            unpaintBoard($("#leftcanvas"),p1fleets,originblue);
            if($("#cheatbox").is(':checked')) paintBoard($("#leftcanvas"),p2fleets,"#432618",darkblue);
            var context2D = $("#leftcanvas")[0].getContext("2d");
            context2D.fillStyle = grd1;
            context2D.strokeStyle = "red";
            var locindex = -1;
            for(var loc = 0; loc < ship.locations.length; loc++) {
                context2D.fillRect(ship.locations[loc][0], ship.locations[loc][1], GRIDVAL, GRIDVAL);
                context2D.strokeRect(ship.locations[loc][0], ship.locations[loc][1], GRIDVAL, GRIDVAL);
                if(this.arraysEqual(ship.locations[loc],[ship.xmin,ship.ymin]))    {
                    locindex = loc;
                }
                if(p1shipcollection.has(ship.locations[loc][0] + "," + ship.locations[loc][1])) {
                    p1shipcollection.delete(ship.locations[loc][0] + "," + ship.locations[loc][1]);
                }
            }
            context2D.fillStyle = "red";
            var count = 0;
            var templocations = [];
            var olddir = ship.dir;
            if(locindex === 0) {
                switch(ship.dir) {
                    case SBConstants.NORTH:
                        ship.dir = SBConstants.EAST;
                        for(var loc = ship.locations.length - 1; loc >= 0; loc--) {
                            templocations.push([ship.locations[ship.locations.length - 1][0] + count * GRIDVAL, ship.locations[ship.locations.length - 1][1]]);
                            count++;
                        }
                        break;
                    case SBConstants.WEST:
                        ship.dir = SBConstants.NORTH;
                        for(var loc = ship.locations.length - 1; loc >= 0; loc--) {
                            templocations.push([ship.locations[ship.locations.length - 1][0], ship.locations[ship.locations.length - 1][1] - count * GRIDVAL]);
                            count++;
                        }
                        break;
                }
                templocations.reverse();
            } else {
                switch(ship.dir) {
                    case SBConstants.SOUTH:
                        ship.dir = SBConstants.WEST;
                        //ships.locations[ships.locations.length - 1]
                        for(var loc = ship.locations.length - 1; loc >= 0; loc--) {
                            templocations.push([ship.locations[ship.locations.length - 1][0] - count * GRIDVAL, ship.locations[ship.locations.length - 1][1]]);
                            count++;
                        }
                        break;
                    case SBConstants.EAST:
                        ship.dir = SBConstants.SOUTH;
                        for(var loc = ship.locations.length - 1; loc >= 0; loc--) {
                            templocations.push([ship.locations[ship.locations.length - 1][0], ship.locations[ship.locations.length - 1][1] + count * GRIDVAL]);
                            count++;
                        }
                        break;
                }
                templocations.reverse();
            }
            if(!this.canAct(templocations)) {
                for(var loc = 0; loc < ship.locations.length; loc++) {
                    if(!p1shipcollection.has(ship.locations[loc][0] + "," + ship.locations[loc][1])) {
                        p1shipcollection.add(ship.locations[loc][0] + "," + ship.locations[loc][1]);
                    }
                }
                ship.dir = olddir;
                this.drawship(ship);
                paintBoard($("#leftcanvas"),p1fleets,"red",darkblue);
                return false;
            }
            p1fleets.ships[ship.index].locations = templocations;
            p1fleets.ships[ship.index].dir = ship.dir;
            ship.locations = templocations;
            for(var loc = 0; loc < ship.locations.length; loc++) {
                if(!p1shipcollection.has(ship.locations[loc][0] + "," + ship.locations[loc][1])) {
                    p1shipcollection.add(ship.locations[loc][0] + "," + ship.locations[loc][1]);
                }
            }
            this.drawship(ship);
        }
        //changed
		unpaintBoard($("#leftcanvas"),p1fleets,originblue);
        paintBoard($("#leftcanvas"),p1fleets,"red",darkblue);
        if($("#cheatbox").is(':checked')) paintBoard($("#leftcanvas"),p2fleets,"#432618",darkblue);
    },
    rotateCCW: function(ship) {
        if(ship.index === -1) {
			alert("No selection!");
            return;
        } else {
			if(ship.checked.length !== 0) {
           	    alert("Can't move!");
                return;
       		}
            unpaintBoard($("#leftcanvas"),p1fleets,originblue);
            if($("#cheatbox").is(':checked')) paintBoard($("#leftcanvas"),p2fleets,"#432618",darkblue);
            var context2D = $("#leftcanvas")[0].getContext("2d");
            context2D.fillStyle = grd1;
            context2D.strokeStyle = "red";
            var locindex = -1;
            for(var loc = 0; loc < ship.locations.length; loc++) {
                context2D.fillRect(ship.locations[loc][0], ship.locations[loc][1], GRIDVAL, GRIDVAL);
                context2D.strokeRect(ship.locations[loc][0], ship.locations[loc][1], GRIDVAL, GRIDVAL);
                if(this.arraysEqual(ship.locations[loc],[ship.xmin,ship.ymin]))                                {
                    locindex = loc;
                }
                if(p1shipcollection.has(ship.locations[loc][0] + "," + ship.locations[loc][1])) {
                    p1shipcollection.delete(ship.locations[loc][0] + "," + ship.locations[loc][1]);
                }
            }
            context2D.fillStyle = "red";
            var count = 0;
            var templocations = [];
            var olddir = ship.dir;
            if(locindex === 0) {
                switch(ship.dir) {
                    case SBConstants.NORTH:
                        ship.dir = SBConstants.WEST;
                        for(var loc = ship.locations.length - 1; loc >= 0; loc--) {
                            templocations.push([ship.locations[ship.locations.length - 1][0] - count * GRIDVAL, ship.locations[ship.locations.length - 1][1]]);
                            count++;
                        }
                        break;
                    case SBConstants.WEST:
                        ship.dir = SBConstants.SOUTH;
                        for(var loc = ship.locations.length - 1; loc >= 0; loc--) {
                            templocations.push([ship.locations[ship.locations.length - 1][0], ship.locations[ship.locations.length - 1][1] + count * GRIDVAL]);
                            count++;
                        }
                        break;
                }
                templocations.reverse();
            } else {
                switch(ship.dir) {
                    case SBConstants.SOUTH:
                        ship.dir = SBConstants.EAST;
                        for(var loc = ship.locations.length - 1; loc >= 0; loc--) {
                            templocations.push([ship.locations[ship.locations.length - 1][0] + count * GRIDVAL, ship.locations[ship.locations.length - 1][1]]);
                            count++;
                        }
                        break;
                    case SBConstants.EAST:
                        ship.dir = SBConstants.NORTH;
                        for(var loc = ship.locations.length - 1; loc >= 0; loc--) {
                            templocations.push([ship.locations[ship.locations.length - 1][0], ship.locations[ship.locations.length - 1][1] - count * GRIDVAL]);
                            count++;
                        }
                        break;
                }
                templocations.reverse();
            }
            if(!this.canAct(templocations)) {
                for(var loc = 0; loc < ship.locations.length; loc++) {
                    if(!p1shipcollection.has(ship.locations[loc][0] + "," + ship.locations[loc][1])) {
                        p1shipcollection.add(ship.locations[loc][0] + "," + ship.locations[loc][1]);
                    }
                }
                ship.dir = olddir;
                this.drawship(ship);
                paintBoard($("#leftcanvas"),p1fleets,"red",darkblue);
                return false;
            }
            p1fleets.ships[ship.index].locations = templocations;
            p1fleets.ships[ship.index].dir = ship.dir;
            ship.locations = templocations;
            this.drawship(ship);
            for(var loc = 0; loc < ship.locations.length; loc++) {
                if(!p1shipcollection.has(ship.locations[loc][0] + "," + ship.locations[loc][1])) {
                    p1shipcollection.add(ship.locations[loc][0] + "," + ship.locations[loc][1]);
                }
            }
        }
        //changed
		unpaintBoard($("#leftcanvas"),p1fleets,originblue);
        paintBoard($("#leftcanvas"),p1fleets,"red",darkblue);
        if($("#cheatbox").is(':checked')) paintBoard($("#leftcanvas"),p2fleets,"#432618",darkblue);
    },
    moveForward: function(ship) {
        if(ship.index === -1) {
			alert("No selection!");
            return;
        } else {
			if(ship.checked.length !== 0) {
           	    alert("Can't move!");
                return;
       		}
            unpaintBoard($("#leftcanvas"),p1fleets,originblue);
            if($("#cheatbox").is(':checked')) paintBoard($("#leftcanvas"),p2fleets,"#432618",darkblue);
            var context2D = $("#leftcanvas")[0].getContext("2d");
            var templocations = [];
            var head = 0;
            context2D.fillStyle = grd1;
            context2D.strokeStyle = "red";
            for(var loc = 0; loc < ship.locations.length; loc++) {
                context2D.fillRect(ship.locations[loc][0], ship.locations[loc][1], GRIDVAL, GRIDVAL);
                context2D.strokeRect(ship.locations[loc][0], ship.locations[loc][1], GRIDVAL, GRIDVAL);
                if(p1shipcollection.has(ship.locations[loc][0] + "," + ship.locations[loc][1])) {
                    p1shipcollection.delete(ship.locations[loc][0] + "," + ship.locations[loc][1]);
                }
            }
            switch(ship.dir) {
                case SBConstants.NORTH:
                    for(var i = 0; i < ship.locations.length; i++)  {
                        templocations.push([ship.locations[i][0],ship.locations[i][1] - GRIDVAL]);
                    }
                    break;
                case SBConstants.SOUTH:
                    for(var i = 0; i < ship.locations.length; i++)  {
                        templocations.push([ship.locations[i][0],ship.locations[i][1] + GRIDVAL]);
                    }
                    break;
                case SBConstants.EAST:
                    for(var i = 0; i < ship.locations.length; i++)  {
                        //ship.locations[i][0] += GRIDVAL;
                        templocations.push([ship.locations[i][0]  + GRIDVAL,ship.locations[i][1]]);
                    }
                    break;
                case SBConstants.WEST:
                    for(var i = 0; i < ship.locations.length; i++)  {
                        //ship.locations[i][0] -= GRIDVAL;
                        templocations.push([ship.locations[i][0]  - GRIDVAL,ship.locations[i][1]]);
                    }
                    break;
            }
            if(!this.canHeadAct(head,templocations)) {
                for(var loc = 0; loc < ship.locations.length; loc++) {
                    if(!p1shipcollection.has(ship.locations[loc][0] + "," + ship.locations[loc][1])) {
                        p1shipcollection.add(ship.locations[loc][0] + "," + ship.locations[loc][1]);
                    }
                }
                this.drawship(ship);
                paintBoard($("#leftcanvas"),p1fleets,"red",darkblue);
                return false;
            }
            p1fleets.ships[ship.index].locations = templocations;
            p1fleets.ships[ship.index].dir = ship.dir;
            ship.locations = templocations;
            setminmax(ship);
            context2D.fillStyle = "red";
            context2D.strokeStyle = "white";
            context2D.lineWidth=2;
            switch(ship.dir) {
                case SBConstants.NORTH:
                    context2D.fillRect(ship.xmin, ship.ymin, GRIDVAL, GRIDVAL * ship.locations.length);
                    context2D.strokeRect(ship.xmin, ship.ymin, GRIDVAL, GRIDVAL * ship.locations.length);
                    break;
                case SBConstants.SOUTH:
                    context2D.fillRect(ship.xmin, ship.ymin, GRIDVAL, GRIDVAL * ship.locations.length);
                    context2D.strokeRect(ship.xmin, ship.ymin, GRIDVAL, GRIDVAL * ship.locations.length);
                    break;
                case SBConstants.WEST:
                    context2D.fillRect(ship.xmin, ship.ymin, GRIDVAL * ship.locations.length, GRIDVAL);
                    context2D.strokeRect(ship.xmin, ship.ymin, GRIDVAL * ship.locations.length, GRIDVAL);
                    break;
                case SBConstants.EAST:
                    context2D.fillRect(ship.xmin, ship.ymin, GRIDVAL * ship.locations.length, GRIDVAL);
                    context2D.strokeRect(ship.xmin, ship.ymin, GRIDVAL * ship.locations.length, GRIDVAL);
                    break;
            }
            for(var loc = 0; loc < ship.locations.length; loc++) {
                if(!p1shipcollection.has(ship.locations[loc][0] + "," + ship.locations[loc][1])) {
                    p1shipcollection.add(ship.locations[loc][0] + "," + ship.locations[loc][1]);
                }
            }
        }
		//changed
		unpaintBoard($("#leftcanvas"),p1fleets,originblue);
        paintBoard($("#leftcanvas"),p1fleets,"red",darkblue);
        if($("#cheatbox").is(':checked')) {
            paintBoard($("#leftcanvas"),p2fleets,"#432618",darkblue);
        }
    },
    moveBackward: function(ship) {
        if(ship.index === -1) {
            alert("No selection!");
            return;
        } else {
			if(ship.checked.length !== 0) {
           	    alert("Can't move!");
                return;
       		}
            unpaintBoard($("#leftcanvas"),p1fleets,originblue);
            if($("#cheatbox").is(':checked')) paintBoard($("#leftcanvas"),p2fleets,"#432618",darkblue);
            var templocations = [];
            var head = ship.locations.length - 1;
            var context2D = $("#leftcanvas")[0].getContext("2d");
            context2D.fillStyle = grd1;
            context2D.strokeStyle = "red";
            for(var loc = 0; loc < ship.locations.length; loc++) {
                context2D.fillRect(ship.locations[loc][0], ship.locations[loc][1], GRIDVAL, GRIDVAL);
                context2D.strokeRect(ship.locations[loc][0], ship.locations[loc][1], GRIDVAL, GRIDVAL);
                if(p1shipcollection.has(ship.locations[loc][0] + "," + ship.locations[loc][1])) {
                    p1shipcollection.delete(ship.locations[loc][0] + "," + ship.locations[loc][1]);
                }
            }
            switch(ship.dir) {
                case SBConstants.NORTH:
                    for(var i = 0; i < ship.locations.length; i++)  {
                        templocations.push([ship.locations[i][0],ship.locations[i][1] + GRIDVAL]);
                    }
                    break;
                case SBConstants.SOUTH:
                    for(var i = 0; i < ship.locations.length; i++)  {
                        templocations.push([ship.locations[i][0],ship.locations[i][1] - GRIDVAL]);
                    }
                    break;
                case SBConstants.EAST:
                    for(var i = 0; i < ship.locations.length; i++)  {
                        //ship.locations[i][0] -= GRIDVAL;
                        templocations.push([ship.locations[i][0] - GRIDVAL,ship.locations[i][1]]);
                    }
                    break;
                case SBConstants.WEST:
                    for(var i = 0; i < ship.locations.length; i++)  {
                        //ship.locations[i][0] += GRIDVAL;
                        templocations.push([ship.locations[i][0] + GRIDVAL,ship.locations[i][1]]);
                    }
                    break;
            }
            if(!this.canHeadAct(head,templocations)) {
                for(var loc = 0; loc < ship.locations.length; loc++) {
                    if(!p1shipcollection.has(ship.locations[loc][0] + "," + ship.locations[loc][1])) {
                        p1shipcollection.add(ship.locations[loc][0] + "," + ship.locations[loc][1]);
                    }
                }
                this.drawship(ship);
                paintBoard($("#leftcanvas"),p1fleets,"red",darkblue);
                return false;
            }
            p1fleets.ships[ship.index].locations = templocations;
            p1fleets.ships[ship.index].dir = ship.dir;
            ship.locations = templocations;
            setminmax(ship);
            context2D.fillStyle = "red";
            context2D.strokeStyle = "white";
            context2D.lineWidth=2;
            switch(ship.dir) {
                case SBConstants.NORTH:
                    context2D.fillRect(ship.xmin, ship.ymin, GRIDVAL, GRIDVAL * ship.locations.length);
                    context2D.strokeRect(ship.xmin, ship.ymin, GRIDVAL, GRIDVAL * ship.locations.length);
                    break;
                case SBConstants.SOUTH:
                    context2D.fillRect(ship.xmin, ship.ymin, GRIDVAL, GRIDVAL * ship.locations.length);
                    context2D.strokeRect(ship.xmin, ship.ymin, GRIDVAL, GRIDVAL * ship.locations.length);
                    break;
                case SBConstants.WEST:
                    context2D.fillRect(ship.xmin, ship.ymin, GRIDVAL * ship.locations.length, GRIDVAL);
                    context2D.strokeRect(ship.xmin, ship.ymin, GRIDVAL * ship.locations.length, GRIDVAL);
                    break;
                case SBConstants.EAST:
                    context2D.fillRect(ship.xmin, ship.ymin, GRIDVAL * ship.locations.length, GRIDVAL);
                    context2D.strokeRect(ship.xmin, ship.ymin, GRIDVAL * ship.locations.length, GRIDVAL);
                    break;
            }
            for(var loc = 0; loc < ship.locations.length; loc++) {
                if(!p1shipcollection.has(ship.locations[loc][0] + "," + ship.locations[loc][1])) {
                    p1shipcollection.add(ship.locations[loc][0] + "," + ship.locations[loc][1]);
                }
            }
        }
        //changed
		unpaintBoard($("#leftcanvas"),p1fleets,originblue);
        paintBoard($("#leftcanvas"),p1fleets,"red",darkblue);
        if($("#cheatbox").is(':checked')) paintBoard($("#leftcanvas"),p2fleets,"#432618",darkblue);
    },
    findship: function(tempx,tempy) {
        //console.log("hello");
        for (var index = 0; index < p1fleets.ships.length; index++) {
            //console.log([tempx,tempy],fleets.ships[index].locations);
            for(var loc = 0; loc < p1fleets.ships[index].locations.length;loc++) {
                if(this.arraysEqual(p1fleets.ships[index].locations[loc],[tempx,tempy])) {
                    return index;
                }
            }
        }
        for (var index = 0; index < p2fleets.ships.length; index++) {
            //console.log([tempx,tempy],fleets.ships[index].locations);
            for(var loc = 0; loc < p2fleets.ships[index].locations.length;loc++) {
                if(this.arraysEqual(p2fleets.ships[index].locations[loc],[tempx,tempy])) {
                    //alert("hll");
                    return -2;
                }
            }
        }
        return -1;
    },
    arraysEqual: function(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
        return JSON.stringify(a1)==JSON.stringify(a2);
    },
    canAct: function(templocations) {
        for (var index = 0; index < templocations.length; index++) {
                var locstr = templocations[index][0] + "," + templocations[index][1];
                if(templocations[index][0] < 0 || templocations[index][1] < 0) {
                    alert("Can't move!");
                    return false;
                }
                if(templocations[index][0] > (colmax - 1 ) * GRIDVAL || templocations[index][1] > (rowmax - 1 )* GRIDVAL) {
                    alert("Can't move!");
                    return false;
                }
                if(userselection.has(locstr)){
                    alert("Can't move!");
                    return false;
                }
                if(compselection.has(locstr)){
                    alert("Can't move!");
                    return false;
                }
                if(p1shipcollection.has(locstr)) {
                    alert("Can't move!");
                    return false;
                }
        }
        return true;
    },
    canHeadAct: function(head,templocations) {
        var locstr = templocations[head][0] + "," + templocations[head][1];
        if(templocations[head][0] < 0 || templocations[head][1] < 0) {
            alert("Can't move!");
            return false;
        }
        if(templocations[head][0] > (colmax) * GRIDVAL || templocations[head][1] > (rowmax)* GRIDVAL) {
            alert("Can't move!");
            return false;
        }
        if(userselection.has(locstr)){
            alert("Can't move!");
            return false;
        }
        if(compselection.has(locstr)){
                alert("Can't move!");
            return false;
        }
        if(p1shipcollection.has(locstr)) {
            alert("Can't move!");
            return false;
        }
        return true;
    },
    findCompShip: function(fleets,tempx,tempy) {
        for (var index = 0; index < fleets.ships.length; index++) {
            //console.log([tempx,tempy],fleets.ships[index].locations);
            for(var loc = 0; loc < fleets.ships[index].locations.length;loc++) {
                if(this.arraysEqual(fleets.ships[index].locations[loc],[tempx,tempy])) {
                    return [index,loc];
                }
            }
        }
        return -1;
    },
    drawship: function(ship){
        var xmin = 1000,ymin = 1000;
        var context2D = $("#leftcanvas")[0].getContext("2d");
        context2D.fillStyle = "red";
        context2D.strokeStyle = "white";
        context2D.lineWidth=2;
        //context2D.fillStyle = "red";
        for(var i = 0; i < ship.locations.length; i++) {
            if(ship.locations[i][0] < xmin) {
                xmin = ship.locations[i][0];
            }
            if(ship.locations[i][1] < ymin) {
                ymin = ship.locations[i][1];
            }
            ship.xmin = xmin;
            ship.ymin = ymin;
        }
        //paint border
        switch(ship.dir) {
                case SBConstants.NORTH:
                    context2D.fillRect(xmin, ymin, GRIDVAL, GRIDVAL * ship.locations.length);
                    context2D.strokeRect(xmin, ymin, GRIDVAL, GRIDVAL * ship.locations.length);
                    break;
                case SBConstants.SOUTH:
                    context2D.fillRect(xmin, ymin, GRIDVAL, GRIDVAL * ship.locations.length);
                    context2D.strokeRect(xmin, ymin, GRIDVAL, GRIDVAL * ship.locations.length);
                    break;
                case SBConstants.WEST:
                    context2D.fillRect(xmin, ymin, GRIDVAL * ship.locations.length, GRIDVAL);
                    context2D.strokeRect(xmin, ymin, GRIDVAL * ship.locations.length, GRIDVAL);
                    break;
                case SBConstants.EAST:
                    context2D.fillRect(xmin, ymin, GRIDVAL * ship.locations.length, GRIDVAL);
                    context2D.strokeRect(xmin, ymin, GRIDVAL * ship.locations.length, GRIDVAL);
                    break;
        }
    },
    checkwin: function(index,player) {
        var p1flag = 1;
        var p2flag = 1;
        //$("#outputarea").text("");
        this.displayact(index,player);
        for (var j = 0; j < p1fleets.ships.length; j++) {
            if(p1fleets.ships[j].alive === "destroyed") {
                p1flag = p1flag & 1;
            } else {
                p1flag = p1flag & 0;
            }
        }
        if(p1flag === 1) {
            result = true;
            $(".footer span").empty();
            $(".footer span").prepend("Computer win!<br>Please refresh page to start a new game!");
            return "Computer win!";
        }
        for (var k = 0; k < p2fleets.ships.length; k++) {
            if(p2fleets.ships[k].alive === "destroyed") {
                p2flag = p2flag & 1;
            } else {
                p2flag = p2flag & 0;
            }
        }
        if(p2flag === 1) {
            result = true;
            $(".footer span").empty();
            $(".footer span").prepend("Player win!<br>Please refresh page to start a new game!");
            return "Player win!";
        }
        $(".footer span").empty();
        $(".footer span").prepend("No one wins yet!<br>");
        return "None";
    },
    displayact: function(index,player) {
        if(index === -1) {
            $("#outputarea").prepend(player + " missed!<br>");
        } else if(index === -2){
            $("#outputarea").prepend(player + " hit!<br>");
        } else {
        }
    },
    displayres: function() {
        var fleet_ul = $("#fleets ul");
        fleet_ul.empty();
        p1fleets.ships.forEach(function (s) {
            var ship_str = "<ul><li>" + s.name + "</li>";
            ship_str += "<li>Direction: " + s.dir + "</li>";
            ship_str += "<li>Size: " + s.size + "</li>";
            if (s.alive === "full") {
                ship_str += "<li>Status: ALIVE</li>";
            } else if (s.alive === "broken") {
                ship_str += "<li>Status: BROKEN</li>";
            } else {
                ship_str += "<li>Status: DESTROYED</li>";
            }
            ship_str += "</ul>";
            fleet_ul.append(ship_str);
        });
    }
};

