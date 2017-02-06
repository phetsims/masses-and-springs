// Copyright 2016, University of Colorado Boulder

/**
 * @author Denzell Barnett
 *
 * Node for the Natural line.
 */

define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var LINE_LENGTH = 100;

  /**
   * @param {ModelViewTransform2} mvt
   * @param {Spring} spring - determines which spring is being referenced
   * @param {boolean} visibleProperty
   * @constructor
   */
  function NaturalLengthLineNode( mvt, spring, visibleProperty ) {
    var self = this;
    Node.call( this );

    var line = new Line( 0, 0, LINE_LENGTH, 0, {
      stroke: 'rgb(65,66,232)',
      lineDash: [ 12, 8 ],
      lineWidth: 1.5,
      cursor: 'pointer'
    } );
    line.mouseArea = line.localBounds.dilated( 10 );
    line.touchArea = line.localBounds.dilated( 10 );

    this.addChild( line );

    // @private
    var xPos = mvt.modelToViewX( spring.positionProperty.get().x ) + 7.5; // prevents overlap with the equilibrium line
    var yPos = mvt.modelToViewY( spring.bottomProperty.get() );
    this.positionProperty = new Property( new Vector2( xPos, yPos ) );
    this.positionProperty.link( function( position ) {
      self.translation = position.minus( new Vector2( LINE_LENGTH / 2, 0 ) );
    } );

    visibleProperty.linkAttribute( self, 'visible' );
  }

  massesAndSprings.register( 'NaturalLengthLineNode', NaturalLengthLineNode );

  return inherit( Node, NaturalLengthLineNode, {
    reset: function() {
      this.positionProperty.reset();
    }
  } );

} );