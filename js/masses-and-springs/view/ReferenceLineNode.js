// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );


  /**
   * @param {ModelViewTransform} mvt
   * @param {Bounds2} dragBounds
   * @param {MASRuler} ruler
   * @constructor
   */
  function ReferenceLineNode( mvt, dragBounds ) {

    Node.call( this, { position: mvt.modelToViewPosition( new Vector2(.1,.9 ) ) } );


    //this.positionProperty.link( function( position ) {
    //  var newPosition = mvt.modelToViewPosition( position );
    //  self.x = newPosition.x;
    //  self.y = newPosition.y;
    //} );

    this.referenceLine = new Path( new Shape(), { stroke: 'blue', lineDash: [ 10, 10 ] } );
    this.referenceLine.setShape( new Shape()
      .moveTo( mvt.modelToViewDeltaX(.45), mvt.modelToViewDeltaY(-.35) )
      .lineTo( mvt.modelToViewDeltaX(.95), mvt.modelToViewDeltaY(-.35) ) );
    this.addChild( this.referenceLine );
    this.lineDragHandler = new MovableDragHandler(  {
      dragBounds: dragBounds,
      modelViewTransform: mvt
    } );
    this.addInputListener( this.lineDragHandler );
  }

  massesAndSprings.register( 'ReferenceLineNode', ReferenceLineNode );

  return inherit( Node, ReferenceLineNode );

} );
