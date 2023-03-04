// Copyright 2017-2023, University of Colorado Boulder

/**
 * Node for the reference line and laser pointer node.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { DragListener, Line, LinearGradient, Node, Rectangle } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsColors from './MassesAndSpringsColors.js';

class MovableLineNode extends Node {
  /**
   * @param {Vector2} initialPosition - of the center of line
   * @param {number} length - in view coordinates
   * @param {Property.<boolean>} visibleProperty
   * @param {Bounds2} dragBounds - limits draggable bounds of the line
   * @param {Tandem} tandem
   */
  constructor( initialPosition, length, visibleProperty, dragBounds, tandem ) {
    super( { pickable: true, cursor: 'pointer' } );

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
      stroke: MassesAndSpringsColors.movableLineProperty,
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
    this.positionProperty.link( position => {
      this.translation = position.minusXY( length / 2, 0 );
    } );

    this.addInputListener( new DragListener( {
      positionProperty: this.positionProperty,
      useParentOffset: true,
      dragBoundsProperty: new Property( dragBounds ), // done so reference line is only draggable on the y-axis
      tandem: tandem.createTandem( 'dragListener' )
    } ) );
    visibleProperty.linkAttribute( this, 'visible' );
    this.addChild( line );
  }

  /**
   * @public
   */
  reset() {
    this.positionProperty.reset();
  }
}

massesAndSprings.register( 'MovableLineNode', MovableLineNode );

export default MovableLineNode;