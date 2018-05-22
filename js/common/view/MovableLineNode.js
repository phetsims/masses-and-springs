// Copyright 2017-2018, University of Colorado Boulder

/**
 * Node for the reference line and laser pointer node.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2IO = require( 'DOT/Vector2IO' );

  /**
   * @param {Vector2} initialPosition - of the center of line
   * @param {number} length - in view coordinates
   * @param {Property.<boolean>} visibleProperty
   * @param {Bounds2} dragBounds - limits draggable bounds of the line
   * @param {Tandem} tandem
   * @constructor
   */
  function MovableLineNode( initialPosition, length, visibleProperty, dragBounds, tandem ) {
    var self = this;
    Node.call( this, { pickable: true, cursor: 'pointer' } );

    // Creates laser pointer tip for reference line
    var bodySize = new Dimension2( 12, 14 );
    var nozzleSize = new Dimension2( 8, 9 );
    var cornerRadius = 1;
    var topColor = 'rgb( 170, 170, 170 )';
    var bottomColor = 'rgb( 40, 40, 40 )';
    var highlightColor = 'rgb( 245, 245, 245 )';
    var highlightColorStop = 0.3;

    // the narrow part of the handle
    var nozzleNode = new Rectangle( 0, 0, nozzleSize.width + cornerRadius, nozzleSize.height, {
      cornerRadius: cornerRadius,
      fill: new LinearGradient( 0, 0, 0, nozzleSize.height )
        .addColorStop( 0, topColor )
        .addColorStop( highlightColorStop, highlightColor )
        .addColorStop( 1, bottomColor ),
      stroke: 'black',
      right: 0,
      centerY: 0
    } );
    this.addChild( nozzleNode );

    // the main body of the handle
    var bodyNode = new Rectangle( 0, 0, bodySize.width, bodySize.height, {
      cornerRadius: cornerRadius,
      fill: new LinearGradient( 0, 0, 0, bodySize.height )
        .addColorStop( 0, topColor )
        .addColorStop( highlightColorStop, highlightColor )
        .addColorStop( 1, bottomColor ),
      stroke: 'black',
      right: nozzleNode.left + cornerRadius, // overlap to hide corner radius
      centerY: nozzleNode.centerY
    } );
    this.addChild( bodyNode );

    var line = new Line( 0, 0, length, 0, {
      stroke: 'red',
      lineDash: [ 12, 8 ],
      lineWidth: 1.5,
      cursor: 'pointer',
      tandem: tandem.createTandem( 'line' )
    } );
    var dilatedLineBounds = line.localBounds.dilated( 10 );
    line.mouseArea = dilatedLineBounds;
    line.touchArea = dilatedLineBounds;

    // Setting x coordinate for the position of the line.
    initialPosition.setX( dragBounds.minX );

    // @private {Vector2} (read-write) position of line in screen coordinates
    this.positionProperty = new Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioType: PropertyIO( Vector2IO )
    } );

    // Position the line in screen coordinates
    this.positionProperty.link( function( position ) {
      self.translation = position.minusXY( length / 2, 0 );
    } );

    this.addInputListener( new MovableDragHandler( this.positionProperty, {
      dragBounds: dragBounds, // done so reference line is only draggable on the y-axis
      tandem: tandem.createTandem( 'dragHandler' )
    } ) );
    visibleProperty.linkAttribute( this, 'visible' );
    this.addChild( line );
  }

  massesAndSprings.register( 'MovableLineNode', MovableLineNode );

  return inherit( Node, MovableLineNode, {
    /**
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
    }
  } );

} );