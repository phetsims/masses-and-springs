// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Property = require( 'AXON/Property' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  var cmString = require( 'string!MASSES_AND_SPRINGS/cm' );
  var FONT = new PhetFont( 12 );

  /**
   * @param {Bounds2} dragBounds
   * @param {Vector2} initialPosition
   * @param {Property} visibleProperty
   * @constructor
   */
  function DraggableRulerNode( dragBounds, initialPosition, visibleProperty ) {
    var self = this;
    Node.call( this );
    Property.addProperty( this, 'position', initialPosition );

    var rulerLength = 400;
    var majorTickWidth = rulerLength / 20;
    var majorTickLabels = [];
    for ( var i = 1; i < 10; i++ ) {
      majorTickLabels[ i * 2 ] = '' + Math.floor( i * 10 );
    }

    this.addChild( new RulerNode( rulerLength, 0.1 * rulerLength, majorTickWidth, majorTickLabels, cmString, {
      insetsWidth: 5,
      minorTicksPerMajorTick: 4,
      top: self.position,
      unitsMajorTickIndex: 19,
      rotation: Math.PI / 2,
      backgroundFill: 'rgb( 237, 225, 121 )',
      cursor: 'pointer',
      majorTickFont: FONT,
      majorTickHeight: 10,
      minorTickHeight: 5,
      unitsFont: FONT,
      tickMarksOnBottom: false
    } ) );

    this.positionProperty.linkAttribute( self, 'translation' );
    this.addInputListener( new MovableDragHandler( this.positionProperty, {
      dragBounds: dragBounds
    } ) );

    visibleProperty.linkAttribute( self, 'visible' );
  }

  massesAndSprings.register( 'DraggableRulerNode', DraggableRulerNode );

  return inherit( Node, DraggableRulerNode );

} );
