// Copyright 2017-2019, University of Colorado Boulder

/**
 * Node for the reference line and laser pointer node.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  /**
   * @param {Vector2} initialPosition - of the center of line
   * @param {number} length - in view coordinates
   * @param {Property.<boolean>} visibleProperty
   * @param {Bounds2} dragBounds - limits draggable bounds of the line
   * @param {Tandem} tandem
   * @constructor
   */
  function MovableLineNode( initialPosition, length, visibleProperty, dragBounds, tandem ) {
    const self = this;
    Node.call( this, { pickable: true, cursor: 'pointer' } );

    // Creates laser pointer tip for reference line
    const bodySize = new Dimension2( 12, 14 );
    const nozzleSize = new Dimension2( 8, 9 );
    const cornerRadius = 1;
    const topColor = 'rgb( 170, 170, 170 )';
    const bottomColor = 'rgb( 40, 40, 40 )';
    const highlightColor = 'rgb( 245, 245, 245 )';
    const highlightColorStop = 0.3;

    // the narrow part of the handle
    const nozzleNode = new Rectangle( 0, 0, nozzleSize.width + cornerRadius, nozzleSize.height, {
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
    const bodyNode = new Rectangle( 0, 0, bodySize.width, bodySize.height, {
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

    const line = new Line( 0, 0, length, 0, {
      stroke: MassesAndSpringsColorProfile.movableLineProperty,
      lineDash: [ 12, 8 ],
      lineWidth: 1.5,
      cursor: 'pointer',
      tandem: tandem.createTandem( 'line' )
    } );
    const dilatedLineBounds = line.localBounds.dilated( 10 );
    line.mouseArea = dilatedLineBounds;
    line.touchArea = dilatedLineBounds;

    // Setting x coordinate for the position of the line.
    initialPosition.setX( dragBounds.minX );

    // @private (read-write) - position of line in screen coordinates
    this.positionProperty = new Vector2Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' )
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