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
  var Vector2 = require( 'DOT/Vector2' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );


  /**
   * @param {ModelViewTransform} mvt
   * @param {Bounds2} dragBounds
   * @param {MASRuler} ruler
   * @constructor
   */
  function MASRulerNode( mvt, dragBounds, ruler ) {
    var self = this;

    Node.call( this, { position: mvt.modelToViewPosition( new Vector2( 0, 1.2 )), cursor: 'pointer' } );

    var rulerLength = mvt.modelToViewDeltaY( -1 );
    var majorTickWidth = mvt.modelToViewDeltaY( -.05 );
    var majorTickLabels = [];
    var numberOfTicks = Math.floor( rulerLength / majorTickWidth ) + 1;
    for ( var i = 2; i < numberOfTicks - 1; i = i + 2 ) {
      majorTickLabels[ i ] = '' + Math.floor( -mvt.viewToModelDeltaY( i ) * majorTickWidth * 100 );
    }

    this.addChild( new RulerNode( rulerLength, 0.075 * rulerLength, majorTickWidth, majorTickLabels, 'cm', {
      insetsWidth: mvt.modelToViewDeltaY( -.01 ),
      minorTicksPerMajorTick: 4,
      top: ruler.positionProperty.get(),
      unitsMajorTickIndex: 19,
      rotation: Math.PI / 2
      //font: new PhetFont( { size: 62 } )
    } ) );

    ruler.positionProperty.link( function( position ) {
      var newPosition = mvt.modelToViewPosition( position );
      self.x = newPosition.x;
      self.y = newPosition.y;
    } );

    this.movableDragHandler = new MovableDragHandler( ruler.positionProperty, {
      dragBounds: dragBounds,
      modelViewTransform: mvt
    } );
    this.addInputListener( this.movableDragHandler );

  }

  massesAndSprings.register( 'MASRulerNode', MASRulerNode );

  return inherit( Node, MASRulerNode );

} );
