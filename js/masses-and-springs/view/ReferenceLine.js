// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */

define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  // Erase me
  /**
   * @param {Vector2} initialPosition - of the center of line
   * @param {Bounds2} dragBounds
   * @param {number} length - in view coordinates
   * @param {boolean} visibleProperty
   * @constructor
   */
  function ReferenceLine( initialPosition, dragBounds,length, visibleProperty ){
    var self = this;
    Node.call( this );

    var line = new Line( 0, 0, length, 0, {
      stroke: 'blue',
      lineDash: [ 12, 8 ],
      lineWidth: 2,
      cursor: 'pointer'
    } );
    line.mouseArea = line.localBounds.dilated( 10 );
    line.touchArea = line.localBounds.dilated( 10 );

    // @private
    this.positionProperty = new Property( initialPosition );
    this.positionProperty.link( function( position ) {
      self.translation = position.minus( new Vector2( length / 2, 0 ) );
    } );

    this.addInputListener( new MovableDragHandler( this.positionProperty, {
      dragBounds: dragBounds
    } ) );

    visibleProperty.linkAttribute( self, 'visible' );

    this.addChild( line );
  }

  massesAndSprings.register( 'ReferenceLine', ReferenceLine );

  return inherit( Node, ReferenceLine, {
    reset: function() {
      this.positionProperty.reset();
    }
  } );

} );