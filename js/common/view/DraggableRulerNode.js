// Copyright 2016, University of Colorado Boulder

/**
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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // strings
  var cmString = require( 'string!MASSES_AND_SPRINGS/cm' );

  // constants
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

    // define ruler params in pixels
    var rulerWidth = 397; // 1 meter
    var rulerLength = .1 * rulerWidth;
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
      majorTickFont: FONT,
      majorTickHeight: 10,
      minorTickHeight: 5,
      unitsFont: FONT,
      opacity: .8,
      tickMarksOnBottom: false
    } ) );

    // @private
    this.positionProperty = new Property( initialPosition );
    this.positionProperty.linkAttribute( self, 'translation' );
    this.addInputListener( new MovableDragHandler( this.positionProperty, {
      dragBounds: dragBounds
    } ) );

    visibleProperty.linkAttribute( self, 'visible' );
  }

  massesAndSprings.register( 'DraggableRulerNode', DraggableRulerNode );

  return inherit( Node, DraggableRulerNode, {

    reset: function() {
      this.positionProperty.reset();
    }
  } );

} );