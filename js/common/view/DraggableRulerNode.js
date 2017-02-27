// Copyright 2016-2017, University of Colorado Boulder

/**
 * Responsible for the attributes and drag handlers associated with the ruler node.
 *
 * @author Denzell Barnett
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Property = require( 'AXON/Property' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );

  // strings
  var cmString = require( 'string!MASSES_AND_SPRINGS/cm' );

  /**
   * @param {Bounds2} dragBounds
   * @param {Vector2} initialPosition
   * @param {Property.<boolean>} visibleProperty
   * @constructor
   */
  //TODO: Look into passing in toolbox bounds to compare with ruler bounds. If these two intersect then trigger "put away event"
  function DraggableRulerNode( dragBounds, initialPosition, visibleProperty ) {
    var self = this;
    Node.call( this );

    // @public {read-write} Used for returning ruler to toolbox. Set this if needed to be returned.
    this.toolbox = null;

    // define ruler params in pixels
    var rulerWidth = 397; // 1 meter
    var rulerLength = .1 * rulerWidth; //
    var majorTickLabels = [ '' ];
    for ( var i = 1; i < 10; i++ ) {
      majorTickLabels.push( '' );
      majorTickLabels.push( '' + Math.floor( i * 10 ) );
      assert && assert( majorTickLabels[ i * 2 ] === '' + Math.floor( i * 10 ) );
    }
    majorTickLabels.push( '' );
    majorTickLabels.push( '' );
    var majorTickWidth = rulerWidth / ( majorTickLabels.length - 1 );

    this.addChild( new RulerNode( rulerWidth, rulerLength, majorTickWidth, majorTickLabels, cmString, {
      insetsWidth: 5,
      minorTicksPerMajorTick: 4,
      unitsMajorTickIndex: 19,
      rotation: Math.PI / 2,
      backgroundFill: 'rgb( 237, 225, 121 )',
      cursor: 'pointer',
      majorTickFont: MassesAndSpringsConstants.FONT,
      majorTickHeight: 10,
      minorTickHeight: 5,
      unitsFont: MassesAndSpringsConstants.FONT,
      opacity: .8,
      tickMarksOnBottom: false
    } ) );

    // @private
    this.positionProperty = new Property( initialPosition );
    this.positionProperty.linkAttribute( this, 'translation' );

    // @private {read-only} handles ruler node drag events
    this.rulerNodeMovableDragHandler = new MovableDragHandler( this.positionProperty, {
      dragBounds: dragBounds,
      endDrag: function( event ) {
        // When a node is released, check if it is over the toolbox.  If so, drop it in.
        if ( self.toolbox && self.getGlobalBounds().intersectsBounds( self.toolbox.getGlobalBounds() ) ) {
          visibleProperty.set( false );
        }
      }
    } );
    this.addInputListener( this.rulerNodeMovableDragHandler );
    visibleProperty.linkAttribute( self, 'visible' );
  }

  massesAndSprings.register( 'DraggableRulerNode', DraggableRulerNode );

  return inherit( Node, DraggableRulerNode, {

    reset: function() {
      this.positionProperty.reset();
    },

    /**
     * Responsible for handling drag event for ruler node using event forwarding from ruler icon in toolbox
     * @public
     *
     * @param {Event} event - Drag event that is forwarded from ruler icon in toolbox node
     */
    startDrag: function( event ) {
      this.rulerNodeMovableDragHandler.startDrag( event );
    }
  } );

} );