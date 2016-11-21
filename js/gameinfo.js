// fleet obj

var p1fleets = {
    ships: [
        {
            name: "Carrier",
            locations:[],
            size:5,
            dir: SBConstants.NORTH,
            alive: "full",
            checked: [],
            frontview: 5,
            sideview: 5,
            rearview:2,
			player: "p1",
            xmin: 1000,
            ymin: 1000,
	        index: -1,
        },
        {
            name: "Battleship",
            locations:[],
            size:4,
            dir:SBConstants.NORTH,
            alive: "full",
            checked: [],
            frontview: 4,
            sideview: 4,
            rearview:2,
			player: "p1",
            xmin: 1000,
            ymin: 1000,
	        index: -1,
        },
        {
            name: "Cruiser",
            locations:[],
            size:3,
            dir:SBConstants.NORTH,
            alive: "full",
            checked: [],
            frontview: 3,
            sideview: 3,
            rearview:2,
			player: "p1",
            xmin: 1000,
            ymin: 1000,
	        index: -1,
        },
        {
            name: "Submarine",
            locations:[],
            size:3,
            dir:SBConstants.NORTH,
            alive: "full",
            checked: [],
            frontview: 3,
            sideview: 3,
            rearview:2,
			player: "p1",
            xmin: 1000,
            ymin: 1000,
	        index: -1,
        },
        {
            name: "Destroyer",
            locations:[],
            size:2,
            dir:SBConstants.NORTH,
            alive: "full",
            checked: [],
            frontview: 2,
            sideview: 3,
            rearview:2,
			player: "p1",
            xmin: 1000,
            ymin: 1000,
	        index: -1,
        }
    ],
    collisionCheck: function(ship1,ship2) {
        for(var i=0; i < ship1.locations.length;i++) {
            for(var j=0; j < ship2.locations.length;j++) {
                if(commands.arraysEqual(ship1.locations[i],ship2.locations[j])) {
                    return true;
                }
            }
        }
        return false;
    }
}
var p2fleets = {
    ships: [
        {
            name: "Carrier",
            locations:[],
            size:5,
            dir: SBConstants.NORTH,
            alive: "full",
            checked: [],
            frontview: 5,
            sideview: 5,
            rearview:2
        },
        {
            name: "Battleship",
            locations:[],
            size:4,
            dir:SBConstants.NORTH,
            alive: "full",
            checked: [],
            frontview: 4,
            sideview: 4,
            rearview:2
        },
        {
            name: "Cruiser",
            locations:[],
            size:3,
            dir:SBConstants.NORTH,
            alive: "full",
            checked: [],
            frontview: 3,
            sideview: 3,
            rearview:2
        },
        {
            name: "Submarine",
            locations:[],
            size:3,
            dir:SBConstants.NORTH,
            alive: "full",
            checked: [],
            frontview: 3,
            sideview: 3,
            rearview:2
        },
        {
            name: "Destroyer",
            locations:[],
            size:2,
            dir:SBConstants.NORTH,
            alive: "full",
            checked: [],
            frontview: 2,
            sideview: 2,
            rearview:2
        }
    ],
    collisionCheck: function(ship1,ship2) {
        for(var i=0; i < ship1.locations.length;i++) {
            for(var j=0; j < ship2.locations.length;j++) {
                if(commands.arraysEqual(ship1.locations[i],ship2.locations[j])) {
                    return true;
                }
            }
        }
        return false;
    }
}

var options = {
    boardSize: 50,
    missAge: 10,
    turnLimit: 200,
    rotateMissLimit: 3,
    rearViewDistance: 2
}

function initLocation(){
    //alert("hello");
    for (var j=0; j < p1fleets.ships.length; j++) {
        p1fleets.ships[j].dir = SBConstants.randir();
        p1fleets.ships[j].locations = generateShipLocation(p1fleets.ships[j]);
        var collide = true;
        while(collide) {
            for (var k=0; k < p1fleets.ships.length; k++){
                if(p1fleets.ships[j] === p1fleets.ships[k]) continue;
                if(p1fleets.collisionCheck(p1fleets.ships[j],p1fleets.ships[k])) {
                    collide = true;
                    break;
                } else {
                    collide = false;
                }
            }
            if(!collide) {
                for (var k=0; k < p2fleets.ships.length; k++){
                    if(p2fleets.collisionCheck(p1fleets.ships[j],p2fleets.ships[k])) {
                        collide = true;
                        break;
                    } else {
                        collide = false;
                    }
                }
            }
            if(collide) {
                p1fleets.ships[j].locations = generateShipLocation(p1fleets.ships[j]);
                //alert("asdsa");
            } else {
                break;
            }
        }
    }
    for (var j=0; j < p2fleets.ships.length; j++) {
        p2fleets.ships[j].dir = SBConstants.randir();
        p2fleets.ships[j].locations = generateShipLocation(p2fleets.ships[j]);
        var collide = true;
        while(collide) {
            for (var k=0; k < p2fleets.ships.length; k++){
                if(p2fleets.ships[j] === p2fleets.ships[k]) continue;
                if(p2fleets.collisionCheck(p2fleets.ships[j],p2fleets.ships[k])) {
                    collide = true;
                    break;
                } else {
                    collide = false;
                }
            }
            if(!collide) {
                for (var k=0; k < p1fleets.ships.length; k++){
                    if(p1fleets.collisionCheck(p2fleets.ships[j],p1fleets.ships[k])) {
                        collide = true;
                        break;
                    } else {
                        collide = false;
                    }
                }
            }
            if(collide) {
                p2fleets.ships[j].locations = generateShipLocation(p2fleets.ships[j]);
                //alert("asdsa");
            } else {
                break;
            }
        }
    }
    //console.log(p1fleets);
    return [p1fleets,p2fleets];
};


function generateShipLocation(ship){
    ship.locations = [];
    var rowsmin,rowsmax,colsmin,colsmax;
    switch(ship.dir) {
        case SBConstants.NORTH:
            rowsmin = 0;
            rowsmax = rowmax - 1 - ship.size;
            colsmin = 0;
            colsmax = colmax - 1;
            break;
        case SBConstants.SOUTH:
            rowsmin = 1 + ship.size;
            rowsmax = rowmax - 1;
            colsmin = 0;
            colsmax = colmax - 1;
            break;
        case SBConstants.WEST:
            rowsmin = 0;
            rowsmax = rowmax - 1;
            colsmin = 0;
            colsmax = colmax - 1 - ship.size;
            break;
        case SBConstants.EAST:
            rowsmin = 0;
            rowsmax = rowmax - 1;
            colsmin = 1 + ship.size;
            colsmax = colmax - 1;
            break;
    }
    var randCol = Math.floor(Math.random() * (colsmax - colsmin)) + colsmin;
    var randRow = Math.floor(Math.random() * (rowsmax - rowsmin)) + rowsmin;
    var x,y;
    x = (randCol * GRIDVAL + diffx / 2);
    y = (randRow * GRIDVAL + diffy / 2);
    ship.locations.push([x,y]);
    //alert("ads");
    //console.log(ship.locations);
    switch(ship.dir) {
        case SBConstants.NORTH:
            for(var i=1; i < ship.size; i++) {
                y = ((randRow + i) * GRIDVAL + diffy / 2);
                ship.locations.push([x,y]);
            }
            break;
        case SBConstants.SOUTH:
            for(var i=1; i < ship.size; i++) {
                y = ((randRow - i) * GRIDVAL + diffy / 2);
                ship.locations.push([x,y]);
            }
            break;
        case SBConstants.WEST:
            for(var i=1; i < ship.size; i++) {
                x = ((randCol + i) * GRIDVAL + diffx / 2);
                ship.locations.push([x,y]);
            }
            break;
        case SBConstants.EAST:
            for(var i=1; i < ship.size; i++) {
                x = ((randCol - i) * GRIDVAL + diffx / 2);
                ship.locations.push([x,y]);
            }
            break;
    }
    return ship.locations;
}


