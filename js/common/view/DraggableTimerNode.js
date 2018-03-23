// Copyright 2017-2018, University of Colorado Boulder

/**
 * Responsible for the attributes and drag handlers associated with the timer node.
 *
 * REVIEW: some duplication with this and the DraggableRulerNode. Consider (not forced) factoring this common behavior
 * REVIEW: out into some "DraggableNode" that both can inherit from (then the TimerNode/etc. would be a child).
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
   * @param {Tandem} tandem
   * @constructor
   */
  function DraggableTimerNode( dragBounds, initialPosition, timerSecondsProperty, timerRunningProperty, visibleProperty, tandem ) {
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

    // @public {Panel|null} (read-write) Used for returning ruler to toolbox. Set this if needed to be returned.
    this.toolbox = null;

    //REVIEW: type docs
    //REVIEW: Specify read-write as (read-only) AFTER the type docs. Add type docs here.
    // @private {read-only} position of ruler node in screen coordinates
    this.positionProperty = new Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioType: PropertyIO( Vector2IO )
    } );
    //REVIEW: Use `this` instead of self here?
    this.positionProperty.linkAttribute( self, 'translation' );

    //REVIEW: Specify read-write as (read-only) AFTER the type docs. Add type docs here.
    // @private {read-only} handles timer node drag events
    this.timerNodeMovableDragHandler = new MovableDragHandler( this.positionProperty, {
      tandem: tandem.createTandem( 'dragHandler' ),
      dragBounds: dragBounds,
      startDrag: function() {
        self.moveToFront();
      },
      endDrag: function() {

        // When a node is released, check if it is over the toolbox.  If so, drop it in.
        if ( self.toolbox && self.getGlobalBounds().intersectsBounds( self.toolbox.getGlobalBounds() ) ) {
          visibleProperty.set( false );
          timerSecondsProperty.reset();
          timerRunningProperty.reset();
        }
      }
    } );
    this.addInputListener( this.timerNodeMovableDragHandler );
    //REVIEW: Use `this` instead of self here?
    visibleProperty.linkAttribute( self, 'visible' );
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