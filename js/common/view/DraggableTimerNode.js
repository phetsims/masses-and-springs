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
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Timer = require( 'SCENERY_PHET/Timer' );

  function DraggableTimerNode( visibleProperty ) {
    var self = this;
    Node.call( this );
    var secondsProperty = new Property( 0 );
    var runningProperty = new Property( false );
    this.addChild( new Timer( secondsProperty, runningProperty ) );

    visibleProperty.linkAttribute( self, 'visible' );
  }

  massesAndSprings.register( 'DraggableTimerNode', DraggableTimerNode );

  return inherit( Node, DraggableTimerNode, {} );
} );