// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 * @author Denzell Barnett
 *
 * Node responsible for Timer.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Timer = require( 'SCENERY_PHET/Timer' );

  function DraggableTimerNode( dragBounds, initialPosition, timerSecondsProperty, timerRunningProperty, visibleProperty ) {
    var self = this;
    Node.call( this );
    this.addChild( new Timer( timerSecondsProperty, timerRunningProperty ) );

    // @private
    this.positionProperty = new Property( initialPosition );
    this.positionProperty.linkAttribute( self, 'translation' );
    this.addInputListener( new MovableDragHandler( this.positionProperty, {
      dragBounds: dragBounds
    } ) );

    visibleProperty.linkAttribute( self, 'visible' );
  }

  massesAndSprings.register( 'DraggableTimerNode', DraggableTimerNode );

  return inherit( Node, DraggableTimerNode, {} );
} );