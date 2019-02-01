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
  var PropertyIO = require( 'AXON/PropertyIO' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );
  var Util = require( 'DOT/Util' );
  var Vector2IO = require( 'DOT/Vector2IO' );

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


    // @private {Property.<Vector2>} (read-only) position of ruler node in screen coordinates
    this.positionProperty = new Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioType: PropertyIO( Vector2IO )
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