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
  var LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  var Line = require( 'SCENERY/nodes/Line' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Vector2 = require( 'DOT/Vector2' );
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
    Node.call( this );

    // Creates laser pointer tip for reference line
    // Laser should never have a button in this sim, but a Property is needed for the LaserPointerNode to work
    var laserEnabledProperty = new Property( false, { validValues: [ false ] } );
    var laserPointerNode = new LaserPointerNode( laserEnabledProperty, {
      bodySize: new Dimension2( 12, 14 ),
      nozzleSize: new Dimension2( 8, 9 ),
      cornerRadius: 1,
      tandem: tandem.createTandem( 'laserPointerNode' ),
      hasButton: false,
      buttonRadius: 5,
      buttonTouchAreaDilation: 10,
      cursor: 'pointer'
    } );
    this.addChild( laserPointerNode );

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
      self.translation = position.minusXY( length / 2, 0  );
    } );

    this.addInputListener( new MovableDragHandler( this.positionProperty, {
      dragBounds: dragBounds, // done so reference line is only draggable on the y-axis
      tandem: tandem.createTandem( 'dragHandler' )
    } ) );

    //REVIEW: Use `this` instead of self here?
    visibleProperty.linkAttribute( self, 'visible' );

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