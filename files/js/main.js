// global variables
var templates = {},
    preloader = {},
    gameInterface = {},
    colorData = [],

    currentTileIndex = 0,
    userScore = 0,
    updateScoreChunk = 20,
    scoreIsUpdating = false,
    playTime = 60,
    currentPlayTime = 60,
    playInterval = 0,
    scoreBoardUpdateInterval = 0,

    $body = null;

// main functions
function loadTemplates ( $, Handlebars ) {
    console.log( 'Handlebars loaded' );

    window.$ = window.$ || $;
    window.Handlebars = window.Handlebars || Handlebars;
    require( [ 'templates', 'min/jquery-ui.min' ], additionalScriptsLoaded );
}

function additionalScriptsLoaded ( templatesTmp ) {
    templates = templatesTmp;

    init();
}

function initPreloader () {
    preloader.$preloader = getTemplate( 'preloader', {} ).appendTo( $body );

    loadColorData();
}

function loadColorData () {
    $.getJSON( 'files/json/colors.json', function ( data ) {
        colorData = data.shuffle();

        setTimeout( removePreloader, 2000 );
    } );
}

function preloaded () {
    removePreloader();
}

function removePreloader () {
    preloader.$preloader.addClass( 'fade-out' );

    setTimeout( function () {
        preloader.$preloader.remove();
        initGameInterfaceView();
    }, 800 );
}

function initGameInterfaceView () {
    console.log( "Init Game Interface" );

    var currentItem = colorData[ currentTileIndex ];

    gameInterface.$game = getTemplate( 'game-interface', {} ).appendTo( $body );
    gameInterface.$gameOverView = gameInterface.$game.find( '.game-over-view' );
    gameInterface.$mainView = gameInterface.$game.find( '.main-view' );
    gameInterface.$timeBoard = gameInterface.$game.find( '.time-board .seconds' );
    gameInterface.$scoreBoard = gameInterface.$mainView.find( '.score-board' );
    gameInterface.$scoreBoardValue = gameInterface.$mainView.find( '.value' );
    gameInterface.$mainTiles = gameInterface.$mainView.find( '.big-tiles-container' ).addClass( 'disabled' );
    gameInterface.$mainTileFirst = gameInterface.$mainTiles.find( '.first-color' );
    gameInterface.$mainTileSecond = gameInterface.$mainTiles.find( '.second-color' );
    gameInterface.$tilesView = gameInterface.$game.find( '.tiles-view' );
    gameInterface.$chooseView = gameInterface.$game.find( '.choose-view' );
    gameInterface.$game.find( '.btn.play' ).addClass( 'active' );
    gameInterface.$game.find( '.btn.reload' ).addClass( 'disabled' );

    generateTilesInInputQeue();
}

function startNewGame() {
    console.log( "Start a new game" );

    resetGame();

    gameInterface.$mainTiles.removeClass( 'disabled' );
    gameInterface.$game.find( '.btn.play' )
        .removeClass( 'active' )
        .addClass( 'disabled' );
    gameInterface.$game.find( '.btn.reload' )
            .addClass( 'active' )
            .removeClass( 'disabled' );
    continueWithTileAtIndex( currentTileIndex );

    playInterval = setInterval( updatePlayTime, 1000 );
}

function updatePlayTime () {
    if ( currentPlayTime ) {
        currentPlayTime -= 1;
        gameInterface.$timeBoard.text( currentPlayTime );
    } else {
        clearInterval( playInterval );

        gameOver();
    }
}

function gameOver () {
    var textContent = "";

    console.log( 'Game over!' );

    if ( userScore >= 1000 ) {
        textContent = "Hey nicht schlecht! Du hast " + userScore + " Punkte erziehlt!";
    } else if ( userScore >= 300 ) {
        textContent = "Naja, " + userScore + " Punkte... Da geht doch noch was!";
    } else {
        textContent = "Wie würde eine Grundschullehrerin sagen: 'Er hat sich stehts bemüht'.<br/><br/>" + userScore + " Punkte.";
    }

    gameInterface.$gameOverView.addClass( 'active' );
    gameInterface.$gameOverView.find( '.content' ).html( textContent );
}

function continueWithTileAtIndex( index ) {
    var $item = gameInterface.$tilesView.find( '.tiles-wrapper' ).first(),
        itemFirstColorIndex = parseInt( $item.attr( 'data-id' ) ),
        itemSecondColorIndex = itemFirstColorIndex - 1,
        firstItem = colorData[ itemFirstColorIndex ],
        secondItem = colorData[ itemSecondColorIndex ],
        uniqueValues = [
            colorData[ itemFirstColorIndex ].name,
            colorData[ itemSecondColorIndex ].name
        ],
        buttons = getRandomColorValues( uniqueValues, 4 ),
        htmlData = getTemplate( 'choose-btn', buttons );

    gameInterface.$mainView.removeClass( 'win loose' );
    gameInterface.$mainTiles.find( '.label' ).css( { opacity: '' } );
    gameInterface.$mainTiles.find( '.tile' ).removeClass( 'disabled' );

    gameInterface.$mainTileFirst
        .css( 'background', '#' + firstItem.hex )
        .attr( 'data-accepted-value', firstItem.name );
    gameInterface.$mainTileSecond
        .css( 'background', '#' + secondItem.hex )
        .attr( 'data-accepted-value', secondItem.name );
    gameInterface.$chooseView.html( htmlData );

    addDragDropFunctionality();
}

function addDragDropFunctionality () {
    gameInterface.$chooseView.find( '.choose-btn' ).draggable( {
        containment: '.main-view',
        revert: 'invalid',
        stop: dragStopped
    } );

    gameInterface.$mainTiles.droppable( {
        accept: '.choose-btn',
        drop: bigTilesDropped,
        activeClass: "active",
        hoverClass: "hover"
    } );
}

function dragStopped () {
    var $draggedElems = gameInterface.$chooseView.find( '.dragged' ),
        win = false;

    if ( $draggedElems.length === 2 ) {
        console.log( 'Dropped two elements. Validate now' );

        win = validateDroppedElements();

        if ( win ) {
            console.log( 'Win this round' );

            gameInterface.$mainView.addClass( 'win' );
            updateScorePoints( 200 );
        } else {
            console.log( 'Loose this round' );

            gameInterface.$mainView.addClass( 'loose' );
            updateScorePoints( -100, true );
        }

        fadeOutCurrentTiles();
    }
}

function fadeOutCurrentTiles () {
    console.log( 'Fade out tiles' );

    gameInterface.$mainTiles.find('.label').animate( {
        opacity: 0
    } );

    setTimeout( function () {
        gameInterface.$mainTiles.removeClass( 'disabled' );
        gameInterface.$tilesView.find( '.tiles-wrapper' ).first().animate( {
            height: 0,
            margin: 0,
            padding: 0,
            opacity: 0,
            border: '1px solid transparent'
        } );

        setTimeout( function () {
            gameInterface.$tilesView.find( '.tiles-wrapper' ).first().remove();

            currentTileIndex++;
            continueWithTileAtIndex( currentTileIndex );
        }, 500 );
    }, 1000 );
}

function updateScorePoints ( points, decrement ) {
    userScore += points;

    console.log( 'New Score: %s', userScore );

    if ( userScore >= 0 ) {
        gameInterface.$scoreBoard
            .addClass( 'positive' )
            .removeClass( 'negative' );

        console.log( 'Scoreboard changed to positive' );
    } else {
        gameInterface.$scoreBoard
            .addClass( 'negative' )
            .removeClass( 'positive' );

        console.log( 'Scoreboard changed to negative' );
    }

    if ( !scoreIsUpdating ) {
        scoreIsUpdating = true;

        scoreBoardUpdateInterval = setInterval( function () {
            incrementScoreBoardValue( decrement );
        }, 50 );
    }
}

function incrementScoreBoardValue ( decrement ) {
    var currentVal = parseInt( gameInterface.$scoreBoardValue.text() );

    if ( decrement ) {
        if ( currentVal > userScore ) {
            gameInterface.$scoreBoardValue.text( currentVal - updateScoreChunk );
        } else if ( currentVal < userScore ) {
            gameInterface.$scoreBoardValue.text( currentVal + updateScoreChunk );
        } else {
            scoreIsUpdating = false;
            clearInterval( scoreBoardUpdateInterval );
        }
    } else {
        if ( currentVal + updateScoreChunk < userScore ) {
            gameInterface.$scoreBoardValue.text( currentVal + updateScoreChunk );
        } else {
            scoreIsUpdating = false;
            clearInterval( scoreBoardUpdateInterval );
            gameInterface.$scoreBoardValue.text( userScore );
        }
    }
}

function validateDroppedElements () {
    var $leftDroppedItem = gameInterface.$chooseView.find( '.dropped-left' ),
        $rightDroppedItem = gameInterface.$chooseView.find( '.dropped-right' ),
        acceptedFirstValue = gameInterface.$mainTileFirst.attr( 'data-accepted-value' ),
        acceptedSecondValue = gameInterface.$mainTileSecond.attr( 'data-accepted-value' ),
        win = true;

    // check left
    if ( $leftDroppedItem.text() === acceptedFirstValue ) {
        console.log( 'Left dropped item is okay' );
    } else {
        console.log( 'Left dropped item is wrong. The right is "%s"', acceptedFirstValue );

        win = false;
    }

    // check right
    if ( $rightDroppedItem.text() === acceptedSecondValue ) {
        console.log( 'Right dropped item is okay' );
    } else {
        console.log( 'Right dropped item is wrong. The right is "%s"', acceptedSecondValue );

        win = false;
    }

    return win;
}

function bigTilesDropped ( event, $ui ) {
    var $item = $( $ui.draggable[ 0 ] );

    if ( !targetContainsItem( $item ) ) {
        $item
            .draggable( 'disable' )
            .addClass( 'dragged' );
    } else {
        $item.animate( { top: '', left: '' } );
    }
}

function targetContainsItem ( $element ) {
    var centerX = $element.offset().left + $element.width() / 2,
        centerY = $element.offset().top + $element.height() / 2,
        targetXMin = gameInterface.$mainTiles.offset().left,
        targetYMin = gameInterface.$mainTiles.offset().top,
        targetXMax = targetXMin + gameInterface.$mainTiles.width(),
        targetYMax = targetYMin + gameInterface.$mainTiles.height(),
        targetCenterX = targetXMin + gameInterface.$mainTiles.width() / 2,
        isInBounceX = centerX >= targetXMin && centerX <= targetXMax,
        isInBounceY = centerY >= targetYMin && centerY <= targetYMax;

    if ( isInBounceX && isInBounceY ) {
        if ( centerX <= targetCenterX ) {
            if ( gameInterface.$chooseView.find( '.dropped-left' ).length ) {
                console.log( 'Item dropped left' );

                return true;
            } else {
                console.log( 'Item cant dropped left' );

                $element.addClass( 'dropped-left' );
                gameInterface.$mainTiles
                    .find( '.first-color' )
                        .addClass( 'disabled' )
                    .find( '.label' )
                        .text( $element.text() );

                return false;
            }
        } else {
            if ( gameInterface.$chooseView.find( '.dropped-right' ).length ) {
                console.log( 'Item dropped right' );

                return true;
            } else {
                console.log( 'Item cant dropped right' );

                $element.addClass( 'dropped-right' );
                gameInterface.$mainTiles
                    .find( '.second-color' )
                        .addClass( 'disabled' )
                    .find( '.label' )
                        .text( $element.text() );

                return false;
            }
        }
    }

    return false;
}

function getRandomColorValues ( uniqueValues, itemsCount ) {
    var mixedColors = [];

    for ( var i = 0; i < itemsCount - uniqueValues.length; i++ ) {
        var exists = false,
            randomItem;

        do {
            randomItem = colorData[ Math.floor( Math.random() * colorData.length ) ].name;
            exists = mixedColors.exists( randomItem );
        } while ( exists );

        mixedColors.push( randomItem );
    }

    mixedColors = addUniqueValuesAtRandomIndexToArray( mixedColors, uniqueValues );

    return mixedColors;
}

function addUniqueValuesAtRandomIndexToArray ( array, uniqueValues ) {
    for ( var i = 0; i < uniqueValues.length; i++ ) {
        var randomIndex = Math.round( Math.random() * array.length );

        array.insert( randomIndex, uniqueValues[ i ] );
    }

    return array;
}

function resetGame() {
    console.log( "Reset game" );

    gameInterface.$tilesView.empty();
    gameInterface.$scoreBoard.removeClass( 'negative positive' );
    gameInterface.$scoreBoardValue.text( '0000' );
    gameInterface.$timeBoard.text( playTime );
    gameInterface.$gameOverView.removeClass( 'active' );

    currentTileIndex = 0;
    userScore = 0;
    currentPlayTime = playTime;
    colorData = colorData.shuffle();
    generateTilesInInputQeue();
    clearInterval( playInterval );
}

function generateTilesInInputQeue () {
    var tmpColor = '';

    for ( var i = 0; i < colorData.length; i++ ) {
        if ( i % 2 && i > 1 ) {
            gameInterface.$tilesView.append( getTemplate( 'tile', { 'id': i, 'first-color': colorData[ i ].hex, 'second-color': tmpColor } ) );
        }

        tmpColor = colorData[ i ].hex;
    }
}

function getTemplate ( templateName, data ) {
    return $( Handlebars.templates[ templateName ]( data ) );
}

function initVariables () {
    $body = $( 'body' );
}

function init () {
    console.log( 'Initialize App' );

    initVariables();
    initPreloader();
    bindEvents();
}

function bindEvents() {
    $body.on( 'click', '.btn.play.active', playBtnClicked );
    $body.on( 'click', '.btn.reload.active', reloadBtnClicked );
}

function playBtnClicked () {
    var $this = $( this );

    $this
        .removeClass( 'active' )
        .addClass( 'disabled' );

    startNewGame();
}

function reloadBtnClicked () {
    startNewGame();
}

// prototypes
Array.prototype.shuffle = function () {
    for(var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);

    return this;
};

Array.prototype.exists = function ( object ) {
    for ( var i = 0; i < this.length; i++ ) {
        if ( this[ i ] ===  object ) {
            return true;
        }
    }

    return false;
};

Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

// start loading scripts
define( [ 'min/jquery-2.1.4.min', 'handlebars/handlebars.runtime' ], loadTemplates );
