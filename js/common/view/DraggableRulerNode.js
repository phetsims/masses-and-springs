// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 *
 * Node responsible for Ruler.
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
   * @param {Property} visibleProperty
   * @constructor
   */
  //TODO: Look into passing in toolbox bounds to compare with ruler bounds. If these two intersect then trigger "put away event"
  function DraggableRulerNode( dragBounds, initialPosition, visibleProperty ) {
    var self = this;
    Node.call( this );

    // define ruler params in pixels
    this.rulerWidth = 397; // 1 meter
    this.rulerLength = .1 * this.rulerWidth;
    var majorTickLabels = [ '' ];
    for ( var i = 1; i < 10; i++ ) {
      majorTickLabels.push( '' );
      majorTickLabels.push( '' + Math.floor( i * 10 ) );
      assert && assert( majorTickLabels[ i * 2 ] === '' + Math.floor( i * 10 ) );
    }
    majorTickLabels.push( '' );
    majorTickLabels.push( '' );
    var majorTickWidth = this.rulerWidth / ( majorTickLabels.length - 1 );

    this.addChild( new RulerNode( this.rulerWidth, this.rulerLength, majorTickWidth, majorTickLabels, cmString, {
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