// Copyright 2017-2019, University of Colorado Boulder

/**
 * Responsible for the attributes and drag handlers associated with the timer node.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Property = require( 'AXON/Property' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );
  var Util = require( 'DOT/Util' );
  var Vector2Property = require( 'DOT/Vector2Property' );

  /**
   * @param {Bounds2} dragBounds
   * @param {Vector2} initialPosition
   * @param {Property.<number>} timerSecondsProperty
   * @param {Property.<boolean>} timerRunningProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {function} endDragCallback
   * @param {Tandem} tandem
   * @constructor
   */
  function DraggableTimerNode( dragBounds, initialPosition, timerSecondsProperty, timerRunningProperty, visibleProperty, endDragCallback, tandem ) {
    var self = this;

    // Readout value that is used for the timerNode. We are rounding the value in the view component.
    var timerReadoutProperty = new DynamicProperty( new Property( timerSecondsProperty ), {
      bidirectional: true,
      map: function( seconds ) {
        return Util.roundSymmetric( seconds * 1e5 ) / 1e5;
      }
    } );

    TimerNode.call( this, timerReadoutProperty, timerRunningProperty, {
      tandem: tandem.createTandem( 'timer' )
    } );


    // @private (read-only) - position of ruler node in screen coordinates
    this.positionProperty = new Vector2Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );
    this.positionProperty.linkAttribute( this, 'translation' );

    // @private {MovableDragHandler} (read-only) handles timer node drag events
    this.timerNodeMovableDragHandler = new MovableDragHandler( this.positionProperty, {
      tandem: tandem.createTandem( 'dragHandler' ),
      dragBounds: dragBounds,
      startDrag: function() {
        self.moveToFront();
      },
      endDrag: function() {
        endDragCallback();
      }
    } );
    this.addInputListener( this.timerNodeMovableDragHandler );
    visibleProperty.linkAttribute( this, 'visible' );
  }

  massesAndSprings.register( 'DraggableTimerNode', DraggableTimerNode );

  return inherit( TimerNode, DraggableTimerNode, {
    /**
     * @override
     *
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
    }
  } );
} );