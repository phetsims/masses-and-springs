// Copyright 2016-2017, University of Colorado Boulder

/**
 * Responsible for the attributes and drag handlers associated with the timer node.
 *
 * @author Matt Pennington
 * @author Denzell Barnett
 *
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
  var TVector2 = require( 'DOT/TVector2' );

  /**
   * @param {Bounds2} dragBounds
   * @param {Vector2} initialPosition
   * @param {number} timerSecondsProperty
   * @param {boolean} timerRunningProperty
   * @param {boolean} visibleProperty
   * @param {Tandem} tandem
   * @constructor
   */
  function DraggableTimerNode( dragBounds, initialPosition, timerSecondsProperty, timerRunningProperty, visibleProperty, tandem ) {
    var self = this;
    Node.call( this );
    this.addChild( new Timer( timerSecondsProperty, timerRunningProperty, {
      tandem: tandem.createTandem( 'timer' )
    } ) );

    // @public {read-write} Used for returning ruler to toolbox. Set this if needed to be returned.
    this.toolbox = null;

    // @private
    this.positionProperty = new Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioValueType: TVector2
    } );
    this.positionProperty.linkAttribute( self, 'translation' );

    // @private {read-only} handles timer node drag events
    this.timerNodeMovableDragHandler = new MovableDragHandler( this.positionProperty, {
      tandem: tandem.createTandem( 'dragHandler' ),
      dragBounds: dragBounds,
      endDrag: function( event ) {
        // When a node is released, check if it is over the toolbox.  If so, drop it in.
        if ( self.toolbox && self.getGlobalBounds().intersectsBounds( self.toolbox.getGlobalBounds() ) ) {
          visibleProperty.set( false );
          timerSecondsProperty.reset();
          timerRunningProperty.reset();
        }
      }
    } );
    this.addInputListener( this.timerNodeMovableDragHandler );

    visibleProperty.linkAttribute( self, 'visible' );
  }

  massesAndSprings.register( 'DraggableTimerNode', DraggableTimerNode );

  return inherit( Node, DraggableTimerNode, {

    /**
     * Responsible for handling drag event for timer node using event forwarding from timer icon in toolbox
     * @public
     *
     * @param {Event} event - Drag event that is forwarded from timer icon in toolbox node
     */
    startDrag: function( event ) {
      this.timerNodeMovableDragHandler.startDrag( event );
    }
  } );
} );